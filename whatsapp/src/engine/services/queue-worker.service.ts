import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoSessionService } from './mongo-session.service';
import { DistributedLockService } from './distributed-lock.service';
import { EngineStateService } from './engine-state.service';
import { MetricsService } from './metrics.service';
import { createLogger } from '../../common/services/logger.service';
import { IncomingMessage } from '../interfaces/whatsapp-engine.interface';
import { ObjectId } from 'mongodb';

export interface QueueJobDocument {
  _id: ObjectId;
  sessionId: string;
  messageId: string;
  sender: string;
  messageTimestamp: number;
  payload: IncomingMessage;
  status: 'PENDING' | 'PROCESSING' | 'DONE';
  queueType: 'OFFLINE' | 'REALTIME';
  retryCount: number;
  nextAttemptAt: Date;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutgoingMessageDocument {
  _id: string; // `${sessionId}_${incomingMessageId}`
  sessionId: string;
  incomingMessageId: string;
  recipient: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  waMessageId?: string;
  sentAt?: Date;
  createdAt: Date;
}

@Injectable()
export class QueueWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createLogger('QueueWorkerService');
  private isRunning = false;
  private workerInterval: NodeJS.Timeout | null = null;
  private messageHandler: ((msg: IncomingMessage) => Promise<void>) | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly mongoSessionService: MongoSessionService,
    private readonly lockService: DistributedLockService,
    private readonly engineStateService: EngineStateService,
    private readonly metricsService: MetricsService,
  ) {}

  onModuleInit(): void {
    const delayMs = this.configService.get<number>('engine.queueProcessDelayMs', 500);
    this.isRunning = true;

    // Start background processing loop
    this.workerInterval = setInterval(() => {
      void this.processQueueCycle();
    }, Math.max(200, delayMs));
  }

  registerMessageHandler(handler: (msg: IncomingMessage) => Promise<void>): void {
    this.messageHandler = handler;
  }

  /** On startup, recover any jobs that were stuck in PROCESSING when container crashed. */
  async recoverStuckJobs(sessionId = 'default'): Promise<number> {
    const coll = this.mongoSessionService.getCollection<QueueJobDocument>('offline_queue');
    if (!coll) return 0;

    try {
      const res = await coll.updateMany(
        { sessionId, status: 'PROCESSING' },
        { $set: { status: 'PENDING', updatedAt: new Date() } },
      );
      if (res.modifiedCount > 0) {
        this.logger.log(`[QueueRecovery] Recovered ${res.modifiedCount} stuck PROCESSING jobs for session ${sessionId}`);
      }
      return res.modifiedCount;
    } catch {
      return 0;
    }
  }

  async enqueue(msg: IncomingMessage, queueType: 'OFFLINE' | 'REALTIME'): Promise<boolean> {
    const queueColl = this.mongoSessionService.getCollection<QueueJobDocument>('offline_queue');
    const processedColl = this.mongoSessionService.getCollection<{ _id: string; sessionId: string; messageId: string; processedAt: Date }>('processed_messages');

    if (!queueColl || !processedColl) {
      // Memory fallback if MongoDB is disabled
      if (this.messageHandler) {
        void this.messageHandler(msg);
      }
      return true;
    }

    const sessionId = (msg as any).sessionId || 'default';
    const messageId = msg.id;
    const dedupeId = `${sessionId}_${messageId}`;

    try {
      // 1. Check duplicate
      const isDuplicate = await processedColl.findOne({ _id: dedupeId });
      if (isDuplicate) {
        this.logger.debug(`[Dedupe] Skipped duplicate incoming message ${messageId}`);
        return false;
      }

      // 2. Insert into offline_queue
      await queueColl.updateOne(
        { messageId, sessionId },
        {
          $setOnInsert: {
            sessionId,
            messageId,
            sender: msg.from,
            messageTimestamp: msg.timestamp,
            payload: msg,
            status: 'PENDING',
            queueType,
            retryCount: 0,
            nextAttemptAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );

      await this.metricsService.updateMetrics(sessionId, { pendingDelta: 1 });
      return true;
    } catch (err) {
      this.logger.warn('Failed to enqueue message', { error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  }

  private async processQueueCycle(): Promise<void> {
    if (!this.isRunning || !this.messageHandler) return;

    const sessionId = 'default';
    const hasLease = await this.lockService.tryAcquireLease(sessionId, 30000);
    if (!hasLease) return; // Another worker instance is currently processing the queue

    const queueColl = this.mongoSessionService.getCollection<QueueJobDocument>('offline_queue');
    if (!queueColl) return;

    const batchSize = this.configService.get<number>('engine.queueBatchSize', 100);

    try {
      const now = new Date();
      // Fetch batch of PENDING jobs sorted by priority: OFFLINE first, then REALTIME, then timestamp ASC
      const jobs = await queueColl
        .find({ status: 'PENDING', nextAttemptAt: { $lte: now } })
        .sort({ queueType: 1, messageTimestamp: 1 })
        .limit(batchSize)
        .toArray();

      if (jobs.length === 0) return;

      for (const job of jobs) {
        if (!this.isRunning) break;
        await this.processSingleJob(job);
      }
    } catch (err) {
      this.logger.warn('Error during queue processing cycle', { error: err instanceof Error ? err.message : String(err) });
    }
  }

  private async processSingleJob(job: QueueJobDocument): Promise<void> {
    const queueColl = this.mongoSessionService.getCollection<QueueJobDocument>('offline_queue');
    const processedColl = this.mongoSessionService.getCollection('processed_messages');
    const dlqColl = this.mongoSessionService.getCollection('dead_letter_queue');
    if (!queueColl) return;

    const startTime = Date.now();
    // Claim job: status -> PROCESSING
    const claimResult = await queueColl.updateOne(
      { _id: job._id, status: 'PENDING' },
      { $set: { status: 'PROCESSING', updatedAt: new Date() } },
    );
    if (claimResult.modifiedCount === 0) return;

    await this.metricsService.updateMetrics(job.sessionId, { pendingDelta: -1, processingDelta: 1 });

    try {
      // Execute registered bot rule / message handler
      await this.messageHandler!(job.payload);

      const processingTime = Date.now() - startTime;
      await this.commitJobCompletion(job, processingTime);
    } catch (err) {
      const processingTime = Date.now() - startTime;
      await this.handleJobFailure(job, err instanceof Error ? err.message : String(err), processingTime);
    }
  }

  private async commitJobCompletion(job: QueueJobDocument, processingTimeMs: number): Promise<void> {
    const client = this.mongoSessionService.getClient();
    const queueColl = this.mongoSessionService.getCollection<QueueJobDocument>('offline_queue');
    const processedColl = this.mongoSessionService.getCollection<{ _id: string; sessionId: string; messageId: string; processedAt: Date }>('processed_messages');

    if (!queueColl || !processedColl) return;

    const dedupeId = `${job.sessionId}_${job.messageId}`;

    if (client) {
      const session = client.startSession();
      try {
        await session.withTransaction(async () => {
          await queueColl.updateOne(
            { _id: job._id },
            { $set: { status: 'DONE', updatedAt: new Date() } },
            { session },
          );
          await processedColl.updateOne(
            { _id: dedupeId },
            {
              $set: {
                sessionId: job.sessionId,
                messageId: job.messageId,
                processedAt: new Date(),
              },
            },
            { upsert: true, session },
          );
          await this.engineStateService.updateLastProcessedTimestamp(job.sessionId, job.messageTimestamp);
          await this.metricsService.updateMetrics(job.sessionId, { processingDelta: -1 }, processingTimeMs);
        });
        return;
      } catch {
        // Fallback for standalone Mongo or transactions unsupported
      } finally {
        await session.endSession();
      }
    }

    // Fallback execution
    await queueColl.updateOne({ _id: job._id }, { $set: { status: 'DONE', updatedAt: new Date() } });
    await processedColl.updateOne(
      { _id: dedupeId },
      { $set: { sessionId: job.sessionId, messageId: job.messageId, processedAt: new Date() } },
      { upsert: true },
    );
    await this.engineStateService.updateLastProcessedTimestamp(job.sessionId, job.messageTimestamp);
    await this.metricsService.updateMetrics(job.sessionId, { processingDelta: -1 }, processingTimeMs);
  }

  private async handleJobFailure(job: QueueJobDocument, errorMsg: string, processingTimeMs: number): Promise<void> {
    const queueColl = this.mongoSessionService.getCollection<QueueJobDocument>('offline_queue');
    const dlqColl = this.mongoSessionService.getCollection('dead_letter_queue');
    if (!queueColl) return;

    const retryDelays = this.configService.get<number[]>('engine.queueRetries', [2000, 5000, 10000]);
    const nextRetryCount = job.retryCount + 1;

    if (nextRetryCount <= retryDelays.length) {
      const delayMs = retryDelays[nextRetryCount - 1];
      const nextAttemptAt = new Date(Date.now() + delayMs);

      await queueColl.updateOne(
        { _id: job._id },
        {
          $set: {
            status: 'PENDING',
            retryCount: nextRetryCount,
            nextAttemptAt,
            lastError: errorMsg,
            updatedAt: new Date(),
          },
        },
      );
      await this.metricsService.updateMetrics(job.sessionId, { pendingDelta: 1, processingDelta: -1 }, processingTimeMs);
      this.logger.warn(`[QueueWorker] Job ${job.messageId} failed. Retry ${nextRetryCount}/${retryDelays.length} scheduled in ${delayMs}ms.`);
    } else {
      // Exceeded max retries: transfer to Dead Letter Queue (DLQ)
      if (dlqColl) {
        await dlqColl.insertOne({
          sessionId: job.sessionId,
          messageId: job.messageId,
          sender: job.sender,
          payload: job.payload,
          retryCount: nextRetryCount,
          failedAt: new Date(),
          error: errorMsg,
        });
      }
      await queueColl.deleteOne({ _id: job._id });
      await this.metricsService.updateMetrics(job.sessionId, { processingDelta: -1, failedDelta: 1 }, processingTimeMs);
      this.logger.error(`[QueueWorker] Job ${job.messageId} permanently failed. Moved to dead_letter_queue.`);
    }
  }

  /** Outgoing Message Idempotency Check & Guard */
  async isOutgoingAlreadySent(sessionId: string, incomingMessageId: string): Promise<boolean> {
    const outgoingColl = this.mongoSessionService.getCollection<OutgoingMessageDocument>('outgoing_messages');
    if (!outgoingColl) return false;

    const _id = `${sessionId}_${incomingMessageId}`;
    const doc = await outgoingColl.findOne({ _id });
    return doc?.status === 'SENT';
  }

  async recordOutgoingSent(sessionId: string, incomingMessageId: string, recipient: string, waMessageId?: string): Promise<void> {
    const outgoingColl = this.mongoSessionService.getCollection<OutgoingMessageDocument>('outgoing_messages');
    if (!outgoingColl) return;

    const _id = `${sessionId}_${incomingMessageId}`;
    await outgoingColl.updateOne(
      { _id },
      {
        $set: {
          sessionId,
          incomingMessageId,
          recipient,
          status: 'SENT',
          waMessageId,
          sentAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
  }

  onModuleDestroy(): void {
    this.isRunning = false;
    if (this.workerInterval) {
      clearInterval(this.workerInterval);
      this.workerInterval = null;
    }
  }
}
