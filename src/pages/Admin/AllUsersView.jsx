import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import './Admin.css';

const AllUsersView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAllUsers, loading, error } = useAdmin();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter !== 'all' ? { role: filter } : {};
      const data = await getAllUsers(params);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="rental-container">
        <div style={{ background: '#fee', border: '1px solid #fcc', padding: '12px', borderRadius: '6px', marginTop: '20px', color: '#c33' }}>
          Chỉ admin mới có quyền xem trang này
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="rental-container"><p>Đang tải...</p></div>;
  }

  return (
    <div className="rental-container">
      <div className="posts-header">
        <h1>👥 Danh Sách Tất Cả Người Dùng</h1>
        <div className="posts-header-nav">
          <Link to="/admin" className="header-link">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả ({users.length})
        </button>
        <button
          className={`filter-btn ${filter === 'admin' ? 'active' : ''}`}
          onClick={() => setFilter('admin')}
        >
          Admin ({users.filter(u => u.role === 'admin').length})
        </button>
        <button
          className={`filter-btn ${filter === 'landlord' ? 'active' : ''}`}
          onClick={() => setFilter('landlord')}
        >
          Chủ Nhà ({users.filter(u => u.role === 'landlord').length})
        </button>
        <button
          className={`filter-btn ${filter === 'tenant' ? 'active' : ''}`}
          onClick={() => setFilter('tenant')}
        >
          Người Thuê ({users.filter(u => u.role === 'tenant').length})
        </button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>Không có người dùng nào</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: 'var(--primary-gradient)', color: 'white' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>ID</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Tên</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Email</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Vai Trò</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Trạng Thái</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Ngày Tạo</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id} style={{
                  borderBottom: '1px solid #e0e0e0',
                  background: idx % 2 === 0 ? '#f9f9f9' : 'white',
                  transition: 'background 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.parentElement.style.background = '#f0f4ff'}
                onMouseLeave={(e) => e.target.parentElement.style.background = idx % 2 === 0 ? '#f9f9f9' : 'white'}
                onClick={() => navigate(`/admin/users/${u.id}`)}
                >
                  <td style={{ padding: '16px', color: '#666' }}>{u.id}</td>
                  <td style={{ padding: '16px', color: '#333', fontWeight: '500' }}>
                    <Link to={`/admin/users/${u.id}`} style={{ color: '#333', textDecoration: 'none' }}>
                      {u.full_name}
                    </Link>
                  </td>
                  <td style={{ padding: '16px', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      background: u.role === 'admin' ? '#ffe0e0' : u.role === 'landlord' ? '#e0f0ff' : '#e0ffe0',
                      color: u.role === 'admin' ? '#c00' : u.role === 'landlord' ? '#0066cc' : '#00a000'
                    }}>
                      {u.role === 'admin' ? '👤 Admin' : u.role === 'landlord' ? '🏠 Chủ Nhà' : '👤 Người Thuê'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: u.is_active ? '#e0ffe0' : '#ffe0e0',
                      color: u.is_active ? '#00a000' : '#c00'
                    }}>
                      {u.is_active ? '✅ Hoạt Động' : '❌ Khóa'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#666', fontSize: '0.9em' }}>
                    {new Date(u.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', padding: '12px', borderRadius: '6px', marginTop: '20px', color: '#c33' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default AllUsersView;
