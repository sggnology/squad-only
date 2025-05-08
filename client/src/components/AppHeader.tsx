import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, IconButton, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function AppHeader() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(isDrawerOpen => !isDrawerOpen);
  };

  const handleLogout = () => {
    setIsLogoutDialogOpen(false);
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 1201, boxShadow: 3, height: '64px' }}>
      <Toolbar sx={{ minHeight: '64px', display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={toggleDrawer()}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={toggleDrawer()}
            ModalProps={{
              keepMounted: true, // Improves performance on mobile
            }}
            sx={{
              zIndex: 1200, // Ensure Drawer is below AppBar
              '& .MuiDrawer-paper': {
                marginTop: '64px', // Offset by AppBar height
              },
            }}
          >
            <List>
              <ListItem component="button" onClick={() => { setIsDrawerOpen(false); navigate('/mypage'); }}>
                <ListItemText primary="My Profile" />
              </ListItem>
              <Divider />
              <ListItem component="button" onClick={() => { setIsDrawerOpen(false); navigate('/'); }}>
                <ListItemText primary="Home" />
              </ListItem>
              <Divider />
              <ListItem component="button" sx={{ marginTop: 'auto' }} onClick={() => { setIsDrawerOpen(false); setIsLogoutDialogOpen(true); }}>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Drawer>
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

      <Dialog open={isLogoutDialogOpen} onClose={() => setIsLogoutDialogOpen(false)}>
        <DialogTitle>로그아웃 하시겠습니까?</DialogTitle>
        <DialogContent>
          <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Button onClick={() => setIsLogoutDialogOpen(false)} color="primary" variant='contained' autoFocus>
              취소
            </Button>
            <Button onClick={handleLogout} color="primary">
              확인
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
}

export default AppHeader;