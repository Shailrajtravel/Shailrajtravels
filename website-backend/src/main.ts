import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors();
  app.setGlobalPrefix('api', { exclude: ['health', 'healthz', 'status', 'ready', 'webhook', 'webhooks', 'api/webhook', 'api/webhooks'] });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
