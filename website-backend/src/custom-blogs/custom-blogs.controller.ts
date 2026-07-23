import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CustomBlogsService } from './custom-blogs.service';

@Controller('custom-blogs')
export class CustomBlogsController {
  constructor(private readonly customBlogsService: CustomBlogsService) {}

  @Get()
  async getCustomBlogs() {
    return this.customBlogsService.getCustomBlogs();
  }

  @Get('slug/:slug')
  async getCustomBlogBySlug(@Param('slug') slug: string) {
    return this.customBlogsService.getCustomBlogBySlug(slug);
  }

  @Post()
  async createCustomBlog(@Body() data: any) {
    return this.customBlogsService.createCustomBlog(data);
  }

  @Put(':id')
  async updateCustomBlog(@Param('id') id: string, @Body() data: any) {
    return this.customBlogsService.updateCustomBlog(id, data);
  }

  @Put(':id/visibility')
  async toggleBlogVisibility(@Param('id') id: string, @Body('isHidden') isHidden: boolean) {
    return this.customBlogsService.toggleBlogVisibility(id, isHidden);
  }

  @Delete(':id')
  async deleteCustomBlog(@Param('id') id: string) {
    return this.customBlogsService.deleteCustomBlog(id);
  }
}
