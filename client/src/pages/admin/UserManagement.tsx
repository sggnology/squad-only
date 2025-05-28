import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  Skeleton,
  TablePagination
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon
} from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import { formatDateTime } from '../../utils/DateUtil';

interface UserData {
  userId: string;
  name: string;
  isEnabled: boolean;
  isDeleted: boolean;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
}

interface UserRegistrationForm {
  userId: string;
  name: string;
}

function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  // Registration dialog state
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationForm, setRegistrationForm] = useState<UserRegistrationForm>({
    userId: '',
    name: ''
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/admin/account?page=${page}&size=${rowsPerPage}`
      );

      const data = response.data as any;
      setUsers(data.content || []);
      setTotalUsers(data.page.totalElements || 0);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || '사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const handleRegisterUser = async () => {
    if (!registrationForm.userId || !registrationForm.name) {
      setError('모든 필드를 입력해주세요.');
      return;
    } try {
      setRegistrationLoading(true);
      await axiosInstance.post('/admin/account', registrationForm);

      setRegistrationOpen(false);
      setRegistrationForm({
        userId: '',
        name: ''
      });
      fetchUsers(); // Refresh the user list
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || '사용자 등록 중 오류가 발생했습니다.');
    } finally {
      setRegistrationLoading(false);
    }
  };
  
  const handleToggleUserStatus = async (userId: string) => {

    const user = users.find(u => u.userId === userId);
    if (!user) return;

    // 관리자 권한이 있는 사용자는 상태 변경 불가
    if (user.roles.includes('ROLE_ADMIN')) {
      setError('관리자 권한이 있는 사용자는 상태를 변경할 수 없습니다.');
      return;
    }

    // 삭제된 사용자는 상태 변경 불가
    if (user.isDeleted) {
      setError('삭제된 사용자는 상태를 변경할 수 없습니다.');
      return;
    }

    try {
      await axiosInstance.patch(`/admin/account/toggle/${userId}`);
      fetchUsers(); // Refresh the user list
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || '상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    // 관리자 권한이 있는 사용자는 삭제 불가
    const user = users.find(u => u.userId === userToDelete);
    if (user && user.roles.includes('ROLE_ADMIN')) {
      setError('관리자 권한이 있는 사용자는 삭제할 수 없습니다.');
      setDeleteDialogOpen(false);
      return;
    }

    // 이미 삭제된 사용자는 삭제 불가
    if (user && user.isDeleted) {
      setError('이미 삭제된 사용자입니다.');
      setDeleteDialogOpen(false);
      return;
    }

    try {
      await axiosInstance.delete(`/admin/account/${userToDelete}`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh the user list
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || '사용자 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          사용자 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setRegistrationOpen(true)}
        >
          사용자 등록
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>사용자 ID</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell>최종 로그인</TableCell>
                <TableCell align="center">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : (
                users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.name}</TableCell>                    <TableCell>
                      <Chip
                        label={user.isDeleted ? '삭제됨' : (user.isEnabled ? '활성' : '비활성')}
                        color={user.isDeleted ? 'error' : (user.isEnabled ? 'success' : 'default')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                    <TableCell>{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '-'}</TableCell>
                    <TableCell align="center">
                      {/* 삭제된 사용자는 작업 버튼을 표시하지 않음 */}
                      {!user.isDeleted && !user.roles.includes('ROLE_ADMIN') && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleUserStatus(user.userId)}
                            color={user.isEnabled ? 'warning' : 'success'}
                            title={user.isEnabled ? '비활성화' : '활성화'}
                          >
                            {user.isEnabled ? <ToggleOffIcon /> : <ToggleOnIcon />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setUserToDelete(user.userId);
                              setDeleteDialogOpen(true);
                            }}
                            color="error"
                            title="삭제"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                      {user.isDeleted && (
                        <Typography variant="body2" color="text.secondary">
                          삭제된 사용자
                        </Typography>
                      )}
                      {user.roles.includes('ROLE_ADMIN') && !user.isDeleted && (
                        <Typography variant="body2" color="text.secondary">
                          관리자 계정
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행 수:"
        />
      </Paper>

      {/* User Registration Dialog */}
      <Dialog open={registrationOpen} onClose={() => setRegistrationOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>새 사용자 등록</DialogTitle>        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="사용자 ID"
              value={registrationForm.userId}
              onChange={(e) => setRegistrationForm({ ...registrationForm, userId: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="이름"
              value={registrationForm.name}
              onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegistrationOpen(false)}>취소</Button>
          <Button
            onClick={handleRegisterUser}
            variant="contained"
            disabled={registrationLoading}
          >
            {registrationLoading ? '등록 중...' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>사용자 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>
            정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default UserManagement;
