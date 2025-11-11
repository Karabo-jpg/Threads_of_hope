import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSelector } from 'react-redux';

const Layout = () => {
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
          marginLeft: sidebarOpen ? '240px' : '0px',
          transition: 'margin-left 0.3s',
        }}
      >
        <Header />
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;


