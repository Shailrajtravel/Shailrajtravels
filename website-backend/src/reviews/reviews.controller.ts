import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

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
