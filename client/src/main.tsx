import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/timeDisplay.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { ErrorProvider } from './contexts/ErrorContext.tsx';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ErrorProvider>
          <App />
          <ErrorDisplay />
        </ErrorProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
