import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function AppHeader() {
  const navigate = useNavigate();

  return (
    <AppBar sx={{ boxShadow: 3, height: '64px' }}>
      <Toolbar sx={{ minHeight: '64px', display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          {/* Left-aligned content can go here */}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            SquadOnly
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="inherit" onClick={() => navigate('/mypage')}>
            My Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;