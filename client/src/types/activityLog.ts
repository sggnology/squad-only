export interface ActivityLogItem {
  idx: number;
  userId: string;
  username: string;
  type: string;
  description: string;
  targetId: string | null;
  ip: string;
  createdAt: string;
}

export interface ActivityLogPage {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface ActivityLogResponse {
  content: ActivityLogItem[];
  page: ActivityLogPage;
}

export type ACTIVITY_LOG_TYPE = 'LOGIN' | 'CONTENT_CREATE' | 'CONTENT_UPDATE' | 'CONTENT_DELETE' | 'PROFILE_UPDATE' | 'COMMENT_CREATE' | 'COMMENT_UPDATE' | 'COMMENT_DELETE';

export const ACTIVITY_LOG_LABELS: Record<ACTIVITY_LOG_TYPE, string> = {
  LOGIN: '로그인',
  CONTENT_CREATE: '콘텐츠 등록',
  CONTENT_UPDATE: '콘텐츠 수정',
  CONTENT_DELETE: '콘텐츠 삭제',
  PROFILE_UPDATE: '프로필 수정',
  COMMENT_CREATE: '댓글 작성',
  COMMENT_UPDATE: '댓글 수정',
  COMMENT_DELETE: '댓글 삭제'
};

export const ACTIVITY_LOG_COLORS: Record<ACTIVITY_LOG_TYPE, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  LOGIN: 'info',
  CONTENT_CREATE: 'success',
  CONTENT_UPDATE: 'primary',
  CONTENT_DELETE: 'error',
  PROFILE_UPDATE: 'warning',
  COMMENT_CREATE: 'success',
  COMMENT_UPDATE: 'primary',
  COMMENT_DELETE: 'error'
};
