import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Home from './Home';
import ResourceCataloguePage from './ResourceCataloguePage';
import Login from './Login';
import Register from './Register';
import Welcome from './Welcome';
import Bookings from './Bookings';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import OAuth2Callback from './OAuth2Callback';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading session...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If an admin is trying to access a user-only route, redirect to admin panel
    const adminRoles = ['ADMIN', 'SUPER_ADMIN'];
    if (adminRoles.includes(user.role)) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourceCataloguePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        
        <Route path="/bookings" element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['USER', 'TECHNICIAN', 'MANAGER']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
