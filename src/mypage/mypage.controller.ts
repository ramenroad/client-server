import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
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
import { updateIsPublicReqDTO } from './dto/req/updateIsPublic.req.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { getUserInfoResDTO } from './dto/res/getUserInfo.res.dto';
import { Express } from 'express';

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
  @ApiResponse({
    status: 409,
    description: '닉네임이 중복인 경우',
  })
  @ApiBearerAuth('accessToken')
  @Patch('/nickname')
  updateNickname(@User() user: JwtPayload, @Body() dto: updateNicknameReqDTO) {
    return this.mypageService.updateNickname(user, dto);
  }

  @ApiOperation({
    summary: '닉네임 중복 체크',
  })
  @ApiResponse({
    status: 200,
    description: '닉네임 중복 체크 성공',
    type: Boolean,
  })
  @ApiBearerAuth('accessToken')
  @Get('/nickname/check')
  checkNickname(@Query('nickname') nickname: string): Promise<boolean> {
    return this.mypageService.checkNickname(nickname);
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

  @ApiOperation({
    summary: '프로필 공개 여부 변경하기',
  })
  @ApiResponse({
    status: 200,
    description: '프로필 공개 여부 변경 성공',
  })
  @ApiBearerAuth('accessToken')
  @Patch('/isPublic')
  updateIsPublic(
    @User() user: JwtPayload,
    @Body() dto: updateIsPublicReqDTO,
  ): Promise<void> {
    return this.mypageService.updateIsPublic(user, dto);
  }

  @Public()
  @ApiOperation({
    summary: '유저 프로필 정보 불러오기',
  })
  @ApiResponse({
    status: 200,
    description: '유저 프로필 정보 불러오기 성공',
    type: getUserInfoResDTO,
  })
  @ApiResponse({
    status: 404,
    description: '해당 userId에 대한 유저를 찾을 수 없는 경우',
  })
  @Get('/user/:userId')
  getUserInfo(@Param('userId') userId: string): Promise<getUserInfoResDTO> {
    return this.mypageService.getUserInfo(userId);
  }
}
