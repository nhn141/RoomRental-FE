# 📱 Room Rental FE - MVVM Architecture Documentation

## 📂 Cấu Trúc Thư Mục

```
src/
├── services/              # Model Layer - API calls
│   ├── api.js            # Axios config
│   ├── authService.js    # Auth API
│   ├── profileService.js # Profile API
│   ├── rentalPostService.js # RentalPost API
│   └── adminService.js   # Admin API
│
├── hooks/                 # ViewModel Layer - Business Logic
│   ├── useProfile.js     # Profile logic
│   ├── useRentalPosts.js # RentalPosts logic
│   └── useAdmin.js       # Admin logic
│
├── pages/                 # View Layer - UI Components
│   ├── Login.jsx
│   ├── RegisterTenant.jsx
│   ├── RegisterLandlord.jsx
│   ├── Dashboard.jsx
│   ├── Profile/
│   │   ├── ProfileView.jsx
│   │   └── EditProfileView.jsx
│   ├── RentalPost/
│   │   ├── RentalPostListView.jsx
│   │   ├── RentalPostDetailView.jsx
│   │   └── CreateRentalPostView.jsx
│   └── Admin/
│       └── CreateAdminView.jsx
│
├── context/              # State Management
│   └── AuthContext.jsx
│
├── components/           # Shared Components
│   └── ProtectedRoute.jsx
│
└── App.jsx              # Main App & Routing
```

## 🏗️ MVVM Pattern Explanation

### 1. **Model Layer** (`services/`)
Chịu trách nhiệm gọi API BE

```js
// profileService.js
const profileService = {
  getProfile: async () => { /* API call */ },
  updateProfile: async (data) => { /* API call */ },
};
```

### 2. **ViewModel Layer** (`hooks/`)
Quản lý state và business logic

```js
// useProfile.js
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchProfile = useCallback(async () => { /* logic */ }, []);
  const updateProfile = useCallback(async (data) => { /* logic */ }, []);
  
  return { profile, loading, fetchProfile, updateProfile };
};
```

### 3. **View Layer** (`pages/`)
Hiển thị UI, sử dụng ViewModel

```js
// ProfileView.jsx
const ProfileView = () => {
  const { profile, loading, fetchProfile } = useProfile();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  return <div>{ /* UI */ }</div>;
};
```

## 🔗 Routing Map

### Public Routes
- `/login` - Đăng nhập cho 3 roles
- `/register/tenant` - Đăng ký Tenant
- `/register/landlord` - Đăng ký Landlord
- `/unauthorized` - Trang lỗi 403

### Protected Routes - Profile
- `/profile` - Xem profile
- `/profile/edit` - Sửa profile

### Protected Routes - Rental Posts
- `/rental-posts` - Danh sách bài đăng
- `/rental-posts/create` - Tạo bài đăng (Landlord only)
- `/rental-posts/:id` - Chi tiết bài đăng

### Protected Routes - Admin
- `/admin/create` - Tạo admin mới (Admin only)

### Role-based Dashboards
- `/admin` - Admin Dashboard (Admin only)
- `/landlord` - Landlord Dashboard (Landlord only)
- `/tenant` - Tenant Dashboard (Tenant only)

## 📊 Data Flow

```
User Action
    ↓
View (Component)
    ↓
ViewModel (Hook) - xử lý logic
    ↓
Model (Service) - gọi API
    ↓
Backend API
    ↓
Response
    ↓
ViewModel - update state
    ↓
View - re-render
```

## 🎯 Một số ví dụ sử dụng

### Ví dụ 1: Fetch Profile
```js
const { profile, loading, fetchProfile } = useProfile();

useEffect(() => {
  fetchProfile(); // Gọi API, tự động set state
}, [fetchProfile]);
```

### Ví dụ 2: Fetch & Filter Rental Posts
```js
const { posts, fetchAllPosts } = useRentalPosts();

useEffect(() => {
  fetchAllPosts({ status: 'approved' }); // Có thể truyền params
}, []);
```

### Ví dụ 3: Create Rental Post
```js
const { createPost, loading, error } = useRentalPosts();

const handleSubmit = async (data) => {
  try {
    await createPost(data); // Tự động handle error
    navigate('/rental-posts');
  } catch (err) {
    console.error(err);
  }
};
```

## 🔐 Protected Routes

```js
<Route
  path="/profile"
  element={
    <ProtectedRoute>  {/* Bất kỳ user đã login */}
      <ProfileView />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/create"
  element={
    <ProtectedRoute requiredRole="admin">  {/* Admin only */}
      <CreateAdminView />
    </ProtectedRoute>
  }
/>
```

## 📡 Tất cả các API Endpoints

### Auth
- `POST /auth/tenant/register`
- `POST /auth/tenant/login`
- `POST /auth/landlord/register`
- `POST /auth/landlord/login`
- `POST /auth/admin/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`

### Profile
- `GET /profile` - Xem profile
- `PUT /profile/edit-profile` - Cập nhật profile

### Rental Posts
- `GET /rental-posts` - Danh sách tất cả
- `GET /rental-posts/my/posts` - Bài của tôi (Landlord)
- `GET /rental-posts/:id` - Chi tiết
- `POST /rental-posts` - Tạo mới (Landlord)
- `PUT /rental-posts/:id` - Cập nhật (Landlord)
- `DELETE /rental-posts/:id` - Xóa (Landlord)
- `PUT /rental-posts/approve` - Duyệt (Admin)
- `PUT /rental-posts/reject` - Từ chối (Admin)

### Admin
- `POST /admins/create` - Tạo admin mới (Admin)

## 💡 Best Practices

1. **Luôn sử dụng Hooks** - Không trực tiếp gọi service trong component
2. **Error Handling** - Hooks đã tích hợp try-catch
3. **Loading State** - Hiển thị loading indicator khi cần
4. **Type-safe** - Dùng PropTypes hoặc TypeScript (tuỳ chọn)
5. **Code Reusability** - Các hooks có thể dùng lại trong nhiều components

## 🚀 Cách Deploy

```bash
# Cài dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

**API URL**: `http://localhost:4000/api` (cấu hình trong `.env.local`)
