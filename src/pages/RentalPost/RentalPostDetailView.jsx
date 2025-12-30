import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRentalPosts } from '../../hooks/useRentalPosts';
import { useAuth } from '../../context/AuthContext';
import './RentalPost.css';

const RentalPostDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPost, loading, error, fetchPostById } = useRentalPosts();

  useEffect(() => {
    if (id) {
      fetchPostById(id);
    }
  }, [id, fetchPostById]);

  if (loading) {
    return <div className="rental-container"><p>Đang tải...</p></div>;
  }

  if (error) {
    return <div className="rental-container"><div className="error-message">{error}</div></div>;
  }

  if (!currentPost) {
    return <div className="rental-container"><p>Không tìm thấy bài đăng</p></div>;
  }

  return (
    <div className="rental-container">
      <div className="page-header">
        <button 
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'landlord' ? '/landlord' : '/tenant')}
          className="home-btn"
          title="Về Dashboard"
        >
          🏠
        </button>
      </div>
      <div className="detail-header-nav">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Quay Lại
        </button>
        <div className="detail-nav-links">
          <Link to="/rental-posts" className="header-link">
            Danh Sách Bài Đăng
          </Link>
          <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'landlord' ? '/landlord' : '/tenant'} className="header-link">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div>
            <h1>{currentPost.title}</h1>
            <p className="detail-location">
              {currentPost.address_detail && `${currentPost.address_detail} • `}
              {currentPost.ward_name && `${currentPost.ward_name} • `}
              {currentPost.province_name}
            </p>
          </div>
          <span className={`status-badge status-${currentPost.status}`}>
            {currentPost.status === 'approved' && 'Đã Duyệt'}
            {currentPost.status === 'pending' && 'Chờ Duyệt'}
            {currentPost.status === 'rejected' && 'Từ Chối'}
          </span>
        </div>

        <div className="detail-body">
          <div className="price-section">
            <h2 className="price">
              {currentPost.price?.toLocaleString('vi-VN')} VND
            </h2>
            <p>/ Tháng</p>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Diện Tích:</label>
              <p>{currentPost.area} m²</p>
            </div>
            <div className="info-item">
              <label>Số Người Tối Đa:</label>
              <p>{currentPost.max_tenants || 'Không giới hạn'}</p>
            </div>
            {currentPost.electricity_price && (
              <div className="info-item">
                <label>Giá Điện:</label>
                <p>{currentPost.electricity_price?.toLocaleString('vi-VN')} VND/kWh</p>
              </div>
            )}
            {currentPost.water_price && (
              <div className="info-item">
                <label>Giá Nước:</label>
                <p>{currentPost.water_price?.toLocaleString('vi-VN')} VND/m³</p>
              </div>
            )}
          </div>

          {currentPost.description && (
            <div className="description-section">
              <label>Mô Tả Chi Tiết:</label>
              <p>{currentPost.description}</p>
            </div>
          )}

          {currentPost.amenities && currentPost.amenities.length > 0 && (
            <div className="amenities-section">
              <label>Tiện Nghi:</label>
              <div className="amenities-list">
                {Array.isArray(currentPost.amenities) ? (
                  currentPost.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-tag">{amenity}</span>
                  ))
                ) : (
                  <p>Không có thông tin tiện nghi</p>
                )}
              </div>
            </div>
          )}

          <div className="contact-section">
            <label>Thông Tin Chủ Nhà:</label>
            <p><strong>Tên:</strong> {currentPost.landlord_name}</p>
            {currentPost.landlord_phone && (
              <p><strong>Điện Thoại:</strong> {currentPost.landlord_phone}</p>
            )}
            {currentPost.landlord_email && (
              <p><strong>Email:</strong> {currentPost.landlord_email}</p>
            )}
            {currentPost.reputation_score !== undefined && (
              <p><strong>Điểm Uy Tín:</strong> {currentPost.reputation_score?.toFixed(1)} ⭐</p>
            )}
          </div>

          {currentPost.rejection_reason && currentPost.status === 'rejected' && (
            <div className="rejection-section">
              <label>Lý Do Từ Chối:</label>
              <p>{currentPost.rejection_reason}</p>
            </div>
          )}

          <div className="date-section">
            <small>Đăng lúc: {new Date(currentPost.created_at).toLocaleDateString('vi-VN')}</small>
            {currentPost.updated_at && (
              <small>Cập nhật: {new Date(currentPost.updated_at).toLocaleDateString('vi-VN')}</small>
            )}
            <small>Đăng lúc: {new Date(currentPost.created_at).toLocaleDateString('vi-VN')}</small>
          </div>
        </div>

        <div className="detail-actions">
          {user?.role === 'tenant' && currentPost.status === 'approved' && (
            <button
              onClick={() => navigate(`/contracts/create?post_id=${currentPost.id}`)}
              className="create-contract-btn"
            >
              📋 Tạo Hợp Đồng
            </button>
          )}
          <button onClick={() => navigate(-1)} className="cancel-btn">
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalPostDetailView;
