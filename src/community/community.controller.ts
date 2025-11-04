import { Body, Controller, Post, UploadedFiles, UseInterceptors, BadRequestException, Get, Query, Param, Delete, Patch } from '@nestjs/common';
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
import { updateBoardReqDTO } from './dto/req/updateBoard.req.dto';
import { createCommentReqDTO } from './dto/req/createComment.req.dto';
import { CommentNode } from './interfaces/commentNode.interface';
import { updateCommentReqDTO } from './dto/req/uodateComment.req.dto';
import { CommentNodeResDTO } from './dto/res/getComments.res.dto';

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
    status: 406,
    description: '삭제된 게시글입니다.',
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

  @ApiOperation({
    summary: '게시글 수정하기',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 수정 성공',
  })
  @ApiResponse({
    status: 403,
    description: '게시글 수정 권한 없음',
  })
  @ApiResponse({
    status: 404,
    description: '게시글 정보 조회 실패',
  })
  @ApiResponse({
    status: 406,
    description: '삭제된 게시글입니다.',
  })
  @ApiResponse({
    status: 500,
    description: '게시글 수정 실패',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('accessToken')
  @UseInterceptors(FilesInterceptor('Images'))
  @Patch('/board/:boardId')
  updateBoard(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
    @Body() dto: updateBoardReqDTO,
    @UploadedFiles() Images: Express.Multer.File[],
  ): Promise<void> {
    return this.communityService.updateBoard(user, boardId, dto, Images)
  }

  @ApiOperation({
    summary: '게시글 삭제하기',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 삭제 성공',
  })
  @ApiResponse({
    status: 403,
    description: '게시글 삭제 권한 없음',
  })
  @ApiResponse({
    status: 404,
    description: '게시글 정보 조회 실패',
  })
  @ApiResponse({
    status: 406,
    description: '삭제된 게시글입니다.',
  })
  @ApiResponse({
    status: 500,
    description: '게시글 삭제 실패',
  })
  @ApiBearerAuth('accessToken')
  @Delete('/board/:boardId')
  deleteBoard(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
  ): Promise<void> {
    return this.communityService.deleteBoard(user, boardId)
  }

  @ApiOperation({
    summary: '게시글 좋아요 추가하기',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 좋아요 추가 성공',
  })
  @ApiResponse({
    status: 400,
    description: '이미 좋아요를 누른 게시글입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '게시글 정보 조회 실패',
  })
  @ApiResponse({
    status: 500,
    description: '게시글 좋아요 추가 실패',
  })
  @ApiBearerAuth('accessToken')
  @Post('/board/:boardId/like')
  addBoardLike(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
  ): Promise<void> {
    return this.communityService.addBoardLike(user, boardId)
  }

  @ApiOperation({
    summary: '게시글 좋아요 취소하기',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 좋아요 취소 성공',
  })
  @ApiResponse({
    status: 404,
    description: '게시글 정보 조회 실패',
  })
  @ApiResponse({
    status: 500,
    description: '게시글 좋아요 취소 실패',
  })
  @ApiBearerAuth('accessToken')
  @Delete('/board/:boardId/like')
  deleteBoardLike(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
  ): Promise<void> {
    return this.communityService.deleteBoardLike(user, boardId)
  }

  @ApiOperation({
    summary: '댓글/답글 작성하기'
  })
  @ApiResponse({
    status: 200,
    description: '댓글/답글 작성 성공',
  })
  @ApiResponse({
    status: 404,
    description: '게시글 정보 조회 실패',
  })
  @ApiResponse({
    status: 406,
    description: '삭제된 게시글입니다.',
  })
  @ApiResponse({
    status: 500,
    description: '댓글/답글 작성 실패',
  })
  @ApiBearerAuth('accessToken')
  @Post('/board/:boardId/comment')
  createComment(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
    @Body() dto: createCommentReqDTO,
  ): Promise<void> {
    return this.communityService.createComment(user, boardId, dto)
  }

  @ApiOperation({
    summary: '댓글 불러오기'
  })
  @ApiResponse({
    status: 200,
    description: '댓글 불러오기 성공',
  })
  @ApiResponse({
    status: 404,
    description: '댓글 정보 조회 실패',
  })
  @ApiResponse({
    status: 500,
    description: '댓글 불러오기 실패',
  })
  @ApiBearerAuth('accessToken')
  @Get('/board/:boardId/comment')
  getComments(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
  ): Promise<CommentNodeResDTO[]> {
    return this.communityService.getComments(user, boardId)
  }

  @ApiOperation({
    summary: '댓글 삭제하기',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '댓글 정보 조회 실패',
  })
  @ApiResponse({
    status: 500,
    description: '댓글 삭제 실패',
  })
  @ApiBearerAuth('accessToken')
  @Delete('/board/:boardId/comment/:commentId')
  deleteComment(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
    @Param('commentId') commentId: string,
  ): Promise<void> {
    return this.communityService.deleteComment(user, boardId, commentId)
  }

  @ApiOperation({
    summary: '댓글 수정하기',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 수정 성공',
  })
  @ApiResponse({
    status: 404,
    description: '댓글 정보 조회 실패',
  })
  @ApiResponse({
    status: 500,
    description: '댓글 수정 실패',
  })
  @ApiBearerAuth('accessToken')
  @Patch('/board/:boardId/comment/:commentId')
  updateComment(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
    @Param('commentId') commentId: string,
    @Body() dto: updateCommentReqDTO,
  ): Promise<void> {
    return this.communityService.updateComment(user, boardId, commentId, dto)
  }

  @ApiOperation({
    summary: '댓글 좋아요',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 좋아요 성공',
  })
  @ApiResponse({
    status: 404,
    description: '댓글 정보 조회 실패',
  })
  @ApiResponse({
    status: 500,
    description: '댓글 좋아요 실패',
  })
  @ApiBearerAuth('accessToken')
  @Post('/board/:boardId/comment/:commentId/like')
  addCommentLike(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
    @Param('commentId') commentId: string,
  ): Promise<void> {
    return this.communityService.addCommentLike(user, boardId, commentId)
  }

  @ApiOperation({
    summary: '댓글 좋아요 취소하기',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 좋아요 취소 성공',
  })
  @ApiResponse({
    status: 404,
    description: '댓글 정보 조회 실패',
  })
  @ApiResponse({
    status: 500,
    description: '댓글 좋아요 취소 실패',
  })
  @ApiBearerAuth('accessToken')
  @Delete('/board/:boardId/comment/:commentId/like')
  deleteCommentLike(
    @User() user: JwtPayload,
    @Param('boardId') boardId: string,
    @Param('commentId') commentId: string,
  ): Promise<void> {
    return this.communityService.deleteCommentLike(user, boardId, commentId)
  }
}