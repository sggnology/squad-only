import { useParams } from 'react-router-dom';

interface Content {
  id: number;
  image: string;
  title: string;
  description?: string;
  tags: string[];
  location: string;
  createdAt: string;
}

function Detail() {
  const { id } = useParams<{ id: string }>();

  // Simulate fetching content by ID
  const content: Content = {
    id: Number(id),
    image: 'https://placehold.co/400',
    title: `Title ${id}`,
    description: 'This is a sample description.',
    tags: ['Tag1', 'Tag2'],
    location: 'Sample Location',
    createdAt: '2025-05-07',
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>{content.title}</h1>
      <img src={content.image} alt={content.title} style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
      <p><strong>Location:</strong> {content.location}</p>
      <p><strong>Created At:</strong> {content.createdAt}</p>
      <p><strong>Tags:</strong> {content.tags.join(', ')}</p>
    </div>
  );
}

export default Detail;