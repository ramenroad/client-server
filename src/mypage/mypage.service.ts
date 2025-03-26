import {
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

@Injectable()
export class MypageService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<user>,
    private readonly commonService: CommonService,
  ) {}

  async updateNickname(user: JwtPayload, dto: updateNicknameReqDTO) {
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
}
