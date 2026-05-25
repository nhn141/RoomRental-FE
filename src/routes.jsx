import { Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';

// Auth Pages
import { Login, RegisterTenant, RegisterLandlord, ForgotPassword, ResetPassword } from './pages/Auth';

// Common Pages
import { Dashboard } from './pages/Dashboard';
import { Unauthorized } from './pages/Error';
import { ChatView } from './pages/Chat';

// Profile Pages
import { ProfileView, EditProfileView, PublicProfileView } from './pages/Profile';

// Rental Post Pages
import {
  RentalPostListView,
  RentalPostDetailView,
  CreateRentalPostView,
  MyRentalPostsView,
  EditRentalPostView,
  RecommendedRoomsView,
} from './pages/RentalPost';

// Admin Pages
import { CreateAdminView, AllUsersView, AdminUserDetailView, AllContractsView } from './pages/Admin';

// Contract Pages
import {
  CreateContractView,
  MyContractsView,
  LandlordContractsView,
  ContractDetailView,
} from './pages/Contract';

/**
 * Application route configuration.
 *
 * Structure:
 *  - Public routes (auth, password reset)
 *  - Protected routes wrapped in MainLayout (header is rendered once)
 */
const routes = [
  // --- Public Routes ---
  { path: '/login', element: <Login /> },
  { path: '/register/tenant', element: <RegisterTenant /> },
  { path: '/register/landlord', element: <RegisterLandlord /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/unauthorized', element: <Unauthorized /> },

  // --- Protected Routes (with MainLayout) ---
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboards
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/landlord',
        element: (
          <ProtectedRoute requiredRole="landlord">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tenant',
        element: (
          <ProtectedRoute requiredRole="tenant">
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // Profile
      { path: '/profile', element: <ProfileView /> },
      { path: '/profile/edit', element: <EditProfileView /> },
      { path: '/users/:id', element: <PublicProfileView /> },

      // Chat
      { path: '/chat', element: <ChatView /> },

      // Rental Posts
      { path: '/rental-posts', element: <RentalPostListView /> },
      {
        path: '/rental-posts/recommendations/my',
        element: (
          <ProtectedRoute requiredRole="tenant">
            <RecommendedRoomsView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rental-posts/create',
        element: (
          <ProtectedRoute requiredRole="landlord">
            <CreateRentalPostView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-rental-posts',
        element: (
          <ProtectedRoute requiredRole="landlord">
            <MyRentalPostsView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rental-posts/:id/edit',
        element: (
          <ProtectedRoute requiredRole="landlord">
            <EditRentalPostView />
          </ProtectedRoute>
        ),
      },
      { path: '/rental-posts/:id', element: <RentalPostDetailView /> },

      // Admin
      {
        path: '/admin/users',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AllUsersView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/users/:id',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminUserDetailView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/contracts',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AllContractsView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/create',
        element: (
          <ProtectedRoute requiredRole="admin">
            <CreateAdminView />
          </ProtectedRoute>
        ),
      },

      // Contracts
      {
        path: '/contracts/create',
        element: (
          <ProtectedRoute requiredRole="tenant">
            <CreateContractView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/contracts/my',
        element: (
          <ProtectedRoute requiredRole="tenant">
            <MyContractsView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/contracts/landlord',
        element: (
          <ProtectedRoute requiredRole="landlord">
            <LandlordContractsView />
          </ProtectedRoute>
        ),
      },
      { path: '/contracts/:id', element: <ContractDetailView /> },
    ],
  },

  // --- Default Route ---
  { path: '/', element: <Navigate to="/login" replace /> },
];

export default routes;
