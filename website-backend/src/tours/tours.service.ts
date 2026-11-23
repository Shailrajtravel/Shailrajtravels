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
      return tours.map((t: any) => ({
        _id: t._id.toString(),
        slug: t.slug,
        lang: t.lang || "en",
        title: t.title,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
        canonicalUrl: t.canonicalUrl,
        heroContent: t.heroContent || { image: "", description: "" },
        overview: t.overview,
        highlights: t.highlights || [],
        destinations: t.destinations || [],
        dates: Array.isArray(t.dates) ? t.dates.filter(isUpcomingDate) : [],
        packages: t.packages || [],
        faq: t.faq || [],
        relatedTours: t.relatedTours || [],
        relatedBlogs: t.relatedBlogs || [],
      }));
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
        metaTitle: tour.metaTitle,
        metaDescription: tour.metaDescription,
        canonicalUrl: tour.canonicalUrl,
        heroContent: tour.heroContent || { image: "", description: "" },
        overview: tour.overview,
        highlights: tour.highlights || [],
        destinations: tour.destinations || [],
        dates: Array.isArray(tour.dates) ? tour.dates.filter(isUpcomingDate) : [],
        packages: tour.packages || [],
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
    const insertedId = await tourRepository.insertOne(processedData);
    return { success: true, id: insertedId };
  }

  async updateTour(id: string, data: any) {
    const processedData = await this.processTourImages(data);
    const updateData = { ...processedData };
    delete updateData._id;
    await tourRepository.updateOne(id, updateData);

    // Cross-sync dates and heroContent.image to packages collection
    try {
      const existingTour = await tourRepository.findById(id);
      const titleToMatch = updateData.title || existingTour?.title;
      const slugToMatch = updateData.slug || existingTour?.slug;
      const newImage = updateData.heroContent?.image;

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
        if (Object.keys($setObj).length > 0) {
          const updateOp: any = { $set: $setObj };
          if (newImage) {
            updateOp.$addToSet = { images: newImage };
          }
          await pkgsCol.updateMany({ $or: conditions }, updateOp);
          this.logger.log(`Successfully synced tour updates to matching packages`);
        }
      }
    } catch (e: any) {
      this.logger.warn(`Failed to sync tour updates to packages: ${e.message}`);
    }

    return { success: true };
  }

  async deleteTour(id: string) {
    await tourRepository.deleteOne(id);
    return { success: true };
  }

  async deleteToursBySlug(slug: string) {
    await tourRepository.deleteManyBySlug(slug);
    return { success: true };
  }
}
