import AdminLogin from '../pages/@admin/login';
import AdminRegister from '../pages/@admin/register';
import AdminDashboard from '../pages/@admin/Dashboard';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Admin route guard component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null; // or a loading spinner
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

const adminRoutes = [
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/register',
    element: <AdminRegister />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: '/admin',
    element: <Navigate to="/admin/dashboard" />,
  },
];

export default adminRoutes; 