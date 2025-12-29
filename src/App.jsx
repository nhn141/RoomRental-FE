import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import RegisterTenant from './pages/RegisterTenant';
import RegisterLandlord from './pages/RegisterLandlord';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Common Pages
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';

// Profile Pages
import ProfileView from './pages/Profile/ProfileView';
import EditProfileView from './pages/Profile/EditProfileView';

// Rental Post Pages
import RentalPostListView from './pages/RentalPost/RentalPostListView';
import RentalPostDetailView from './pages/RentalPost/RentalPostDetailView';
import CreateRentalPostView from './pages/RentalPost/CreateRentalPostView';

// Admin Pages
import CreateAdminView from './pages/Admin/CreateAdminView';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Password reset flows */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/tenant" element={<RegisterTenant />} />
          <Route path="/register/landlord" element={<RegisterLandlord />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes - Dashboards */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landlord"
            element={
              <ProtectedRoute requiredRole="landlord">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant"
            element={
              <ProtectedRoute requiredRole="tenant">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfileView />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Rental Posts */}
          <Route
            path="/rental-posts"
            element={
              <ProtectedRoute>
                <RentalPostListView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rental-posts/create"
            element={
              <ProtectedRoute requiredRole="landlord">
                <CreateRentalPostView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rental-posts/:id"
            element={
              <ProtectedRoute>
                <RentalPostDetailView />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateAdminView />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
