import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/authSlice';
import axiosInstance from '../../utils/axiosInstance';
import { 
  Content, 
  ContentResponseData, 
  PageContent, 
  ContentApiParams,
  convertToContent 
} from '../../types/content';
import { ContentGrid } from '../ContentGrid/ContentGrid';

export const MyContentList: React.FC = () => {
  const currentUser = useAppSelector(selectUser);
  
  const [content, setContent] = useState<Content[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const size = 16; // Items per page
  const fetchingContentRef = useRef(false); // 중복 요청 방지 플래그

  // 컴포넌트 마운트 시 스크롤 위치 초기화
  useEffect(() => {
    // 페이지 로드 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    
    // 브라우저의 자동 스크롤 복원 비활성화
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // 컨텐츠 조회
  const fetchContent = useCallback(async () => {
    if (fetchingContentRef.current || last || !currentUser?.userId) return;
    
    fetchingContentRef.current = true;
    setLoading(true);
    
    try {
      const params: ContentApiParams = {
        page,
        size,
        userId: currentUser.userId // 내가 등록한 컨텐츠만 조회
      };

      const res = await axiosInstance.get<PageContent>('/content', {
        params
      });
      
      const responseData = res.data.content;
      const responsePage = res.data.page;      
      const newContent: Content[] = responseData.map((item: ContentResponseData) => convertToContent(item));

      const isLast = responsePage.number === responsePage.totalPages - 1;
      setContent((prev) => [...prev, ...newContent]);
      setLast(isLast);
      
      setError(null);
    } catch (e) {
      console.error('Error fetching my content:', e);
      setError('내가 등록한 콘텐츠를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      fetchingContentRef.current = false;
    }
  }, [page, last, currentUser?.userId, size]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // 무한 스크롤 처리
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
      !loading &&
      !last
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, last]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 페이지네이션 초기화
  const resetPagination = useCallback(() => {
    setContent([]);
    setPage(0);
    setLast(false);
  }, []);

  // 사용자가 변경되면 컨텐츠 새로고침
  useEffect(() => {
    if (currentUser?.userId) {
      resetPagination();
    }
  }, [currentUser?.userId, resetPagination]);

  return (
    <ContentGrid
      content={content}
      loading={loading}
      last={last}
      error={error}
      showUsername={false} // 내가 등록한 컨텐츠이므로 등록자명 숨김
      emptyMessage="등록한 콘텐츠가 없습니다"
      emptyDescription="첫 번째 콘텐츠를 등록해보세요!"
    />
  );
};
