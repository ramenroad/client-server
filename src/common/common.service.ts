import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class CommonService {
  private readonly s3: AWS.S3;
  private readonly MAXIMUM_IMAGE_SIZE: number;
  private readonly ACCEPTABLE_MIME_TYPES: string[];
  public readonly S3_BUCKET_NAME: string;

  constructor() {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
    });
    this.s3 = new AWS.S3();
    this.MAXIMUM_IMAGE_SIZE = 5000000; // 이미지 용량 3MB 제한
    this.ACCEPTABLE_MIME_TYPES = ['image/jpg', 'image/png', 'image/jpeg']; // 이미지 확장자 제한
    this.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  }

  async uploadImageFileToS3(
    path: string,
    name: string,
    file: Express.Multer.File,
  ) {
    if (!this.ACCEPTABLE_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        '이미지 파일 확장자는 jpg, png, jpeg만 가능합니다.',
      );
    }
    if (file.size > this.MAXIMUM_IMAGE_SIZE) {
      throw new BadRequestException(
        '업로드 가능한 이미지 최대 용량은 5MB입니다.',
      );
    }

    try {
      await new AWS.S3()
        .putObject({
          Key: path + name,
          Body: file.buffer,
          Bucket: this.S3_BUCKET_NAME,
          ContentType: file.mimetype,
        })
        .promise();

      const url = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${path}${name}`;

      return url;
    } catch (error) {
      return new InternalServerErrorException('S3 업로드 실패');
    }
  }
}
