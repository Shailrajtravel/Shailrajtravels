import { Controller, Get, Post, Body } from '@nestjs/common';
import { RecommendedVehiclesService } from './recommended-vehicles.service';

@Controller('recommended-vehicles')
export class RecommendedVehiclesController {
  constructor(private readonly recommendedVehiclesService: RecommendedVehiclesService) {}

  @Get()
  async getRecommendedVehicles() {
    return this.recommendedVehiclesService.getRecommendedVehicles();
  }

  @Post()
  async saveRecommendedVehicles(@Body() vehicles: any[]) {
    return this.recommendedVehiclesService.saveRecommendedVehicles(vehicles);
  }
}
