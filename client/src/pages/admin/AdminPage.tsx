import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Box 
} from '@mui/material';
import { 
  People as PeopleIcon, 
  Article as ArticleIcon,
  Dashboard as DashboardIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 6, fontWeight: 'bold' }}>
      관리자 대시보드
      </Typography>

      <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
        <CardContent>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <PeopleIcon sx={{ mr: 2 }} color="primary" />
          <Typography variant="h6">사용자 관리</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          사용자 계정 생성, 수정, 삭제 및 권한 관리
          </Typography>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => navigate('/admin/users')}
          >
          사용자 관리
          </Button>
        </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
        <CardContent>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <ArticleIcon sx={{ mr: 2 }} color="primary" />
          <Typography variant="h6">콘텐츠 관리</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          등록된 콘텐츠 조회, 수정, 삭제 관리
          </Typography>
          <Button variant="contained" fullWidth>
          콘텐츠 관리
          </Button>
        </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
        <CardContent>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          <DashboardIcon sx={{ mr: 2 }} color="primary" />
          <Typography variant="h6">시스템 통계</Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          사용자, 콘텐츠 등 시스템 전반 통계 확인
          </Typography>
          <Button variant="contained" fullWidth>
          통계 보기
          </Button>
        </CardContent>
        </Card>
      </Grid>
      </Grid>

      <Paper sx={{ mt: 8, p: 6 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        최근 활동
      </Typography>
      <Typography variant="body1" color="textSecondary">
        최근 사용자 활동 및 시스템 로그가 여기에 표시됩니다.
      </Typography>
      </Paper>
    </Container>
  );
}

export default AdminPage;
