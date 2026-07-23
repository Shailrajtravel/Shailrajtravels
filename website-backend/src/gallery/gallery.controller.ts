import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async getGalleryPhotos() {
    return this.galleryService.getGalleryPhotos();
  }

  @Post()
  async addGalleryPhoto(@Body() data: any) {
    return this.galleryService.addGalleryPhoto(data);
  }

  @Delete(':id')
  async deleteGalleryPhoto(@Param('id') id: string) {
    return this.galleryService.deleteGalleryPhoto(id);
  }
}
