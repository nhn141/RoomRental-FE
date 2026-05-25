import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRealtime } from '../context/RealtimeContext';
import './Header.css';

const BellIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

const Header = () => {
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useRealtime();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const accountRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!isAccountOpen && !isNotificationOpen) return undefined;

    const handlePointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsAccountOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountOpen, isNotificationOpen]);

  const handleLogout = () => {
    setIsAccountOpen(false);
    setIsNotificationOpen(false);
    setIsMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleViewProfile = () => {
    setIsAccountOpen(false);
    setIsNotificationOpen(false);
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification);
    } catch (error) {
      console.error('Mark notification read error', error);
    }

    setIsNotificationOpen(false);
    setIsAccountOpen(false);
    setIsMenuOpen(false);

    const conversationId = notification.metadata?.conversation_id;
    const link = notification.link_url || (conversationId ? `/chat?conversationId=${conversationId}` : null);
    if (link) {
      navigate(link);
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error('Mark all notifications read error', error);
    }
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
    setIsNotificationOpen(false);
  };

  const formatNotificationTime = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                {renderNavLink('/chat', 'Tin nhắn')}

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

                <li className="nav-item notification-menu" ref={notificationRef}>
                  <button
                    type="button"
                    className="notification-trigger"
                    title="Thông báo"
                    aria-haspopup="menu"
                    aria-expanded={isNotificationOpen}
                    onClick={() => {
                      setIsNotificationOpen((open) => !open);
                      setIsAccountOpen(false);
                    }}
                  >
                    <BellIcon />
                    {unreadCount > 0 && (
                      <span className="notification-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="notification-popover" role="menu">
                      <div className="notification-header">
                        <strong>Thông báo</strong>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            className="notification-read-all"
                            onClick={handleMarkAllNotifications}
                          >
                            Đọc tất cả
                          </button>
                        )}
                      </div>

                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <div className="notification-empty">Chưa có thông báo</div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              className={`notification-item${notification.is_read ? '' : ' unread'}`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <span className="notification-title">{notification.title}</span>
                              <span className="notification-body">{notification.body}</span>
                              <span className="notification-time">{formatNotificationTime(notification.created_at)}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </li>

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
