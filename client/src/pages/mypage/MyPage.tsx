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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccountCircle as AccountCircleIcon,
  Event as EventIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Close as CloseIcon
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

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
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

  // 비밀번호 변경 모달 관련 상태
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordFormErrors, setPasswordFormErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const validatePasswordForm = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };

    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }

    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!passwordForm.confirmNewPassword.trim()) {
      errors.confirmNewPassword = '비밀번호 확인을 입력해주세요.';
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = '비밀번호가 일치하지 않습니다.';
    }

    setPasswordFormErrors(errors);
    return !errors.currentPassword && !errors.newPassword && !errors.confirmNewPassword;
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
  // 비밀번호 변경 관련 핸들러들
  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);
    setError(null);

    try {
      await axiosInstance.put('/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword
      });
      
      setIsPasswordModalOpen(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setPasswordFormErrors({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
      console.error('Failed to change password:', err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setPasswordFormErrors({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  const handlePasswordInputChange = (field: keyof PasswordChangeRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // 입력 중 에러 메시지 초기화
    if (passwordFormErrors[field]) {
      setPasswordFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
          <CardActions sx={{ justifyContent: 'space-between', p: 3 }}>
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => setIsPasswordModalOpen(true)}
              disabled={loading}
              color="secondary"
            >
              비밀번호 변경
            </Button>
            
            <Box>
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
            </Box>
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
          </Box>        </CardContent>
      </Card>

      {/* 비밀번호 변경 모달 */}
      <Dialog 
        open={isPasswordModalOpen} 
        onClose={handlePasswordModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon color="primary" />
            비밀번호 변경
          </Box>
          <IconButton
            onClick={handlePasswordModalClose}
            disabled={passwordLoading}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="현재 비밀번호"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={handlePasswordInputChange('currentPassword')}
              fullWidth
              disabled={passwordLoading}
              error={!!passwordFormErrors.currentPassword}
              helperText={passwordFormErrors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('current')}
                      edge="end"
                      disabled={passwordLoading}
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="새 비밀번호"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={handlePasswordInputChange('newPassword')}
              fullWidth
              disabled={passwordLoading}
              error={!!passwordFormErrors.newPassword}
              helperText={passwordFormErrors.newPassword || '8자 이상 입력해주세요.'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                      disabled={passwordLoading}
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="새 비밀번호 확인"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordInputChange('confirmNewPassword')}
              fullWidth
              disabled={passwordLoading}
              error={!!passwordFormErrors.confirmNewPassword}
              helperText={passwordFormErrors.confirmNewPassword || '새 비밀번호를 다시 입력해주세요.'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                      disabled={passwordLoading}
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handlePasswordModalClose}
            disabled={passwordLoading}
            variant="outlined"
          >
            취소
          </Button>
          <Button
            onClick={handlePasswordChange}
            disabled={passwordLoading}
            variant="contained"
            startIcon={passwordLoading ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
          >
            {passwordLoading ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyPage;