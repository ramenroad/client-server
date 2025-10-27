import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Board } from 'schema/board.schema';
import { JwtPayload } from 'src/common/types/jwtpayloadtype';
import { createBoardReqDTO } from './dto/req/createBoard.req.dto';
import { Express } from 'express';
import { CommonService } from 'src/common/common.service';
import { getAllBoardsResDTO } from './dto/res/getAllBoards.res.dto';
import { Comment } from 'schema/comment.schema';
import { getBoardDetailResDTO } from './dto/res/getBoardDetail.res.dto';

@Injectable()
export class CommunityService {
    constructor(
        @InjectModel('board')
        private readonly boardModel: Model<Board>,
        private readonly commonService: CommonService,
        @InjectModel('comment')
        private readonly commentModel: Model<Comment>,
        @InjectConnection() private readonly connection: mongoose.Connection
    ) { }

    async createBoard(user: JwtPayload, dto: createBoardReqDTO, Images: Express.Multer.File[]): Promise<void> {

        //이미지 s3에 업로드
        const ImageUrls = [];

        for (const image of Images) {
            const url = await this.commonService.uploadImageFileToS3(
                'images/board/',
                image.originalname,
                image,
            );
            ImageUrls.push(url);
        }

        const board = await this.boardModel.create({
            userId: user.id,
            category: dto.category,
            title: dto.title,
            body: dto.body,
            ImageUrls: ImageUrls
        });

        return
    }

    async getAllBoards(page?: number, limit?: number): Promise<getAllBoardsResDTO> {
        
        const total = await this.boardModel.countDocuments();
        const lastPage = Math.ceil(total / limit);

        const boards = await this.boardModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select('_id category title body likeCount viewCount commentCount ImageUrls createdAt updatedAt')
        .populate({ path: 'userId', select: 'nickname profileImageUrl'})

        console.log(boards)

        return {
            lastPage: lastPage,
            boards: boards,
        };
    }

    async getBoardDetail(boardId: string): Promise<getBoardDetailResDTO>{

        const board = await this.boardModel.findById(boardId)
        .select('_id category title body likeCount viewCount commentCount ImageUrls createdAt updatedAt')
        .populate({ path: 'userId', select: 'nickname profileImageUrl'})

        if (!board) {
            throw new NotFoundException();
        }

        return board
    }
}
