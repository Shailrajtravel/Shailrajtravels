import { Injectable, Logger } from '@nestjs/common';
import { contactRepository } from '../repositories/ContactRepository';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  async addContact(data: any) {
    try {
      const newDoc = {
        ...data,
        createdAt: new Date(),
      };

      const insertedId = await contactRepository.insertOne(newDoc);
      this.logger.log(`[DB] Saved contact submission from ${data.email || 'unknown'}`);
      return { success: true, _id: insertedId };
    } catch (error) {
      this.logger.error("[DB] Failed to save contact:", error);
      throw error;
    }
  }
}
