import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccountCircle as AccountCircleIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUser, updateUserProfile } from '../../store/authSlice';
import axiosInstance from '../../utils/axiosInstance';

interface Profile {
  userId: string;
  name: string;
  nickname: string | null;
  createdAt: string;
}

interface ProfileUpdateResponse {
  name: string;
  nickname: string | null;
}

function MyPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    nickname: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    nickname: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<Profile>('/profile');
      setProfile(response.data);
      setEditForm({
        name: response.data.name,
        nickname: response.data.nickname || ''
      });
    } catch (err: any) {
      setError('프로필을 불러오는데 실패했습니다.');
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      nickname: ''
    };

    if (!editForm.name.trim()) {
      errors.name = '이름을 입력해주세요.';
    } else if (editForm.name.length < 2) {
      errors.name = '이름은 2자 이상이어야 합니다.';
    }

    if (editForm.nickname.trim() && editForm.nickname.length < 2) {
      errors.nickname = '닉네임은 2자 이상이어야 합니다.';
    }

    setFormErrors(errors);
    return !errors.name && !errors.nickname;
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setSuccessMessage('');
    setError(null);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        name: profile.name,
        nickname: profile.nickname || ''
      });
    }
    setFormErrors({
      name: '',
      nickname: ''
    });
    setSuccessMessage('');
    setError(null);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.put<ProfileUpdateResponse>('/profile', {
        name: editForm.name.trim(),
        nickname: editForm.nickname.trim()
      });
      
      // 로컬 프로필 상태 업데이트
      setProfile(prev => prev ? {
        ...prev,
        name: response.data.name,
        nickname: response.data.nickname
      } : null);
      
      // Auth slice의 사용자 정보도 업데이트
      dispatch(updateUserProfile({
        name: response.data.name,
        nickname: response.data.nickname
      }));
      
      setIsEditing(false);
      setFormErrors({
        name: '',
        nickname: ''
      });
      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError('프로필 수정에 실패했습니다.');
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: 'name' | 'nickname') => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // 입력 중 에러 메시지 초기화
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PersonIcon color="primary" />
          마이페이지
        </Typography>
        <Typography variant="body1" color="text.secondary">
          개인 정보를 확인하고 수정할 수 있습니다.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {profile && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
                <AccountCircleIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {profile.nickname || profile.name}
                </Typography>
                <Chip 
                  icon={<EventIcon />}
                  label={`가입일: ${formatDate(profile.createdAt)}`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="사용자 ID"
                value={profile.userId}
                fullWidth
                disabled
                variant="outlined"
                helperText="사용자 ID는 변경할 수 없습니다."
              />

              <TextField
                label="이름"
                value={isEditing ? editForm.name : profile.name}
                onChange={handleInputChange('name')}
                fullWidth
                disabled={!isEditing || loading}
                variant="outlined"
                error={!!formErrors.name}
                helperText={formErrors.name || '실제 이름을 입력해주세요.'}
                required
              />

              <TextField
                label="닉네임"
                value={isEditing ? editForm.nickname : (profile.nickname || '')}
                onChange={handleInputChange('nickname')}
                fullWidth
                disabled={!isEditing || loading}
                variant="outlined"
                error={!!formErrors.nickname}
                helperText={formErrors.nickname || '다른 사용자에게 표시될 닉네임입니다. (선택사항)'}
                placeholder="닉네임을 입력하세요"
              />
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: 'flex-end', p: 3 }}>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditStart}
                disabled={loading}
              >
                편집
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleEditCancel}
                  disabled={loading}
                >
                  취소
                </Button>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? '저장 중...' : '저장'}
                </Button>
              </Box>
            )}
          </CardActions>
        </Card>
      )}

      {/* 사용자 통계 및 추가 정보 섹션 */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            계정 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">현재 권한:</Typography>
              <Box>
                {currentUser?.roles.map((role) => (
                  <Chip 
                    key={role} 
                    label={role === 'ADMIN' ? '관리자' : '일반 사용자'} 
                    size="small" 
                    color={role === 'ADMIN' ? 'error' : 'default'}
                    sx={{ ml: 1 }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">계정 상태:</Typography>
              <Chip label="활성" color="success" size="small" />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default MyPage;