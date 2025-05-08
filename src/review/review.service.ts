import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { review } from 'schema/review.schema';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { createReviewReqDTO } from './dto/req/createReview.req.dto';
import { CommonService } from 'src/common/common.service';
import { ramenya } from 'schema/ramenya.schema';
import { createReviewResDTO } from './dto/res/createReview.res.dto';
import { getRamenyaReviewsResDTO } from './dto/res/getRamenyaReviews.res.dto';
import { getRamenyaReviewImagesResDTO } from './dto/res/getRamenyaReviewImages.res.dto';

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
    const menusArray = dto.menus.split(',').map((item) => item.trim());

    try {
      transactionSession.startTransaction();
      const review = await this.reviewModel.create({
        userId: user.id,
        ramenyaId: dto.ramenyaId,
        rating: dto.rating,
        menus: menusArray,
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

  async deleteReview(user: JwtPayload, reviewId: string): Promise<void> {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('리뷰 정보 조회 실패');
    }

    if (String(review.userId) != user.id) {
      throw new ForbiddenException('리뷰 삭제 권한 없음');
    }

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();

      const ramenya = await this.ramenyaModel.findById(review.ramenyaId);

      let rating;

      if (ramenya.reviewCount == 1) {
        rating = 0;
      } else {
        rating =
          (ramenya.rating * ramenya.reviewCount - review.rating) /
          (ramenya.reviewCount - 1);
      }

      await this.reviewModel.findByIdAndDelete(reviewId);

      await this.ramenyaModel.findByIdAndUpdate(review.ramenyaId, {
        rating: rating,
        $pull: {
          reviews: reviewId,
        },
        $inc: {
          reviewCount: -1,
        },
      });

      await transactionSession.commitTransaction();
      return;
    } catch (error) {
      await transactionSession.abortTransaction();
      throw new InternalServerErrorException('리뷰 삭제 transaction 실패');
    } finally {
      await transactionSession.endSession();
    }
  }

  async getRamenyaReview(ramenyaId: string, page: number, limit: number) {
    const total = await this.reviewModel.countDocuments({ ramenyaId });
    const lastPage = Math.ceil(total / limit);

    if (lastPage < page) {
      throw new NotAcceptableException(
        `해당 limit의 최대 페이지 수는 ${total} 입니다.`,
      );
    }

    const reviews = await this.reviewModel
      .find({ ramenyaId })
      .select(
        '_id ramenyaId userId rating review reviewImageUrls createdAt updatedAt menus',
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'userId', select: 'nickname profileImageUrl' });

    const response = {
      lastPage: lastPage,
      reviews: reviews,
    };

    return response;
  }

  async getRamenyaReviewImages(
    ramenyaId: string,
  ): Promise<getRamenyaReviewImagesResDTO> {
    const ramenyas = await this.reviewModel
      .find({
        ramenyaId: ramenyaId,
      })
      .select('reviewImageUrls');

    const ramenyaReviewImagesUrls = [];

    for (let i = 0; i < ramenyas.length; i++) {
      if (ramenyas[i].reviewImageUrls.length == 0) {
        continue;
      }

      ramenyaReviewImagesUrls.push(...ramenyas[i].reviewImageUrls);
    }

    const response = {
      ramenyaReviewImagesUrls: ramenyaReviewImagesUrls,
    };

    return response;
  }
}
