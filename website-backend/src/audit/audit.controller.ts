import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getAuditLogs() {
    return this.auditService.getAuditLogs();
  }

  @Post()
  async logAction(@Body() data: { action: string; entityType: string; details: string; entityId?: string }) {
    return this.auditService.logAction(data);
  }
}
