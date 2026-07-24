import { Controller, Get, Inject, Optional, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShutdownService } from '../../common/services/shutdown.service';
import { EngineStateService } from '../../engine/services/engine-state.service';
import { MongoSessionService } from '../../engine/services/mongo-session.service';
import { MetricsService } from '../../engine/services/metrics.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource('main') private readonly mainDataSource: DataSource,
    @InjectDataSource('data') private readonly dataDataSource: DataSource,
    private readonly shutdownService: ShutdownService,
    @Optional() private readonly engineStateService?: EngineStateService,
    @Optional() private readonly mongoSessionService?: MongoSessionService,
    @Optional() private readonly metricsService?: MetricsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Basic health status check' })
  check() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { version } = require('../../../package.json') as { version: string };
    return {
      status: 'ok',
      version,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe endpoint' })
  liveness() {
    return { status: 'ok' };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe endpoint' })
  async readiness() {
    if (this.shutdownService.isShuttingDown()) {
      throw new ServiceUnavailableException('Service is shutting down');
    }

    try {
      await this.mainDataSource.query('SELECT 1');
      await this.dataDataSource.query('SELECT 1');
      return {
        status: 'ok',
        details: {
          mainDatabase: { status: 'up' },
          dataDatabase: { status: 'up' },
        },
      };
    } catch (err) {
      throw new ServiceUnavailableException(`Readiness check failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  @Get('diagnostics')
  @ApiOperation({ summary: 'Rich diagnostic telemetry for CRM and MongoDB engine state' })
  async getDiagnostics() {
    const state = this.engineStateService ? await this.engineStateService.getState('default') : null;
    const metrics = this.metricsService ? await this.metricsService.getMetrics('default') : null;
    const isMongoConnected = this.mongoSessionService ? this.mongoSessionService.isConnected() : false;

    return {
      status: state?.status ?? 'UNKNOWN',
      whatsapp: state?.status === 'READY',
      mongodb: isMongoConnected,
      queue: {
        pending: metrics?.pendingCount ?? 0,
        processing: metrics?.processingCount ?? 0,
        failed: metrics?.failedCount ?? 0,
      },
      lastHeartbeat: state?.lastHeartbeat ?? null,
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
