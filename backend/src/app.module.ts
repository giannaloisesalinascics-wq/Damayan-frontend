import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthGatewayModule } from './gateway/auth/auth-gateway.module.js';
import { SiteManagerGatewayModule } from './gateway/site-manager/site-manager.module.js';
import { AdminGatewayModule } from './gateway/admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthGatewayModule,
    SiteManagerGatewayModule,
    AdminGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
