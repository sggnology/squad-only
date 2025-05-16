import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { ErrorProvider } from './contexts/ErrorContext.tsx';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ErrorProvider>
        <App />
        <ErrorDisplay />
      </ErrorProvider>
    </ThemeProvider>
  </React.StrictMode>
);
