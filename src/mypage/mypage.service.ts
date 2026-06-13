import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { updateNicknameReqDTO } from './dto/req/updateNickname.req.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { user } from 'schema/user.schema';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { getMyInfoResDTO } from './dto/res/getMyInfo.res.dto';
import { CommonService } from 'src/common/common.service';
import { updateIsPublicReqDTO } from './dto/req/updateIsPublic.req.dto';
import { review } from 'schema/review.schema';
import { getUserInfoResDTO } from './dto/res/getUserInfo.res.dto';
import { notice } from 'schema/notice.schema';
import { getNoticesResDTO } from './dto/res/getNotices.res.dto';
import { getNoticeResDTO } from './dto/res/getNotice.res.dto';
import { createInquiryReqDTO } from './dto/req/createInquiry.req.dto';
import { inquiry } from 'schema/inquiry.schema';
import { Express } from 'express';
import { Board } from 'schema/board.schema';
import { getMyPostsResDTO } from './dto/res/getMyPost.res.dto';
import { ViewHistory } from 'schema/viewHistory.schema';
import { getRecentViewedRamenyaResDTO } from './dto/res/getRecentViewedRamenya.res.dto';
import { getMyCommentsResDTO } from './dto/res/getMyComments.res.dto';
import { Bookmark } from 'schema/bookmark.schema';
import { getMyBookmarksResDTO } from './dto/res/getMyBookmarks.res.dto';

@Injectable()
export class MypageService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<user>,
    @InjectModel('review') private readonly reviewModel: Model<review>,
    private readonly commonService: CommonService,
    @InjectModel('notice') private readonly noticeModel: Model<notice>,
    @InjectModel('inquiry') private readonly inquiryModel: Model<inquiry>,
    @InjectModel('board') private readonly boardModel: Model<Board>,
    @InjectModel('viewHistory') private readonly viewHistoryModel: Model<ViewHistory>,
    @InjectModel('comment') private readonly commentModel: Model<Comment>,
    @InjectModel('bookmark') private readonly bookmarkModel: Model<Bookmark>,
  ) {}

  async updateNickname(user: JwtPayload, dto: updateNicknameReqDTO) {

    const alreadyExist = await this.userModel.findOne({
      nickname: dto.nickname,
    });

    if (alreadyExist) {
      throw new ConflictException('닉네임이 중복인 경우');
    }

    await this.userModel.findByIdAndUpdate(user.id, {
      nickname: dto.nickname,
    });

    return;
  }

  async getMyInfo(user: JwtPayload): Promise<getMyInfoResDTO> {
    const myInfo = await this.userModel
      .findById(user.id)
      .select('nickname email profileImageUrl');

    if (!myInfo) {
      throw new NotFoundException('내 정보 조회 실패');
    }

    return myInfo;
  }

  async updateProfileImage(
    user: JwtPayload,
    profileImageFile: Express.Multer.File,
  ): Promise<void> {
    try {
      const url = await this.commonService.uploadImageFileToS3(
        'images/profiles/',
        profileImageFile.originalname,
        profileImageFile,
      );

      await this.userModel.findByIdAndUpdate(user.id, {
        profileImageUrl: url,
      });
    } catch (error) {
      throw new Error('프로필 사진 변경 실패');
    }

    return;
  }

  async updateIsPublic(user: JwtPayload, dto: updateIsPublicReqDTO) {
    await this.userModel.findByIdAndUpdate(user.id, {
      isPublic: dto.isPublic,
    });

    return;
  }

  async getUserInfo(userId: string): Promise<getUserInfoResDTO> {
    const user = await this.userModel
      .findById(userId)
      .select('nickname profileImageUrl avgReviewRating reviewCount isPublic');

    if (!user) {
      throw new NotFoundException('유저 정보 조회 실패');
    }

    const reviewCount30Days = await this.reviewModel.countDocuments({
      userId: userId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    });

    const response = {
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
      avgReviewRating: user.avgReviewRating,
      reviewCount: user.reviewCount,
      isPublic: user.isPublic,
      currentMonthReviewCount: reviewCount30Days,
    };

    return response;
  }

  async checkNickname(nickname: string): Promise<boolean> {
    const user = await this.userModel.findOne({ nickname: nickname });

    if (user) {
      return false;
    }

    return true;
  }

  async getNotices(type: string): Promise<getNoticesResDTO[]> {

    const notices = await this.noticeModel.find({ type: type })
    .select('_id title url createdAt')

    return notices;
  }

  async getNotice(noticeId: string): Promise<getNoticeResDTO> {
    const notice = await this.noticeModel.findById(noticeId)
    .select('_id title body url createdAt')

    return notice;
  }

  async createInquiry(user: JwtPayload, dto: createInquiryReqDTO) {
    await this.inquiryModel.create({
      userId: user.id,
      title: dto.title,
      body: dto.body,
    });

    return
  }

  async getMyPosts(user: JwtPayload): Promise<getMyPostsResDTO[]> {
    const posts = await this.boardModel.find({ userId: user.id, isDeleted: false })
    .select('_id category title body likeCount viewCount commentCount ImageUrls createdAt updatedAt')
    
    
    return posts;
  }

  async getRecentViewedRamenya(user: JwtPayload): Promise<getRecentViewedRamenyaResDTO[]> {

    const recentViewedRamenya = await this.viewHistoryModel.find({ user: new Types.ObjectId(user.id) })
    .select('_id user ramenya lastViewedAt createdAt updatedAt')
    .sort({ lastViewedAt: -1 })
    .limit(30)
    .populate({ path: 'ramenya', select: 'name genre rating reviewCount thumbnailUrl'})

    return recentViewedRamenya;
  }

  async getMyBookmarks(user: JwtPayload): Promise<getMyBookmarksResDTO[]> {
    const bookmarks = await this.bookmarkModel
      .find({ user: new Types.ObjectId(user.id) })
      .select('_id user ramenya createdAt')
      .sort({ createdAt: -1 })
      .populate({
        path: 'ramenya',
        select: 'name genre rating reviewCount thumbnailUrl latitude longitude address businessHours',
        match: { isDeleted: { $ne: true } },
      });

    // 삭제된 매장(populate 결과 null)은 목록에서 제외
    return bookmarks.filter((bookmark) => bookmark.ramenya != null);
  }

  async getMyComments(user: JwtPayload) {
    const comments = await this.commentModel
      .find({ userId: user.id, isDeleted: false })
      .select('_id boardId body depth likeCount parentCommentId createdAt updatedAt')
      .sort({ createdAt: -1 })
      // 본문(게시글) 제목/카테고리
      .populate({ path: 'boardId', model: this.boardModel, select: 'category title' })
      // 답글이면 부모(상위) 댓글 + 작성자 정보
      .populate({
        path: 'parentCommentId',
        model: this.commentModel,
        select: 'body userId',
        populate: { path: 'userId', model: this.userModel, select: 'nickname profileImageUrl' },
      });

    return comments;
  }
}
