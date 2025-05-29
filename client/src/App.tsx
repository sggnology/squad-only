import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Detail from './pages/detail/Detail';
import EditContent from './pages/detail/EditContent';
import NotFound from './pages/notfound/NotFound';
import MyPage from './pages/mypage/MyPage';
import AdminPage from './pages/admin/AdminPage';
import UserManagement from './pages/admin/UserManagement';
import SiteManagement from './pages/admin/SiteManagement';
import AppHeader from './components/AppHeader';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useAppDispatch } from './store/hooks';
import { logoutAsync, validateTokenAsync } from './store/authSlice';
import { siteAsync } from './store/siteSlice';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 앱 초기화 시 저장된 토큰이 있으면 유효성 검증
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Found stored token, validating...');
        await dispatch(validateTokenAsync(token));
      }
    };

    // 사이트 정보 초기화
    const initializeSite = async () => {
      try {
        await dispatch(siteAsync());
      } catch (error) {
        console.error('Failed to initialize site:', error);
      }
    };

    initializeAuth();
    initializeSite();

    // 401 Unauthorized 이벤트 리스너 등록
    const handleUnauthorized = () => {
      dispatch(logoutAsync());
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flexShrink: 0 }}>
          <AppHeader />
        </div>
        <div style={{ flexGrow: 1, paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/detail/:idx" element={<Detail />} />

            {/* Protected Routes - 로그인 필요 */}
            <Route path="/register" element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            } />
            <Route path="/mypage" element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            } />
            <Route path="/edit/:idx" element={
              <ProtectedRoute>
                <EditContent />
              </ProtectedRoute>
            } />

            {/* Admin Routes - 관리자 권한 필요 */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/admin/site" element={
              <AdminRoute>
                <SiteManagement />
              </AdminRoute>
            } />
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
