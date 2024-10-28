import { Module } from '@nestjs/common';
import { RamenyaController } from './ramenya.controller';
import { RamenyaService } from './ramenya.service';

@Module({
  controllers: [RamenyaController],
  providers: [RamenyaService]
})
export class RamenyaModule {}
