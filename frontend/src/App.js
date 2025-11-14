import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeSocket } from './services/socketService';

// Components
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import NGODashboard from './pages/ngo/Dashboard';
import WomanDashboard from './pages/woman/Dashboard';
import DonorDashboard from './pages/donor/Dashboard';
import Donations from './pages/donor/Donations';
import NewDonation from './pages/donor/NewDonation';
import ImpactReports from './pages/donor/ImpactReports';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      const store = { dispatch };
      initializeSocket(user.id, store);
    }
  }, [user, dispatch]);

  // Route based on user role
  const getDashboardRoute = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'ngo':
        return <NGODashboard />;
      case 'woman':
        return <WomanDashboard />;
      case 'donor':
        return <DonorDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={getDashboardRoute()} />
        
        {/* Admin routes */}
        <Route path="admin/*" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        
        {/* NGO routes */}
        <Route path="ngo/*" element={<PrivateRoute roles={['ngo', 'admin']}><NGODashboard /></PrivateRoute>} />
        
        {/* Woman routes */}
        <Route path="woman/*" element={<PrivateRoute roles={['woman']}><WomanDashboard /></PrivateRoute>} />
        
        {/* Donor routes */}
        <Route path="donor" element={<PrivateRoute roles={['donor']} />}>
          <Route index element={<DonorDashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="donations/new" element={<NewDonation />} />
          <Route path="impact" element={<ImpactReports />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;


