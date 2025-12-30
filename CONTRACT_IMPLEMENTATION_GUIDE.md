# CONTRACT SYSTEM - IMPLEMENTATION GUIDE

## ✅ Backend Implementation - COMPLETE

### Files Created/Updated:
1. **[src/models/Contract.js](src/models/Contract.js)** - Database layer with all CRUD operations
2. **[src/controllers/contractController.js](src/controllers/contractController.js)** - 7 endpoints with role-based access
3. **[src/routes/contract.js](src/routes/contract.js)** - 8 contract routes
4. **[src/app.js](src/app.js)** - Updated to register contract routes
5. **[CONTRACT_TESTING_GUIDE.md](CONTRACT_TESTING_GUIDE.md)** - Complete Postman testing guide

### Key Features Implemented:
✅ Create contract (Tenant) - marks rental_post.is_available = false
✅ View my contracts (Tenant)
✅ View landlord contracts (Landlord)
✅ View contract details (with full enriched data)
✅ Update contract (Tenant/Landlord)
✅ Terminate contract (Landlord/Admin) - marks rental_post.is_available = true
✅ Delete contract (Tenant/Landlord/Admin) - marks rental_post.is_available = true
✅ Role-based access control on all endpoints

### Testing:
- Use `CONTRACT_TESTING_GUIDE.md` for complete cURL examples
- All 8 endpoints include request/response examples
- Error scenarios documented

---

## ✅ Frontend Implementation - COMPLETE

### Files Created:

#### 1. Services
**[src/services/contractService.js](src/services/contractService.js)**
- API client for all contract endpoints
- 8 service methods matching backend API
- Uses axios instance with JWT auth

#### 2. Hooks
**[src/hooks/useContracts.js](src/hooks/useContracts.js)**
- State management hook for contracts
- Handles loading, error, and pagination
- Methods: fetchAll, fetchMy, fetchLandlord, fetchById, create, update, terminate, delete
- Auto-refresh lists after mutations

#### 3. Pages/Components

**[src/pages/Contract/CreateContractView.jsx](src/pages/Contract/CreateContractView.jsx)**
- Form for tenant to create new contract
- Fields: post_id, start_date, end_date, monthly_rent, deposit_amount, contract_url
- Validation: date range, amounts, required fields
- Features:
  - Shows post info (title, price, address) if available
  - Prevents duplicate contracts for same post
  - Error handling with user-friendly messages
  - Loading state during submission

**[src/pages/Contract/MyContractsView.jsx](src/pages/Contract/MyContractsView.jsx)**
- Tenant's contract dashboard
- Features:
  - List all tenant's contracts
  - Filter by status (all, active, terminated)
  - Card view with key info: title, landlord, rent, dates
  - Actions: View detail, Delete (if active)
  - Count badges for each status

**[src/pages/Contract/LandlordContractsView.jsx](src/pages/Contract/LandlordContractsView.jsx)**
- Landlord's contract management dashboard
- Features:
  - List all landlord's contracts
  - Filter by status (all, active, terminated)
  - Card view with key info: title, tenant, rent, dates
  - Actions: View detail, Terminate (if active)
  - Count badges for each status

**[src/pages/Contract/ContractDetailView.jsx](src/pages/Contract/ContractDetailView.jsx)**
- Full contract detail page
- Features:
  - Post information (address, location, price)
  - Tenant and landlord information with contact details
  - Contract terms (dates, financial details)
  - PDF contract link (if available)
  - Role-based actions:
    - Landlord: Terminate contract
    - Tenant: Delete contract
    - Admin: Full access
  - Status display and timestamps

**[src/components/Header.jsx](src/components/Header.jsx)** - New!
- Responsive navigation bar
- Role-based menu items:
  - **Tenant**: Dashboard, Find Room, My Contracts
  - **Landlord**: Dashboard, Create Post, My Posts, Contracts
  - **Admin**: Dashboard, Create Admin, Manage Posts
- Profile dropdown with edit profile & logout
- Mobile-friendly hamburger menu

**[src/components/Header.css](src/components/Header.css)** - New!
- Modern gradient styling
- Responsive design
- Hover effects and animations

#### 4. Styles
**[src/pages/Contract/Contract.css](src/pages/Contract/Contract.css)**
- Common styles for all contract pages
- Card hover effects
- Form styling
- Badge styles
- Responsive grid layouts
- Status color schemes
- Empty state styling

#### 5. Updated Files
**[src/App.jsx](src/App.jsx)**
- Added imports for all contract components
- 4 new routes:
  - `/contracts/create` - CreateContractView (Tenant)
  - `/contracts/my` - MyContractsView (Tenant)
  - `/contracts/landlord` - LandlordContractsView (Landlord)
  - `/contracts/:id` - ContractDetailView (All)

**[src/pages/Dashboard.jsx](src/pages/Dashboard.jsx)**
- Integrated Header component
- Added contract links to role-specific cards:
  - Tenant: "📋 Hợp Đồng Của Tôi" → /contracts/my
  - Landlord: "📋 Hợp Đồng Của Tôi" → /contracts/landlord

---

## 🎯 NAVIGATION STRUCTURE

```
┌─ Header (Global)
│  ├─ Logo: 🏠 RoomRental
│  ├─ Tenant Menu:
│  │  ├─ 📊 Dashboard
│  │  ├─ 🔍 Tìm Phòng → /rental-posts
│  │  ├─ 📋 Hợp Đồng Của Tôi → /contracts/my
│  │  └─ Profile Dropdown
│  │
│  ├─ Landlord Menu:
│  │  ├─ 📊 Dashboard
│  │  ├─ ➕ Đăng Phòng → /rental-posts/create
│  │  ├─ 📝 Bài Đăng Của Tôi → /my-rental-posts
│  │  ├─ 📋 Hợp Đồng → /contracts/landlord
│  │  └─ Profile Dropdown
│  │
│  ├─ Admin Menu:
│  │  ├─ 📊 Dashboard
│  │  ├─ 👤 Tạo Admin → /admin/create
│  │  ├─ 📋 Quản Lý Bài Đăng → /rental-posts
│  │  └─ Profile Dropdown
│  │
│  └─ Not Logged In:
│     ├─ 🔐 Đăng Nhập
│     ├─ 👤 Đăng Ký Thuê
│     └─ 🏠 Đăng Ký Cho Thuê
│
├─ Dashboard Cards (All Roles)
│  ├─ Tenant:
│  │  ├─ 🔍 Tìm Kiếm Phòng
│  │  ├─ 📋 Hợp Đồng Của Tôi
│  │  └─ 👤 Hồ Sơ Cá Nhân
│  │
│  ├─ Landlord:
│  │  ├─ ➕ Đăng Bài Cho Thuê
│  │  ├─ 📝 Quản Lý Bài Đăng
│  │  └─ 📋 Hợp Đồng Của Tôi
│  │
│  └─ Admin:
│     ├─ 👤 Tạo Admin
│     ├─ 📋 Duyệt Bài Đăng
│     └─ 📊 Báo Cáo
│
├─ Contract Pages:
│  ├─ /contracts/create → CreateContractView (Tenant)
│  ├─ /contracts/my → MyContractsView (Tenant)
│  ├─ /contracts/landlord → LandlordContractsView (Landlord)
│  └─ /contracts/:id → ContractDetailView (All Roles)
│
└─ Rental Post Pages (Existing)
   ├─ /rental-posts → RentalPostListView
   ├─ /rental-posts/:id → RentalPostDetailView
   ├─ /rental-posts/create → CreateRentalPostView (Landlord)
   ├─ /my-rental-posts → MyRentalPostsView (Landlord)
   └─ /rental-posts/:id/edit → EditRentalPostView (Landlord)
```

---

## 🧪 TESTING WORKFLOW

### Step 1: Backend Testing
```bash
# Navigate to backend
cd RoomRental-BE

# Start server
npm start

# Test all endpoints using CONTRACT_TESTING_GUIDE.md
# Use provided cURL commands in Postman or terminal
```

### Step 2: Frontend Development
```bash
# Navigate to frontend
cd RoomRental-FE

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Server runs at http://localhost:5173
```

### Step 3: Test User Flows

#### Tenant Flow:
1. Login as tenant
2. Dashboard → 🔍 Tìm Phòng
3. Click rental post → Create Contract button
4. Fill form and create contract
5. Dashboard → 📋 Hợp Đồng Của Tôi (view created contract)
6. Click contract → View details
7. Options: Delete (if active) or view PDF

#### Landlord Flow:
1. Login as landlord
2. Dashboard → 📋 Hợp Đồng
3. View all received contracts
4. Click contract → View details
5. Options: Terminate (if active)
6. See rental_post.is_available = false when contract active

#### Admin Flow:
1. Login as admin
2. View any role's contracts
3. Manage/terminate contracts as needed

---

## 🔗 KEY INTEGRATION POINTS

### 1. Contract Creation Flow
```
Tenant clicks "Create Contract" on rental post detail
  ↓
Navigate to /contracts/create?post_id={post_id}
  ↓
CreateContractView loads and shows post info
  ↓
User fills form (dates, amounts)
  ↓
contractService.createContract() called
  ↓
Backend validates and creates contract
  ↓
rental_posts.is_available = false
  ↓
Redirect to /contracts/my
```

### 2. is_available Synchronization
```
Create Contract → is_available = FALSE (post unavailable)
Delete Contract → is_available = TRUE (post available)
Terminate Contract → is_available = TRUE (post available)
```

### 3. Role-Based Access
- **Tenant**: Can create, view own, delete own contracts
- **Landlord**: Can view own, update, terminate contracts
- **Admin**: Can view all, manage all contracts

---

## 📋 NEXT STEPS / ENHANCEMENTS (Optional)

1. **Notifications**
   - Notify landlord when tenant creates contract
   - Notify tenant when contract is terminated

2. **Payment Integration**
   - Add payment status tracking
   - Deposit payment tracking

3. **Document Management**
   - Upload contract PDF via form
   - Digital signature support

4. **Reporting**
   - Monthly rent tracking
   - Contract history export

5. **Real-time Updates**
   - WebSocket for live contract updates
   - Status change notifications

---

## 📚 FILE STRUCTURE SUMMARY

```
RoomRental-FE/
├── src/
│   ├── components/
│   │   ├── Header.jsx (NEW - Navigation bar)
│   │   ├── Header.css (NEW - Header styles)
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Contract/ (NEW)
│   │   │   ├── CreateContractView.jsx
│   │   │   ├── MyContractsView.jsx
│   │   │   ├── LandlordContractsView.jsx
│   │   │   ├── ContractDetailView.jsx
│   │   │   └── Contract.css
│   │   ├── Dashboard.jsx (UPDATED - Header + new cards)
│   │   ├── Profile/
│   │   │   ├── ProfileView.jsx
│   │   │   └── EditProfileView.jsx
│   │   └── RentalPost/
│   ├── services/
│   │   ├── contractService.js (NEW)
│   │   ├── rentalPostService.js
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   └── api.js
│   ├── hooks/
│   │   ├── useContracts.js (NEW)
│   │   ├── useRentalPosts.js
│   │   ├── useProfile.js
│   │   └── useAdmin.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx (UPDATED - Contract routes)
│   └── main.jsx
└── package.json

RoomRental-BE/
├── src/
│   ├── controllers/
│   │   ├── contractController.js (NEW - 7 endpoints)
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   └── rentalPostController.js
│   ├── routes/
│   │   ├── contract.js (NEW - 8 routes)
│   │   ├── auth.js
│   │   ├── profile.js
│   │   └── rentalPost.js
│   ├── models/
│   │   ├── Contract.js (UPDATED)
│   │   ├── RentalPost.js
│   │   ├── User.js
│   │   ├── Tenant.js
│   │   ├── Landlord.js
│   │   └── Admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── app.js (UPDATED - contract routes)
│   └── index.js
├── CONTRACT_TESTING_GUIDE.md (NEW)
└── package.json
```

---

## ✨ FEATURES CHECKLIST

### Backend
- [x] Contract Model with all CRUD methods
- [x] Contract Controller with 7 endpoints
- [x] Contract Routes (8 total)
- [x] Role-based access control
- [x] is_available synchronization
- [x] Validation and error handling
- [x] Duplicate contract prevention
- [x] Postman testing guide

### Frontend
- [x] Contract Service (API client)
- [x] useContracts Hook (state management)
- [x] CreateContractView (Tenant form)
- [x] MyContractsView (Tenant dashboard)
- [x] LandlordContractsView (Landlord dashboard)
- [x] ContractDetailView (Full details page)
- [x] Header Navigation (role-based)
- [x] Contract Styling (responsive)
- [x] App Routes (4 contract routes)
- [x] Dashboard Integration (contract links)

---

## 🚀 DEPLOYMENT READY

All files are production-ready with:
✅ Error handling
✅ Input validation
✅ Loading states
✅ Responsive design
✅ Accessibility considerations
✅ Performance optimizations
✅ Security (JWT auth, role-based)

---

**Happy coding! 🎉**

For questions or issues, refer to:
- Backend: `CONTRACT_TESTING_GUIDE.md`
- Architecture: `RoomRental-FE/ARCHITECTURE.md`
- Database schema: Backend models in `src/models/`
