import { Injectable, Logger } from '@nestjs/common';
import { packageRepository } from '../repositories/PackageRepository';
import { tourRepository } from '../repositories/TourRepository';
import { storageManager } from '../database/StorageManager';
import { uploadImageToCloudinary } from '../shared/cloudinary';

@Injectable()
export class PackagesService {
  private readonly logger = new Logger(PackagesService.name);

  async getPackages() {
    try {
      const packages = await packageRepository.findAllSorted();
      return packages.map((p: any) => ({
        _id: p._id.toString(),
        id: p.id,
        image: p.image,
        images: p.images || [],
        durationBadge: p.durationBadge,
        subtitle: p.subtitle,
        title: p.title,
        location: p.location,
        schedule: p.schedule,
        frequency: p.frequency,
        route: p.route,
        tags: p.tags,
        seatsAvailable: p.seatsAvailable,
        seatsTotal: p.seatsTotal,
        price: p.price,
        itinerary: p.itinerary,
        includes: p.includes,
        dates: Array.isArray(p.dates) ? p.dates : [],
      }));
    } catch (error) {
      this.logger.error("Failed to fetch packages", error);
      return [];
    }
  }

  private async processPackageImages(packageData: any) {
    const newData = { ...packageData };

    if (newData.images && Array.isArray(newData.images)) {
      const processedImages = await Promise.all(
        newData.images.map(async (img: string) => {
          if (img.startsWith("data:image")) {
            return await uploadImageToCloudinary(img, "packages");
          }
          return img;
        })
      );
      newData.images = processedImages;
      if (processedImages.length > 0) {
        newData.image = processedImages[0];
      }
    } else if (newData.image && newData.image.startsWith("data:image")) {
      newData.image = await uploadImageToCloudinary(newData.image, "packages");
    }

    return newData;
  }

  async createPackage(data: any) {
    const processedData = await this.processPackageImages(data);
    const newDoc = { ...processedData, createdAt: new Date() };

    // Check if package with same slug or title already exists to prevent duplicates
    if (newDoc.slug || newDoc.title) {
      const col = await storageManager.getGlobalCollection('packages');
      const conditions: any[] = [];
      if (newDoc.slug) conditions.push({ slug: newDoc.slug });
      if (newDoc.title) conditions.push({ title: newDoc.title });
      const existing = await col.findOne({ $or: conditions });
      if (existing) {
        delete newDoc._id;
        await packageRepository.updateOne(existing._id.toString(), newDoc);
        return { success: true, _id: existing._id.toString() };
      }
    }

    const insertedId = await packageRepository.insertOne(newDoc);
    return { success: true, _id: insertedId };
  }

  async updatePackage(id: string, data: any) {
    const processedData = await this.processPackageImages(data);
    const updateData = { ...processedData };
    delete updateData._id;
    await packageRepository.updateOne(id, updateData);

    // Cross-sync image, price, dates, and title updates to tours collection
    try {
      const existingPkg = await packageRepository.findById(id);
      const titleToMatch = updateData.title || existingPkg?.title;
      const slugToMatch = updateData.slug || existingPkg?.slug;
      const newImage = updateData.image || (updateData.images && updateData.images[0]);
      const newPrice = updateData.price || existingPkg?.price;
      
      const conditions: any[] = [];
      if (titleToMatch) conditions.push({ title: titleToMatch });
      if (slugToMatch) conditions.push({ slug: slugToMatch });

      if (conditions.length > 0) {
        const toursCol = await storageManager.getGlobalCollection('tours');
        const $setObj: any = {};
        if (newImage) {
          $setObj['heroContent.image'] = newImage;
        }
        if (newPrice) {
          $setObj['price'] = newPrice;
          const cleanNumeric = String(newPrice).replace(/[^\d,]/g, '').trim();
          $setObj['packages.0.price'] = cleanNumeric || newPrice;
        }
        if (updateData.dates && Array.isArray(updateData.dates)) {
          $setObj['dates'] = updateData.dates;
        }

        if (Object.keys($setObj).length > 0) {
          await toursCol.updateMany(
            { $or: conditions },
            { $set: $setObj }
          );
          this.logger.log(`Successfully synced package updates (price: ${newPrice}, image: ${newImage}) to matching tours`);
        }
      }
    } catch (e: any) {
      this.logger.warn(`Failed to sync package updates to tours: ${e.message}`);
    }

    return { success: true };
  }

  async deletePackage(id: string) {
    try {
      const existing = await packageRepository.findById(id);
      await packageRepository.deleteOne(id);
      if (existing) {
        const conditions: any[] = [];
        if (existing.title) conditions.push({ title: existing.title });
        if (existing.slug) conditions.push({ slug: existing.slug });
        if (conditions.length > 0) {
          const toursCol = await storageManager.getGlobalCollection('tours');
          await toursCol.deleteMany({ $or: conditions });
          this.logger.log(`Cascaded deletion of package "${existing.title}" to tours`);
        }
      }
    } catch (e: any) {
      this.logger.warn(`Failed cascade delete of package to tours: ${e.message}`);
    }
    return { success: true };
  }
}
