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

  getDb(): Db | null {
    return this.db;
  }

  async createBooking(bookingData: any) {
    if (!this.db) return null;
    const result = await this.db.collection('bookings').insertOne({
      ...bookingData,
      createdAt: new Date(),
    });
    return result;
  }

  async getBookings() {
    if (!this.db) return [];
    return this.db.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
  }

  async getPackages() {
    if (!this.db) return [];
    return this.db.collection('packages').find({}).toArray();
  }
  
  async getTours() {
    if (!this.db) return [];
    return this.db.collection('tours').find({}).toArray();
  }
  
  async getTripOptions() {
    if (!this.db) return [];
    return this.db.collection('trip_options').find({}).toArray();
  }

  async getReviews() {
    if (!this.db) return [];
    return this.db.collection('reviews').find({}).toArray();
  }

  // --- OpenWA MongoDB Session & Webhook Persistence ---

  async saveOpenWaSession(session: any) {
    if (!this.db || !session) return;
    try {
      await this.db.collection('openwa_sessions').updateOne(
        { id: session.id },
        { $set: { ...session, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch (e: any) {
      this.logger.warn(`Failed to persist OpenWA session ${session.id} to MongoDB: ${e.message}`);
    }
  }

  async getOpenWaSessions() {
    if (!this.db) return [];
    try {
      return await this.db.collection('openwa_sessions').find({}).toArray();
    } catch (e: any) {
      this.logger.warn(`Failed to fetch OpenWA sessions from MongoDB: ${e.message}`);
      return [];
    }
  }

  async saveOpenWaWebhook(webhook: any) {
    if (!this.db || !webhook) return;
    try {
      await this.db.collection('openwa_webhooks').updateOne(
        { id: webhook.id },
        { $set: { ...webhook, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch (e: any) {
      this.logger.warn(`Failed to persist OpenWA webhook ${webhook.id} to MongoDB: ${e.message}`);
    }
  }

  async getOpenWaWebhooks() {
    if (!this.db) return [];
    try {
      return await this.db.collection('openwa_webhooks').find({}).toArray();
    } catch (e: any) {
      this.logger.warn(`Failed to fetch OpenWA webhooks from MongoDB: ${e.message}`);
      return [];
    }
  }

  async deleteOpenWaWebhook(id: string) {
    if (!this.db) return;
    try {
      await this.db.collection('openwa_webhooks').deleteOne({ id });
    } catch (e: any) {
      this.logger.warn(`Failed to delete OpenWA webhook ${id} from MongoDB: ${e.message}`);
    }
  }
}
