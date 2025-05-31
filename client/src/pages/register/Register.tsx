import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Chip,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import AddressSearch from '../../components/AddressSearch';

// Interface for the content registration request body
interface ContentRegistrationReqDto {
  newFileIds: number[];
  title: string;
  description: string;
  location: string;
  tags: string[];
}

function Register() {
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
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

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!title.trim()) {
        setError('제목을 입력해주세요.');
        return;
      }

      if (!location.trim()) {
        setError('위치를 입력해주세요.');
        return;
      }

      const payload: ContentRegistrationReqDto = {
        newFileIds: uploadedFileId == null ? [] : [uploadedFileId],
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        tags,
      };

      await axiosInstance.post('/content', payload);
      console.log('Content registered successfully:', payload);
      navigate('/');
    } catch (error) {
      console.error('Error registering content:', error);
      setError('컨텐츠 등록 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          컨텐츠 등록
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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

            {/* 이미지 미리보기 (로딩 중이 아닐 때만 표시) */}
            {!imageLoading && imagePreview && (
              <Box
                component="img"
                src={imagePreview}
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
            {!imageLoading && !imagePreview && (
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
                '이미지 업로드'
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
            error={!title.trim() && error !== null}
            helperText={!title.trim() && error !== null ? '제목을 입력해주세요' : ''}
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
          
          <AddressSearch
            value={location}
            onChange={(address) => setLocation(address)}
            error={!location.trim() && error !== null}
            helperText={!location.trim() && error !== null ? '위치를 입력해주세요' : '정확한 주소를 검색해서 선택해주세요'}
            label="위치"
            placeholder="주소를 검색해주세요"
            required
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
              onClick={handleSubmit}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={saving || !title.trim() || !location.trim()}
            >
              {saving ? '등록 중...' : '등록'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;