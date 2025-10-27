import { Body, Controller, Post, UploadedFiles, UseInterceptors, BadRequestException, Get, Query, Param } from '@nestjs/common';
import { CommunityService } from './community.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { Express } from 'express';
import { createBoardReqDTO } from './dto/req/createBoard.req.dto';
import { getAllBoardsResDTO } from './dto/res/getAllBoards.res.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { getBoardDetailResDTO } from './dto/res/getBoardDetail.res.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) { }

  @ApiOperation({
    summary: '게시글 작성하기',
  })
  @ApiResponse({
    status: 201,
    description: '게시글 작성 성공',
  })
  @ApiResponse({
    status: 500,
    description: '게시글 작성 실패',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('accessToken')
  @UseInterceptors(FilesInterceptor('Images'))
  @Post('board')
  createBoard(
    @User() user: JwtPayload,
    @Body() dto: createBoardReqDTO,
    @UploadedFiles() Images: Express.Multer.File[],
  ): Promise<void> {
    // 이미지 개수 제한 (최대 10장)
    if (Images && Images.length > 10) {
      throw new BadRequestException('이미지는 최대 10장까지만 업로드할 수 있습니다.');
    }

    return this.communityService.createBoard(user, dto, Images);
  }

  @ApiOperation({
    summary: '게시글 전체 불러오기',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 불러오기 성공',
    type: getAllBoardsResDTO
  })
  @ApiResponse({
    status: 500,
    description: '게시글 불러오기 실패',
  })
  @Public()
  @Get('/boards')
  getAllBoards(
    @Query('page') page?: number,
    @Query('limit') limit?: number,): Promise<getAllBoardsResDTO> {
    return this.communityService.getAllBoards(page, limit)
  }

  @ApiOperation({
    summary: '특정 게시글 불러오기'
  })
  @ApiResponse({
    status: 200,
    description: '게시글 불러오기 성공',
    type: getBoardDetailResDTO,
  })
  @ApiResponse({
    status: 500,
    description: '게시글 불러오기 실패',
  })
  @Public()
  @Get('/board/:boardId')
  getBoardDetail(
    @Param('boardId') boardId: string): Promise<getBoardDetailResDTO> {
    return this.communityService.getBoardDetail(boardId)
  }
}
