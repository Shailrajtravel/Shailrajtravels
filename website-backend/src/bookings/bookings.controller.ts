import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // --- WHATSAPP TEMPLATES ---
  @Get('templates')
  async getWhatsAppTemplates() {
    return this.bookingsService.getWhatsAppTemplates();
  }

  @Post('templates')
  async saveWhatsAppTemplates(@Body() templates: { confirmed?: string; cancelled?: string; payment?: string }) {
    return this.bookingsService.saveWhatsAppTemplates(templates);
  }

  // --- TRIP OPTIONS ---
  @Get('trip-options')
  async getTripOptions() {
    return this.bookingsService.getTripOptions();
  }

  @Post('trip-options')
  async createTripOption(@Body() data: any) {
    return this.bookingsService.createTripOption(data);
  }

  @Put('trip-options/:id')
  async updateTripOption(@Param('id') id: string, @Body() data: any) {
    return this.bookingsService.updateTripOption(id, data);
  }

  @Delete('trip-options/:id')
  async deleteTripOption(@Param('id') id: string) {
    return this.bookingsService.deleteTripOption(id);
  }

  // --- BOOKINGS ---
  @Get()
  async getBookings() {
    return this.bookingsService.getBookings();
  }

  @Post()
  async createBooking(@Body() data: any) {
    return this.bookingsService.createBooking(data);
  }

  @Put(':id/date')
  async updateBookingDate(@Param('id') id: string, @Body('date') date: string) {
    return this.bookingsService.updateBookingDate(id, date);
  }

  @Put(':id/status')
  async updateBookingStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateBookingStatus(id, status);
  }

  @Put(':id/payment')
  async updateBookingPaymentStatus(
    @Param('id') id: string,
    @Body() body: { paymentStatus: string; paidAmount?: number | string; paymentNote?: string; sendWhatsApp?: boolean },
  ) {
    return this.bookingsService.updateBookingPaymentStatus(
      id,
      body.paymentStatus,
      body.paidAmount,
      body.paymentNote,
      body.sendWhatsApp !== false,
    );
  }

  @Post(':id/invoice')
  async saveInvoice(@Param('id') id: string, @Body('invoiceCustomData') invoiceCustomData: any) {
    return this.bookingsService.saveInvoice(id, invoiceCustomData);
  }

  @Post(':id/invoice/whatsapp')
  async sendInvoiceWhatsApp(@Param('id') id: string, @Body('phone') phone?: string) {
    return this.bookingsService.sendInvoiceWhatsApp(id, phone);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingsService.deleteBooking(id);
  }

  @Get(':id/print')
  async getBookingForPrint(@Param('id') id: string) {
    return this.bookingsService.getBookingForPrint(id);
  }

  @Get('public-stats')
  async getPublicStats() {
    return this.bookingsService.getPublicStats();
  }
}
