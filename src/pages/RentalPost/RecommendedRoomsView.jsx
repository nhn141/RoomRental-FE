import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecommendations } from '../../hooks/useRecommendations';
import './RentalPost.css';

const RecommendedRoomsView = () => {
  const { user } = useAuth();
  const { recommendations, loading, error, fetchRecommendations } = useRecommendations();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (loading) {
    return <div className="rental-container"><p>Đang tải...</p></div>;
  }

  if (error) {
    return <div className="rental-container"><div className="error-message">{error}</div></div>;
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

      <div className="posts-header">
        <h1>🎯 Phòng Được Gợi Ý Cho Bạn</h1>
        <div className="posts-header-nav">
          <Link to="/rental-posts" className="header-link">
            🔍 Tìm Kiếm Phòng
          </Link>
          <Link to="/tenant" className="header-link">
            Dashboard
          </Link>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          <p>Không có phòng nào phù hợp với yêu cầu của bạn lúc này.</p>
          <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
            Hãy cập nhật thông tin profile của bạn để nhận được những gợi ý tốt hơn.
          </p>
          <Link to="/profile" className="create-post-btn">
            📝 Cập nhật profile
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {recommendations.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <span className="status-badge status-approved">
                  Đã Duyệt
                </span>
              </div>

              <div className="post-body">
                <p className="price">
                  <strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.price)}
                </p>
                <p><strong>Địa chỉ:</strong> {post.address_detail}</p>
                <p><strong>Quận/Huyện:</strong> {post.ward_name}</p>
                <p><strong>Tỉnh/Thành Phố:</strong> {post.province_name}</p>
                <p><strong>Diện tích:</strong> {post.area} m²</p>
                {post.max_tenants && <p><strong>Số người tối đa:</strong> {post.max_tenants}</p>}
                {post.electricity_price && <p><strong>Giá điện:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.electricity_price)}/kWh</p>}
                {post.water_price && <p><strong>Giá nước:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.water_price)}/m³</p>}
                {post.description && <p className="description">{post.description?.substring(0, 100)}...</p>}
              </div>

              <div className="post-footer">
                <button
                  onClick={() => navigate(`/rental-posts/${post.id}`)}
                  className="view-btn"
                >
                  Xem Chi Tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedRoomsView;
