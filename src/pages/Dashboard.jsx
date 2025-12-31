import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: 'Quản Trị Viên',
      landlord: 'Chủ Nhà',
      tenant: 'Người Thuê',
    };
    return roleMap[role] || role;
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <main className="dashboard-content">
          <div className="welcome-card">
            <h2>Chào mừng, {user?.full_name}!</h2>
            <p>Bạn đang đăng nhập với vai trò: <strong>{getRoleDisplay(user?.role)}</strong></p>
            <p>Email: {user?.email}</p>
          </div>

          {user?.role === 'admin' && (
            <div className="role-specific-content">
              <h3>Bảng Điều Khiển Quản Trị</h3>
              <div className="cards-grid">
                <Link to="/admin/users" className="card">
                  <h4>👥 Xem Tất Cả Người Dùng</h4>
                  <p>Quản lý và xem danh sách tất cả người dùng</p>
                </Link>
                <Link to="/admin/contracts" className="card">
                  <h4>📋 Xem Tất Cả Hợp Đồng</h4>
                  <p>Xem danh sách tất cả hợp đồng trong hệ thống</p>
                </Link>
                <Link to="/admin/create" className="card">
                  <h4>👤 Tạo Admin</h4>
                  <p>Tạo tài khoản quản trị viên mới</p>
                </Link>
                <Link to="/rental-posts?status=pending" className="card">
                  <h4>📋 Duyệt Bài Đăng</h4>
                  <p>Duyệt và quản lý các bài đăng cho thuê</p>
                </Link>
              </div>
            </div>
          )}

          {user?.role === 'landlord' && (
            <div className="role-specific-content">
              <h3>Bảng Điều Khiển Chủ Nhà</h3>
              <div className="cards-grid">
                <Link to="/rental-posts/create" className="card">
                  <h4>➕ Đăng Bài Cho Thuê</h4>
                  <p>Tạo bài đăng cho các phòng cho thuê</p>
                </Link>
                <Link to="/my-rental-posts" className="card">
                  <h4>📝 Quản Lý Bài Đăng</h4>
                  <p>Chỉnh sửa, xóa hoặc ẩn bài đăng</p>
                </Link>
                <Link to="/contracts/landlord" className="card">
                  <h4>📋 Hợp Đồng Của Tôi</h4>
                  <p>Quản lý hợp đồng thuê phòng</p>
                </Link>
              </div>
            </div>
          )}

          {user?.role === 'tenant' && (
            <div className="role-specific-content">
              <h3>Bảng Điều Khiển Người Thuê</h3>
              <div className="cards-grid">
                <Link to="/rental-posts/recommendations/my" className="card">
                  <h4>🎯 Phòng Được Gợi Ý</h4>
                  <p>Xem phòng phù hợp với yêu cầu của bạn</p>
                </Link>
                <Link to="/rental-posts" className="card">
                  <h4>🔍 Tìm Kiếm Phòng</h4>
                  <p>Duyệt các bài đăng phòng cho thuê</p>
                </Link>
                <Link to="/contracts/my" className="card">
                  <h4>📋 Hợp Đồng Của Tôi</h4>
                  <p>Xem lịch sử hợp đồng thuê phòng</p>
                </Link>
                <Link to="/profile" className="card">
                  <h4>👤 Hồ Sơ Cá Nhân</h4>
                  <p>Cập nhật thông tin cá nhân</p>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
