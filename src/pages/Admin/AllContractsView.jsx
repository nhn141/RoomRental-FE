import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import './Admin.css';

const AllContractsView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAllContracts, loading, error } = useAdmin();
  const [contracts, setContracts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContracts();
  }, [filter]);

  const fetchContracts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await getAllContracts(params);
      setContracts(data.contracts || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
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
      <div className="page-header">
        <button 
          onClick={() => navigate('/admin')}
          className="home-btn"
          title="Về Dashboard"
        >
          🏠
        </button>
      </div>

      <div className="posts-header">
        <h1>📋 Danh Sách Tất Cả Hợp Đồng</h1>
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
          Tất Cả ({contracts.length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Chờ Xác Nhận
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Đang Hiệu Lực
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Hoàn Thành
        </button>
        <button
          className={`filter-btn ${filter === 'terminated' ? 'active' : ''}`}
          onClick={() => setFilter('terminated')}
        >
          Hủy
        </button>
      </div>

      {contracts.length === 0 ? (
        <div className="empty-state">
          <p>Không có hợp đồng nào</p>
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
              <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>ID</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Bài Đăng</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Người Thuê</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Chủ Nhà</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Tiền Thuê/Tháng</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Ngày Bắt Đầu</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c, idx) => (
                <tr key={c.id} style={{
                  borderBottom: '1px solid #e0e0e0',
                  background: idx % 2 === 0 ? '#f9f9f9' : 'white',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.parentElement.style.background = '#f0f4ff'}
                onMouseLeave={(e) => e.target.parentElement.style.background = idx % 2 === 0 ? '#f9f9f9' : 'white'}
                >
                  <td style={{ padding: '16px', color: '#666' }}>{c.id}</td>
                  <td style={{ padding: '16px', color: '#333', fontWeight: '500' }}>
                    <Link to={`/rental-posts/${c.post_id}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                      {c.post_title}
                    </Link>
                  </td>
                  <td style={{ padding: '16px', color: '#555' }}>
                    <div style={{ fontSize: '0.9em' }}>
                      <strong>{c.tenant_name}</strong>
                      <div style={{ fontSize: '0.85em', color: '#999' }}>{c.tenant_email}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#555' }}>
                    <div style={{ fontSize: '0.9em' }}>
                      <strong>{c.landlord_name}</strong>
                      <div style={{ fontSize: '0.85em', color: '#999' }}>{c.landlord_email}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#667eea', fontWeight: '600' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.monthly_rent)}
                  </td>
                  <td style={{ padding: '16px', color: '#666', fontSize: '0.9em' }}>
                    {new Date(c.start_date).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      background: c.status === 'pending' ? '#fff3cd' : c.status === 'active' ? '#d4edda' : c.status === 'completed' ? '#e2e3e5' : '#f8d7da',
                      color: c.status === 'pending' ? '#856404' : c.status === 'active' ? '#155724' : c.status === 'completed' ? '#383d41' : '#721c24'
                    }}>
                      {c.status === 'pending' ? '⏳ Chờ' : c.status === 'active' ? '✅ Hiệu Lực' : c.status === 'completed' ? '✔️ Hoàn Thành' : '❌ Hủy'}
                    </span>
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

export default AllContractsView;
