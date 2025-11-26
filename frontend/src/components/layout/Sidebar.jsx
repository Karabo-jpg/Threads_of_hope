import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ChildCare as ChildCareIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
  Handshake as HandshakeIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { toggleSidebar } from '../../store/slices/uiSlice';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const getMenuItems = () => {
    const commonItems = [
      { text: t('nav.dashboard'), icon: <DashboardIcon />, path: '/' },
      { text: t('nav.messages'), icon: <MessageIcon />, path: '/messages' },
      { text: t('nav.notifications'), icon: <NotificationsIcon />, path: '/notifications' },
    ];

    const roleItems = {
      admin: [
        ...commonItems,
        { text: t('nav.admin'), icon: <AdminIcon />, path: '/admin' },
        { text: t('nav.children'), icon: <ChildCareIcon />, path: '/ngo/children' },
        { text: t('nav.training'), icon: <SchoolIcon />, path: '/ngo/training' },
        { text: t('nav.donations'), icon: <FavoriteIcon />, path: '/ngo/donations' },
        { text: t('nav.collaboration'), icon: <HandshakeIcon />, path: '/ngo/collaboration' },
      ],
      ngo: [
        ...commonItems,
        { text: t('nav.children'), icon: <ChildCareIcon />, path: '/ngo/children' },
        { text: t('nav.training'), icon: <SchoolIcon />, path: '/ngo/training' },
        { text: t('nav.donations'), icon: <FavoriteIcon />, path: '/ngo/donations' },
        { text: t('nav.collaboration'), icon: <HandshakeIcon />, path: '/ngo/collaboration' },
      ],
      woman: [
        ...commonItems,
        { text: t('nav.training'), icon: <SchoolIcon />, path: '/woman/training' },
      ],
      donor: [
        { text: t('nav.dashboard'), icon: <DashboardIcon />, path: '/donor' },
        { text: t('nav.donations'), icon: <FavoriteIcon />, path: '/donor/donations' },
        { text: 'Impact Reports', icon: <HandshakeIcon />, path: '/donor/impact' },
        { text: t('nav.messages'), icon: <MessageIcon />, path: '/messages' },
        { text: t('nav.notifications'), icon: <NotificationsIcon />, path: '/notifications' },
      ],
    };

    return roleItems[user?.role] || commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'primary.main',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight="bold" align="center">
          Threads of Hope
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;


