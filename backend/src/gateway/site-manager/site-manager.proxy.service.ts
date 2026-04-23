import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CAPACITY_PATTERNS,
  CHECK_IN_PATTERNS,
  DASHBOARD_PATTERNS,
  DISASTER_EVENT_PATTERNS,
  DISPATCH_ORDER_PATTERNS,
  DISTRIBUTION_PATTERNS,
  INCIDENT_REPORT_PATTERNS,
  INVENTORY_PATTERNS,
  ORGANIZATION_PATTERNS,
  REGISTRATION_PATTERNS,
  RELIEF_OPERATION_PATTERNS,
  UPLOAD_PATTERNS,
} from '../../../libs/contracts/src/message-patterns.js';
import { OPERATIONS_SERVICE } from '../gateway.tokens.js';
import { CreateItemDto } from '../../inventory/dto/create-item.dto.js';
import { UpdateItemDto } from '../../inventory/dto/update-item.dto.js';
import { AdjustQuantityDto } from '../../inventory/dto/adjust-quantity.dto.js';
import { CreateCheckInDto } from '../../check-in/dto/create-check-in.dto.js';
import { ScanQrDto } from '../../check-in/dto/scan-qr.dto.js';
import { CreateOrganizationDto } from '../../organizations/dto/create-organization.dto.js';
import { UpdateOrganizationDto } from '../../organizations/dto/update-organization.dto.js';
import { CreateDisasterEventDto } from '../../disaster-events/dto/create-disaster-event.dto.js';
import { UpdateDisasterEventDto } from '../../disaster-events/dto/update-disaster-event.dto.js';
import { CreateDispatchOrderDto } from '../../dispatch-orders/dto/create-dispatch-order.dto.js';
import { UpdateDispatchOrderDto } from '../../dispatch-orders/dto/update-dispatch-order.dto.js';
import { CreateReliefOperationDto } from '../../relief-operations/dto/create-relief-operation.dto.js';
import { UpdateReliefOperationDto } from '../../relief-operations/dto/update-relief-operation.dto.js';
import { CreateIncidentReportDto } from '../../incident-reports/dto/create-incident-report.dto.js';
import { UpdateIncidentReportDto } from '../../incident-reports/dto/update-incident-report.dto.js';
import { CreateDistributionDto } from '../../distributions/dto/create-distribution.dto.js';
import { UpdateDistributionDto } from '../../distributions/dto/update-distribution.dto.js';
import { CreateCitizenDto } from '../../registrations/dto/create-citizen.dto.js';
import { UpdateCitizenDto } from '../../registrations/dto/update-citizen.dto.js';
import { CreateFamilyDto } from '../../registrations/dto/create-family.dto.js';
import { UpdateFamilyDto } from '../../registrations/dto/update-family.dto.js';
import { CreateDisasterCoverUploadDto } from '../../uploads/dto/create-disaster-cover-upload.dto.js';
import { CreateIncidentAttachmentUploadDto } from '../../uploads/dto/create-incident-attachment-upload.dto.js';
import { CreateObjectViewUrlDto } from '../../uploads/dto/create-object-view-url.dto.js';

@Injectable()
export class SiteManagerProxyService {
  constructor(
    @Inject(OPERATIONS_SERVICE) private readonly operationsClient: ClientProxy,
  ) {}

  getDashboard(scope: 'admin' | 'site-manager' = 'site-manager') {
    return firstValueFrom(
      this.operationsClient.send(DASHBOARD_PATTERNS.GET_OVERVIEW, {
        scope,
      }),
    );
  }

  findInventory(search?: string) {
    return firstValueFrom(
      this.operationsClient.send(INVENTORY_PATTERNS.FIND_ALL, { search }),
    );
  }

  findInventoryItem(id: string) {
    return firstValueFrom(
      this.operationsClient.send(INVENTORY_PATTERNS.FIND_ONE, { id }),
    );
  }

  createInventoryItem(createItemDto: CreateItemDto) {
    return firstValueFrom(
      this.operationsClient.send(INVENTORY_PATTERNS.CREATE, createItemDto),
    );
  }

  updateInventoryItem(id: string, updateItemDto: UpdateItemDto) {
    return firstValueFrom(
      this.operationsClient.send(INVENTORY_PATTERNS.UPDATE, { id, updateItemDto }),
    );
  }

  adjustInventoryItem(id: string, adjustQuantityDto: AdjustQuantityDto) {
    return firstValueFrom(
      this.operationsClient.send(INVENTORY_PATTERNS.ADJUST_QUANTITY, {
        id,
        adjustQuantityDto,
      }),
    );
  }

  deleteInventoryItem(id: string) {
    return firstValueFrom(
      this.operationsClient.send(INVENTORY_PATTERNS.DELETE, { id }),
    );
  }

  getInventoryStats() {
    return firstValueFrom(
      this.operationsClient.send(INVENTORY_PATTERNS.GET_STATS, {}),
    );
  }

  findCapacity(search?: string) {
    return firstValueFrom(
      this.operationsClient.send(CAPACITY_PATTERNS.FIND_ALL, { search }),
    );
  }

  getCapacityStats() {
    return firstValueFrom(
      this.operationsClient.send(CAPACITY_PATTERNS.GET_STATS, {}),
    );
  }

  findOrganizations(search?: string) {
    return firstValueFrom(
      this.operationsClient.send(ORGANIZATION_PATTERNS.FIND_ALL, { search }),
    );
  }

  createOrganization(createOrganizationDto: CreateOrganizationDto) {
    return firstValueFrom(
      this.operationsClient.send(ORGANIZATION_PATTERNS.CREATE, createOrganizationDto),
    );
  }

  updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return firstValueFrom(
      this.operationsClient.send(ORGANIZATION_PATTERNS.UPDATE, {
        id,
        updateOrganizationDto,
      }),
    );
  }

  deleteOrganization(id: string) {
    return firstValueFrom(
      this.operationsClient.send(ORGANIZATION_PATTERNS.DELETE, { id }),
    );
  }

  getOrganizationStats() {
    return firstValueFrom(
      this.operationsClient.send(ORGANIZATION_PATTERNS.GET_STATS, {}),
    );
  }

  findDisasterEvents(search?: string) {
    return firstValueFrom(
      this.operationsClient.send(DISASTER_EVENT_PATTERNS.FIND_ALL, { search }),
    );
  }

  createDisasterEvent(createDisasterEventDto: CreateDisasterEventDto) {
    return firstValueFrom(
      this.operationsClient.send(DISASTER_EVENT_PATTERNS.CREATE, createDisasterEventDto),
    );
  }

  updateDisasterEvent(id: string, updateDisasterEventDto: UpdateDisasterEventDto) {
    return firstValueFrom(
      this.operationsClient.send(DISASTER_EVENT_PATTERNS.UPDATE, {
        id,
        updateDisasterEventDto,
      }),
    );
  }

  deleteDisasterEvent(id: string) {
    return firstValueFrom(
      this.operationsClient.send(DISASTER_EVENT_PATTERNS.DELETE, { id }),
    );
  }

  getDisasterEventStats() {
    return firstValueFrom(
      this.operationsClient.send(DISASTER_EVENT_PATTERNS.GET_STATS, {}),
    );
  }

  findDispatchOrders(search?: string, operationId?: string) {
    return firstValueFrom(
      this.operationsClient.send(DISPATCH_ORDER_PATTERNS.FIND_ALL, {
        search,
        operationId,
      }),
    );
  }

  createDispatchOrder(createDispatchOrderDto: CreateDispatchOrderDto) {
    return firstValueFrom(
      this.operationsClient.send(DISPATCH_ORDER_PATTERNS.CREATE, createDispatchOrderDto),
    );
  }

  updateDispatchOrder(id: string, updateDispatchOrderDto: UpdateDispatchOrderDto) {
    return firstValueFrom(
      this.operationsClient.send(DISPATCH_ORDER_PATTERNS.UPDATE, {
        id,
        updateDispatchOrderDto,
      }),
    );
  }

  deleteDispatchOrder(id: string) {
    return firstValueFrom(
      this.operationsClient.send(DISPATCH_ORDER_PATTERNS.DELETE, { id }),
    );
  }

  getDispatchOrderStats() {
    return firstValueFrom(
      this.operationsClient.send(DISPATCH_ORDER_PATTERNS.GET_STATS, {}),
    );
  }

  findReliefOperations(search?: string, disasterId?: string) {
    return firstValueFrom(
      this.operationsClient.send(RELIEF_OPERATION_PATTERNS.FIND_ALL, {
        search,
        disasterId,
      }),
    );
  }

  createReliefOperation(createReliefOperationDto: CreateReliefOperationDto) {
    return firstValueFrom(
      this.operationsClient.send(RELIEF_OPERATION_PATTERNS.CREATE, createReliefOperationDto),
    );
  }

  updateReliefOperation(id: string, updateReliefOperationDto: UpdateReliefOperationDto) {
    return firstValueFrom(
      this.operationsClient.send(RELIEF_OPERATION_PATTERNS.UPDATE, {
        id,
        updateReliefOperationDto,
      }),
    );
  }

  deleteReliefOperation(id: string) {
    return firstValueFrom(
      this.operationsClient.send(RELIEF_OPERATION_PATTERNS.DELETE, { id }),
    );
  }

  getReliefOperationStats() {
    return firstValueFrom(
      this.operationsClient.send(RELIEF_OPERATION_PATTERNS.GET_STATS, {}),
    );
  }

  findIncidentReports(search?: string, disasterId?: string) {
    return firstValueFrom(
      this.operationsClient.send(INCIDENT_REPORT_PATTERNS.FIND_ALL, {
        search,
        disasterId,
      }),
    );
  }

  createIncidentReport(createIncidentReportDto: CreateIncidentReportDto) {
    return firstValueFrom(
      this.operationsClient.send(INCIDENT_REPORT_PATTERNS.CREATE, createIncidentReportDto),
    );
  }

  updateIncidentReport(id: string, updateIncidentReportDto: UpdateIncidentReportDto) {
    return firstValueFrom(
      this.operationsClient.send(INCIDENT_REPORT_PATTERNS.UPDATE, {
        id,
        updateIncidentReportDto,
      }),
    );
  }

  deleteIncidentReport(id: string) {
    return firstValueFrom(
      this.operationsClient.send(INCIDENT_REPORT_PATTERNS.DELETE, { id }),
    );
  }

  getIncidentReportStats() {
    return firstValueFrom(
      this.operationsClient.send(INCIDENT_REPORT_PATTERNS.GET_STATS, {}),
    );
  }

  findDistributions(search?: string, operationId?: string) {
    return firstValueFrom(
      this.operationsClient.send(DISTRIBUTION_PATTERNS.FIND_ALL, {
        search,
        operationId,
      }),
    );
  }

  createDistribution(createDistributionDto: CreateDistributionDto) {
    return firstValueFrom(
      this.operationsClient.send(DISTRIBUTION_PATTERNS.CREATE, createDistributionDto),
    );
  }

  updateDistribution(id: string, updateDistributionDto: UpdateDistributionDto) {
    return firstValueFrom(
      this.operationsClient.send(DISTRIBUTION_PATTERNS.UPDATE, {
        id,
        updateDistributionDto,
      }),
    );
  }

  deleteDistribution(id: string) {
    return firstValueFrom(
      this.operationsClient.send(DISTRIBUTION_PATTERNS.DELETE, { id }),
    );
  }

  getDistributionStats() {
    return firstValueFrom(
      this.operationsClient.send(DISTRIBUTION_PATTERNS.GET_STATS, {}),
    );
  }

  findCitizens(search?: string) {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.FIND_CITIZENS, { search }),
    );
  }

  createCitizen(createCitizenDto: CreateCitizenDto) {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.CREATE_CITIZEN, createCitizenDto),
    );
  }

  updateCitizen(id: string, updateCitizenDto: UpdateCitizenDto) {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.UPDATE_CITIZEN, {
        id,
        updateCitizenDto,
      }),
    );
  }

  deleteCitizen(id: string) {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.DELETE_CITIZEN, { id }),
    );
  }

  findFamilies(search?: string) {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.FIND_FAMILIES, { search }),
    );
  }

  createFamily(createFamilyDto: CreateFamilyDto) {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.CREATE_FAMILY, createFamilyDto),
    );
  }

  updateFamily(id: string, updateFamilyDto: UpdateFamilyDto) {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.UPDATE_FAMILY, {
        id,
        updateFamilyDto,
      }),
    );
  }

  deleteFamily(id: string) {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.DELETE_FAMILY, { id }),
    );
  }

  getRegistrationStats() {
    return firstValueFrom(
      this.operationsClient.send(REGISTRATION_PATTERNS.GET_STATS, {}),
    );
  }

  createDisasterCoverUploadUrl(
    createDisasterCoverUploadDto: CreateDisasterCoverUploadDto,
  ) {
    return firstValueFrom(
      this.operationsClient.send(
        UPLOAD_PATTERNS.CREATE_DISASTER_COVER_UPLOAD_URL,
        createDisasterCoverUploadDto,
      ),
    );
  }

  createIncidentAttachmentUploadUrl(
    createIncidentAttachmentUploadDto: CreateIncidentAttachmentUploadDto,
  ) {
    return firstValueFrom(
      this.operationsClient.send(
        UPLOAD_PATTERNS.CREATE_INCIDENT_ATTACHMENT_UPLOAD_URL,
        createIncidentAttachmentUploadDto,
      ),
    );
  }

  createObjectViewUrl(createObjectViewUrlDto: CreateObjectViewUrlDto) {
    return firstValueFrom(
      this.operationsClient.send(
        UPLOAD_PATTERNS.CREATE_OBJECT_VIEW_URL,
        createObjectViewUrlDto,
      ),
    );
  }

  findCheckIns(search?: string) {
    return firstValueFrom(
      this.operationsClient.send(CHECK_IN_PATTERNS.FIND_ALL, { search }),
    );
  }

  findCheckIn(id: string) {
    return firstValueFrom(
      this.operationsClient.send(CHECK_IN_PATTERNS.FIND_ONE, { id }),
    );
  }

  createManualCheckIn(createCheckInDto: CreateCheckInDto) {
    return firstValueFrom(
      this.operationsClient.send(CHECK_IN_PATTERNS.CREATE_MANUAL, createCheckInDto),
    );
  }

  scanQr(scanQrDto: ScanQrDto) {
    return firstValueFrom(
      this.operationsClient.send(CHECK_IN_PATTERNS.SCAN_QR, scanQrDto),
    );
  }

  checkOut(id: string) {
    return firstValueFrom(
      this.operationsClient.send(CHECK_IN_PATTERNS.CHECK_OUT, { id }),
    );
  }

  getCheckInStats() {
    return firstValueFrom(
      this.operationsClient.send(CHECK_IN_PATTERNS.GET_STATS, {}),
    );
  }

  getRecentCheckIns(limit?: number) {
    return firstValueFrom(
      this.operationsClient.send(CHECK_IN_PATTERNS.GET_RECENT, { limit }),
    );
  }
}
