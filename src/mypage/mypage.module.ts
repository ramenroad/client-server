import { Module } from '@nestjs/common';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'schema/user.schema';
import { CommonService } from 'src/common/common.service';
import { reviewSchema } from 'schema/review.schema';
import { noticeSchema } from 'schema/notice.schema';
import { inquirySchema } from 'schema/inquiry.schema';
import { boardSchema } from 'schema/board.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'user', schema: userSchema }, 
    { name: 'review', schema: reviewSchema },
    { name: 'notice', schema: noticeSchema },
    { name: 'inquiry', schema: inquirySchema },
    { name: 'board', schema: boardSchema },
  ])],
  controllers: [MypageController],
  providers: [MypageService, CommonService],
})
export class MypageModule {}
