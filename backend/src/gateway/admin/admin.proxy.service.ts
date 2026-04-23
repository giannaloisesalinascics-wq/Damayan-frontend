import { Injectable } from '@nestjs/common';
import { SiteManagerProxyService } from '../site-manager/site-manager.proxy.service.js';
import { CreateItemDto } from '../../inventory/dto/create-item.dto.js';
import { UpdateItemDto } from '../../inventory/dto/update-item.dto.js';
import { AdjustQuantityDto } from '../../inventory/dto/adjust-quantity.dto.js';
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
export class AdminProxyService {
  constructor(private readonly siteManagerProxyService: SiteManagerProxyService) {}

  getDashboard() {
    return this.siteManagerProxyService.getDashboard('admin');
  }

  findInventory(search?: string) {
    return this.siteManagerProxyService.findInventory(search);
  }

  getInventoryStats() {
    return this.siteManagerProxyService.getInventoryStats();
  }

  findCapacity(search?: string) {
    return this.siteManagerProxyService.findCapacity(search);
  }

  getCapacityStats() {
    return this.siteManagerProxyService.getCapacityStats();
  }

  findOrganizations(search?: string) {
    return this.siteManagerProxyService.findOrganizations(search);
  }

  createOrganization(createOrganizationDto: CreateOrganizationDto) {
    return this.siteManagerProxyService.createOrganization(createOrganizationDto);
  }

  updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.siteManagerProxyService.updateOrganization(id, updateOrganizationDto);
  }

  deleteOrganization(id: string) {
    return this.siteManagerProxyService.deleteOrganization(id);
  }

  getOrganizationStats() {
    return this.siteManagerProxyService.getOrganizationStats();
  }

  findDisasterEvents(search?: string) {
    return this.siteManagerProxyService.findDisasterEvents(search);
  }

  createDisasterEvent(createDisasterEventDto: CreateDisasterEventDto) {
    return this.siteManagerProxyService.createDisasterEvent(createDisasterEventDto);
  }

  updateDisasterEvent(id: string, updateDisasterEventDto: UpdateDisasterEventDto) {
    return this.siteManagerProxyService.updateDisasterEvent(id, updateDisasterEventDto);
  }

  deleteDisasterEvent(id: string) {
    return this.siteManagerProxyService.deleteDisasterEvent(id);
  }

  getDisasterEventStats() {
    return this.siteManagerProxyService.getDisasterEventStats();
  }

  findDispatchOrders(search?: string, operationId?: string) {
    return this.siteManagerProxyService.findDispatchOrders(search, operationId);
  }

  createDispatchOrder(createDispatchOrderDto: CreateDispatchOrderDto) {
    return this.siteManagerProxyService.createDispatchOrder(createDispatchOrderDto);
  }

  updateDispatchOrder(id: string, updateDispatchOrderDto: UpdateDispatchOrderDto) {
    return this.siteManagerProxyService.updateDispatchOrder(id, updateDispatchOrderDto);
  }

  deleteDispatchOrder(id: string) {
    return this.siteManagerProxyService.deleteDispatchOrder(id);
  }

  getDispatchOrderStats() {
    return this.siteManagerProxyService.getDispatchOrderStats();
  }

  findReliefOperations(search?: string, disasterId?: string) {
    return this.siteManagerProxyService.findReliefOperations(search, disasterId);
  }

  createReliefOperation(createReliefOperationDto: CreateReliefOperationDto) {
    return this.siteManagerProxyService.createReliefOperation(createReliefOperationDto);
  }

  updateReliefOperation(id: string, updateReliefOperationDto: UpdateReliefOperationDto) {
    return this.siteManagerProxyService.updateReliefOperation(id, updateReliefOperationDto);
  }

  deleteReliefOperation(id: string) {
    return this.siteManagerProxyService.deleteReliefOperation(id);
  }

  getReliefOperationStats() {
    return this.siteManagerProxyService.getReliefOperationStats();
  }

  findIncidentReports(search?: string, disasterId?: string) {
    return this.siteManagerProxyService.findIncidentReports(search, disasterId);
  }

  createIncidentReport(createIncidentReportDto: CreateIncidentReportDto) {
    return this.siteManagerProxyService.createIncidentReport(createIncidentReportDto);
  }

  updateIncidentReport(id: string, updateIncidentReportDto: UpdateIncidentReportDto) {
    return this.siteManagerProxyService.updateIncidentReport(id, updateIncidentReportDto);
  }

  deleteIncidentReport(id: string) {
    return this.siteManagerProxyService.deleteIncidentReport(id);
  }

  getIncidentReportStats() {
    return this.siteManagerProxyService.getIncidentReportStats();
  }

  findDistributions(search?: string, operationId?: string) {
    return this.siteManagerProxyService.findDistributions(search, operationId);
  }

  createDistribution(createDistributionDto: CreateDistributionDto) {
    return this.siteManagerProxyService.createDistribution(createDistributionDto);
  }

  updateDistribution(id: string, updateDistributionDto: UpdateDistributionDto) {
    return this.siteManagerProxyService.updateDistribution(id, updateDistributionDto);
  }

  deleteDistribution(id: string) {
    return this.siteManagerProxyService.deleteDistribution(id);
  }

  getDistributionStats() {
    return this.siteManagerProxyService.getDistributionStats();
  }

  findCitizens(search?: string) {
    return this.siteManagerProxyService.findCitizens(search);
  }

  createCitizen(createCitizenDto: CreateCitizenDto) {
    return this.siteManagerProxyService.createCitizen(createCitizenDto);
  }

  updateCitizen(id: string, updateCitizenDto: UpdateCitizenDto) {
    return this.siteManagerProxyService.updateCitizen(id, updateCitizenDto);
  }

  deleteCitizen(id: string) {
    return this.siteManagerProxyService.deleteCitizen(id);
  }

  findFamilies(search?: string) {
    return this.siteManagerProxyService.findFamilies(search);
  }

  createFamily(createFamilyDto: CreateFamilyDto) {
    return this.siteManagerProxyService.createFamily(createFamilyDto);
  }

  updateFamily(id: string, updateFamilyDto: UpdateFamilyDto) {
    return this.siteManagerProxyService.updateFamily(id, updateFamilyDto);
  }

  deleteFamily(id: string) {
    return this.siteManagerProxyService.deleteFamily(id);
  }

  getRegistrationStats() {
    return this.siteManagerProxyService.getRegistrationStats();
  }

  createDisasterCoverUploadUrl(
    createDisasterCoverUploadDto: CreateDisasterCoverUploadDto,
  ) {
    return this.siteManagerProxyService.createDisasterCoverUploadUrl(
      createDisasterCoverUploadDto,
    );
  }

  createIncidentAttachmentUploadUrl(
    createIncidentAttachmentUploadDto: CreateIncidentAttachmentUploadDto,
  ) {
    return this.siteManagerProxyService.createIncidentAttachmentUploadUrl(
      createIncidentAttachmentUploadDto,
    );
  }

  createObjectViewUrl(createObjectViewUrlDto: CreateObjectViewUrlDto) {
    return this.siteManagerProxyService.createObjectViewUrl(createObjectViewUrlDto);
  }

  findCheckIns(search?: string) {
    return this.siteManagerProxyService.findCheckIns(search);
  }

  getCheckInStats() {
    return this.siteManagerProxyService.getCheckInStats();
  }

  getRecentCheckIns(limit?: number) {
    return this.siteManagerProxyService.getRecentCheckIns(limit);
  }

  createInventoryItem(createItemDto: CreateItemDto) {
    return this.siteManagerProxyService.createInventoryItem(createItemDto);
  }

  updateInventoryItem(id: string, updateItemDto: UpdateItemDto) {
    return this.siteManagerProxyService.updateInventoryItem(id, updateItemDto);
  }

  adjustInventoryItem(id: string, adjustQuantityDto: AdjustQuantityDto) {
    return this.siteManagerProxyService.adjustInventoryItem(id, adjustQuantityDto);
  }
}
