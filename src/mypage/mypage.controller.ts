import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MypageService } from './mypage.service';
import { User } from 'src/common/decorators/user.decorator';
import { updateNicknameReqDTO } from './dto/req/updateNickname.req.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { getMyInfoResDTO } from './dto/res/getMyInfo.res.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @ApiOperation({
    summary: '내 정보 불러오기',
  })
  @ApiResponse({
    status: 200,
    description: '내 정보 불러오기 성공',
    type: getMyInfoResDTO,
  })
  @ApiResponse({
    status: 404,
    description: '토큰 ID에 대한 유저 정보가 없는 경우',
  })
  @ApiBearerAuth('accessToken')
  @Get()
  getMyInfo(@User() user: JwtPayload): Promise<getMyInfoResDTO> {
    return this.mypageService.getMyInfo(user);
  }

  @ApiOperation({
    summary: '프로필 사진 변경하기',
  })
  @ApiResponse({
    status: 200,
    description: '프로필 사진 변경 성공',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImageFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImageFile'))
  @Patch('/image')
  updateProfileImage(
    @User() user: JwtPayload,
    @UploadedFile() profileImageFile: Express.Multer.File,
  ): Promise<void> {
    return this.mypageService.updateProfileImage(user, profileImageFile);
  }
}
