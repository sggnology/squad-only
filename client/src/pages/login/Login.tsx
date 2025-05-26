import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loginAsync,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated
} from '../../store/authSlice';

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  // 이미 로그인된 상태라면 홈으로 리디렉션
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 에러 메시지 초기화
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId.trim() || !formData.password.trim()) {
      return;
    }

    try {
      const result = await dispatch(loginAsync(formData));
      if (loginAsync.fulfilled.match(result)) {
        navigate('/');
      }
    } catch (err) {
      // 에러는 Redux에서 처리됨
    }
  };

  return (
    <Container
      maxWidth="sm"
      className="mt-8"
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            로그인
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="사용자 ID"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            margin="normal"
            required
            autoComplete="username"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            autoComplete="current-password"
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 6 }}
            disabled={loading || !formData.userId.trim() || !formData.password.trim()}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;