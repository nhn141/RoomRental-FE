import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Room Rental</h1>
        </div>
        <div className="navbar-user">
          <span className="user-role">{getRoleDisplay(user?.role)}</span>
          <span className="user-name">{user?.full_name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Đăng Xuất
          </button>
        </div>
      </nav>

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
              <div className="card">
                <h4>Quản Lý Người Dùng</h4>
                <p>Quản lý tất cả người dùng trong hệ thống</p>
              </div>
              <div className="card">
                <h4>Quản Lý Bài Đăng</h4>
                <p>Duyệt và quản lý các bài đăng cho thuê</p>
              </div>
              <div className="card">
                <h4>Báo Cáo</h4>
                <p>Xem báo cáo và thống kê hệ thống</p>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'landlord' && (
          <div className="role-specific-content">
            <h3>Bảng Điều Khiển Chủ Nhà</h3>
            <div className="cards-grid">
              <div className="card">
                <h4>Đăng Bài Cho Thuê</h4>
                <p>Tạo bài đăng cho các phòng cho thuê</p>
              </div>
              <div className="card">
                <h4>Quản Lý Bài Đăng</h4>
                <p>Chỉnh sửa, xóa hoặc ẩn bài đăng</p>
              </div>
              <div className="card">
                <h4>Quản Lý Yêu Cầu</h4>
                <p>Xem các yêu cầu từ người thuê</p>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'tenant' && (
          <div className="role-specific-content">
            <h3>Bảng Điều Khiển Người Thuê</h3>
            <div className="cards-grid">
              <div className="card">
                <h4>Tìm Kiếm Phòng</h4>
                <p>Duyệt các bài đăng phòng cho thuê</p>
              </div>
              <div className="card">
                <h4>Yêu Cầu Của Tôi</h4>
                <p>Xem lịch sử các yêu cầu thuê phòng</p>
              </div>
              <div className="card">
                <h4>Hồ Sơ Cá Nhân</h4>
                <p>Cập nhật thông tin cá nhân</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
