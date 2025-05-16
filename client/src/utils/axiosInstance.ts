import axios from 'axios';
import { CustomErrorEventDetail } from '../components/ErrorDisplay/ErrorDisplay';

const axiosInstance = axios.create({
  baseURL: '/api/v1', // Assuming all your API calls are prefixed with /api
  // You can add other default configurations here, like headers or timeout
});

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

