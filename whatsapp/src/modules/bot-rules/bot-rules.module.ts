import { Module } from '@nestjs/common';
import { BotRulesController } from './bot-rules.controller';
import { ShailrajApiModule } from '../shailraj-api/shailraj-api.module';

@Module({
  imports: [ShailrajApiModule],
  controllers: [BotRulesController],
})
export class BotRulesModule {}
