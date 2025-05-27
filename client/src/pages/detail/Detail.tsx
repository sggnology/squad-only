import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { formatDateTime } from '../../utils/DateUtil';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Fab } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import './Detail.css';
import { selectAuth } from '../../store/authSlice';

interface ContentResponseData {
  idx: number;
  fileIds: number[];
  title: string;
  tags: string[];
  location: string;
  description: string;
  createdAt: string;
  registeredUserId?: string;
}

interface Content {
  idx: number;
  imageUrl: string;
  title: string;
  tags: string[];
  location: string;
  description: string;
  createdAt: string;
  registeredUserId?: string;
}

function Detail() {
  const { idx } = useParams<{ idx: string }>();

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false); // 중복 요청 방지 플래그

  // Redux 상태에서 로그인한 사용자 정보 가져오기
  const { user, isAuthenticated } = useAppSelector(selectAuth);
  const navigate = useNavigate();


  // 편집 권한 확인 함수
  const canEditContent = (): boolean => {
    if (!isAuthenticated || !user || !content) return false;

    // 관리자는 모든 컨텐츠 편집 가능
    if (user.roles.includes('ROLE_ADMIN')) return true;

    // 컨텐츠 소유자만 편집 가능
    return content.registeredUserId === user.userId;
  };

  // 편집 버튼 클릭 핸들러
  const handleEditClick = () => {
    navigate(`/edit/${content?.idx}`);
  };

  // Simulate fetching content by ID
  useEffect(() => {
    const fetchContent = async () => {
      if (fetchingRef.current) return; // 이미 요청 중이거나 마지막 페이지면 무시
      fetchingRef.current = true;
      setLoading(true);
      try {
        // Use axiosInstance and adjust the path if baseURL is set
        // If baseURL is '/api', then the path here should be '/v1/content'
        const res = await axiosInstance.get<ContentResponseData>(`/content/${idx}`);

        // Type assertion for Spring pageable response
        const responseData = res.data;
        const newContent: Content = {
          idx: responseData.idx,
          imageUrl: responseData.fileIds && responseData.fileIds.length > 0 ? `/api/v1/file/${responseData.fileIds[0]}` : 'https://placehold.co/400', // Fallback image URL
          title: responseData.title,
          tags: responseData.tags,
          location: responseData.location,
          description: responseData.description,
          createdAt: formatDateTime(responseData.createdAt),
          registeredUserId: responseData.registeredUserId,
        };

        setContent(newContent);
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
  }, [idx]);

  // 이미지 컨테이너 스타일
  const imageContainerStyle: React.CSSProperties = {
    width: '100%', // 부모 요소의 너비를 따름
    maxWidth: '400px', // 데스크톱 최대 너비
    height: '400px', // 데스크톱 최대 높이
    marginBottom: '20px',
    overflow: 'hidden', // 이미지가 컨테이너를 벗어나지 않도록
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // 이미지가 로드되기 전 배경색
  };

  // 이미지 자체 스타일
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain', // 이미지 비율을 유지하면서 컨테이너를 채움
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', position: 'relative' }}>
      {loading && <p>Loading...</p>}
      {!loading && !content && <p>No content found.</p>}
      {!loading && content != null && (
        <>
          <h1 className="detail-title">
            {content.title}
          </h1>
          {/* 이미지 컨테이너 추가 */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={imageContainerStyle} className="detail-image-container">
              <img
                src={content.imageUrl}
                alt={content.title}
                style={imageStyle}
              />
            </div>
          </div>
          {content.tags.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              {content.tags.map((tag, index) => (
                <span key={index} style={{ marginRight: '10px', padding: '5px', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {content.description && <p><strong>Description:</strong> {content.description}</p>}
          <p><strong>Location:</strong> {content.location}</p>
          <p><strong>Created At:</strong> {content.createdAt}</p>
        </>
      )}

      {/* 플로팅 편집 버튼 - 편집 권한이 있을 때만 표시 */}
      {canEditContent() && (
        <Fab
          color="primary"
          aria-label="edit"
          onClick={handleEditClick}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <EditIcon />
        </Fab>
      )}
    </div>
  );
}

export default Detail;