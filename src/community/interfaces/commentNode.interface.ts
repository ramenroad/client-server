import { Types } from "mongoose";

interface PopulatedUser {
    _id: Types.ObjectId;
    nickname: string;
    profileImageUrl: string;
  }
  
  // 최종 반환될 재귀적인 댓글 트리 노드(Node)의 타입
export interface CommentNode {
    // --- 'select' 쿼리로 선택된 필드들 ---
    _id: Types.ObjectId;
    userId: PopulatedUser; // populate된 유저 정보
    body: string;
    likeCount: number;
    likeUserIds: string[];
    parentCommentId: Types.ObjectId | null;
    depth: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;

  
    // --- 2. 트리를 만들기 위해 동적으로 추가할 필드 ---
    // (DB 스키마에는 존재하지 않음)
    replies: CommentNode[];
  }