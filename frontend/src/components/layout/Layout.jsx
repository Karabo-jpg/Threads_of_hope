import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSelector } from 'react-redux';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: { xs: 0, md: sidebarOpen ? '240px' : '0px' }, // No margin on mobile
          transition: 'margin-left 0.3s',
          width: { xs: '100%', md: 'auto' }, // Full width on mobile
        }}
      >
        <Header />
        <Box sx={{ 
          flexGrow: 1, 
          p: { xs: 1.5, sm: 2, md: 3 }, // Less padding on mobile
          bgcolor: 'background.default',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden', // Prevent horizontal scroll
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;


