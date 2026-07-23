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
    return await bookingRepository.updateOne(id, { travelDate: date });
  }

  async updateBookingStatus(id: string, status: string) {
    return await bookingRepository.updateOne(id, { status });
  }

  async updateBookingPaymentStatus(id: string, paymentStatus: string) {
    return await bookingRepository.updateOne(id, { paymentStatus });
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
