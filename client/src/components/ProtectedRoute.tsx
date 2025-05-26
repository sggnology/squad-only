import { JSX, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectAuthLoading } from '../store/authSlice';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute= ({ children }: ProtectedRouteProps): JSX.Element => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // 로그인 후 원래 페이지로 돌아가기 위해 현재 위치를 state에 저장
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
