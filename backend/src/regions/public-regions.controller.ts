import { Controller, Get } from '@nestjs/common';
import { RegionsService } from './regions.service.js';

@Controller('regions')
export class PublicRegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  findAll() {
    return this.regionsService.findAll();
  }
}
