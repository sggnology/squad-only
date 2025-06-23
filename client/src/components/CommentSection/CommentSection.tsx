import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Comment, CommentResponseData, PageComment, CommentRegistrationRequest, CommentUpdateRequest } from '../../types/comment';
import { useAppSelector } from '../../store/hooks';
import { RelativeTime } from '../TimeComponents';
import axiosInstance from '../../utils/axiosInstance';

interface CommentSectionProps {
  contentIdx: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ contentIdx }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  const user = useAppSelector(state => state.auth.user);

  // 댓글 조회
  const fetchComments = async (pageNum: number = 0, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<PageComment>(`/comment/${contentIdx}`, {
        params: {
          page: pageNum,
          size: 10
        }
      }); 
      
      const newComments: CommentResponseData[] = response.data.content;

      if (append) {
        setComments(prev => [...prev, ...newComments]);
      } else {
        setComments(newComments);
      }

      setHasMore(!response.data.page || response.data.page.number < response.data.page.totalPages - 1);
      setPage(pageNum);
    } catch (err: any) {
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  // 댓글 등록
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const requestData: CommentRegistrationRequest = {
        comment: newComment.trim()
      };

      await axiosInstance.post(`/comment/${contentIdx}`, requestData);

      setNewComment('');
      // 첫 페이지를 다시 로드하여 새 댓글을 표시
      await fetchComments(0, false);
    } catch (err: any) {
      setError('댓글 등록 중 오류가 발생했습니다.');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId: number) => {
    if (!editingComment.trim()) return;

    try {
      setError(null);

      const requestData: CommentUpdateRequest = {
        comment: editingComment.trim()
      };

      await axiosInstance.put(`/comment/${commentId}`, requestData);

      // 댓글 목록 업데이트
      setComments(prev => prev.map(comment =>
        comment.idx === commentId
          ? { ...comment, comment: editingComment.trim(), updatedAt: new Date().toISOString() }
          : comment
      ));

      setEditingCommentId(null);
      setEditingComment('');
    } catch (err: any) {
      setError('댓글 수정 중 오류가 발생했습니다.');
      console.error('Error updating comment:', err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      setError(null);
      setDeletingCommentId(commentId);

      await axiosInstance.delete(`/comment/${commentId}`);

      setComments(prev => prev.filter(comment => comment.idx !== commentId));
      setDeleteDialogOpen(false);
    } catch (err: any) {
      setError('댓글 삭제 중 오류가 발생했습니다.');
      console.error('Error deleting comment:', err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  // 더 많은 댓글 로드
  const loadMoreComments = () => {
    if (hasMore && !loading) {
      fetchComments(page + 1, true);
    }
  };

  // 메뉴 핸들러
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, commentId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  // 수정 시작
  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.idx);
    setEditingComment(comment.comment);
    handleMenuClose();
  };

  // 삭제 다이얼로그 열기
  const openDeleteDialog = (deleteId: number | null) => {
    setDeletingCommentId(deleteId)
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingComment('');
  };

  useEffect(() => {
    fetchComments();
  }, [contentIdx]);

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          댓글 ({comments.length})
        </Typography>

        {/* 오류 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 댓글 작성 */}
        {user && (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                startIcon={submitting ? <CircularProgress size={16} /> : undefined}
              >
                {submitting ? '등록 중...' : '댓글 등록'}
              </Button>
            </Box>
          </Box>
        )}

        {/* 댓글 목록 */}
        {comments.length === 0 && !loading ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            첫 번째 댓글을 작성해보세요!
          </Typography>
        ) : (
          <>
            {comments.map((comment, index) => (
              <Box key={comment.idx}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 2, backgroundColor: '#1976d2' }}>
                    <PersonIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {comment.username}
                      </Typography>                      
                      <Typography variant="caption" color="text.secondary">
                        <RelativeTime isoString={comment.createdAt} />
                        {comment.updatedAt !== comment.createdAt && ' (수정됨)'}
                      </Typography>
                      {/* 내가 작성한 댓글인 경우 메뉴 표시 */}
                      {(user && (user.userId === comment.userId || user.roles?.includes('ROLE_ADMIN'))) && (
                        <IconButton
                          size="small"
                          sx={{ ml: 'auto' }}
                          onClick={(e) => handleMenuClick(e, comment.idx)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    {/* 댓글 내용 또는 수정 필드 */}
                    {editingCommentId === comment.idx ? (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={editingComment}
                          onChange={(e) => setEditingComment(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleUpdateComment(comment.idx)}
                            disabled={!editingComment.trim()}
                          >
                            수정
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={cancelEdit}
                          >
                            취소
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.comment}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}

            {/* 더 보기 버튼 */}
            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={loadMoreComments}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                  {loading ? '로딩 중...' : '더 보기'}
                </Button>
              </Box>
            )}
          </>
        )}

        {/* 메뉴 */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => startEdit(comments.find(c => c.idx === selectedCommentId)!)}>
            <EditIcon sx={{ mr: 1, fontSize: 16 }} />
            수정
          </MenuItem>
          <MenuItem onClick={() => openDeleteDialog(selectedCommentId)}>
            <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
            삭제
          </MenuItem>
        </Menu>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>댓글 삭제</DialogTitle>
          <DialogContent>
            <Typography>이 댓글을 삭제하시겠습니까?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              취소
            </Button>
            <Button
              onClick={() => deletingCommentId && handleDeleteComment(deletingCommentId)}
              color="error"
              disabled={deletingCommentId == null}
            >
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
