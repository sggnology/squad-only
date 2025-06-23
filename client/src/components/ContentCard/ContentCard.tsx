import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  CardMedia,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { Content } from '../../types/content';
import { RelativeTime } from '../TimeComponents';

interface ContentCardProps {
  content: Content;
  onTagClick?: (tag: string) => void;
  showUsername?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onTagClick,
  showUsername = true
}) => {
  const navigate = useNavigate();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '300px', md: '320px' },
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => navigate(`/detail/${content.idx}`)}
    >      
    <CardMedia
        component="img"
        image={content.imageUrl}
        alt={content.title}
        sx={{
          objectFit: 'cover',
          width: '100%',
          minHeight: '300px',
          maxHeight: '300px'
        }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography gutterBottom variant="h6" component="h2"
          sx={{
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
          {content.title}
        </Typography>

        {/* 태그 표시 */}
        <Box sx={{ mb: 2 }}>
          {content.tags.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                mr: 0.5,
                mb: 0.5,
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                cursor: onTagClick ? 'pointer' : 'default',
                '&:hover': onTagClick ? {
                  backgroundColor: '#bbdefb',
                } : {},
              }}
              onClick={onTagClick ? (e) => handleTagClick(e, tag) : undefined}
            />
          ))}
          {content.tags.length > 3 && (
            <Chip
              label={`+${content.tags.length - 3}`}
              size="small"
              sx={{
                mr: 0.5,
                mb: 0.5,
                backgroundColor: '#f5f5f5',
                color: '#666'
              }}
            />
          )}
        </Box>

        {/* 위치 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {content.location}
          </Typography>
        </Box>

        {/* 등록자 정보 */}
        {showUsername && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 20, height: 20, mr: 1, backgroundColor: '#1976d2' }}>
              <PersonIcon sx={{ fontSize: 12 }} />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {content.registeredUsername}
            </Typography>
          </Box>
        )}          
        {/* 등록일과 댓글 수 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            <RelativeTime isoString={content.createdAt} />
          </Typography>
          {content.commentCount != undefined && content.commentCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CommentIcon sx={{ fontSize: 14, color: '#666', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {content.commentCount}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
