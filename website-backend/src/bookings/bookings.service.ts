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

  async createBooking(data: any) {
    const res: any = await bookingRepository.insertOne(data);
    const id = typeof res === 'object' && res ? (res.insertedId || res._id || res.id || res).toString() : String(res);
    return { id, success: true };
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
