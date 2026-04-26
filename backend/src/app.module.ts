import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthGatewayModule } from './gateway/auth/auth-gateway.module.js';
import { SiteManagerGatewayModule } from './gateway/site-manager/site-manager.module.js';
import { AdminGatewayModule } from './gateway/admin/admin.module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendRoot = resolve(__dirname, '..');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(backendRoot, '.env'),
    }),
    AuthGatewayModule,
    SiteManagerGatewayModule,
    AdminGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
