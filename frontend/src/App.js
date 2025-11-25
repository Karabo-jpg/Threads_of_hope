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
import Children from './pages/ngo/Children';
import RegisterChild from './pages/ngo/RegisterChild';
import Training from './pages/ngo/Training';
import CreateProgram from './pages/ngo/CreateProgram';
import NGODonations from './pages/ngo/NGODonations';
import Collaboration from './pages/ngo/Collaboration';
import WomanDashboard from './pages/woman/Dashboard';
import DonorDashboard from './pages/donor/Dashboard';
import Donations from './pages/donor/Donations';
import NewDonation from './pages/donor/NewDonation';
import ImpactReports from './pages/donor/ImpactReports';
import Messages from './pages/common/Messages';
import Notifications from './pages/common/Notifications';
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
        return <Navigate to="/admin" replace />;
      case 'ngo':
        return <Navigate to="/ngo" replace />;
      case 'woman':
        return <Navigate to="/woman" replace />;
      case 'donor':
        return <Navigate to="/donor" replace />;
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
        <Route path="admin" element={<PrivateRoute roles={['admin']} />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        
        {/* NGO routes */}
        <Route path="ngo" element={<PrivateRoute roles={['ngo', 'admin']} />}>
          <Route index element={<NGODashboard />} />
        </Route>
        <Route path="children" element={<PrivateRoute roles={['ngo', 'admin']} />}>
          <Route index element={<Children />} />
          <Route path="register" element={<RegisterChild />} />
        </Route>
        <Route path="training" element={<PrivateRoute roles={['ngo', 'admin']} />}>
          <Route index element={<Training />} />
          <Route path="create" element={<CreateProgram />} />
        </Route>
        <Route path="donations" element={<PrivateRoute roles={['ngo', 'donor', 'admin']} />}>
          <Route index element={<NGODonations />} />
        </Route>
        <Route path="collaboration" element={<PrivateRoute roles={['ngo', 'admin']} />}>
          <Route index element={<Collaboration />} />
        </Route>
        
        {/* Woman routes */}
        <Route path="woman" element={<PrivateRoute roles={['woman']} />}>
          <Route index element={<WomanDashboard />} />
        </Route>
        
        {/* Donor routes */}
        <Route path="donor" element={<PrivateRoute roles={['donor']} />}>
          <Route index element={<DonorDashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="donations/new" element={<NewDonation />} />
          <Route path="impact" element={<ImpactReports />} />
        </Route>

        {/* Common routes for all authenticated users */}
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;


