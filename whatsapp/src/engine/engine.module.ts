import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineFactory } from './engine.factory';
import { BaileysStoredMessage } from './adapters/baileys-stored-message.entity';
import { BaileysMessageStoreService } from './adapters/baileys-message-store.service';
import { LidMapping } from './identity/lid-mapping.entity';
import { LidMappingStoreService } from './identity/lid-mapping-store.service';
import { MongoSessionService } from './services/mongo-session.service';
import { DistributedLockService } from './services/distributed-lock.service';
import { EngineStateService } from './services/engine-state.service';
import { MetricsService } from './services/metrics.service';
import { QueueWorkerService } from './services/queue-worker.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BaileysStoredMessage, LidMapping], 'data')],
  providers: [
    EngineFactory,
    BaileysMessageStoreService,
    LidMappingStoreService,
    MongoSessionService,
    DistributedLockService,
    EngineStateService,
    MetricsService,
    QueueWorkerService,
  ],
  exports: [
    EngineFactory,
    LidMappingStoreService,
    MongoSessionService,
    DistributedLockService,
    EngineStateService,
    MetricsService,
    QueueWorkerService,
  ],
})
export class EngineModule {}

