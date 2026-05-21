import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard.js';
import { RolesGuard } from '../common/auth/roles.guard.js';
import { Roles } from '../common/auth/roles.decorator.js';
import { AppRole } from '../../libs/contracts/src/roles.js';
import { RegionsService } from './regions.service.js';
import { CreateShelterAssignmentDto } from './dto/create-shelter-assignment.dto.js';
import { UpdateRegionPhaseDto } from './dto/update-region-phase.dto.js';
import { UpsertRegionPersonaPhaseDto } from './dto/upsert-region-persona-phase.dto.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AppRole.ADMIN)
export class RegionsController {
  constructor(@Inject(RegionsService) private readonly regionsService: RegionsService) {}

  @Get('regions')
  findAllRegions() {
    return this.regionsService.findAll();
  }

  @Get('regions/geo')
  findAllRegionsGeo() {
    return this.regionsService.getAllRegionsGeo();
  }

  @Get('regions/:id/geo')
  findRegionGeo(@Param('id') id: string) {
    return this.regionsService.getRegionGeo(id);
  }

  @Get('regions/:id/shelters')
  findRegionShelters(@Param('id') id: string) {
    return this.regionsService.getRegionShelters(id);
  }

  @Patch('regions/:id/phase')
  updateRegionPhase(@Param('id') id: string, @Body() dto: UpdateRegionPhaseDto) {
    return this.regionsService.updatePhase(id, dto.newPhase);
  }

  @Get('regions/:id/persona-phase-controls')
  findPersonaPhaseControls(@Param('id') id: string) {
    return this.regionsService.findPersonaPhaseControls(id);
  }

  @Post('regions/:id/persona-phase-controls')
  upsertPersonaPhaseControl(@Param('id') id: string, @Body() dto: UpsertRegionPersonaPhaseDto) {
    return this.regionsService.upsertPersonaPhaseControl(id, dto);
  }

  @Get('regions/:id/persona-phase-controls/audience')
  findPersonaPhaseAudience(@Param('id') id: string, @Query('personaRole') personaRole?: AppRole) {
    return this.regionsService.findPersonaPhaseAudience(id, personaRole);
  }

  @Get('shelter-assignments')
  findAssignments(@Query('centerId') centerId?: string) {
    return this.regionsService.findAssignments(centerId);
  }

  @Post('shelter-assignments')
  createAssignment(@Body() dto: CreateShelterAssignmentDto) {
    return this.regionsService.createAssignment(dto);
  }

  @Delete('shelter-assignments/:managerId')
  deleteAssignment(@Param('managerId') managerId: string) {
    return this.regionsService.deleteAssignment(managerId);
  }
}
