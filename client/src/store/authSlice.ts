import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// Types
export interface User {
  userId: string;
  name: string;
  nickname: string | null;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  nickname: string | null;
  roles: string[];
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk<LoginResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    // JWT는 stateless이므로 클라이언트에서만 토큰을 제거하면 됩니다
    return;
  }
);

// 토큰 유효성 검증 및 사용자 정보 복원
export const validateTokenAsync = createAsyncThunk<LoginResponse, string>(
  'auth/validateToken',
  async (token, { rejectWithValue }) => {
    try {
      // /auth/me 엔드포인트를 호출하여 토큰 유효성 검증 및 사용자 정보 조회
      const response = await axiosInstance.get<LoginResponse>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      // 토큰이 유효하지 않으면 localStorage에서 제거
      localStorage.removeItem('token');
      return rejectWithValue(
        error.response?.data?.message || 'Token validation failed'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // 토큰과 사용자 정보를 직접 설정 (API 호출 없이 빠른 복원용)
    setAuthenticated: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    // 인증 초기화 (로그아웃 시 사용)
    clearAuthentication: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    // 사용자 프로필 업데이트
    updateUserProfile: (state, action: PayloadAction<{ name: string; nickname: string | null }>) => {
      if (state.user) {
        state.user.name = action.payload.name;
        state.user.nickname = action.payload.nickname;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        console.log('Login request started');
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        console.log('Login successful:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          userId: action.payload.userId,
          name: action.payload.name,
          nickname: action.payload.nickname,
          roles: action.payload.roles,
        };
        state.error = null;
        
        // 토큰을 localStorage에 저장
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        console.error('Login failed:', action.payload);
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
        
        // 실패 시 localStorage에서 토큰 제거
        localStorage.removeItem('token');
      })      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        console.log('Logout successful');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        
        // localStorage에서 토큰 제거
        localStorage.removeItem('token');
      })
      // Validate Token
      .addCase(validateTokenAsync.pending, (state) => {
        console.log('Token validation started');
        state.loading = true;
        state.error = null;
      })
      .addCase(validateTokenAsync.fulfilled, (state, action) => {
        console.log('Token validation successful:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        // 기존 토큰을 유지 (validateTokenAsync에 전달된 토큰이 유효한 토큰)
        state.user = {
          userId: action.payload.userId,
          name: action.payload.name,
          nickname: action.payload.nickname,
          roles: action.payload.roles,
        };
        state.error = null;
      })
      .addCase(validateTokenAsync.rejected, (state, action) => {
        console.error('Token validation failed:', action.payload);
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null; // 토큰 검증 실패는 에러로 표시하지 않음
        
        // 실패 시 localStorage에서 토큰 제거
        localStorage.removeItem('token');
      });
  },
});

export const { clearError, setAuthenticated, clearAuthentication, updateUserProfile } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.user?.roles.includes('ROLE_ADMIN') || false;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;