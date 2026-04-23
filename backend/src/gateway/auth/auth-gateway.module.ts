import { Module } from '@nestjs/common';
import { GatewayClientsModule } from '../clients.module.js';
import { AuthGatewayController } from './auth.controller.js';
import { AuthProxyService } from './auth.proxy.service.js';

@Module({
  imports: [GatewayClientsModule],
  controllers: [AuthGatewayController],
  providers: [AuthProxyService],
})
export class AuthGatewayModule {}
