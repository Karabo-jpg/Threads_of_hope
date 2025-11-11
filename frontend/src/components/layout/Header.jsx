import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Select,
  FormControl,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { setLanguage } from '../../store/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const { language } = useSelector((state) => state.ui);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    dispatch(setLanguage(newLang));
    i18n.changeLanguage(newLang);
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ bgcolor: 'white', color: 'text.primary' }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('common.welcome')}, {user?.firstName}!
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Language selector */}
          <FormControl size="small" variant="outlined">
            <Select
              value={language}
              onChange={handleLanguageChange}
              sx={{ minWidth: 80 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="sw">Swahili</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
            </Select>
          </FormControl>

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={() => navigate('/notifications')}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile menu */}
          <IconButton
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              alt={user?.firstName}
              src={user?.profilePicture}
              sx={{ width: 32, height: 32 }}
            >
              {user?.firstName?.[0]}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              {t('nav.profile')}
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
              {t('nav.settings')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              {t('common.logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


