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
  Paper,
  TextField,
  IconButton,
  Autocomplete,
  Button,
  Divider,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Person as PersonIcon, 
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
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
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
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
  }, []);  useEffect(() => {
    const fetchContent = async () => {
      if (fetchingRef.current || last) return; // 이미 요청 중이거나 마지막 페이지면 무시
      fetchingRef.current = true;
      setLoading(true);
      try {
        // Use axiosInstance and adjust the path if baseURL is set
        // If baseURL is '/api', then the path here should be '/v1/content'
        const res = await axiosInstance.get<PageContent>('/content', {
          params: { 
            page, 
            size,
            search: searchQuery || undefined,
            tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined
          }
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
        
        // Extract unique tags from content for autocomplete
        const allTags = newContent.flatMap(item => item.tags);
        setAvailableTags(prev => {
          const uniqueTags = [...new Set([...prev, ...allTags])];
          return uniqueTags.sort();
        });
        
        setError(null);
      } catch (e) {
        // The global error handler will display the error.
        // You can still have specific error handling here if needed.
        console.error('Error fetching content in Home component:', e);
        setError('콘텐츠를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchContent(); // Fetch content when page changes (and not last)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, selectedTags]); // Added searchQuery and selectedTags as dependencies
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

  // Search and filter handlers
  const handleSearch = () => {
    if (searchInput.trim() !== searchQuery) {
      setSearchQuery(searchInput.trim());
      resetPagination();
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    resetPagination();
  };

  const handleTagSelection = (newTags: string[]) => {
    setSelectedTags(newTags);
    resetPagination();
  };

  const handleTagRemove = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    resetPagination();
  };

  const resetPagination = () => {
    setContent([]);
    setPage(0);
    setLast(false);
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedTags([]);
    setTagInput('');
    resetPagination();
  };
    return (
    <Container maxWidth="xl" sx={{ py: 2, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Search and Filter Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon sx={{ mr: 1 }} />
          검색 및 필터
        </Typography>
        
        {/* Search Bar */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="제목이나 등록자명으로 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              endAdornment: (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {searchInput && (
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      sx={{ color: 'text.secondary' }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={handleSearch}
                    color="primary"
                    disabled={loading}
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              ),
            }}
          />
        </Box>

        {/* Tag Filter */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            multiple
            options={availableTags}
            value={selectedTags}
            onChange={(_, newValue) => handleTagSelection(newValue)}
            inputValue={tagInput}
            onInputChange={(_, newInputValue) => setTagInput(newInputValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                  onDelete={() => handleTagRemove(option)}
                  sx={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#bbdefb',
                    }
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="태그로 필터링..."
                label="태그 필터"
              />
            )}
            sx={{ mb: 1 }}
          />
        </Box>

        {/* Filter Status and Clear Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {searchQuery && (
              <Chip
                label={`검색: "${searchQuery}"`}
                onDelete={handleClearSearch}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {selectedTags.length > 0 && (
              <Chip
                label={`${selectedTags.length}개 태그 선택됨`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
          
          {(searchQuery || selectedTags.length > 0) && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearAllFilters}
              startIcon={<ClearIcon />}
            >
              모든 필터 제거
            </Button>
          )}
        </Box>
      </Paper>

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
          justifyContent: 'start',
        }}
      >        {content.map((item) => (
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
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#bbdefb',
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!selectedTags.includes(tag)) {
                        handleTagSelection([...selectedTags, tag]);
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

      {/* Empty State */}
      {!loading && content.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery || selectedTags.length > 0 
                ? '검색 결과가 없습니다' 
                : '등록된 콘텐츠가 없습니다'
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery || selectedTags.length > 0 
                ? '다른 검색어나 태그로 시도해보세요'
                : '첫 번째 콘텐츠를 등록해보세요!'
              }
            </Typography>
            {(searchQuery || selectedTags.length > 0) && (
              <Button
                variant="outlined"
                onClick={handleClearAllFilters}
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