import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RamenyaService } from './ramenya.service';
import { createRamenyaReqDTO } from './dto/req/createRamenya.req.dto';
import { getRamenyasResDTO } from './dto/res/getRamenyas.res.dto';

@Controller('ramenya')
export class RamenyaController {
  constructor(private readonly ramenyaService: RamenyaService) {}

  @Get('')
  getRamenyas(@Query('region') region: string): Promise<getRamenyasResDTO[]> {
    return this.ramenyaService.getRamenyas(region);
  }

  @Post('')
  createRamenya(@Body() dto: createRamenyaReqDTO): Promise<void> {
    return this.ramenyaService.createRamenya(dto);
  }
}
