import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  async addContact(@Body() data: any) {
    return this.contactsService.addContact(data);
  }
}
