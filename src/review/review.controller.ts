import {
  Body,
  Controller,
  Post,
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
}
