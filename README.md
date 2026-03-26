# RoomRental — Frontend

Giao diện người dùng cho hệ thống quản lý thuê phòng trọ. Hỗ trợ 3 vai trò: **Người thuê (Tenant)**, **Chủ nhà (Landlord)**, và **Quản trị viên (Admin)**.

## Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|------------|-----------|----------|
| React | 19 | UI Library |
| Vite | 7 | Build tool & Dev server |
| React Router | 7 | Routing (SPA) |
| Axios | 1.7 | HTTP Client |
| Vitest | 4 | Unit testing |
| ESLint | 9 | Linting |

## Yêu cầu hệ thống

- **Node.js** >= 18
- **npm** >= 9

## Cài đặt & Chạy

```bash
# 1. Clone repo & vào thư mục FE
cd RoomRental-FE

# 2. Cài dependencies
npm install

# 3. Tạo file env từ template
cp .env.example .env.local

# 4. (Tuỳ chỉnh) Sửa giá trị trong .env.local nếu cần
# Mặc định: VITE_API_URL=http://localhost:4000/api

# 5. Chạy development server
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`.

## Scripts

| Lệnh | Mô tả |
|-------|--------|
| `npm run dev` | Chạy dev server (HMR) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Kiểm tra lỗi ESLint |
| `npm test` | Chạy unit tests |
| `npm run test:ui` | Chạy tests với giao diện web |
| `npm run test:coverage` | Chạy tests + báo cáo coverage |

## Cấu trúc thư mục

```
src/
├── components/          # Shared components (Header, ProtectedRoute, Layout)
├── context/             # React Context (AuthContext)
├── hooks/               # Custom hooks (useAuth, useAdmin, useContracts, ...)
├── pages/               # Feature-based page modules
│   ├── Auth/            #   Login, Register, ForgotPassword, ResetPassword
│   ├── Dashboard/       #   Dashboard theo từng vai trò
│   ├── Profile/         #   Xem & chỉnh sửa hồ sơ
│   ├── RentalPost/      #   CRUD bài đăng cho thuê
│   ├── Contract/        #   Quản lý hợp đồng
│   ├── Admin/           #   Quản trị người dùng & hợp đồng
│   └── Error/           #   Trang lỗi (403)
├── services/            # API service layer (axios calls)
├── routes.jsx           # Centralized route configuration
├── App.jsx              # App root (Router + AuthProvider)
└── main.jsx             # Entry point
```

## Biến môi trường

| Biến | Mô tả | Giá trị mặc định |
|------|--------|-------------------|
| `VITE_API_URL` | URL gốc của Backend API | `http://localhost:4000/api` |

> **Lưu ý:** File `.env.local` chứa giá trị thật và **không** được commit vào git. Sử dụng `.env.example` làm template.
