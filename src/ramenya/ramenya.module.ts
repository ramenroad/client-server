import { Module } from '@nestjs/common';
import { RamenyaController } from './ramenya.controller';
import { RamenyaService } from './ramenya.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ramenyaSchema } from 'schema/ramenya.schema';
import { ramenyaGroupSchema } from 'schema/ramenyaGroup.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ramenya', schema: ramenyaSchema },
      {
        name: 'ramenyaGroup',
        schema: ramenyaGroupSchema,
      },
    ]),
  ],
  controllers: [RamenyaController],
  providers: [RamenyaService],
})
export class RamenyaModule {}
