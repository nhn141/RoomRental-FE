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
import MyRentalPostsView from './pages/RentalPost/MyRentalPostsView';
import EditRentalPostView from './pages/RentalPost/EditRentalPostView';
import RecommendedRoomsView from './pages/RentalPost/RecommendedRoomsView';

// Admin Pages
import CreateAdminView from './pages/Admin/CreateAdminView';
import AllUsersView from './pages/Admin/AllUsersView';
import AdminUserDetailView from './pages/Admin/AdminUserDetailView';
import AllContractsView from './pages/Admin/AllContractsView';

// Contract Pages
import CreateContractView from './pages/Contract/CreateContractView';
import MyContractsView from './pages/Contract/MyContractsView';
import LandlordContractsView from './pages/Contract/LandlordContractsView';
import ContractDetailView from './pages/Contract/ContractDetailView';

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
            path="/rental-posts/recommendations/my"
            element={
              <ProtectedRoute requiredRole="tenant">
                <RecommendedRoomsView />
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
            path="/my-rental-posts"
            element={
              <ProtectedRoute requiredRole="landlord">
                <MyRentalPostsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rental-posts/:id/edit"
            element={
              <ProtectedRoute requiredRole="landlord">
                <EditRentalPostView />
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
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AllUsersView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUserDetailView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contracts"
            element={
              <ProtectedRoute requiredRole="admin">
                <AllContractsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateAdminView />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Contracts */}
          <Route
            path="/contracts/create"
            element={
              <ProtectedRoute requiredRole="tenant">
                <CreateContractView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts/my"
            element={
              <ProtectedRoute requiredRole="tenant">
                <MyContractsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts/landlord"
            element={
              <ProtectedRoute requiredRole="landlord">
                <LandlordContractsView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts/:id"
            element={
              <ProtectedRoute>
                <ContractDetailView />
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
