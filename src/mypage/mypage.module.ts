import { Module } from '@nestjs/common';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'schema/user.schema';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: userSchema }])],
  controllers: [MypageController],
  providers: [MypageService, CommonService],
})
export class MypageModule {}
