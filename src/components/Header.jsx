import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    if (!isAccountOpen) return undefined;

    const handlePointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountOpen]);

  const handleLogout = () => {
    setIsAccountOpen(false);
    setIsMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleViewProfile = () => {
    setIsAccountOpen(false);
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'landlord') return '/landlord';
    return '/tenant';
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: 'Quản trị viên',
      landlord: 'Chủ nhà',
      tenant: 'Người thuê',
    };

    return roleMap[role] || role;
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  };

  const renderNavLink = (to, label) => (
    <li className="nav-item">
      <NavLink
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        to={to}
        onClick={closeMenus}
      >
        {label}
      </NavLink>
    </li>
  );

  const renderAvatar = (sizeClass = '') => (
    <span className={`avatar-circle ${sizeClass}`.trim()}>
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt="avatar"
          className="avatar-circle-img"
        />
      ) : (
        user.full_name
          ? user.full_name.charAt(0).toUpperCase()
          : user.email.charAt(0).toUpperCase()
      )}
    </span>
  );

  return (
    <nav className="navbar" aria-label="Điều hướng chính">
      <div className="navbar-inner">
        <Link className="navbar-brand" to={getDashboardPath()} onClick={closeMenus}>
          RoomRental
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Mở menu điều hướng"
          onClick={() => {
            setIsMenuOpen((open) => !open);
            setIsAccountOpen(false);
          }}
        >
          <span className="navbar-toggler-icon" aria-hidden="true" />
        </button>

        <div className={`navbar-collapse${isMenuOpen ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            {user ? (
              <>
                {renderNavLink(getDashboardPath(), 'Dashboard')}

                {user.role === 'tenant' && (
                  <>
                    {renderNavLink('/rental-posts', 'Tìm phòng')}
                    {renderNavLink('/contracts/my', 'Hợp đồng của tôi')}
                  </>
                )}

                {user.role === 'landlord' && (
                  <>
                    {renderNavLink('/rental-posts/create', 'Đăng phòng')}
                    {renderNavLink('/my-rental-posts', 'Bài đăng của tôi')}
                    {renderNavLink('/contracts/landlord', 'Hợp đồng')}
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    {renderNavLink('/admin/create', 'Tạo admin')}
                    {renderNavLink('/rental-posts', 'Quản lý bài đăng')}
                  </>
                )}

                <li className="nav-item account-menu" ref={accountRef}>
                  <button
                    type="button"
                    className="user-avatar"
                    title={user.full_name || user.email}
                    aria-haspopup="menu"
                    aria-expanded={isAccountOpen}
                    onClick={() => setIsAccountOpen((open) => !open)}
                  >
                    {renderAvatar()}
                  </button>

                  {isAccountOpen && (
                    <div className="account-popover" role="menu">
                      <div className="account-summary">
                        {renderAvatar('avatar-circle-lg')}
                        <div className="account-name">{user.full_name || 'Người dùng'}</div>
                        <div className="account-email">{user.email}</div>
                        <div className="account-role">{getRoleDisplay(user.role)}</div>
                      </div>

                      <div className="account-actions">
                        <button type="button" className="account-action-btn" onClick={handleViewProfile}>
                          Xem chi tiết hồ sơ
                        </button>
                        <button type="button" className="account-action-btn account-logout-btn" onClick={handleLogout}>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                {renderNavLink('/login', 'Đăng nhập')}
                {renderNavLink('/register/tenant', 'Đăng ký thuê phòng')}
                {renderNavLink('/register/landlord', 'Đăng ký cho thuê')}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
