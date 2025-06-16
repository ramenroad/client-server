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
import { updateReviewReqDTO } from './dto/req/updateReview.req.dto';
import { getMyReviewsResDTO } from './dto/res/getMyReviews.res.dto';
import { getReviewResDTO } from './dto/res/getReview.res.dto';
import { user } from 'schema/user.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('review')
    private readonly reviewModel: Model<review>,
    @InjectModel('ramenya') private readonly ramenyaModel: Model<ramenya>,
    @InjectModel('user') private readonly userModel: Model<user>,
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
        rating: parseFloat(newRating.toFixed(10)),
      });

      const userByUserId = await this.userModel.findById(user.id);

      if (!userByUserId) {
        throw new InternalServerErrorException('유저 정보 조회 실패');
      }

      const userNewAvgRating =
        (userByUserId.avgReviewRating * userByUserId.reviewCount + Number(dto.rating)) /
        (userByUserId.reviewCount + 1);

      //유저 정보 업데이트
      await this.userModel.findByIdAndUpdate(user.id, {
        $inc: {
          reviewCount: 1,
        },
        avgReviewRating: parseFloat(userNewAvgRating.toFixed(10)),
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


      //유저 정보 업데이트
      const userByUserId = await this.userModel.findById(review.userId);

      if (!userByUserId) {
        throw new InternalServerErrorException('유저 정보 조회 실패');
      }
      
      const userNewAvgRating =
        (userByUserId.avgReviewRating * userByUserId.reviewCount - review.rating) /
        (userByUserId.reviewCount - 1);

      await this.userModel.findByIdAndUpdate(review.userId, {
        $inc: {
          reviewCount: -1,
        },
        avgReviewRating: parseFloat(userNewAvgRating.toFixed(10)),
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
      .populate({ path: 'userId', select: 'nickname profileImageUrl avgReviewRating reviewCount' });

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

  async updateReview(
    user: JwtPayload,
    reviewId: string,
    dto: updateReviewReqDTO,
    reviewImages: Express.Multer.File[],
  ) {
    const prevReview = await this.reviewModel.findById(reviewId);
    const ramenya = await this.ramenyaModel.findById(prevReview.ramenyaId);

    if (!review) {
      throw new NotFoundException('리뷰 정보 조회 실패');
    }

    if (String(prevReview.userId) != user.id) {
      throw new ForbiddenException('리뷰 수정 권한 없음');
    }

    //이미지 s3에 업로드
    const reviewImagesUrls = dto.reviewImageUrls;

    for (const image of reviewImages) {
      const url = await this.commonService.uploadImageFileToS3(
        'images/reviews/',
        image.originalname,
        image,
      );

      if (url instanceof Error) {
        throw new InternalServerErrorException('S3 이미지 업로드 실패');
      }

      reviewImagesUrls.push(url);
    }

    const transactionSession = await this.connection.startSession();
    const menusArray = dto.menus.split(',').map((item) => item.trim());

    try {
      transactionSession.startTransaction();
      const updatedReview = await this.reviewModel.findByIdAndUpdate(reviewId, {
        rating: dto.rating,
        menus: menusArray,
        review: dto.review,
        reviewImageUrls: reviewImagesUrls,
      });

      //라멘야 정보 업데이트
      const prevRating =
        (ramenya.rating * ramenya.reviewCount - Number(prevReview.rating)) /
        (ramenya.reviewCount - 1);

      const newRating =
        (ramenya.rating * ramenya.reviewCount + Number(dto.rating)) /
        (ramenya.reviewCount + 1);

      await this.ramenyaModel.findByIdAndUpdate(ramenya._id, {
        rating: parseFloat(newRating.toFixed(3)),
      });

      //유저 정보 업데이트
      //기존 리뷰 별점과 수정한 리뷰의 별점이 다른 경우에만 업데이트
      if (prevReview.rating != dto.rating) {
        
        const userByUserId = await this.userModel.findById(prevReview.userId);

        if (!userByUserId) {
          throw new InternalServerErrorException('유저 정보 조회 실패');
        }

        const userNewAvgRating = 
          (userByUserId.avgReviewRating * userByUserId.reviewCount - Number(prevReview.rating) + Number(dto.rating)) /
          (userByUserId.reviewCount);

        await this.userModel.findByIdAndUpdate(prevReview.userId, {
          avgReviewRating: parseFloat(userNewAvgRating.toFixed(10)),
        });
      }
    

      //s3에서 기존 사진들 삭제
      //보안 상 삭제 로직 주석처리 (불필요한 사진 업로드 등 문제 발생 시 저장되었던 이미지 확인해야함)
      /* if (prevReview.reviewImageUrls.length > 0) {
        const s3Keys = prevReview.reviewImageUrls.map(url => {
          const urlObj = new URL(url);
          return urlObj.pathname.substring(1); // 앞의 '/' 제거
        });

        await this.commonService.deleteObjectsFromS3(s3Keys);
      } */

      await transactionSession.commitTransaction();
      return;
    } catch (error) {
      console.log(error);
      await transactionSession.abortTransaction();
      throw new InternalServerErrorException('리뷰 수정 트랜잭션 실패');
    } finally {
      await transactionSession.endSession();
    }
  }

  async getUserReviews(userId: string, page: number, limit: number): Promise<getMyReviewsResDTO> {

    const total = await this.reviewModel.countDocuments({ userId });
    const lastPage = Math.ceil(total / limit);
    const user = await this.userModel.findById(userId).select('isPublic reviewCount');

    if (!user) {
      throw new NotFoundException('유저 정보 조회 실패');
    }

    if (user.isPublic == false) {
      throw new ForbiddenException('유저 프로필 미공개');
    }

    const reviews = await this.reviewModel
      .find({ userId: user.id })
      .select(
        '_id ramenyaId rating review reviewImageUrls createdAt updatedAt menus',
      )
      .populate({ path: 'ramenyaId', select: 'name' })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const response = {
      reviewCount: user.reviewCount,
      lastPage: lastPage,
      reviews: reviews,
    };

    return response;
  }

  async getReview(
    user: JwtPayload,
    reviewId: string,
  ): Promise<getReviewResDTO> {
    const review = await this.reviewModel
      .findById(reviewId)
      .select(
        '_id ramenyaId userId rating review reviewImageUrls createdAt updatedAt menus',
      )
      .populate({ path: 'ramenyaId', select: 'name' });

    if (!review) {
      throw new NotFoundException('리뷰 정보 조회 실패');
    }

    if (String(review.userId) != user.id) {
      throw new ForbiddenException('리뷰 조회 권한 없음');
    }

    return review;
  }
}
