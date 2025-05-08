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
    </div>
  );
}

export default Detail;