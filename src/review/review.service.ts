import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { review } from 'schema/review.schema';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { createReviewReqDTO } from './dto/req/createReview.req.dto';
import { CommonService } from 'src/common/common.service';
import { ramenya } from 'schema/ramenya.schema';
import { createReviewResDTO } from './dto/res/createReview.res.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('review')
    private readonly reviewModel: Model<review>,
    @InjectModel('ramenya') private readonly ramenyaModel: Model<ramenya>,
    private readonly commonService: CommonService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  //리뷰작성하기 API
  async createReview(
    user: JwtPayload,
    dto: createReviewReqDTO,
    reviewImages: Express.Multer.File[],
  ): Promise<void> {
    const ramenya = await this.ramenyaModel
      .findById(dto.ramenyaId)
      .select('rating reviewCount');

    if (!ramenya) {
      throw new InternalServerErrorException('라멘야 정보 조회 실패');
    }

    //이미지 s3에 업로드
    const reviewImagesUrls = [];

    for (const image of reviewImages) {
      const url = await this.commonService.uploadImageFileToS3(
        'images/reviews/',
        image.originalname,
        image,
      );
      reviewImagesUrls.push(url);
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();
      const review = await this.reviewModel.create({
        userId: user.id,
        ramenyaId: dto.ramenyaId,
        rating: dto.rating,
        review: dto.review,
        reviewImageUrls: reviewImagesUrls,
      });

      //라멘야 정보 업데이트
      const newRating =
        (ramenya.rating * ramenya.reviewCount + Number(dto.rating)) /
        (ramenya.reviewCount + 1);

      await this.ramenyaModel.findByIdAndUpdate(dto.ramenyaId, {
        $push: {
          reviews: review._id,
        },
        $inc: {
          reviewCount: 1,
        },
        rating: parseFloat(newRating.toFixed(3)),
      });

      await transactionSession.commitTransaction();
      return;
    } catch (error) {
      console.log(error);
      await transactionSession.abortTransaction();
      throw new InternalServerErrorException('리뷰 작성 실패(DB)');
    } finally {
      await transactionSession.endSession();
    }
  }

  //TODO - 라멘야 정보 조회 부분 변경하기
}
