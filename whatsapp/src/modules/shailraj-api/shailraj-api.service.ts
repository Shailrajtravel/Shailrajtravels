import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class ShailrajApiService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ShailrajApiService.name);
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async onModuleInit() {
    const uri = process.env.VITE_MONGO_URI || process.env.MONGO_URI;
    if (!uri) {
      this.logger.warn('VITE_MONGO_URI or MONGO_URI is not set. Shailraj API will not connect to MongoDB.');
      return;
    }

    try {
      this.client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      await this.client.connect();
      this.db = this.client.db('shailraj');
      this.logger.log('Successfully connected to MongoDB for Shailraj API');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB', error);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database connection not established');
    }
    return this.db;
  }

  async createBooking(bookingData: any) {
    const db = this.getDb();
    const result = await db.collection('bookings').insertOne({
      ...bookingData,
      createdAt: new Date(),
    });
    return result;
  }

  async getBookings() {
    const db = this.getDb();
    return db.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
  }

  async getPackages() {
    const db = this.getDb();
    return db.collection('packages').find({}).toArray();
  }
  
  async getTours() {
    const db = this.getDb();
    return db.collection('tours').find({}).toArray();
  }
  
  async getTripOptions() {
    const db = this.getDb();
    return db.collection('trip_options').find({}).toArray();
  }

  async getReviews() {
    const db = this.getDb();
    return db.collection('reviews').find({}).toArray();
  }
}
