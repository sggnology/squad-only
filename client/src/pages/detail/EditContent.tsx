import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import { useAppSelector } from '../../store/hooks';

interface ContentResponseData {
  idx: number;
  fileIds: number[];
  title: string;
  tags: string[];
  location: string;
  description: string;
  createdAt: string;
  registeredUserId?: string;
}

const EditContent: React.FC = () => {
  const { idx } = useParams<{ idx: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentResponseData, setContentResponseData] = useState<ContentResponseData | null>(null);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  // 이미지 관련 상태
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchContent();
  }, [idx, isAuthenticated, navigate]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/content/${idx}`);
      const contentResponseData = response.data as ContentResponseData;

      // 편집 권한 확인
      if (!canEditContent(contentResponseData)) {
        setError('이 컨텐츠를 편집할 권한이 없습니다.');
        return;
      }

      setContentResponseData(contentResponseData);
      setTitle(contentResponseData.title);
      setDescription(contentResponseData.description);
      setLocation(contentResponseData.location);
      setTags(contentResponseData.tags || []);

      // 현재 이미지 URL 설정
      if (contentResponseData.fileIds && contentResponseData.fileIds.length > 0) {
        setCurrentImageUrl(`/api/v1/file/${contentResponseData.fileIds[0]}`);
      }
    } catch (err) {
      setError('컨텐츠를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const canEditContent = (contentResponseData: ContentResponseData): boolean => {
    if (!user) return false;

    // 관리자는 모든 컨텐츠 편집 가능
    if (user.roles.includes('ROLE_ADMIN')) return true;

    // 컨텐츠 소유자만 편집 가능
    return contentResponseData.registeredUserId === user.userId;
  };

  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleTagKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTagAdd();
    }
  };
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageLoading(true);
      
      // 1. Local preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      // 2. Upload to server
      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await axiosInstance.post('/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0 && typeof response.data[0] === 'number') {
          setUploadedFileId(response.data[0]);
        } else {
          console.error('Failed to upload image or invalid file ID received:', response.data);
          setImagePreview(null);
          setUploadedFileId(null);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setImagePreview(null);
        setUploadedFileId(null);
      } finally {
        setImageLoading(false);
      }
    } else {
      setImagePreview(null);
      setUploadedFileId(null);
      setImageLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!title.trim()) {
        setError('제목과 위치는 필수 입력 사항입니다.');
      }

      if( !location.trim()) {
        setError('제목과 위치는 필수 입력 사항입니다.');
      }

      const updateData = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        tags,
        newFileIds: uploadedFileId ? [uploadedFileId] : []
      };

      await axiosInstance.put(`/content/${idx}`, updateData);

      // 성공적으로 저장되면 상세 페이지로 이동
      navigate(`/detail/${idx}`);
    } catch (err) {
      setError('컨텐츠 저장 중 오류가 발생했습니다.');
      console.error('Error saving content:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/detail/${idx}`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => navigate(`/detail/${idx}`)}>
            돌아가기
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          컨텐츠 편집
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>          {/* 이미지 섹션 */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* 이미지 로딩 중일 때 스켈레톤 표시 */}
            {imageLoading && (
              <Skeleton
                variant="rectangular"
                width={300}
                height={300}
                sx={{
                  marginBottom: 2,
                  borderRadius: 1,
                  backgroundColor: '#f5f5f5'
                }}
              />
            )}

            {/* 현재 이미지 또는 새 이미지 미리보기 (로딩 중이 아닐 때만 표시) */}
            {!imageLoading && (imagePreview || currentImageUrl) && (
              <Box
                component="img"
                src={imagePreview || currentImageUrl || ''}
                alt="이미지 미리보기"
                sx={{
                  width: 300,
                  height: 300,
                  objectFit: 'cover',
                  marginBottom: 2,
                  display: 'block',
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  transition: 'all 0.3s ease-in-out'
                }}
              />
            )}

            {/* 이미지가 없고 로딩 중이 아닐 때 플레이스홀더 */}
            {!imageLoading && !imagePreview && !currentImageUrl && (
              <Box
                sx={{
                  width: 300,
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #ddd',
                  borderRadius: 1,
                  marginBottom: 2,
                  backgroundColor: '#fafafa',
                  color: '#999',
                  fontSize: '14px',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    borderColor: '#bbb',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                이미지를 업로드해주세요
              </Box>
            )}

            {/* 이미지 업로드 버튼 */}
            <Button
              variant="outlined"
              component="label"
              disabled={imageLoading}
              sx={{ 
                mb: 2,
                minWidth: 120,
                transition: 'all 0.3s ease-in-out'
              }}
            >
              {imageLoading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  업로드 중...
                </>
              ) : (
                currentImageUrl ? '이미지 변경' : '이미지 업로드'
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
                disabled={imageLoading}
              />
            </Button>
          </Box>

          <TextField
            fullWidth
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            error={!title.trim()}
            helperText={!title.trim() ? '제목을 입력해주세요' : ''}
          />

          <TextField
            fullWidth
            label="설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="위치"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
            required
            error={!location.trim()}
            helperText={!location.trim() ? '위치를 입력해주세요' : ''}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="tag-input">태그 추가</InputLabel>
            <OutlinedInput
              id="tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              label="태그 추가"
              endAdornment={
                <Button onClick={handleTagAdd} disabled={!tagInput.trim()}>
                  추가
                </Button>
              }
            />
          </FormControl>

          <Box sx={{ mt: 2, mb: 3 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              disabled={saving}
            >
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving || !title.trim() || !location.trim()}
            >
              {saving ? '저장 중...' : '저장'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditContent;
