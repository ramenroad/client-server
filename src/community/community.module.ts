import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { CommonService } from 'src/common/common.service';
import { MongooseModule } from '@nestjs/mongoose';
import { boardSchema } from 'schema/board.schema';
import { commentSchema } from 'schema/comment.schema';
import { userSchema } from 'schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'board', schema: boardSchema },
      { name: 'comment', schema: commentSchema },
      { name: 'user', schema: userSchema },
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommonService]
})
export class CommunityModule {}
