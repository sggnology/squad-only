import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Detail from './pages/Detail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
        <FloatingButton />
      </div>
    </Router>
  );
}

function FloatingButton() {
  const navigate = useNavigate();

  const handleFloatingButtonClick = () => {
    navigate('/register');
  };

  return (
    <button className="floating-button" onClick={handleFloatingButtonClick}>
      +
    </button>
  );
}

export default App;
