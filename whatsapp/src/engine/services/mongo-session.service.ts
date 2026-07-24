import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, Collection } from 'mongodb';
import { createLogger } from '../../common/services/logger.service';

@Injectable()
export class MongoSessionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createLogger('MongoSessionService');
  private client: MongoClient | null = null;
  private db: Db | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const uri = this.configService.get<string>('engine.mongodbUri');
    if (!uri) {
      this.logger.log('MONGODB_URI not configured; skipping MongoSessionService initialization.');
      return;
    }

    try {
      this.client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      await this.client.connect();
      this.db = this.client.db();
      this.logger.log('Successfully connected to MongoDB Atlas for OpenWA persistence.');

      await this.ensureIndexes();
    } catch (err) {
      this.logger.error('Failed to connect to MongoDB Atlas', err instanceof Error ? err.stack : String(err));
    }
  }

  private async ensureIndexes(): Promise<void> {
    if (!this.db) return;
    try {
      // 1. baileys_keys compound index
      await this.db.collection('baileys_keys').createIndex(
        { sessionId: 1, category: 1, keyId: 1 },
        { name: 'idx_session_cat_key' }
      );

      // 2. offline_queue compound indexes
      await this.db.collection('offline_queue').createIndex(
        { status: 1, queueType: 1, messageTimestamp: 1 },
        { name: 'idx_status_queue_time' }
      );
      await this.db.collection('offline_queue').createIndex(
        { sessionId: 1, messageId: 1 },
        { unique: true, name: 'idx_session_msg_unique' }
      );

      // 3. processed_messages 48-hour TTL index (172800 seconds)
      await this.db.collection('processed_messages').createIndex(
        { processedAt: 1 },
        { expireAfterSeconds: 172800, name: 'idx_processed_ttl' }
      );

      // 4. queue_lock TTL index
      await this.db.collection('queue_lock').createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0, name: 'idx_lock_ttl' }
      );

      // 5. outgoing_messages index
      await this.db.collection('outgoing_messages').createIndex(
        { sessionId: 1, incomingMessageId: 1 },
        { unique: true, name: 'idx_outgoing_unique' }
      );

      this.logger.log('MongoDB collection indexes successfully verified/created.');
    } catch (err) {
      this.logger.warn('Error creating MongoDB indexes', { error: err instanceof Error ? err.message : String(err) });
    }
  }

  isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }

  getClient(): MongoClient | null {
    return this.client;
  }

  getDb(): Db | null {
    return this.db;
  }

  getCollection<T extends import('mongodb').Document = import('mongodb').Document>(name: string): Collection<T> | null {
    if (!this.db) return null;
    return this.db.collection<T>(name);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      this.logger.log('Closing MongoDB Atlas connection...');
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}
