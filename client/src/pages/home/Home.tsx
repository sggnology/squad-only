import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Home.css';

interface Content {
  id: number;
  image: string;
  title: string;
  tags: string[];
  location: string;
  createdAt: string;
}

function Home() {
  const [content, setContent] = useState<Content[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      // Simulate API call
      const newContent = Array.from({ length: 10 }, (_, i) => ({
        id: (page - 1) * 10 + i + 1,
        image: 'https://placehold.co/300',
        title: `Title ${(page - 1) * 10 + i + 1}`,
        tags: ['Tag1', 'Tag2'],
        location: 'Sample Location',
        createdAt: '2025-05-07',
      }));
      setContent((prev) => [...prev, ...newContent]);
      setLoading(false);
    };

    fetchContent();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFloatingButtonClick = () => {
    navigate('/register');
  };

  return (
    <>
      <div className="home-container">
        {content.map((item) => (
          <div
            key={item.id}
            className="card"
            onClick={() => navigate(`/detail/${item.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>Tags: {item.tags.join(', ')}</p>
            <p>Location: {item.location}</p>
            <p>Created At: {item.createdAt}</p>
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>

      <button className="floating-button" onClick={handleFloatingButtonClick}>
        +
      </button>
    </>
  );
}

export default Home;