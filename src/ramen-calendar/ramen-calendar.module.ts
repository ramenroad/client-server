import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ramenCalendarSchema } from 'schema/ramen-calendar.schema';
import { RamenCalendarController } from './ramen-calendar.controller';
import { RamenCalendarService } from './ramen-calendar.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ramenCalendar', schema: ramenCalendarSchema }])],
  controllers: [RamenCalendarController],
  providers: [RamenCalendarService],
})
export class RamenCalendarModule {}
