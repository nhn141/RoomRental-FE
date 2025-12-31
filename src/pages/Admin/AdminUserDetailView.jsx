import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import './Admin.css';

const AdminUserDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUserDetail(id);
      setUserData(data.user);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải thông tin người dùng');
      console.error('Error fetching user detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
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

  if (error) {
    return (
      <div className="rental-container">
        <div style={{ background: '#fee', border: '1px solid #fcc', padding: '12px', borderRadius: '6px', marginTop: '20px', color: '#c33' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="rental-container">
        <div style={{ background: '#fee', border: '1px solid #fcc', padding: '12px', borderRadius: '6px', marginTop: '20px', color: '#c33' }}>
          Không tìm thấy người dùng
        </div>
      </div>
    );
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
        <h1>👤 Chi Tiết Hồ Sơ Người Dùng</h1>
        <div className="posts-header-nav">
          <Link to="/admin/users" className="header-link">
            ← Quay Lại
          </Link>
          <Link to="/admin" className="header-link">
            Dashboard
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{userData.full_name}</h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>{userData.email}</p>
          </div>

          {/* Content */}
          <div style={{ padding: '30px' }}>
            {/* Basic Info */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>📋 Thông Tin Cơ Bản</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px',
                padding: '16px',
                background: '#f9f9f9',
                borderRadius: '8px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Tên Đăng Nhập:</label>
                  <p style={{ margin: 0, color: '#333', fontWeight: '500' }}>{userData.email}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Vai Trò:</label>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: userData.role === 'admin' ? '#ffe0e0' : userData.role === 'landlord' ? '#e0f0ff' : '#e0ffe0',
                    color: userData.role === 'admin' ? '#c00' : userData.role === 'landlord' ? '#0066cc' : '#00a000'
                  }}>
                    {userData.role === 'admin' ? '👤 Admin' : userData.role === 'landlord' ? '🏠 Chủ Nhà' : '👤 Người Thuê'}
                  </span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Trạng Thái:</label>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: userData.is_active ? '#e0ffe0' : '#ffe0e0',
                    color: userData.is_active ? '#00a000' : '#c00'
                  }}>
                    {userData.is_active ? '✅ Hoạt Động' : '❌ Khóa'}
                  </span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Ngày Tạo:</label>
                  <p style={{ margin: 0, color: '#333' }}>{new Date(userData.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            {userData.profile && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                  {userData.role === 'admin' ? '🏢' : userData.role === 'landlord' ? '🏠' : '👤'} Thông Tin {userData.role === 'admin' ? 'Admin' : userData.role === 'landlord' ? 'Chủ Nhà' : 'Người Thuê'}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  padding: '16px',
                  background: '#f9f9f9',
                  borderRadius: '8px'
                }}>
                  {userData.role === 'admin' && (
                    <>
                      {userData.profile.department && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Phòng Ban:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.department}</p>
                        </div>
                      )}
                      {userData.profile.phone_number && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Số Điện Thoại:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.phone_number}</p>
                        </div>
                      )}
                    </>
                  )}

                  {userData.role === 'landlord' && (
                    <>
                      {userData.profile.phone_number && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Số Điện Thoại:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.phone_number}</p>
                        </div>
                      )}
                      {userData.profile.gender && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Giới Tính:</label>
                          <p style={{ margin: 0, color: '#333' }}>
                            {userData.profile.gender === 'male' ? 'Nam' : userData.profile.gender === 'female' ? 'Nữ' : 'Khác'}
                          </p>
                        </div>
                      )}
                      {userData.profile.dob && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Ngày Sinh:</label>
                          <p style={{ margin: 0, color: '#333' }}>{new Date(userData.profile.dob).toLocaleDateString('vi-VN')}</p>
                        </div>
                      )}
                      {userData.profile.identity_card && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>CCCD/CMND:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.identity_card}</p>
                        </div>
                      )}
                      {userData.profile.address_detail && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Địa Chỉ:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.address_detail}</p>
                        </div>
                      )}
                      {userData.profile.reputation_score !== undefined && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Điểm Uy Tín:</label>
                          <p style={{ margin: 0, color: '#667eea', fontWeight: '600' }}>{userData.profile.reputation_score.toFixed(1)} ⭐</p>
                        </div>
                      )}
                      {userData.profile.bio && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Giới Thiệu:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.bio}</p>
                        </div>
                      )}
                    </>
                  )}

                  {userData.role === 'tenant' && (
                    <>
                      {userData.profile.phone_number && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Số Điện Thoại:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.phone_number}</p>
                        </div>
                      )}
                      {userData.profile.gender && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Giới Tính:</label>
                          <p style={{ margin: 0, color: '#333' }}>
                            {userData.profile.gender === 'male' ? 'Nam' : userData.profile.gender === 'female' ? 'Nữ' : 'Khác'}
                          </p>
                        </div>
                      )}
                      {userData.profile.dob && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Ngày Sinh:</label>
                          <p style={{ margin: 0, color: '#333' }}>{new Date(userData.profile.dob).toLocaleDateString('vi-VN')}</p>
                        </div>
                      )}
                      {userData.profile.target_province_name && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Tỉnh/Thành Phố:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.target_province_name}</p>
                        </div>
                      )}
                      {userData.profile.target_ward_name && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Phường/Xã:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.target_ward_name}</p>
                        </div>
                      )}
                      {userData.profile.budget_min && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Ngân Sách Tìm Kiếm:</label>
                          <p style={{ margin: 0, color: '#667eea', fontWeight: '600' }}>
                            {userData.profile.budget_min.toLocaleString('vi-VN')} - {userData.profile.budget_max.toLocaleString('vi-VN')} VND
                          </p>
                        </div>
                      )}
                      {userData.profile.bio && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Giới Thiệu:</label>
                          <p style={{ margin: 0, color: '#333' }}>{userData.profile.bio}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <Link 
                to="/admin/users"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                ← Quay Lại
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailView;
