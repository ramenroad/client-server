import { Module } from '@nestjs/common';
import { RamenyaController } from './ramenya.controller';
import { RamenyaService } from './ramenya.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ramenyaSchema } from 'schema/ramenya.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ramenya', schema: ramenyaSchema }]),
  ],
  controllers: [RamenyaController],
  providers: [RamenyaService],
})
export class RamenyaModule {}
