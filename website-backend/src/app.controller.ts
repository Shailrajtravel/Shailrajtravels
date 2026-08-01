import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(['health', 'healthz'])
  async getHealth() {
    const dbPing = await this.databaseService.pingDb();
    const memUsage = process.memoryUsage();
    return {
      status: dbPing.healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'shailrajtravels-backend',
      database: {
        status: dbPing.healthy ? 'connected' : 'disconnected',
        latencyMs: dbPing.latencyMs,
      },
      memory: {
        rssMB: (memUsage.rss / (1024 * 1024)).toFixed(2),
        heapTotalMB: (memUsage.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsedMB: (memUsage.heapUsed / (1024 * 1024)).toFixed(2),
      },
    };
  }

  @Get('status')
  async getStatus() {
    return this.getHealth();
  }

  @Get('ready')
  async getReady() {
    const dbPing = await this.databaseService.pingDb();
    if (!dbPing.healthy) {
      throw new HttpException({ status: 'not_ready', reason: 'Database connection offline' }, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      databasePingMs: dbPing.latencyMs,
    };
  }
}
