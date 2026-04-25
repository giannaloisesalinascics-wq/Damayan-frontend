import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuthGatewayController } from './auth.controller.js';
import { AuthProxyService } from './auth.proxy.service.js';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST ?? '127.0.0.1',
          port: Number(process.env.AUTH_SERVICE_PORT ?? 4001),
        },
      },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthGatewayController],
  providers: [AuthProxyService, JwtAuthGuard],
  exports: [AuthProxyService],
})
export class AuthGatewayModule {}
