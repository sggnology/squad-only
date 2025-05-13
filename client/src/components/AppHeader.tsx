import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, IconButton, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useMediaQuery from '@mui/material/useMediaQuery';

function AppHeader() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const isMdUp = useMediaQuery('(min-width:960px)');

  const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(isDrawerOpen => !isDrawerOpen);
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu((prev) => (prev === label ? null : label));
  };

  const handleLogout = () => {
    setIsLogoutDialogOpen(false);
    navigate('/');
  };

  const menuItems = [
    {
      label: 'Settings',
      subMenu: [
        { label: 'My Page', action: () => navigate('/mypage') },
      ],
    },
    {
      label: 'Logout',
      action: () => setIsLogoutDialogOpen(true),
    },
  ];

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
              {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem onClick={() => (item.subMenu ? toggleSubMenu(item.label) : item.action())}>
                    <ListItemText primary={item.label} />
                    {item.subMenu && (
                      openSubMenu === item.label ? (
                        <ExpandMoreIcon />
                      ) : (
                        <ChevronRightIcon />
                      )
                    )}
                  </ListItem>
                  {item.subMenu && (
                    <Collapse in={openSubMenu === item.label} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subMenu.map((subItem, subIndex) => (
                          <ListItem
                            key={subIndex}
                            sx={{ pl: 4 }}
                            onClick={() => {
                              setIsDrawerOpen(false);
                              subItem.action();
                            }}
                          >
                            <ListItemText primary={subItem.label} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  {index < menuItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
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
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {isMdUp && menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.subMenu ? (
                <Button
                  color="inherit"
                  endIcon={<ExpandMoreIcon />} // 하위 메뉴가 있음을 나타내는 아이콘
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  {item.label}
                </Button>
              ) : (
                <Button
                  color="inherit"
                  sx={{ fontWeight: 'bold' }} // 하위 메뉴가 없는 메뉴는 굵은 텍스트로 표시
                  onClick={item.action}
                >
                  {item.label}
                </Button>
              )}
              {item.subMenu && (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {item.subMenu.map((subItem, subIndex) => (
                    <MenuItem
                      key={subIndex}
                      onClick={() => {
                        setAnchorEl(null);
                        subItem.action();
                      }}
                    >
                      {subItem.label}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Toolbar>

      <Dialog open={isLogoutDialogOpen} onClose={() => setIsLogoutDialogOpen(false)}>
        <DialogTitle>로그아웃 하시겠습니까?</DialogTitle>
        <DialogContent>
          <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setIsLogoutDialogOpen(false)} color="primary" variant="contained" autoFocus>
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