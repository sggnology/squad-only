import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
// Import the new axiosInstance
import axiosInstance from '../../utils/axiosInstance';
import './Home.css';
import { formatDateTime } from '../../utils/DateUtil';

interface Content {
  idx: number;
  imageUrl: string;
  title: string;
  tags: string[];
  location: string;
  createdAt: string;
}

function Home() {
  const [content, setContent] = useState<Content[]>([]);
  const [page, setPage] = useState(0); // Spring pageable starts at 0
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(false); // Track if last page
  const navigate = useNavigate();
  const size = 10; // Items per page
  const fetchingRef = useRef(false); // 중복 요청 방지 플래그

  useEffect(() => {
    const fetchContent = async () => {
      if (fetchingRef.current || last) return; // 이미 요청 중이거나 마지막 페이지면 무시
      fetchingRef.current = true;
      setLoading(true);
      try {
        // Use axiosInstance and adjust the path if baseURL is set
        // If baseURL is '/api', then the path here should be '/v1/content'
        const res = await axiosInstance.get('/content', {
          params: { page, size },
        });
        // Type assertion for Spring pageable response
        const responseData = res.data as { content: Content[]; last: boolean };
        const newData = {
          content: responseData.content.map((item: Content) => ({
            ...item,
            createdAt: formatDateTime(item.createdAt), // Format date
          })),
          last: responseData.last,
        };
        
        setContent((prev) => [...prev, ...newData.content]);
        setLast(newData.last);
      } catch (e) {
        // The global error handler will display the error.
        // You can still have specific error handling here if needed.
        console.error('Error fetching content in Home component:', e);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchContent(); // Fetch content when page changes (and not last)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Removed 'last' from dependencies to allow initial fetch even if last is true from a previous state

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
      !loading &&
      !last
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, last]); // Re-add event listener if loading or last state changes

  const handleFloatingButtonClick = () => {
    navigate('/register');
  };

  return (
    <>
      <div className="home-container">
        {content.map((item) => (
          <div
            key={item.idx}
            className="card"
            onClick={() => navigate(`/detail/${item.idx}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={item.imageUrl} alt={item.title} />
            <h3>{item.title}</h3>
            <p>Tags: {item.tags.join(', ')}</p>
            <p>Location: {item.location}</p>
            <p>Created At: {item.createdAt}</p>
          </div>
        ))}
        {loading && <p>Loading...</p>}
        {!loading && last && <p className="text-center text-gray-400 py-4">No more content.</p>}
      </div>

      <button className="floating-button" onClick={handleFloatingButtonClick}>
        +
      </button>
    </>
  );
}

export default Home;