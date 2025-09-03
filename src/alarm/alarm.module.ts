import { Module } from '@nestjs/common';
import { AlarmController } from './alarm.controller';
import { AlarmService } from './alarm.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: 'user', schema: userSchema }, 
      ])],
  controllers: [AlarmController],
  providers: [AlarmService]
})
export class AlarmModule {}
