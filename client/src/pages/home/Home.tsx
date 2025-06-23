import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Container,
  Typography,
  Chip,
  Box,
  Fab,
  CircularProgress,
  Paper,
  TextField,
  IconButton,
  Autocomplete,
  Button
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
// Import the new axiosInstance
import axiosInstance from '../../utils/axiosInstance';
import { 
  ContentsResponseData, 
  Contents,
  PageContent, 
  TagPageContent,
  ContentApiParams,
  convertToContent
} from '../../types/content';
import { ContentGrid } from '../../components/ContentGrid/ContentGrid';

function Home() {
  const [content, setContent] = useState<Contents[]>([]);
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

  // Tag pagination states - 더 이상 사용하지 않음
  const [tagLoading, setTagLoading] = useState(false);

  const navigate = useNavigate();
  const size = 16; // Items per page
  const tagSearchSize = 5; // 실시간 검색 시 최대 태그 개수
  const fetchingRef = useRef(false); // 중복 요청 방지 플래그
  const tagSearchRef = useRef<number | null>(null); // debounce를 위한 ref

  // 컴포넌트 마운트 시 스크롤 위치 초기화
  useEffect(() => {
    // 페이지 로드 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);

    // 브라우저의 자동 스크롤 복원 비활성화
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // 태그 실시간 검색 함수
  const searchTags = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setAvailableTags([]);
      return;
    }

    setTagLoading(true);
    try {
      const res = await axiosInstance.get<TagPageContent>('/tag', {
        params: {
          page: 0,
          size: tagSearchSize,
          search: searchTerm.trim()
        }
      });

      const responseData = res.data.content;
      const newTags = responseData.map(item => item.name);
      setAvailableTags(newTags);
    } catch (e) {
      console.error('Error searching tags:', e);
      setAvailableTags([]);
    } finally {
      setTagLoading(false);
    }
  }, [tagSearchSize]);

  // debounced 태그 검색
  const debouncedSearchTags = useCallback((searchTerm: string) => {
    if (tagSearchRef.current) {
      clearTimeout(tagSearchRef.current);
    }

    tagSearchRef.current = window.setTimeout(() => {
      searchTags(searchTerm);
    }, 300); // 300ms debounce
  }, [searchTags]);

  useEffect(() => {
    const fetchContent = async () => {
      if (fetchingRef.current || last) return; // 이미 요청 중이거나 마지막 페이지면 무시
      fetchingRef.current = true;
      setLoading(true);
      try {

        const params: ContentApiParams = {
            page,
            size,
            search: searchQuery || undefined,
            tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined
          }

        const res = await axiosInstance.get<PageContent>('/content', {
          params
        });

        const responseData = res.data.content;
        const responsePage = res.data.page;        
        const newContent: Contents[] = responseData.map((item: ContentsResponseData) => convertToContent(item));

        const isLast = responsePage.number === responsePage.totalPages - 1;
        setContent((prev) => [...prev, ...newContent]);
        setLast(isLast);

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
    // freeSolo 모드에서는 사용자가 직접 입력한 태그도 포함될 수 있음
    const filteredTags = newTags.filter(tag => tag.trim() !== '').map(tag => tag.trim());
    setSelectedTags(filteredTags);
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
            slotProps={{
              input: {
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
              }
            }}
          />
        </Box>        {/* Tag Filter */}
        <Box sx={{ mb: 2 }}>
          <Autocomplete
            multiple
            freeSolo
            options={availableTags}
            value={selectedTags}
            onChange={(_, newValue) => handleTagSelection(newValue)}
            inputValue={tagInput}
            onInputChange={(_, newInputValue) => {
              setTagInput(newInputValue);
              debouncedSearchTags(newInputValue);
            }}
            renderValue={(value, getTagProps) =>
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
            renderOption={(props, option) => (
              <li {...props} key={option}>
                <Typography>{option}</Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="태그로 필터링... (입력하여 검색)"
                label="태그 필터"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {tagLoading && <CircularProgress color="inherit" size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
            loading={tagLoading}
            loadingText="태그 검색 중..."
            noOptionsText={tagInput.trim() ? "검색 결과가 없습니다" : "태그를 입력하여 검색하세요"}
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
        </Box>      </Paper>

      <ContentGrid
        content={content}
        loading={loading}
        last={last}
        error={error}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        onTagClick={(tag) => {
          if (!selectedTags.includes(tag)) {
            handleTagSelection([...selectedTags, tag]);
          }
        }}
        onClearFilters={handleClearAllFilters}
        showUsername={true}
      />

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