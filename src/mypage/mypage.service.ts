import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { updateNicknameReqDTO } from './dto/req/updateNickname.req.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from 'schema/user.schema';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { getMyInfoResDTO } from './dto/res/getMyInfo.res.dto';
import { CommonService } from 'src/common/common.service';
import { updateIsPublicReqDTO } from './dto/req/updateIsPublic.req.dto';
import { review } from 'schema/review.schema';
import { getUserInfoResDTO } from './dto/res/getUserInfo.res.dto';

@Injectable()
export class MypageService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<user>,
    @InjectModel('review') private readonly reviewModel: Model<review>,
    private readonly commonService: CommonService,
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
      throw new InternalServerErrorException('프로필 사진 변경 실패');
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
}
