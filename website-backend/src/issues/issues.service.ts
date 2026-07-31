import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { issueRepository } from '../repositories/IssueRepository';
import { ObjectId } from 'mongodb';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  async addIssue(data: any) {
    try {
      const newDoc = {
        ...data,
        status: 'open',
        createdAt: new Date(),
      };

      const insertedId = await issueRepository.insertOne(newDoc);
      this.logger.log(`[DB] Saved issue submission from ${data.email || 'unknown'}`);
      return { success: true, _id: insertedId };
    } catch (error) {
      this.logger.error("[DB] Failed to save issue:", error);
      throw error;
    }
  }

  async getAllIssues() {
    try {
      const issues = await issueRepository.find({}, { sort: { createdAt: -1 } });
      return issues;
    } catch (error) {
      this.logger.error("[DB] Failed to fetch issues:", error);
      throw error;
    }
  }

  async updateIssueStatus(id: string, status: string) {
    try {
      const issue = await issueRepository.findById(id);
      if (!issue) {
        throw new NotFoundException('Issue not found');
      }
      await issueRepository.updateOne(id, { status, updatedAt: new Date() });
      this.logger.log(`[DB] Updated issue ${id} status to ${status}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`[DB] Failed to update issue ${id}:`, error);
      throw error;
    }
  }

  async deleteIssue(id: string) {
    try {
      const issue = await issueRepository.findById(id);
      if (!issue) {
        throw new NotFoundException('Issue not found');
      }
      await issueRepository.deleteOne(id);
      this.logger.log(`[DB] Deleted issue ${id}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`[DB] Failed to delete issue ${id}:`, error);
      throw error;
    }
  }
}
