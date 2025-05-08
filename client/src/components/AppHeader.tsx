import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function AppHeader() {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 1201, boxShadow: 3, height: '64px' }}>
      <Toolbar sx={{ minHeight: '64px' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            SquadOnly
          </Typography>
        </Box>
        <Button color="inherit" onClick={() => navigate('/mypage')}>
          My Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;