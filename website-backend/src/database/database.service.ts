import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async onModuleInit() {
    const uri = process.env.VITE_MONGO_URI || process.env.MONGO_URI;
    
    if (!uri) {
      this.logger.error('No VITE_MONGO_URI or MONGO_URI provided in environment variables');
      return;
    }

    try {
      this.client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      await this.client.connect();
      this.db = this.client.db('shailraj');
      this.logger.log('Successfully connected to MongoDB');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB', error);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
      this.logger.log('Disconnected from MongoDB');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }
}
