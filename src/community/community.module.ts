import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { CommonService } from 'src/common/common.service';
import { MongooseModule } from '@nestjs/mongoose';
import { boardSchema } from 'schema/board.schema';
import { commentSchema } from 'schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'board', schema: boardSchema },
      { name: 'comment', schema: commentSchema },
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommonService]
})
export class CommunityModule {}
