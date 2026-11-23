import { Injectable, Logger } from '@nestjs/common';
import { tourRepository } from '../repositories/TourRepository';
import { packageRepository } from '../repositories/PackageRepository';
import { storageManager } from '../database/StorageManager';
import { uploadImageToCloudinary } from '../shared/cloudinary';

// Extracted from frontend bookings.ts
export const isUpcomingDate = (dateStr: string): boolean => {
  if (typeof dateStr !== 'string') return false;
  
  const cleanStr = dateStr.trim();
  const yearMatch = cleanStr.match(/\b(\d{4})\b/);
  const year = yearMatch ? yearMatch[1] : String(new Date().getFullYear());
  const startPart = cleanStr.split(/\s+to\s+/i)[0].trim();
  const cleanStart = startPart.replace(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\.?\s+/i, '').trim();
  
  const finalParseString = /\b\d{4}\b/.test(cleanStart) 
    ? cleanStart 
    : `${cleanStart} ${year}`;
    
  const parsedDate = new Date(finalParseString);
  if (!isNaN(parsedDate.getTime())) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return parsedDate >= now;
  }
  return true;
};

@Injectable()
export class ToursService {
  private readonly logger = new Logger(ToursService.name);

  async getTours(lang?: string) {
    try {
      const query: any = {};
      if (lang) {
        query.lang = lang;
      } else {
        query.lang = { $in: ["en", null] };
      }

      const tours = await tourRepository.findAllSorted(query);
      return tours
        .map((t: any) => ({
          _id: t._id.toString(),
          slug: t.slug,
          lang: t.lang || "en",
          title: t.title,
          order: typeof t.order === 'number' && !isNaN(t.order) ? t.order : (typeof t.rank === 'number' && !isNaN(t.rank) ? t.rank : undefined),
          rank: typeof t.rank === 'number' && !isNaN(t.rank) ? t.rank : (typeof t.order === 'number' && !isNaN(t.order) ? t.order : undefined),
          metaTitle: t.metaTitle,
          metaDescription: t.metaDescription,
          canonicalUrl: t.canonicalUrl,
          heroContent: t.heroContent || { image: "", description: "" },
          overview: t.overview,
          highlights: t.highlights || [],
          destinations: t.destinations || [],
          dates: Array.isArray(t.dates) ? t.dates.filter(isUpcomingDate) : [],
          packages: t.packages || [],
          price: t.price || (t.packages?.[0]?.price ? `₹${t.packages[0].price}` : ''),
          faq: t.faq || [],
          relatedTours: t.relatedTours || [],
          relatedBlogs: t.relatedBlogs || [],
        }))
        .sort((a: any, b: any) => {
          const rankA = typeof a.order === 'number' && a.order > 0 ? a.order : (typeof a.rank === 'number' && a.rank > 0 ? a.rank : 999999);
          const rankB = typeof b.order === 'number' && b.order > 0 ? b.order : (typeof b.rank === 'number' && b.rank > 0 ? b.rank : 999999);
          if (rankA !== rankB) return rankA - rankB;
          return 0;
        });
    } catch (error) {
      this.logger.error("Failed to fetch tours", error);
      return [];
    }
  }

  async getTourBySlug(slug: string, lang?: string) {
    try {
      const query: any = { slug };
      if (lang) {
        query.lang = lang;
      } else {
        query.lang = { $in: ["en", null] };
      }

      let tour = await tourRepository.findBySlug(slug, { lang: query.lang });
      if (!tour && lang) {
        tour = await tourRepository.findBySlug(slug, { lang: { $in: ["en", null] } });
      }

      if (!tour) return null;

      return {
        _id: tour._id.toString(),
        slug: tour.slug,
        lang: tour.lang || "en",
        title: tour.title,
        order: typeof tour.order === 'number' && !isNaN(tour.order) ? tour.order : (typeof tour.rank === 'number' && !isNaN(tour.rank) ? tour.rank : undefined),
        rank: typeof tour.rank === 'number' && !isNaN(tour.rank) ? tour.rank : (typeof tour.order === 'number' && !isNaN(tour.order) ? tour.order : undefined),
        metaTitle: tour.metaTitle,
        metaDescription: tour.metaDescription,
        canonicalUrl: tour.canonicalUrl,
        heroContent: tour.heroContent || { image: "", description: "" },
        overview: tour.overview,
        highlights: tour.highlights || [],
        destinations: tour.destinations || [],
        dates: Array.isArray(tour.dates) ? tour.dates.filter(isUpcomingDate) : [],
        packages: tour.packages || [],
        price: tour.price || (tour.packages?.[0]?.price ? `₹${tour.packages[0].price}` : ''),
        faq: tour.faq || [],
        relatedTours: tour.relatedTours || [],
        relatedBlogs: tour.relatedBlogs || [],
        schemaData: tour.schemaData || null,
      };
    } catch (error) {
      this.logger.error("Failed to fetch tour by slug", error);
      return null;
    }
  }

  private async processTourImages(tourData: any) {
    const newData = { ...tourData };
    if (newData.heroContent && newData.heroContent.image) {
      if (newData.heroContent.image.startsWith("data:image")) {
        newData.heroContent.image = await uploadImageToCloudinary(newData.heroContent.image, "tours");
      }
    }
    return newData;
  }

  async createTour(data: any) {
    const processedData = await this.processTourImages(data);
    processedData.createdAt = new Date();

    // Check if tour with same slug or title already exists to prevent duplicates
    if (processedData.slug || processedData.title) {
      const col = await storageManager.getGlobalCollection('tours');
      const conditions: any[] = [];
      if (processedData.slug) conditions.push({ slug: processedData.slug });
      if (processedData.title) conditions.push({ title: processedData.title });
      const existing = await col.findOne({ $or: conditions });
      if (existing) {
        delete processedData._id;
        await tourRepository.updateOne(existing._id.toString(), processedData);
        return { success: true, id: existing._id.toString() };
      }
    }

    const insertedId = await tourRepository.insertOne(processedData);
    return { success: true, id: insertedId };
  }

  async updateTour(id: string, data: any) {
    const processedData = await this.processTourImages(data);
    const updateData = { ...processedData };
    delete updateData._id;
    await tourRepository.updateOne(id, updateData);

    // Cross-sync dates, price, and heroContent.image to packages collection
    try {
      const existingTour = await tourRepository.findById(id);
      const titleToMatch = updateData.title || existingTour?.title;
      const slugToMatch = updateData.slug || existingTour?.slug;
      const newImage = updateData.heroContent?.image;
      const rawPrice = updateData.price || (updateData.packages?.[0]?.price ? `₹${updateData.packages[0].price}` : '') || existingTour?.price;

      const conditions: any[] = [];
      if (titleToMatch) conditions.push({ title: titleToMatch });
      if (slugToMatch) conditions.push({ slug: slugToMatch });

      if (conditions.length > 0) {
        const pkgsCol = await storageManager.getGlobalCollection('packages');
        const $setObj: any = {};
        if (updateData.dates && Array.isArray(updateData.dates)) {
          $setObj.dates = updateData.dates;
        }
        if (newImage) {
          $setObj.image = newImage;
        }
        if (rawPrice) {
          $setObj.price = rawPrice.startsWith('₹') ? rawPrice : `₹${rawPrice}`;
        }
        if (typeof updateData.order === 'number' && !isNaN(updateData.order)) {
          $setObj.order = updateData.order;
          $setObj.rank = updateData.order;
        } else if (typeof updateData.rank === 'number' && !isNaN(updateData.rank)) {
          $setObj.order = updateData.rank;
          $setObj.rank = updateData.rank;
        }
        if (Object.keys($setObj).length > 0) {
          const updateOp: any = { $set: $setObj };
          if (newImage) {
            updateOp.$addToSet = { images: newImage };
          }
          await pkgsCol.updateMany({ $or: conditions }, updateOp);
          this.logger.log(`Successfully synced tour updates (price: ${rawPrice}, image: ${newImage}) to matching packages`);
        }
      }
    } catch (e: any) {
      this.logger.warn(`Failed to sync tour updates to packages: ${e.message}`);
    }

    return { success: true };
  }

  async deleteTour(id: string) {
    try {
      const existing = await tourRepository.findById(id);
      await tourRepository.deleteOne(id);
      if (existing) {
        const conditions: any[] = [];
        if (existing.title) conditions.push({ title: existing.title });
        if (existing.slug) conditions.push({ slug: existing.slug });
        if (conditions.length > 0) {
          const pkgsCol = await storageManager.getGlobalCollection('packages');
          await pkgsCol.deleteMany({ $or: conditions });
          this.logger.log(`Cascaded deletion of tour "${existing.title}" to packages`);
        }
      }
    } catch (e: any) {
      this.logger.warn(`Failed cascade delete of tour to packages: ${e.message}`);
    }
    return { success: true };
  }

  async deleteToursBySlug(slug: string) {
    try {
      await tourRepository.deleteManyBySlug(slug);
      const pkgsCol = await storageManager.getGlobalCollection('packages');
      await pkgsCol.deleteMany({ slug });
    } catch (e: any) {
      this.logger.warn(`Failed deleteToursBySlug cascade: ${e.message}`);
    }
    return { success: true };
  }
}
