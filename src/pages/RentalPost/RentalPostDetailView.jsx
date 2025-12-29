import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRentalPosts } from '../../hooks/useRentalPosts';
import './RentalPost.css';

const RentalPostDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Quay Lại
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <h1>{currentPost.title}</h1>
          <span className={`status-badge status-${currentPost.status}`}>
            {currentPost.status === 'approved' && 'Đã Duyệt'}
            {currentPost.status === 'pending' && 'Chờ Duyệt'}
            {currentPost.status === 'rejected' && 'Từ Chối'}
          </span>
        </div>

        <div className="detail-body">
          <div className="price-section">
            <h2 className="price">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPost.price)}
            </h2>
            <p>/ Tháng</p>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Địa Chỉ:</label>
              <p>{currentPost.address}</p>
            </div>
            <div className="info-item">
              <label>Diện Tích:</label>
              <p>{currentPost.area} m²</p>
            </div>
            <div className="info-item">
              <label>Số Phòng Ngủ:</label>
              <p>{currentPost.num_bedrooms || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Số Phòng Tắm:</label>
              <p>{currentPost.num_bathrooms || 'N/A'}</p>
            </div>
          </div>

          <div className="description-section">
            <label>Mô Tả Chi Tiết:</label>
            <p>{currentPost.description}</p>
          </div>

          <div className="amenities-section">
            <label>Tiện Nghi:</label>
            <div className="amenities-list">
              {currentPost.amenities ? (
                currentPost.amenities.split(',').map((amenity, idx) => (
                  <span key={idx} className="amenity-tag">{amenity.trim()}</span>
                ))
              ) : (
                <p>Không có thông tin tiện nghi</p>
              )}
            </div>
          </div>

          <div className="contact-section">
            <label>Thông Tin Liên Hệ:</label>
            <p><strong>Chủ Nhà:</strong> {currentPost.landlord_name}</p>
            <p><strong>Điện Thoại:</strong> {currentPost.landlord_phone}</p>
            <p><strong>Email:</strong> {currentPost.landlord_email}</p>
          </div>

          <div className="date-section">
            <small>Đăng lúc: {new Date(currentPost.created_at).toLocaleDateString('vi-VN')}</small>
          </div>
        </div>

        <div className="detail-actions">
          <button onClick={() => navigate(-1)} className="cancel-btn">
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalPostDetailView;
