import { Controller, Get, Param, Query } from '@nestjs/common';
import { RamenyaService } from './ramenya.service';
import { getRamenyasResDTO } from './dto/res/getRamenyas.res.dto';
import { getRamenyaByIdResDTO } from './dto/res/getRamenyaById.res.dto';

@Controller({ path: 'ramenya', version: '1' })
export class RamenyaController {
  constructor(private readonly ramenyaService: RamenyaService) {}

  @Get('/all')
  getRamenyas(@Query('region') region: string): Promise<getRamenyasResDTO[]> {
    return this.ramenyaService.getRamenyas(region);
  }

  @Get('/regions')
  getRamenyasRegion(): Promise<Array<string>> {
    return this.ramenyaService.getRamenyasRegion();
  }

  @Get('/:id')
  getRamenyaById(@Param('id') id: string): Promise<getRamenyaByIdResDTO> {
    return this.ramenyaService.getRamenyaById(id);
  }
}
