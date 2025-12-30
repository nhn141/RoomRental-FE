import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold" to="/">
          🏠 RoomRental
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                {/* Dashboard Link - All Roles */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={
                      user.role === 'admin'
                        ? '/admin'
                        : user.role === 'landlord'
                        ? '/landlord'
                        : '/tenant'
                    }
                  >
                    📊 Dashboard
                  </Link>
                </li>

                {/* Tenant Menu */}
                {user.role === 'tenant' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/rental-posts">
                        🔍 Tìm Phòng
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contracts/my">
                        📋 Hợp Đồng Của Tôi
                      </Link>
                    </li>
                  </>
                )}

                {/* Landlord Menu */}
                {user.role === 'landlord' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/rental-posts/create">
                        ➕ Đăng Phòng
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/my-rental-posts">
                        📝 Bài Đăng Của Tôi
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contracts/landlord">
                        📋 Hợp Đồng
                      </Link>
                    </li>
                  </>
                )}

                {/* Admin Menu */}
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/create">
                        👤 Tạo Admin
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/rental-posts">
                        📋 Quản Lý Bài Đăng
                      </Link>
                    </li>
                  </>
                )}

                {/* Profile & Logout */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    👤 {user.email}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        👤 Hồ Sơ Của Tôi
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile/edit">
                        ✏️ Chỉnh Sửa Hồ Sơ
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                      >
                        🚪 Đăng Xuất
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    🔐 Đăng Nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register/tenant">
                    👤 Đăng Ký Thuê Phòng
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register/landlord">
                    🏠 Đăng Ký Cho Thuê
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
