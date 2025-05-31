import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import siteReducer from './siteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    site: siteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;