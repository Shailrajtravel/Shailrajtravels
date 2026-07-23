import { Injectable, Logger } from '@nestjs/common';
import { packageRepository } from '../repositories/PackageRepository';
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
    const insertedId = await packageRepository.insertOne(newDoc);
    return { success: true, _id: insertedId };
  }

  async updatePackage(id: string, data: any) {
    const processedData = await this.processPackageImages(data);
    const updateData = { ...processedData };
    delete updateData._id;
    await packageRepository.updateOne(id, updateData);
    return { success: true };
  }

  async deletePackage(id: string) {
    await packageRepository.deleteOne(id);
    return { success: true };
  }
}
