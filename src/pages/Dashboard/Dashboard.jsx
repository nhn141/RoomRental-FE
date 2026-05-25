import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: 'Quản trị viên',
      landlord: 'Chủ nhà',
      tenant: 'Người thuê',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-content">
        <div className="welcome-card">
          <div className="welcome-text">
            <span className="welcome-label">Xin chào</span>
            <h2>{user?.full_name || 'Người dùng'}</h2>
          </div>
          <div className="welcome-meta">
            <span className="role-pill">{getRoleDisplay(user?.role)}</span>
            <span className="welcome-email">{user?.email}</span>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="role-specific-content">
            <h3>Bảng điều khiển quản trị</h3>
            <div className="cards-grid">
              <Link to="/admin/users" className="card">
                <h4>Xem tất cả người dùng</h4>
                <p>Quản lý và xem danh sách tất cả người dùng</p>
              </Link>
              <Link to="/admin/contracts" className="card">
                <h4>Xem tất cả hợp đồng</h4>
                <p>Xem danh sách tất cả hợp đồng trong hệ thống</p>
              </Link>
              <Link to="/admin/create" className="card">
                <h4>Tạo admin</h4>
                <p>Tạo tài khoản quản trị viên mới</p>
              </Link>
              <Link to="/rental-posts?status=pending" className="card">
                <h4>Duyệt bài đăng</h4>
                <p>Duyệt và quản lý các bài đăng cho thuê</p>
              </Link>
            </div>
          </div>
        )}

        {user?.role === 'landlord' && (
          <div className="role-specific-content">
            <h3>Bảng điều khiển chủ nhà</h3>
            <div className="cards-grid">
              <Link to="/rental-posts/create" className="card">
                <h4>Đăng bài cho thuê</h4>
                <p>Tạo bài đăng cho các phòng cho thuê</p>
              </Link>
              <Link to="/my-rental-posts" className="card">
                <h4>Quản lý bài đăng</h4>
                <p>Chỉnh sửa, xóa hoặc ẩn bài đăng</p>
              </Link>
              <Link to="/contracts/landlord" className="card">
                <h4>Hợp đồng của tôi</h4>
                <p>Quản lý hợp đồng thuê phòng</p>
              </Link>
            </div>
          </div>
        )}

        {user?.role === 'tenant' && (
          <div className="role-specific-content">
            <h3>Bảng điều khiển người thuê</h3>
            <div className="cards-grid">
              <Link to="/rental-posts/recommendations/my" className="card">
                <h4>Phòng được gợi ý</h4>
                <p>Xem phòng phù hợp với yêu cầu của bạn</p>
              </Link>
              <Link to="/rental-posts" className="card">
                <h4>Tìm kiếm phòng</h4>
                <p>Duyệt các bài đăng phòng cho thuê</p>
              </Link>
              <Link to="/contracts/my" className="card">
                <h4>Hợp đồng của tôi</h4>
                <p>Xem lịch sử hợp đồng thuê phòng</p>
              </Link>
              <Link to="/profile" className="card">
                <h4>Hồ sơ cá nhân</h4>
                <p>Cập nhật thông tin cá nhân</p>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
