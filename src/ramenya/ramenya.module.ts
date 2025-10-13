import { Module } from '@nestjs/common';
import { RamenyaController } from './ramenya.controller';
import { RamenyaService } from './ramenya.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ramenyaSchema } from 'schema/ramenya.schema';
import { ramenyaGroupSchema } from 'schema/ramenyaGroup.schema';
import { CommonModule } from 'src/common/common.module';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ramenya', schema: ramenyaSchema },
      {
        name: 'ramenyaGroup',
        schema: ramenyaGroupSchema,
      },
    ]),
    CommonModule,
  ],
  controllers: [RamenyaController],
  providers: [RamenyaService, CommonService],
})
export class RamenyaModule {}
