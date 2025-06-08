import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Pagination,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Login as LoginIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Event as EventIcon
} from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import { ActivityLogResponse, ActivityLogItem, ACTIVITY_LOG_LABELS, ACTIVITY_LOG_COLORS, ACTIVITY_LOG_TYPE } from '../../types/activityLog';

const ACTIVITY_ICONS: Record<ACTIVITY_LOG_TYPE, React.ReactElement> = {
  LOGIN: <LoginIcon />,
  CONTENT_CREATE: <AddIcon />,
  CONTENT_UPDATE: <EditIcon />,
  CONTENT_DELETE: <DeleteIcon />,
  PROFILE_UPDATE: <PersonIcon />
};

interface ActivityLogComponentProps {
  userId?: string;
  showUserId?: boolean; // 사용자 ID 표시 여부 (관리자 페이지용)
  pageSize?: number; // 페이지 크기
}

function ActivityLogComponent({ userId, showUserId = false, pageSize = 15 }: ActivityLogComponentProps) {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchActivityLogs(1);
  }, [userId]);

  const fetchActivityLogs = async (page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: page - 1, // 백엔드는 0-based pagination
        size: pageSize
      };
      
      // userId가 제공된 경우에만 필터링
      if (userId) {
        params.userId = userId;
      }
      
      const response = await axiosInstance.get<ActivityLogResponse>('/activity-log', {
        params
      });
      
      setLogs(response.data.content);
      setCurrentPage(page);
      setTotalPages(response.data.page.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || '활동 로그를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    fetchActivityLogs(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading && logs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (logs.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          활동 기록이 없습니다
        </Typography>
        <Typography variant="body2" color="text.disabled">
          로그인, 콘텐츠 등록/수정/삭제, 프로필 수정 등의 활동이 여기에 표시됩니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <List>        
        {logs.map((log) => (
          <ListItem key={log.idx} divider>
            <ListItemIcon>
              {ACTIVITY_ICONS[log.type as ACTIVITY_LOG_TYPE] || <EventIcon />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
                  <Chip
                    label={ACTIVITY_LOG_LABELS[log.type as ACTIVITY_LOG_TYPE] || log.type}
                    size="small"
                    color={ACTIVITY_LOG_COLORS[log.type as ACTIVITY_LOG_TYPE] || 'default'}
                  />
                  {showUserId && (
                    <Chip
                      label={`${log.username} (${log.userId})`}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(log.createdAt)}
                  </Typography>
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.primary">
                    {log.description}
                  </Typography>
                  {log.targetId && (
                    <Typography variant="caption" color="text.secondary">
                      대상 ID: {log.targetId}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block">
                    IP: {log.ip}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  );
}

export default ActivityLogComponent;
