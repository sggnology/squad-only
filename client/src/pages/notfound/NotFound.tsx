import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
      >
        Go to Home
      </Button>
    </div>
  );
}

export default NotFound;