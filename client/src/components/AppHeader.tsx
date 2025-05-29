import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Collapse,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  logoutAsync,
  selectIsAuthenticated,
  selectUser,
  selectIsAdmin
} from '../store/authSlice';
import { selectSiteName } from '../store/siteSlice';

interface MenuItem {
  label: string;
  action?: () => void | Promise<void>;
  subMenu?: { label: string; action: () => void | Promise<void>; }[];
}

function AppHeader() {
  const navigate = useNavigate();  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const siteName = useAppSelector(selectSiteName);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSubMenu, setCurrentSubMenu] = useState<MenuItem | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const isMdUp = useMediaQuery('(min-width:1360px)');

  const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(isDrawerOpen => !isDrawerOpen);
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu((prev) => (prev === label ? null : label));
  };

  const handleLogout = async () => {
    setIsLogoutDialogOpen(false);
    await dispatch(logoutAsync());
    navigate('/');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: MenuItem) => {
    if (item.subMenu) {
      setAnchorEl(event.currentTarget);
      setCurrentSubMenu(item);
    } else if (item.action) {
      item.action();
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentSubMenu(null);
  };

  // 로그인되지 않은 사용자용 메뉴
  const guestMenuItems: MenuItem[] = [
    {
      label: '로그인',
      action: () => navigate('/login'),
    },
    // {
    //   label: '회원가입',
    //   action: () => navigate('/register'),
    // },
  ];

  // 로그인된 사용자용 메뉴
  const userMenuItems: MenuItem[] = [
    ...(isAdmin ? [{
      label: '관리자',
      subMenu: [
        { label: '관리자 대시보드', action: () => navigate('/admin') },
        { label: '사용자 관리', action: () => navigate('/admin/users') },
        { label: '콘텐츠 관리', action: () => navigate('/admin/contents') },
      ],
    }] : []),
    {
      label: user?.name || '사용자',
      subMenu: [
        { label: '마이페이지', action: () => navigate('/mypage') },
        { label: '콘텐츠 등록', action: () => navigate('/register') },
      ],
    },
    {
      label: '로그아웃',
      action: () => setIsLogoutDialogOpen(true),
    },
  ];

  const menuItems = isAuthenticated ? userMenuItems : guestMenuItems;

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 1201, boxShadow: 3, height: '64px' }}>
      <Toolbar sx={{ minHeight: '64px', display: 'flex', justifyContent: 'space-between' }}>
        {/* 왼쪽 영역 - 모바일 메뉴 */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          {isMdUp == false && (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                // sx={{ display: { xs: 'block', md: 'none' } }}
                onClick={toggleDrawer()}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer()}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  zIndex: 1200,
                  '& .MuiDrawer-paper': {
                    marginTop: '64px',
                  },
                }}
              >
                <List>
                  {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem onClick={() => (item.subMenu ? toggleSubMenu(item.label) : item.action?.())}>
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
            </>
          )}
        </Box>        
        
        {/* 중앙 영역 - 로고 */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            {siteName}
          </Typography>
        </Box>

        {/* 오른쪽 영역 - 데스크톱 메뉴 */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
          {isAuthenticated && user &&  (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                {isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'inherit' }}>
                {user.name}
              </Typography>
            </Box>
          )}

          {isMdUp && menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <Button
                color="inherit"
                endIcon={item.subMenu ? <ExpandMoreIcon /> : undefined}
                onClick={(event) => handleMenuClick(event, item)}
                sx={{ fontWeight: item.subMenu ? 'normal' : 'bold' }}
              >
                {item.label}
              </Button>
            </React.Fragment>
          ))}

          {/* 서브메뉴 드롭다운 */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && Boolean(currentSubMenu)}
            onClose={handleMenuClose}
          >
            {currentSubMenu?.subMenu?.map((subItem, subIndex) => (
              <MenuItem
                key={subIndex}
                onClick={() => {
                  handleMenuClose();
                  subItem.action();
                }}
              >
                {subItem.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>

      {/* 로그아웃 확인 다이얼로그 */}
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