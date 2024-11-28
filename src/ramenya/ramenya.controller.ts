import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RamenyaService } from './ramenya.service';
import { createRamenyaReqDTO } from './dto/req/createRamenya.req.dto';
import { getRamenyasResDTO } from './dto/res/getRamenyas.res.dto';
import { getRamenyaByIdResDTO } from './dto/res/getRamenyaById.res.dto';

@Controller('ramenya')
export class RamenyaController {
  constructor(private readonly ramenyaService: RamenyaService) {}

  @Get('/all')
  getRamenyas(@Query('region') region: string): Promise<getRamenyasResDTO[]> {
    return this.ramenyaService.getRamenyas(region);
  }

  @Get('/:id')
  getRamenyaById(@Param('id') id: string): Promise<getRamenyaByIdResDTO> {
    return this.ramenyaService.getRamenyaById(id);
  }
}
