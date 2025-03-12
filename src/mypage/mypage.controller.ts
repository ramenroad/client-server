import { Body, Controller, Patch } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { User } from 'src/common/decorators/user.decorator';
import { updateNicknameReqDTO } from './dto/req/updateNickname.req.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';

@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @ApiOperation({
    summary: '닉네임 변경',
  })
  @ApiResponse({
    status: 200,
    description: '닉네임 변경 성공',
  })
  @ApiBearerAuth('accessToken')
  @Patch('/nickname')
  updateNickname(@User() user: JwtPayload, @Body() dto: updateNicknameReqDTO) {
    return this.mypageService.updateNickname(user, dto);
  }
}
