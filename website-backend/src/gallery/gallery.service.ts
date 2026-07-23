import { Injectable, Logger } from '@nestjs/common';
import { galleryRepository } from '../repositories/GalleryRepository';
import { uploadImageToCloudinary } from '../shared/cloudinary';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);

  async getGalleryPhotos() {
    try {
      const photos = await galleryRepository.findAllSorted();
      return photos.map((p: any) => ({
        _id: p._id.toString(),
        imageUrl: p.imageUrl,
        createdAt: p.createdAt,
      }));
    } catch (error) {
      this.logger.error("Failed to fetch gallery photos", error);
      return [];
    }
  }

  async addGalleryPhoto(data: any) {
    let finalImageUrl = data.imageUrl;
    if (finalImageUrl.startsWith("data:image")) {
      finalImageUrl = await uploadImageToCloudinary(finalImageUrl, "gallery");
    }

    const newDoc = {
      imageUrl: finalImageUrl,
      createdAt: new Date(),
    };

    const insertedId = await galleryRepository.insertOne(newDoc);
    return { success: true, _id: insertedId };
  }

  async deleteGalleryPhoto(id: string) {
    await galleryRepository.deleteOne(id);
    return { success: true };
  }
}
