import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthServiceAppModule } from './auth-service.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthServiceAppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SERVICE_HOST ?? '127.0.0.1',
      port: Number(process.env.AUTH_SERVICE_PORT ?? 4001),
    },
  });

  await app.listen();
}

bootstrap();
