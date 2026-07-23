import { Module } from '@nestjs/common';
import { CustomBlogsService } from './custom-blogs.service';
import { CustomBlogsController } from './custom-blogs.controller';

@Module({
  controllers: [CustomBlogsController],
  providers: [CustomBlogsService],
})
export class CustomBlogsModule {}
