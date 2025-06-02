import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
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
  Paper
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, LocationOn as LocationIcon } from '@mui/icons-material';
// Import the new axiosInstance
import axiosInstance from '../../utils/axiosInstance';
import { formatDateTime } from '../../utils/DateUtil';

interface ContentResponseData {
  idx: number;
  fileIds: number[];
  title: string;
  tags: string[];
  registeredUsername: string | null;
  location: string;
  createdAt: string;
}

interface Content {
  idx: number;
  imageUrl: string;
  title: string;
  tags: string[];
  registeredUsername: string | null;
  location: string;
  createdAt: string;
}

interface Page {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface PageContent {
  content: ContentResponseData[];
  page: Page;
}

function Home() {
  const [content, setContent] = useState<Content[]>([]);
  const [page, setPage] = useState(0); // Spring pageable starts at 0
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(false); // Track if last page
  const navigate = useNavigate();
  const size = 16; // Items per page
  const fetchingRef = useRef(false); // 중복 요청 방지 플래그

  // 컴포넌트 마운트 시 스크롤 위치 초기화
  useEffect(() => {
    // 페이지 로드 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    
    // 브라우저의 자동 스크롤 복원 비활성화
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (fetchingRef.current || last) return; // 이미 요청 중이거나 마지막 페이지면 무시
      fetchingRef.current = true;
      setLoading(true);
      try {
        // Use axiosInstance and adjust the path if baseURL is set
        // If baseURL is '/api', then the path here should be '/v1/content'
        const res = await axiosInstance.get<PageContent>('/content', {
          params: { page, size },
        });
        // Type assertion for Spring pageable response
        const responseData = res.data.content;
        const responsePage = res.data.page;

        const newContent: Content[] = responseData.map((item: ContentResponseData) => ({
          idx: item.idx,
          imageUrl: item.fileIds && item.fileIds.length > 0 ? `/api/v1/file/${item.fileIds[0]}` : 'https://placehold.co/400', // Fallback image URL
          title: item.title,
          tags: item.tags,
          registeredUsername: item.registeredUsername || 'Unknown',
          location: item.location,
          createdAt: formatDateTime(item.createdAt),
        }));

        const isLast = responsePage.number === responsePage.totalPages - 1;

        setContent((prev) => [...prev, ...newContent]);
        setLast(isLast);
      } catch (e) {
        // The global error handler will display the error.
        // You can still have specific error handling here if needed.
        console.error('Error fetching content in Home component:', e);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchContent(); // Fetch content when page changes (and not last)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Removed 'last' from dependencies to allow initial fetch even if last is true from a previous state

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
      !loading &&
      !last
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, last]); // Re-add event listener if loading or last state changes

  const handleFloatingButtonClick = () => {
    navigate('/register');
  }; 
  
  return (
    <Container maxWidth="xl" sx={{ py: 2, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'start',
        }}
      >
        {content.map((item) => (
          <Card
            key={item.idx}
            sx={{
              width: { xs: '100%', sm: '300px', md: '320px' },
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
            onClick={() => navigate(`/detail/${item.idx}`)}
          >
            <CardMedia
              component="img"
              image={item.imageUrl}
              alt={item.title}
              sx={{
                objectFit: 'cover',
                width: '100%',
                minHeight: '300px',
                maxHeight: '300px'
              }}
            />
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
              <Typography gutterBottom variant="h6" component="h2"
                sx={{
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                {item.title}
              </Typography>

              {/* 태그 표시 */}
              <Box sx={{ mb: 2 }}>
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      mr: 0.5,
                      mb: 0.5,
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#bbdefb',
                      }
                    }}
                  />
                ))}
                {item.tags.length > 3 && (
                  <Chip
                    label={`+${item.tags.length - 3}`}
                    size="small"
                    sx={{
                      mr: 0.5,
                      mb: 0.5,
                      backgroundColor: '#f5f5f5',
                      color: '#666'
                    }}
                  />
                )}
              </Box>

              {/* 위치 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {item.location}
                </Typography>
              </Box>

              {/* 등록자 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 20, height: 20, mr: 1, backgroundColor: '#1976d2' }}>
                  <PersonIcon sx={{ fontSize: 12 }} />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {item.registeredUsername}
                </Typography>
              </Box>

              {/* 등록일 */}
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {item.createdAt}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 로딩 인디케이터 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* 마지막 페이지 메시지 */}
      {!loading && last && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="text.secondary">
              더 이상 콘텐츠가 없습니다.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* 플로팅 액션 버튼 */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={handleFloatingButtonClick}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default Home;