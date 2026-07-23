import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PackagesService } from './packages.service';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  async getPackages() {
    return this.packagesService.getPackages();
  }

  @Post()
  async createPackage(@Body() data: any) {
    return this.packagesService.createPackage(data);
  }

  @Put(':id')
  async updatePackage(@Param('id') id: string, @Body() data: any) {
    return this.packagesService.updatePackage(id, data);
  }

  @Delete(':id')
  async deletePackage(@Param('id') id: string) {
    return this.packagesService.deletePackage(id);
  }
}
