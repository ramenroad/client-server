import { Body, Controller, Get, Post } from '@nestjs/common';
import { RamenyaService } from './ramenya.service';
import { createRamenyaReqDTO } from './dto/req/createRamenya.req.dto';

@Controller('ramenya')
export class RamenyaController {
  constructor(private readonly ramenyaService: RamenyaService) {}

  @Get('')
  getRamenyas() {}

  @Post('')
  createRamenya(@Body() dto: createRamenyaReqDTO): Promise<void> {
    return this.ramenyaService.createRamenya(dto);
  }
}
