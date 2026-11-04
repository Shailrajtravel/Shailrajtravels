import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('google')
  async getGoogleReviews(@Query('refresh') refresh?: string) {
    const forceRefresh = refresh === 'true' || refresh === '1';
    return this.reviewsService.getGoogleReviews(forceRefresh);
  }

  @Post('google/sync')
  async syncGoogleReviews() {
    const result = await this.reviewsService.syncGoogleReviews();
    return {
      success: !!result,
      data: result,
      message: result ? "Google reviews successfully synced" : "Failed to sync Google reviews. Check API key.",
    };
  }

  @Get()
  async getReviews() {
    return this.reviewsService.getReviews();
  }

  @Post()
  async addReview(@Body() data: any) {
    return this.reviewsService.addReview(data);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
