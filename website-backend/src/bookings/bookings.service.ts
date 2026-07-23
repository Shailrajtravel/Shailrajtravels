import { Injectable, Logger } from '@nestjs/common';
import { bookingRepository } from '../repositories/BookingRepository';
import { tripOptionRepository } from '../repositories/TripOptionRepository';
import { storageManager } from '../database/StorageManager';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

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
      const openwaUrl = process.env.OPENWA_API_URL || 'https://shailrajtravels-backend.onrender.com';
      const apiKey = process.env.OPENWA_API_KEY || 'shailraj-secret-key';
      
      const sessRes = await fetch(`${openwaUrl}/api/sessions`, {
        headers: { 'X-API-Key': apiKey }
      });
      if (!sessRes.ok) return;
      const sessions = await sessRes.json();
      const activeSess = Array.isArray(sessions) ? (sessions.find((s: any) => s.status === 'ready' || s.status === 'connected') || sessions[0]) : null;
      if (!activeSess || !activeSess.id) return;

      const formattedTo = to.includes('@') ? to : `${to.replace(/\D/g, '')}@c.us`;
      await fetch(`${openwaUrl}/api/sessions/${activeSess.id}/messages/send-text`, {
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

    // Trigger WhatsApp notifications in the background
    setImmediate(() => {
      // 1. Notify Admin / Owner
      const adminMsg = `🚨 *New Booking Alert! (ID: ${bookingData.bookingId})*\n\n👤 *Customer:* ${data.name || 'Valued Customer'}\n📞 *Phone:* ${data.phone || 'N/A'}\n🗺️ *Trip:* ${data.tripName || 'Tour'}\n📍 *Pickup:* ${data.pickupLocation || 'pune'}\n👥 *Persons:* ${data.persons || 1}\n📅 *Travel Date:* ${data.travelDate || 'Flexible'}\n\nPlease check Admin Dashboard to confirm.`;
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

  async updateBookingStatus(id: string, status: string) {
    await bookingRepository.updateOne(id, { status, updatedAt: new Date().toISOString() });

    // Send automatic WhatsApp notification to customer on status change
    setImmediate(async () => {
      try {
        const bookings = await bookingRepository.findByQuery({ _id: id });
        const booking = bookings.length > 0 ? bookings[0] : null;
        if (booking && booking.phone) {
          const custName = booking.name || booking.customerName || 'Valued Customer';
          const trip = booking.tripName || 'Tour';
          const bkId = booking.bookingId || `SB-${id.slice(-6)}`;
          
          if (status === 'Confirmed') {
            const msg = `Namaste ${custName}! 🎉\n\nGreat news! Your booking (*${bkId}*) for *${trip}* has been *CONFIRMED* by Shailraj Travels!\n\n📅 *Travel Date:* ${booking.travelDate || 'As scheduled'}\n📍 *Pickup:* ${booking.pickupLocation || 'pune'}\n👥 *Persons:* ${booking.persons || 1}\n\nWe look forward to giving you a wonderful journey! Call us anytime: +91 9359570497.`;
            await this.sendWhatsAppNotification(booking.phone, msg);
          } else if (status === 'Cancelled') {
            const msg = `Namaste ${custName}.\n\nYour booking (*${bkId}*) for *${trip}* has been *CANCELLED* by Shailraj Travels.\n\nIf you have any questions or wish to re-book, please contact us at +91 9359570497.`;
            await this.sendWhatsAppNotification(booking.phone, msg);
          }
        }
      } catch (err) {
        this.logger.error(`Error sending status update WhatsApp for booking ${id}`, String(err));
      }
    });

    return { success: true };
  }

  async updateBookingPaymentStatus(id: string, paymentStatus: string) {
    await bookingRepository.updateOne(id, { paymentStatus, updatedAt: new Date().toISOString() });

    // Send automatic WhatsApp notification to customer on payment status change
    setImmediate(async () => {
      try {
        const bookings = await bookingRepository.findByQuery({ _id: id });
        const booking = bookings.length > 0 ? bookings[0] : null;
        if (booking && booking.phone) {
          const custName = booking.name || booking.customerName || 'Valued Customer';
          const trip = booking.tripName || 'Tour';
          const bkId = booking.bookingId || `SB-${id.slice(-6)}`;
          const statusUpper = (paymentStatus || '').toUpperCase();

          let msg = '';
          if (statusUpper === 'PAID') {
            msg = `Namaste ${custName}! 🧾\n\nPayment Status Update for booking *${bkId}* (${trip}):\n\n💳 *Payment Status:* *PAID IN FULL* ✅\n\nThank you for completing your payment with Shailraj Travels! View invoice: https://shailrajtravels.com/invoice-print?id=${id}\nCall us anytime: +91 9359570497.`;
          } else if (statusUpper === 'ADVANCE' || statusUpper === 'ADVANCE PAID') {
            msg = `Namaste ${custName}! 💳\n\nAdvance Payment Status Update for booking *${bkId}* (${trip}):\n\n💰 *Payment Status:* *ADVANCE RECEIVED* ✅\n\nThank you for your advance payment to Shailraj Travels! View bill: https://shailrajtravels.com/invoice-print?id=${id}\nCall us anytime: +91 9359570497.`;
          }
          if (msg) {
            await this.sendWhatsAppNotification(booking.phone, msg);
          }
        }
      } catch (err) {
        this.logger.error(`Error sending payment status WhatsApp for booking ${id}`, String(err));
      }
    });

    return { success: true, whatsappSent: true };
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
      const bookings = await bookingRepository.findByQuery({ _id: id });
      const booking = bookings.length > 0 ? bookings[0] : null;
      const phone = invoiceCustomData?.customerPhone || booking?.phone;

      if (phone) {
        const custName = invoiceCustomData?.customerName || booking?.name || 'Valued Customer';
        const trip = invoiceCustomData?.tripName || booking?.tripName || 'Tour Package';
        const invNo = invoiceCustomData?.invoiceNo || booking?.bookingId || `INV-${id.slice(-6)}`;
        const total = invoiceCustomData?.grandTotal || invoiceCustomData?.totalAmount || 'N/A';
        const advance = invoiceCustomData?.advancePaid || invoiceCustomData?.advanceAmount || '0';
        const balance = invoiceCustomData?.balanceDue || '0';
        const date = invoiceCustomData?.travelDate || booking?.travelDate || 'As scheduled';

        let msg = '';
        if (paymentStatus.toUpperCase() === 'PAID') {
          msg = `Namaste ${custName}! 🧾\n\nHere is your Official Tax Invoice from *Shailraj Travels*!\n\n📋 *Invoice No:* ${invNo}\n🚘 *Trip:* ${trip}\n📅 *Travel Date:* ${date}\n💵 *Total Amount:* ₹${total}\n💳 *Payment Status:* *PAID IN FULL* ✅\n\nView & Print your Invoice: https://shailrajtravels.com/invoice-print?id=${id}\n\nThank you for choosing Shailraj Travels! Call us anytime: +91 9359570497.`;
        } else {
          msg = `Namaste ${custName}! 🧾\n\nHere is your Advance Receipt & Bill from *Shailraj Travels*!\n\n📋 *Invoice No:* ${invNo}\n🚘 *Trip:* ${trip}\n📅 *Travel Date:* ${date}\n💵 *Total Amount:* ₹${total}\n💰 *Advance Paid:* ₹${advance}\n⚖️ *Balance Due:* ₹${balance}\n💳 *Payment Status:* *${paymentStatus.toUpperCase()}* ✅\n\nView & Print your Bill: https://shailrajtravels.com/invoice-print?id=${id}\n\nThank you for booking with Shailraj Travels! Call us anytime: +91 9359570497.`;
        }

        await this.sendWhatsAppNotification(phone, msg);
        whatsappSent = true;
      }
    } catch (err) {
      this.logger.error(`Failed to send WhatsApp invoice for booking ${id}`, String(err));
    }

    return { success: true, whatsappSent };
  }

  async sendInvoiceWhatsApp(id: string, phone?: string) {
    const bookings = await bookingRepository.findByQuery({ _id: id });
    const booking = bookings.length > 0 ? bookings[0] : null;
    if (!booking) return { success: false, message: 'Booking not found' };

    const targetPhone = phone || booking.invoiceCustomData?.customerPhone || booking.phone;
    if (!targetPhone) return { success: false, message: 'No phone number' };

    const custom = booking.invoiceCustomData || {};
    const custName = custom.customerName || booking.name || 'Valued Customer';
    const trip = custom.tripName || booking.tripName || 'Tour';
    const invNo = custom.invoiceNo || booking.bookingId || `INV-${id.slice(-6)}`;
    const paymentStatus = booking.paymentStatus || custom.paymentStatus || 'PENDING';

    const msg = `Namaste ${custName}! 🧾\n\nHere is your Invoice & Booking Summary from *Shailraj Travels*!\n\n📋 *Invoice No:* ${invNo}\n🚘 *Trip:* ${trip}\n💳 *Payment Status:* *${paymentStatus.toUpperCase()}*\n\nView & Print your Bill: https://shailrajtravels.com/invoice-print?id=${id}\n\nContact us: +91 9359570497.`;

    await this.sendWhatsAppNotification(targetPhone, msg);
    return { success: true, whatsappSent: true };
  }

  async deleteBooking(id: string) {
    return await bookingRepository.deleteOne(id);
  }

  async getBookingForPrint(id: string) {
    const bookings = await bookingRepository.findByQuery({ _id: id });
    return bookings.length > 0 ? bookings[0] : null;
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
