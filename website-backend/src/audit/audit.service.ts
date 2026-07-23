import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async logAction(data: { action: string; entityType: string; details: string; entityId?: string }) {
    try {
      const entry: any = {
        action: data.action,
        entityType: data.entityType,
        details: data.details,
        createdAt: new Date(),
      };
      if (data.entityId) entry.entityId = data.entityId;

      await this.databaseService.getDb().collection('audit_logs').insertOne(entry);
      return { success: true };
    } catch (error) {
      this.logger.error("Failed to log audit action:", error);
      return { success: false };
    }
  }

  async getAuditLogs() {
    try {
      const logs = await this.databaseService.getDb().collection('audit_logs')
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();

      return logs.map(log => ({
        ...log,
        _id: log._id.toString(),
      }));
    } catch (error) {
      this.logger.error("Failed to fetch audit logs", error);
      return [];
    }
  }
}
