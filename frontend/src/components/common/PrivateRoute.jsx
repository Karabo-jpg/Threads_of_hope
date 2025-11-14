import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, roles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If children is provided, render it (for wrapping components)
  // If not, render Outlet (for nested routes)
  return children || <Outlet />;
};

export default PrivateRoute;


