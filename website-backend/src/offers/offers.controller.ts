import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get('active')
  async getActiveOffer() {
    return this.offersService.getActiveOffer();
  }

  @Get()
  async getAllOffers() {
    return this.offersService.getAllOffers();
  }

  @Get(':slug')
  async getOfferBySlug(@Param('slug') slug: string) {
    return this.offersService.getOfferBySlug(slug);
  }

  @Post()
  async saveOffer(@Body() data: any) {
    return this.offersService.saveOffer(data);
  }

  @Put(':slug/status')
  async toggleOfferStatus(
    @Param('slug') slug: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.offersService.toggleOfferStatus(slug, isActive);
  }

  @Delete(':slug')
  async deleteOffer(@Param('slug') slug: string) {
    return this.offersService.deleteOffer(slug);
  }
}
