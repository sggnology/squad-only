import { JSX, useContext, useEffect } from 'react';
import { ErrorContext } from '../../contexts/ErrorContext';
import './ErrorDisplay.css';

export interface CustomErrorEventDetail {
  message: string;
  status?: number;
}

const ErrorDisplay = (): JSX.Element | null => {
  const context = useContext(ErrorContext);

  if (!context) {
    return null;
  }

  const { errors, addError, removeError } = context;

  useEffect(() => {
    const handleApiError = (event: CustomEvent<CustomErrorEventDetail>) => {
      const { message, status } = event.detail;
      addError(message, status);
    };

    window.addEventListener('apiError', handleApiError as EventListener);

    return () => {
      window.removeEventListener('apiError', handleApiError as EventListener);
    };
  }, [addError]);

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="error-stack">
      {errors.map((error) => (
        <div key={error.id} className="error-card">
          <div className="error-content">
            <p><strong>Error {error.status && `(${error.status})`}</strong></p>
            <p>{error.message}</p>
          </div>
          <button onClick={() => removeError(error.id)} className="error-close-btn">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ErrorDisplay;
