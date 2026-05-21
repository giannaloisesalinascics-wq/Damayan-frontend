import { Module } from '@nestjs/common';
import { GatewayClientsModule } from '../clients.module.js';
import { DispatcherIncidentReportsController } from './dispatcher-incident-reports.controller.js';
import { DispatcherOperationsController } from './dispatcher-operations.controller.js';
import { SiteManagerProxyService } from '../site-manager/site-manager.proxy.service.js';
import { SupabaseModule } from '../../supabase/supabase.module.js';
import { DispatcherAccountStatusService } from './dispatcher-account-status.service.js';

@Module({
  imports: [GatewayClientsModule, SupabaseModule],
  controllers: [DispatcherIncidentReportsController, DispatcherOperationsController],
  providers: [SiteManagerProxyService, DispatcherAccountStatusService],
})
export class DispatcherModule { }
