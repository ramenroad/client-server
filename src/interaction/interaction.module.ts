import { Module } from '@nestjs/common';
import { InteractionController } from './interaction.controller';
import { InteractionService } from './interaction.service';
import { InteractionListener } from './interaction.listener';
import { MongooseModule } from '@nestjs/mongoose';
import { viewHistorySchema } from 'schema/viewHistory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'viewHistory', schema: viewHistorySchema },
    ]),
  ],
  controllers: [InteractionController],
  providers: [InteractionService, InteractionListener],
  exports: [InteractionService],
})
export class InteractionModule {}
