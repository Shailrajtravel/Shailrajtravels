import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  async addIssue(@Body() data: any) {
    return this.issuesService.addIssue(data);
  }

  @Get()
  async getAllIssues() {
    return this.issuesService.getAllIssues();
  }

  @Patch(':id/status')
  async updateIssueStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.issuesService.updateIssueStatus(id, status);
  }

  @Delete(':id')
  async deleteIssue(@Param('id') id: string) {
    return this.issuesService.deleteIssue(id);
  }
}
