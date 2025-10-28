import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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
import { updateBoardReqDTO } from './dto/req/updateBoard.req.dto';
import { createCommentReqDTO } from './dto/req/createComment.req.dto';
import { CommentNode } from './interfaces/commentNode.interface';
import { user } from 'schema/user.schema';

@Injectable()
export class CommunityService {
    constructor(
        @InjectModel('board')
        private readonly boardModel: Model<Board>,
        private readonly commonService: CommonService,
        @InjectModel('comment')
        private readonly commentModel: Model<Comment>,
        @InjectModel('user')
        private readonly userModel: Model<user>,
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

        const boards = await this.boardModel.find({ isDeleted: false })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select('_id category title body likeCount viewCount commentCount ImageUrls createdAt updatedAt')
            .populate({ path: 'userId', select: 'nickname profileImageUrl' })

        return {
            lastPage: lastPage,
            boards: boards,
        };
    }

    async getBoardDetail(boardId: string): Promise<getBoardDetailResDTO> {

        const board = await this.boardModel.findById(boardId)
            .where({ isDeleted: false })
            .select('_id category title body likeCount likeUserIds viewCount commentCount ImageUrls createdAt updatedAt isDeleted deletedAt')
            .populate({ path: 'userId', select: 'nickname profileImageUrl' })

        if (!board) {
            throw new NotFoundException();
        }

        await this.boardModel.findByIdAndUpdate(boardId, { $inc: { viewCount: 1 } });

        return board
    }

    async updateBoard(user: JwtPayload, boardId: string, dto: updateBoardReqDTO, Images: Express.Multer.File[]): Promise<void> {
        const board = await this.boardModel.findById(boardId);

        if (!board) {
            throw new NotFoundException();
        }

        if (board.isDeleted) {
            throw new NotAcceptableException('삭제된 게시글입니다.');
        }

        if (String(board.userId) != user.id) {
            throw new ForbiddenException('게시글 수정 권한 없음');
        }

        const ImagesUrls = dto.ImageUrls;

        for (const image of Images) {
            const url = await this.commonService.uploadImageFileToS3(
                'images/board/',
                image.originalname,
                image,
            );

            if (url instanceof Error) {
                throw new Error('게시글 업데이트 중 S3 이미지 업로드 실패');
            }

            ImagesUrls.push(url);
        }

        await this.boardModel.findByIdAndUpdate(boardId, {
            category: dto.category,
            title: dto.title,
            body: dto.body,
            ImageUrls: ImagesUrls,
        });

        return
    }

    async deleteBoard(user: JwtPayload, boardId: string): Promise<void> {
        const board = await this.boardModel.findById(boardId);

        if (!board) {
            throw new NotFoundException();
        }

        if (board.isDeleted) {
            throw new NotAcceptableException('삭제된 게시글입니다.');
        }

        if (String(board.userId) != user.id) {
            throw new ForbiddenException('게시글 삭제 권한 없음');
        }

        await this.boardModel.findByIdAndUpdate(boardId, { isDeleted: true, deletedAt: new Date() });

        return
    }

    async addBoardLike(user: JwtPayload, boardId: string): Promise<void> {
        const board = await this.boardModel.findById(boardId);

        if (!board) {
            throw new NotFoundException();
        }

        if (board.isDeleted) {
            throw new NotAcceptableException('삭제된 게시글입니다.');
        }

        if (board.likeUserIds.includes(user.id)) {
            throw new BadRequestException('이미 좋아요를 누른 게시글입니다.');
        }

        await this.boardModel.findByIdAndUpdate(boardId, { $inc: { likeCount: 1 }, $push: { likeUserIds: user.id } });

        return
    }

    async deleteBoardLike(user: JwtPayload, boardId: string): Promise<void> {
        const board = await this.boardModel.findById(boardId);

        if (!board) {
            throw new NotFoundException();
        }

        if (board.isDeleted) {
            throw new NotAcceptableException('삭제된 게시글입니다.');
        }

        if (!board.likeUserIds.includes(user.id)) {
            throw new BadRequestException('좋아요를 누른 게시글이 아닙니다.');
        }

        await this.boardModel.findByIdAndUpdate(boardId, { $inc: { likeCount: -1 }, $pull: { likeUserIds: user.id } });

        return
    }

    async createComment(user: JwtPayload, boardId: string, dto: createCommentReqDTO): Promise<void> {

        const board = await this.boardModel.findById(boardId);

        if (!board || board.isDeleted) {
            throw new NotAcceptableException('게시글을 찾을 수 없거나 삭제되었습니다.');
        }

        // 2. 저장할 댓글 데이터 기본 구조
        const newCommentData: any = {
            boardId: boardId,
            userId: user.id,
            body: dto.body,
            parentCommentId: null,
            depth: 0,
            isDeleted: false,
        };


        if (dto.parentCommentId) {

            const parentComment = await this.commentModel.findById(dto.parentCommentId);

            if (!parentComment || parentComment.isDeleted) {
                throw new NotAcceptableException('부모 댓글을 찾을 수 없거나 삭제되었습니다.');
            }


            newCommentData.parentCommentId = dto.parentCommentId;
            newCommentData.depth = parentComment.depth + 1;
        }

        await this.commentModel.create(newCommentData);

        await this.boardModel.findByIdAndUpdate(boardId, { $inc: { commentCount: 1 } });
    }

    async getComments(user: JwtPayload, boardId: string) {

        const allCommentsData = await this.commentModel.find({ boardId: boardId })
            .where({ isDeleted: false })
            .select('_id userId body likeCount likeUserIds parentCommentId depth createdAt updatedAt isDeleted deletedAt')
            .populate({ path: 'userId', select: '_id nickname profileImageUrl' })
            .sort({ createdAt: 'asc' })
            .lean(); 

        
        const allComments = allCommentsData as unknown as CommentNode[];

        
        const commentMap = new Map<string, CommentNode>();
        const commentTree: CommentNode[] = []; // 1차 댓글만 담을 배열

        
        allComments.forEach(comment => {
            comment.replies = [];
            commentMap.set(comment._id.toString(), comment);
        });

        // 5. 2차 순회: 부모-자식 관계 연결 (트리 조립)
        allComments.forEach(comment => {
            if (comment.parentCommentId) {
                const parent = commentMap.get(comment.parentCommentId.toString());

                if (parent) {
                    parent.replies.push(comment);
                }
                // (부모가 삭제되었거나 없는 경우는 무시됨)

            } else {
                
                commentTree.push(comment);
            }
        });

        // 1차 댓글 목록만 '최신순(desc)'으로 다시 정렬
        const sortedCommentTree = commentTree.sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );

        return sortedCommentTree;
    }
}
