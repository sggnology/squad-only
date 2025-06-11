import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { formatDateTime } from '../../utils/DateUtil';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Fab,
  CircularProgress,
  Avatar,
  Paper,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { selectAuth } from '../../store/authSlice';
import LocationMap from '../../components/LocationMap';
import { CommentSection } from '../../components/CommentSection/CommentSection';

export interface ContentResponseData {
  idx: number;
  fileIds: number[];
  title: string;
  tags: string[];
  location: string;
  description: string;
  createdAt: string;
  registeredUserId: string | null;
  registeredUsername: string | null;
  commentCount: number | null;
}

interface Content {
  idx: number;
  imageUrl: string;
  title: string;
  tags: string[];
  location: string;
  description: string;
  createdAt: string;
  registeredUserId: string | null;
  registeredUsername: string | null;
}

function Detail() {
  const { idx } = useParams<{ idx: string }>();

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false); // 중복 요청 방지 플래그

  // Redux 상태에서 로그인한 사용자 정보 가져오기
  const { user, isAuthenticated } = useAppSelector(selectAuth);
  const navigate = useNavigate();


  // 편집 권한 확인 함수
  const canEditContent = (): boolean => {
    if (!isAuthenticated || !user || !content) return false;

    // 관리자는 모든 컨텐츠 편집 가능
    if (user.roles.includes('ROLE_ADMIN')) return true;

    // 컨텐츠 소유자만 편집 가능
    return content.registeredUserId === user.userId;
  };

  // 편집 버튼 클릭 핸들러
  const handleEditClick = () => {
    navigate(`/edit/${content?.idx}`);
  };

  // Simulate fetching content by ID
  useEffect(() => {
    const fetchContent = async () => {
      if (fetchingRef.current) return; // 이미 요청 중이거나 마지막 페이지면 무시
      fetchingRef.current = true;
      setLoading(true);
      try {
        const res = await axiosInstance.get<ContentResponseData>(`/content/${idx}`);

        // Type assertion for Spring pageable response
        const responseData = res.data;
        const content: Content = {
          idx: responseData.idx,
          imageUrl: responseData.fileIds && responseData.fileIds.length > 0 ? `/api/v1/file/${responseData.fileIds[0]}` : 'https://placehold.co/400', // Fallback image URL
          title: responseData.title,
          tags: responseData.tags,
          location: responseData.location,
          description: responseData.description,
          createdAt: formatDateTime(responseData.createdAt),
          registeredUserId: responseData.registeredUserId,
          registeredUsername: responseData.registeredUsername || 'Unknown',
        };

        setContent(content);
      } catch (e) {
        // The global error handler will display the error.
        // You can still have specific error handling here if needed.
        console.error('Error fetching content in Home component:', e);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchContent(); // Fetch content when page changes (and not last)    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);
  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh' }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!loading && !content && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            콘텐츠를 찾을 수 없습니다.
          </Typography>
        </Paper>
      )}
      
      {!loading && content != null && (
        <Card sx={{ maxWidth: 700, mx: 'auto', mb: 8 }}>          {/* 이미지 섹션 - 크기 축소 */}
          <CardMedia
            component="img"
            height="400"
            image={content.imageUrl}
            alt={content.title}
            sx={{ objectFit: 'contain', py: 1, backgroundColor: '#f5f5f5' }}
          />
          
          <CardContent sx={{ p: 4 }}>
            {/* 제목 */}
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              {content.title}
            </Typography>

            {/* 태그 섹션 */}
            {content.tags.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  태그
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {content.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#bbdefb',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}            
            
            <Divider sx={{ my: 3 }} />

            {/* 상세 정보 섹션 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 등록자 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2, backgroundColor: '#1976d2' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    등록자
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {content.registeredUsername}
                  </Typography>
                </Box>
              </Box>

              {/* 등록일 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2, backgroundColor: '#4caf50' }}>
                  <CalendarIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    등록일
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {content.createdAt}
                  </Typography>
                </Box>
              </Box>

              {/* 위치 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2, backgroundColor: '#ff9800' }}>
                  <LocationIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    위치
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {content.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* 설명 섹션 */}
            {content.description && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    설명
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {content.description}
                  </Typography>
                </Box>
              </>
            )}            {/* 지도 섹션 */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                위치 지도
              </Typography>
              <LocationMap location={content.location} height={300} />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 댓글 섹션 - 컨텐츠가 로드된 경우에만 표시 */}
      {!loading && content && (
        <CommentSection contentIdx={content.idx} />
      )}

      {/* 플로팅 편집 버튼 - 편집 권한이 있을 때만 표시 */}
      {canEditContent() && (
        <Fab
          color="primary"
          aria-label="edit"
          onClick={handleEditClick}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <EditIcon />
        </Fab>
      )}
    </Container>
  );
}

export default Detail;