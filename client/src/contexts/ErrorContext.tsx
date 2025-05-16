import { createContext, useState, useCallback, ReactNode, JSX } from 'react';

interface ErrorMessage {
  id: string;
  message: string;
  status?: number;
}

interface ErrorContextType {
  errors: ErrorMessage[];
  addError: (message: string, status?: number) => void;
  removeError: (id: string) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps): JSX.Element => {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  const addError = useCallback((message: string, status?: number) => {
    const id = crypto.randomUUID();
    setErrors((prevErrors) => [...prevErrors, { id, message, status }]);

    // Auto-remove error after 5 seconds
    setTimeout(() => {
      removeError(id);
    }, 5000);
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError }}>
      {children}
    </ErrorContext.Provider>
  );
};
