import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(express.json({ limit: '250kb' }));
  app.use(express.urlencoded({ limit: '250kb', extended: true }));

  app.enableCors();
  app.setGlobalPrefix('api', { exclude: ['health', 'healthz', 'status', 'ready', 'webhooks', 'api/webhooks'] });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
