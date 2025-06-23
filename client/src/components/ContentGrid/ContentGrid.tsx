import React from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Button,
  Alert
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { Contents } from '../../types/content';
import { ContentCard } from '../ContentCard/ContentCard';

interface ContentGridProps {
  content: Contents[];
  loading: boolean;
  last: boolean;
  error: string | null;
  searchQuery?: string;
  selectedTags?: string[];
  onTagClick?: (tag: string) => void;
  onClearFilters?: () => void;
  showUsername?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  content,
  loading,
  last,
  error,
  searchQuery = '',
  selectedTags = [],
  onTagClick,
  onClearFilters,
  showUsername = true,
  emptyMessage,
  emptyDescription
}) => {
  const hasFilters = searchQuery || selectedTags.length > 0;
  const defaultEmptyMessage = hasFilters ? '검색 결과가 없습니다' : '등록된 콘텐츠가 없습니다';
  const defaultEmptyDescription = hasFilters ? '다른 검색어나 태그로 시도해보세요' : '첫 번째 콘텐츠를 등록해보세요!';

  return (
    <>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content Grid */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
        }}
      >
        {content.map((item) => (
          <ContentCard
            key={item.idx}
            content={item}
            onTagClick={onTagClick}
            showUsername={showUsername}
          />
        ))}
      </Box>

      {/* Empty State */}
      {!loading && content.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {emptyMessage || defaultEmptyMessage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {emptyDescription || defaultEmptyDescription}
            </Typography>
            {hasFilters && onClearFilters && (
              <Button
                variant="outlined"
                onClick={onClearFilters}
                sx={{ mt: 2 }}
                startIcon={<ClearIcon />}
              >
                필터 초기화
              </Button>
            )}
          </Paper>
        </Box>
      )}

      {/* 로딩 인디케이터 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* 마지막 페이지 메시지 */}
      {!loading && last && content.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="text.secondary">
              더 이상 콘텐츠가 없습니다.
            </Typography>
          </Paper>
        </Box>
      )}
    </>
  );
};
