import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../../src/auth/auth.module.js';
import { AuthMessageController } from './auth-message.controller.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [AuthMessageController],
})
export class AuthServiceAppModule {}
