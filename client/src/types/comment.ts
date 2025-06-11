// 댓글 응답 데이터 타입
export interface CommentResponseData {
  idx: number;
  contentIdx: number;
  comment: string;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// 클라이언트에서 사용하는 Comment 타입
export interface Comment {
  idx: number;
  contentIdx: number;
  comment: string;
  userId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// PageInfo는 content.ts에서 import해서 사용
import { PageInfo } from './content';

// 댓글 페이지 응답 타입
export interface PageComment {
  content: CommentResponseData[];
  page: PageInfo;
}

export interface CommentRegistrationRequest {
  comment: string;
}

export interface CommentUpdateRequest {
  comment: string;
}
