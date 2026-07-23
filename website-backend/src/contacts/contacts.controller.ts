import { Controller, Post, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async addContact(@Body() data: any) {
    return this.contactsService.addContact(data);
  }
}
