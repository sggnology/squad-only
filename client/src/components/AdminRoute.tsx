import { JSX, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { 
  selectIsAuthenticated, 
  selectIsAdmin, 
  selectAuthLoading 
} from '../store/authSlice';
import { CircularProgress, Box, Alert } from '@mui/material';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps): JSX.Element => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const loading = useAppSelector(selectAuthLoading);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Box p={3}>
        <Alert severity="error">
          관리자 권한이 필요한 페이지입니다.
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
