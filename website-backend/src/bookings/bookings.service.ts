import { Injectable, Logger } from '@nestjs/common';
import { bookingRepository } from '../repositories/BookingRepository';
import { tripOptionRepository } from '../repositories/TripOptionRepository';
import { storageManager } from '../database/StorageManager';

const DEFAULT_TEMPLATES = {
  confirmed: `Namaste {customerName}! 🎉\n\nGreat news! Your booking (*{bookingId}*) for *{tripName}* has been *CONFIRMED* by Shailraj Travels!\n\n📅 *Travel Date:* {travelDate}\n📍 *Pickup:* {pickupLocation}\n👥 *Persons:* {persons}\n\nWe look forward to giving you a wonderful journey! Call us anytime: +91 9359570497.`,
  cancelled: `Namaste {customerName}.\n\nYour booking (*{bookingId}*) for *{tripName}* has been *CANCELLED* by Shailraj Travels.\n\nIf you have any questions or wish to re-book, please contact us at +91 9359570497.`,
  payment: `Namaste {customerName}! 🧾\n\nHere is your Official Payment Receipt & Invoice from *Shailraj Travels*!\n\n📋 *Booking ID:* {bookingId}\n🚘 *Trip:* {tripName}\n📅 *Travel Date:* {travelDate}\n💵 *Paid Amount:* ₹{paidAmount}\n📝 *Note:* {paymentNote}\n💳 *Payment Status:* *{paymentStatus}* ✅\n\n📄 *View & Print Invoice:* {invoiceUrl}\n\nThank you for choosing Shailraj Travels! Call us anytime: +91 9359570497.`,
  invoicePdf: `🙏 *Shailraj Travels Pune* 🙏\n\nHello *{customerName}*,\n\nWe have received your payment for *{tripName}*.\nPlease find the official invoice above. Thank you for choosing us! Have a blessed trip! 🚩`,
};

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  // --- TEMPLATES ---
  async getWhatsAppTemplates() {
    try {
      const col = await storageManager.getGlobalCollection('whatsapp_templates');
      const doc = await col.findOne({ _id: 'booking_templates' as any });
      if (doc) {
        return {
          confirmed: doc.confirmed || DEFAULT_TEMPLATES.confirmed,
          cancelled: doc.cancelled || DEFAULT_TEMPLATES.cancelled,
          payment: doc.payment || DEFAULT_TEMPLATES.payment,
          invoicePdf: doc.invoicePdf || DEFAULT_TEMPLATES.invoicePdf,
        };
      }
    } catch (e) {
      this.logger.warn('Failed to fetch whatsapp templates from database, returning defaults');
    }
    return DEFAULT_TEMPLATES;
  }

  async saveWhatsAppTemplates(templates: { confirmed?: string; cancelled?: string; payment?: string; invoicePdf?: string }) {
    try {
      const col = await storageManager.getGlobalCollection('whatsapp_templates');
      await col.updateOne(
        { _id: 'booking_templates' as any },
        {
          $set: {
            confirmed: templates.confirmed || DEFAULT_TEMPLATES.confirmed,
            cancelled: templates.cancelled || DEFAULT_TEMPLATES.cancelled,
            payment: templates.payment || DEFAULT_TEMPLATES.payment,
            invoicePdf: templates.invoicePdf || DEFAULT_TEMPLATES.invoicePdf,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );
      return { success: true };
    } catch (e: any) {
      this.logger.error('Failed to save whatsapp templates', e);
      throw e;
    }
  }

  private renderTemplate(template: string, vars: Record<string, string | number>) {
    let result = template;
    for (const key in vars) {
      const val = vars[key] != null ? String(vars[key]) : '';
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
    }
    return result;
  }

  // --- TRIP OPTIONS ---
  async getTripOptions() {
    return await tripOptionRepository.findAll();
  }

  async createTripOption(data: any) {
    return await tripOptionRepository.insertOne(data);
  }

  async updateTripOption(id: string, data: any) {
    return await tripOptionRepository.updateOne(id, data);
  }

  async deleteTripOption(id: string) {
    return await tripOptionRepository.deleteOne(id);
  }

  // --- BOOKINGS ---
  async getBookings() {
    return await bookingRepository.findAllSorted();
  }

  private async sendWhatsAppNotification(to: string, text: string) {
    try {
      const baseUrl = process.env.OPENWA_API_URL || 'https://shailrajtravels-backend.onrender.com';
      const openwaUrl = baseUrl.replace(/\/+$/, '');
      const apiKey = process.env.OPENWA_API_KEY || 'shailraj-secret-key';
      
      const sessRes = await fetch(`${openwaUrl}/api/sessions`, {
        headers: { 'X-API-Key': apiKey }
      });
      if (!sessRes.ok) {
        this.logger.error(`OpenWA API sessions error: HTTP ${sessRes.status}`);
        return;
      }
      const sessions = await sessRes.json();
      const activeSess = Array.isArray(sessions) ? (sessions.find((s: any) => s.status === 'ready' || s.status === 'connected' || s.status === 'working') || sessions[0]) : null;
      if (!activeSess || !activeSess.id) {
        this.logger.error('No active WhatsApp session found in OpenWA engine');
        return;
      }

      let cleanTo = (to || '').trim();
      let digits = cleanTo.replace(/\D/g, '');

      // Handle leading zero e.g. 08446982438 -> 8446982438
      if (digits.length === 11 && digits.startsWith('0')) {
        digits = digits.slice(1);
      }

      // Standardize Indian 10-digit mobile numbers by adding 91 country code prefix if missing
      if (digits.length === 10) {
        digits = '91' + digits;
      }

      const formattedTo = cleanTo.includes('@') ? cleanTo : `${digits}@c.us`;

      this.logger.log(`Dispatching WhatsApp message via session ${activeSess.id} to ${formattedTo}`);

      const sendRes = await fetch(`${openwaUrl}/api/sessions/${activeSess.id}/messages/send-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({
          chatId: formattedTo,
          text: text
        })
      });

      if (!sendRes.ok) {
        const errBody = await sendRes.text();
        this.logger.error(`Failed to dispatch WhatsApp message to ${formattedTo}: ${errBody}`);
      } else {
        this.logger.log(`Successfully delivered WhatsApp message to ${formattedTo}`);
      }
    } catch (err) {
      this.logger.error(`Failed to send WhatsApp notification to ${to}`, String(err));
    }
  }

  async createBooking(data: any) {
    const now = new Date().toISOString();
    const bookingData = {
      bookingId: `SB-${Date.now().toString().slice(-6)}`,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      createdAt: now,
      updatedAt: now,
      ...data
    };

    const res: any = await bookingRepository.insertOne(bookingData);
    const id = typeof res === 'object' && res ? (res.insertedId || res._id || res.id || res).toString() : String(res);

    // Immediate background notifications
    setImmediate(async () => {
      // 1. Notify Admin (Default Number: 919359570497)
      const adminMsg = `🚨 *NEW BOOKING ALERT!* (ID: ${bookingData.bookingId})\n\n👤 *Customer:* ${data.name || 'N/A'}\n📞 *Phone:* ${data.phone || 'N/A'}\n🚘 *Trip:* ${data.tripName || 'Custom'}\n📍 *Destination:* ${data.customDestination || 'N/A'}\n📅 *Travel Date:* ${data.travelDate || 'N/A'}\n👥 *Persons:* ${data.persons || 1}\n\nPlease check admin panel to confirm!`;
      this.sendWhatsAppNotification('919359570497', adminMsg);

      // 2. Notify Customer (if phone provided)
      if (data.phone) {
        const custMsg = `Namaste ${data.name || ''}! 🙏\n\nThank you for booking with *Shailraj Travels*!\n\n📋 *Booking Details (ID: ${bookingData.bookingId}):*\n• *Trip:* ${data.tripName || 'Tour'}\n• *Travel Date:* ${data.travelDate || 'Flexible'}\n• *Persons:* ${data.persons || 1}\n• *Pickup Location:* ${data.pickupLocation || 'pune'}\n• *Status:* Pending Confirmation\n\nOur team will contact you shortly to confirm your booking. Call us anytime: +91 9359570497.`;
        this.sendWhatsAppNotification(data.phone, custMsg);
      }
    });

    return { id, bookingId: bookingData.bookingId, success: true };
  }

  async updateBookingDate(id: string, date: string) {
    return await bookingRepository.updateOne(id, { travelDate: date, updatedAt: new Date().toISOString() });
  }

  async updateBookingStatus(id: string, status: 'Pending' | 'Confirmed' | 'Cancelled', sendWhatsApp: boolean = true) {
    const booking = await bookingRepository.findBookingById(id);
    if (!booking) throw new Error('Booking not found');

    await bookingRepository.updateOne(id, { status, updatedAt: new Date().toISOString() });

    // Send automatic WhatsApp notification to customer on status change using custom templates
    if (sendWhatsApp) {
      setImmediate(async () => {
        try {
          const booking = await bookingRepository.findBookingById(id);
          const targetPhone = booking?.phone || booking?.customerPhone;
          if (booking && targetPhone) {
            const templates = await this.getWhatsAppTemplates();
            const vars = {
              customerName: booking.name || booking.customerName || 'Valued Customer',
              bookingId: booking.bookingId || `SB-${id.slice(-6)}`,
              tripName: booking.tripName === 'custom' ? booking.customDestination || 'Custom Trip' : booking.tripName || 'Tour Package',
              travelDate: booking.travelDate || 'As scheduled',
              persons: booking.persons || 1,
              pickupLocation: booking.pickupLocation || 'Pune',
              invoiceUrl: `https://shailrajtravels.com/invoice-print?id=${id}`,
            };

            const sLower = (status || '').trim().toLowerCase();
            if (sLower === 'confirmed') {
              const msg = this.renderTemplate(templates.confirmed, vars);
              await this.sendWhatsAppNotification(targetPhone, msg);
            } else if (sLower === 'cancelled') {
              const msg = this.renderTemplate(templates.cancelled, vars);
              await this.sendWhatsAppNotification(targetPhone, msg);
            }
          }
        } catch (err) {
          this.logger.error(`Error sending status update WhatsApp for booking ${id}`, String(err));
        }
      });
    }

    return { success: true };
  }

  async updateBookingPaymentStatus(
    id: string,
    paymentStatus: string,
    paidAmount?: number | string,
    paymentNote?: string,
    sendWhatsApp: boolean = true,
  ) {
    const booking = await bookingRepository.findBookingById(id);
    const existingCustom = booking?.invoiceCustomData || {};

    const updateFields: any = {
      paymentStatus,
      updatedAt: new Date().toISOString(),
    };

    if (paidAmount !== undefined && paidAmount !== null && paidAmount !== '') {
      updateFields.paidAmount = String(paidAmount);
      existingCustom.advancePaid = String(paidAmount);
      existingCustom.advanceAmount = String(paidAmount);
    }
    if (paymentNote !== undefined && paymentNote !== null) {
      updateFields.paymentNote = paymentNote;
      existingCustom.paymentNote = paymentNote;
    }
    existingCustom.paymentStatus = paymentStatus;
    updateFields.invoiceCustomData = existingCustom;

    await bookingRepository.updateOne(id, updateFields);

    let whatsappSent = false;

    if (sendWhatsApp) {
      setImmediate(async () => {
        try {
          const refreshed = await bookingRepository.findBookingById(id);
          if (refreshed && refreshed.phone) {
            const templates = await this.getWhatsAppTemplates();
            const statusUpper = (paymentStatus || '').toUpperCase();
            const formattedStatus = statusUpper.includes('PAID') && !statusUpper.includes('ADVANCE') ? 'PAID IN FULL' : 'ADVANCE RECEIVED';

            const vars = {
              customerName: refreshed.name || refreshed.customerName || 'Valued Customer',
              bookingId: refreshed.bookingId || `SB-${id.slice(-6)}`,
              tripName: refreshed.tripName || 'Tour Package',
              travelDate: refreshed.travelDate || 'As scheduled',
              persons: refreshed.persons || 1,
              pickupLocation: refreshed.pickupLocation || 'Pune',
              paidAmount: refreshed.paidAmount || paidAmount || '0',
              paymentNote: refreshed.paymentNote || paymentNote || (statusUpper.includes('PAID') ? 'Full payment received' : 'Advance received'),
              paymentStatus: formattedStatus,
              invoiceUrl: `https://shailrajtravels.com/invoice-print?id=${id}`,
            };

            const msg = this.renderTemplate(templates.payment, vars);
            await this.sendWhatsAppNotification(refreshed.phone, msg);
            whatsappSent = true;
          }
        } catch (err) {
          this.logger.error(`Error sending payment status WhatsApp for booking ${id}`, String(err));
        }
      });
    }

    return { success: true, whatsappSent };
  }

  async saveInvoice(id: string, invoiceCustomData: any) {
    const paymentStatus = invoiceCustomData?.paymentStatus || 'ADVANCE';
    await bookingRepository.updateOne(id, {
      invoiceCustomData,
      isInvoiceLocked: true,
      paymentStatus: paymentStatus,
      updatedAt: new Date().toISOString()
    });

    let whatsappSent = false;
    try {
      const booking = await bookingRepository.findBookingById(id);
      const phone = invoiceCustomData?.customerPhone || booking?.phone;

      if (phone) {
        const templates = await this.getWhatsAppTemplates();
        const vars = {
          customerName: invoiceCustomData?.customerName || booking?.name || 'Valued Customer',
          bookingId: invoiceCustomData?.invoiceNo || booking?.bookingId || `INV-${id.slice(-6)}`,
          tripName: invoiceCustomData?.tripName || booking?.tripName || 'Tour Package',
          travelDate: invoiceCustomData?.travelDate || booking?.travelDate || 'As scheduled',
          persons: booking?.persons || 1,
          pickupLocation: booking?.pickupLocation || 'Pune',
          paidAmount: invoiceCustomData?.advancePaid || invoiceCustomData?.grandTotal || '0',
          paymentNote: invoiceCustomData?.paymentNote || 'Invoice issued',
          paymentStatus: (paymentStatus || '').toUpperCase(),
          invoiceUrl: `https://shailrajtravels.com/invoice-print?id=${id}`,
        };

        const msg = this.renderTemplate(templates.payment, vars);
        await this.sendWhatsAppNotification(phone, msg);
        whatsappSent = true;
      }
    } catch (err) {
      this.logger.error(`Failed to send WhatsApp invoice for booking ${id}`, String(err));
    }

    return { success: true, whatsappSent };
  }

  async sendInvoiceWhatsApp(id: string, phone?: string) {
    const booking = await bookingRepository.findBookingById(id);
    if (!booking) return { success: false, message: 'Booking not found' };

    const targetPhone = phone || booking.invoiceCustomData?.customerPhone || booking.phone;
    if (!targetPhone) return { success: false, message: 'No phone number' };

    const templates = await this.getWhatsAppTemplates();
    const custom = booking.invoiceCustomData || {};
    const vars = {
      customerName: custom.customerName || booking.name || 'Valued Customer',
      bookingId: custom.invoiceNo || booking.bookingId || `INV-${id.slice(-6)}`,
      tripName: custom.tripName || booking.tripName || 'Tour Package',
      travelDate: custom.travelDate || booking.travelDate || 'As scheduled',
      persons: booking.persons || 1,
      pickupLocation: booking.pickupLocation || 'Pune',
      paidAmount: booking.paidAmount || custom.advancePaid || '0',
      paymentNote: booking.paymentNote || 'Invoice issued',
      paymentStatus: (booking.paymentStatus || custom.paymentStatus || 'PENDING').toUpperCase(),
      invoiceUrl: `https://shailrajtravels.com/invoice-print?id=${id}`,
    };

    const msg = this.renderTemplate(templates.payment, vars);
    await this.sendWhatsAppNotification(targetPhone, msg);
    return { success: true, whatsappSent: true };
  }

  async deleteBooking(id: string) {
    return await bookingRepository.deleteOne(id);
  }

  async getBookingForPrint(id: string) {
    return await bookingRepository.findBookingById(id);
  }

  async getPublicStats() {
    try {
      const bookingsCol = await storageManager.getCollectionForRead("booking", "dummy", "bookings");
      const confirmedBookings = await bookingsCol
        .find({ status: "Confirmed" }, { projection: { persons: 1 } })
        .toArray();
        
      const travelersCount = confirmedBookings.reduce((sum: number, b: any) => {
        const p = parseInt(b.persons);
        return sum + (isNaN(p) ? 1 : p);
      }, 0);
      
      const packagesCount = await (await storageManager.getGlobalCollection("packages")).countDocuments();
      const toursCount = await (await storageManager.getGlobalCollection("tours")).countDocuments();
      const tripOptionsCount = await (await storageManager.getGlobalCollection("trip_options")).countDocuments();

      const reviewsCollection = await storageManager.getGlobalCollection("reviews");
      const reviews = await reviewsCollection
        .find({}, { projection: { rating: 1 } })
        .toArray();
      const totalRating = reviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0);
      const avgRating = reviews.length > 0 ? (totalRating / reviews.length) : 4.9;

      return {
        travelersCount,
        packagesCount,
        toursCount,
        tripOptionsCount,
        avgRating,
      };
    } catch (error) {
      this.logger.error("Failed to fetch public stats", error);
      return {
        travelersCount: 0,
        packagesCount: 0,
        toursCount: 0,
        tripOptionsCount: 0,
        avgRating: 4.9,
      };
    }
  }
}
