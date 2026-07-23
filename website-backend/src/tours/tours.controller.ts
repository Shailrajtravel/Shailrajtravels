import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  async getTours(@Query('lang') lang?: string) {
    return this.toursService.getTours(lang);
  }

  @Get('slug/:slug')
  async getTourBySlug(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.toursService.getTourBySlug(slug, lang);
  }

  @Post()
  async createTour(@Body() data: any) {
    return this.toursService.createTour(data);
  }

  @Put(':id')
  async updateTour(@Param('id') id: string, @Body() data: any) {
    return this.toursService.updateTour(id, data);
  }

  @Delete(':id')
  async deleteTour(@Param('id') id: string) {
    return this.toursService.deleteTour(id);
  }

  @Delete('slug/:slug')
  async deleteToursBySlug(@Param('slug') slug: string) {
    return this.toursService.deleteToursBySlug(slug);
  }
}
