import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

export interface SiteState {
  name: string;
}

const initialState: SiteState = {
  name: 'Squad Only',
};

export interface SiteResponse {
  name: string;
}

export const siteAsync = createAsyncThunk<SiteResponse, void>(
  'site/fetchSite',
  async () => {
    try {
      const response = await axiosInstance.get<SiteResponse>('/site');
      return response.data;
    }
    catch (error) {
      console.error('Failed to fetch site:', error);
      throw error; // 에러를 다시 던져서 reject 처리
    }
  }
)

export const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setSiteName: (state, action) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(siteAsync.pending, (state) => {
        // 요청 시작 시 로딩 상태로 변경할 수 있습니다.
        state.name = 'Loading...';
      })
      .addCase(siteAsync.fulfilled, (state, action) => {
        state.name = action.payload.name;
      })      
      .addCase(siteAsync.rejected, (state, action) => {
        console.error('Failed to fetch site:', action.error.message);
        // 에러 시 기본값 유지
        state.name = initialState.name;
      });
  },
});

export const { setSiteName } = siteSlice.actions;

// Selectors
export const selectSiteName = (state: { site: SiteState }) => state.site.name;

export default siteSlice.reducer;