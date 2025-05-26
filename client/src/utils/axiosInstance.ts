import axios from 'axios';
import { CustomErrorEventDetail } from '../components/ErrorDisplay/ErrorDisplay';

const axiosInstance = axios.create({
  baseURL: '/api/v1', // Assuming all your API calls are prefixed with /api
  // You can add other default configurations here, like headers or timeout
});

// Request interceptor to add auth token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰을 가져와서 헤더에 추가
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors
    let errorMessage = 'An unexpected error occurred.';
    let errorStatus;

    if ((axios as any).isAxiosError ? (axios as any).isAxiosError(error) : error.isAxiosError) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorStatus = error.response.status;
        // Try to get a more specific message from the server response
        errorMessage = error.response.data?.message || error.response.data?.error || error.message;
        console.error('API Error:', error.response.data, 'Status:', errorStatus);
        
        // TODO: 만약 401 Unauthorized 에러가 발생하면 로그아웃 처리하고 있어 추후 확인해보아야 한다.
        // 401 Unauthorized 에러 시 로그아웃 처리
        if (errorStatus === 401) {
          // 토큰이 만료되었거나 유효하지 않은 경우만 로그아웃
          // Redux store의 logout action을 디스패치하는 custom event 발생
          const logoutEvent = new CustomEvent('unauthorized');
          window.dispatchEvent(logoutEvent);
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Please check your network connection.';
        console.error('Network Error:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
        console.error('Error:', error.message);
      }
    } else {
      // Handle non-Axios errors
      errorMessage = error.message || 'An unknown error occurred';
      console.error('Non-Axios Error:', error);
    }

    // Dispatch a custom event with error details
    const event = new CustomEvent<CustomErrorEventDetail>('apiError', {
      detail: { message: errorMessage, status: errorStatus },
    });
    window.dispatchEvent(event);

    // It's important to return a rejected promise so that the calling code
    // (e.g., in your components) can also handle the error if needed.
    return Promise.reject(error);
  }
);

export default axiosInstance;

