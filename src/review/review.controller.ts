import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { createReviewReqDTO } from './dto/req/createReview.req.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { getRamenyaReviewsResDTO } from './dto/res/getRamenyaReviews.res.dto';
import { getRamenyaReviewImagesResDTO } from 'src/review/dto/res/getRamenyaReviewImages.res.dto';
import { updateReviewReqDTO } from './dto/req/updateReview.req.dto';
import { getUserReviewsResDTO } from './dto/res/getUserReviews.res.dto';
import { getReviewResDTO } from './dto/res/getReview.res.dto';
import { getMyReviewsResDTO } from './dto/res/getMyReviews.res.dto';
import { Express } from 'express';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({
    summary: '리뷰 작성하기',
  })
  @ApiResponse({
    status: 201,
    description: '리뷰 작성 성공',
  })
  @ApiResponse({
    status: 500,
    description: '리뷰 작성 실패 (상세 원인은 에러 메시지 참조)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('accessToken')
  @UseInterceptors(FilesInterceptor('reviewImages'))
  @Post()
  createReview(
    @User() user: JwtPayload,
    @Body() dto: createReviewReqDTO,
    @UploadedFiles() reviewImages: Express.Multer.File[],
  ): Promise<void> {
    return this.reviewService.createReview(user, dto, reviewImages);
  }

  @ApiOperation({
    summary: '내 리뷰 삭제하기',
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '해당 reviewId에 대한 리뷰를 찾을 수 없는 경우',
  })
  @ApiResponse({
    status: 403,
    description: '해당 리뷰의 작성자가 본인이 아닌 경우',
  })
  @ApiBearerAuth('accessToken')
  @Delete(':reviewId')
  deleteReview(
    @User() user: JwtPayload,
    @Param('reviewId') reviewId: string,
  ): Promise<void> {
    return this.reviewService.deleteReview(user, reviewId);
  }

  @Public()
  @ApiOperation({
    summary: '라멘야 리뷰 조회',
  })
  @ApiResponse({
    status: 200,
    description: '라멘야 리뷰 조회 성공',
    type: getRamenyaReviewsResDTO,
  })
  @ApiResponse({
    status: 406,
    description: '요청한 page가 최대 page 초과인 경우',
  })
  @Get('')
  getRamenyaReviews(
    @Query('ramenyaId') ramenyaId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<getRamenyaReviewsResDTO> {
    return this.reviewService.getRamenyaReview(ramenyaId, page, limit);
  }

  @Public()
  @ApiOperation({
    summary: '라멘야 리뷰 사진 정보 조회',
  })
  @ApiResponse({
    status: 200,
    description: '라멘야 사진 정보 조회 성공',
    type: getRamenyaReviewImagesResDTO,
  })
  @Get('/:ramenyaId/images')
  getRamenyaReviewImages(
    @Param('ramenyaId') ramenyaId: string,
  ): Promise<getRamenyaReviewImagesResDTO> {
    return this.reviewService.getRamenyaReviewImages(ramenyaId);
  }

  @ApiOperation({
    summary: '라멘야 리뷰 수정',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('accessToken')
  @UseInterceptors(FilesInterceptor('reviewImages'))
  @Patch(':reviewId')
  updateReview(
    @User() user: JwtPayload,
    @Param('reviewId') reviewId: string,
    @Body() dto: updateReviewReqDTO,
    @UploadedFiles() reviewImages: Express.Multer.File[],
  ) {
    return this.reviewService.updateReview(user, reviewId, dto, reviewImages);
  }

  @ApiOperation({
    summary: '내가 작성한 리뷰 불러오기',
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 불러오기 성공',
    type: getMyReviewsResDTO
  })
  @ApiBearerAuth('accessToken')
  @Get('/my/reviews')
  getMyReviews(@User() user: JwtPayload, @Query('page') page?: number, @Query('limit') limit?: number):Promise<getMyReviewsResDTO>  {
    return this.reviewService.getMyReviews(user, page, limit);
  }

  @Public()
  @ApiOperation({
    summary: '유저가 작성한 리뷰 불러오기',
  })
  @ApiResponse({
    status: 200,
    description: '리뷰 불러오기 성공',
    type: getUserReviewsResDTO
  })
  @ApiResponse({
    status: 404,
    description: '해당 userId에 대한 유저를 찾을 수 없는 경우',
  })
  @ApiResponse({
    status: 403,
    description: '해당 유저의 프로필이 비공개인 경우',
  })
  @Get('/:userId/reviews')
  getUserReviews(@Param('userId') userId: string, @Query('page') page?: number, @Query('limit') limit?: number):Promise<getUserReviewsResDTO>  {
    return this.reviewService.getUserReviews(userId, page, limit);
  }

  @ApiOperation({
    summary: '리뷰 상세 조회하기',
  })
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status: 200,
    description: '리뷰 상세 조회 성공',
    type: getReviewResDTO,
  })
  @ApiResponse({
    status: 404,
    description: '해당 reviewId에 대한 리뷰를 찾을 수 없는 경우',
  })
  @ApiResponse({
    status: 403,
    description: '해당 리뷰의 작성자가 본인이 아닌 경우',
  })
  @Get('/:reviewId')
  getReview(@User() user: JwtPayload, @Param('reviewId') reviewId: string) {
    return this.reviewService.getReview(user, reviewId);
  }
}
