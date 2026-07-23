import { Module } from '@nestjs/common';
import { RecommendedVehiclesService } from './recommended-vehicles.service';
import { RecommendedVehiclesController } from './recommended-vehicles.controller';

@Module({
  controllers: [RecommendedVehiclesController],
  providers: [RecommendedVehiclesService],
})
export class RecommendedVehiclesModule {}
