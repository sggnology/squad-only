// Content 관련 타입 정의
import { formatDateTime } from '../utils/DateUtil';

// API 응답 데이터 타입
export interface ContentResponseData {
  idx: number;
  fileIds: number[];
  title: string;
  tags: string[];
  registeredUsername: string | null;
  location: string;
  createdAt: string;
  commentCount?: number; // 댓글 수 추가
}

// 클라이언트에서 사용하는 Content 타입
export interface Content {
  idx: number;
  imageUrl: string;
  title: string;
  tags: string[];
  registeredUsername: string | null;
  location: string;
  createdAt: string;
  commentCount?: number; // 댓글 수 추가
}

// 페이지네이션 타입
export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// API 응답 타입 (페이지네이션 포함)
export interface PageContent {
  content: ContentResponseData[];
  page: PageInfo;
}

// 태그 응답 데이터 타입
export interface TagResponseData {
  name: string;
}

// 태그 페이지 응답 타입
export interface TagPageContent {
  content: TagResponseData[];
  page: PageInfo;
}

// Content API 요청 파라미터 타입
export interface ContentApiParams {
  page: number;
  size: number;
  search?: string;
  tags?: string;
  userId?: string; // 마이페이지에서 사용할 userId 파라미터
}

// Content 변환 유틸리티 함수
export const convertToContent = (item: ContentResponseData): Content => ({
  idx: item.idx,
  imageUrl: item.fileIds && item.fileIds.length > 0 
    ? `/api/v1/file/${item.fileIds[0]}` 
    : 'https://placehold.co/400',
  title: item.title,
  tags: item.tags,
  registeredUsername: item.registeredUsername || 'Unknown',
  location: item.location,
  createdAt: formatDateTime(item.createdAt), // formatDateTime 적용
  commentCount: item.commentCount || 0, // commentCount 추가
});
