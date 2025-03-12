import { Injectable } from '@nestjs/common';
import { updateNicknameReqDTO } from './dto/req/updateNickname.req.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { user } from 'schema/user.schema';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';

@Injectable()
export class MypageService {
  constructor(@InjectModel('user') private readonly userModel: Model<user>) {}

  async updateNickname(user: JwtPayload, dto: updateNicknameReqDTO) {
    await this.userModel.findByIdAndUpdate(user.id, {
      nickname: dto.nickname,
    });

    return;
  }
}
