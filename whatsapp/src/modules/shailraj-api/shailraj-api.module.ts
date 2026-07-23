import { Module, Global } from '@nestjs/common';
import { ShailrajApiService } from './shailraj-api.service';

@Global()
@Module({
  providers: [ShailrajApiService],
  exports: [ShailrajApiService],
})
export class ShailrajApiModule {}
