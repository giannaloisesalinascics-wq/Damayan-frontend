import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { ApiCenterModule } from '../apicenter/apicenter.module.js';

@Module({
  imports: [ApiCenterModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
