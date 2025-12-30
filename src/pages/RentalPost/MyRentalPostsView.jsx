import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRentalPosts } from '../../hooks/useRentalPosts';
import { useAuth } from '../../context/AuthContext';
import '../RentalPost/RentalPost.css';

const MyRentalPostsView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    myPosts,
    loading,
    error,
    fetchMyPosts,
    deletePost,
  } = useRentalPosts();

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bài đăng này?')) {
      return;
    }
    try {
      await deletePost(postId);
      await fetchMyPosts();
    } catch (err) {
      console.error('Lỗi khi xóa bài đăng:', err);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/rental-posts/${postId}/edit`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ Duyệt', className: 'badge-pending' },
      approved: { label: 'Đã Duyệt', className: 'badge-approved' },
      rejected: { label: 'Bị Từ Chối', className: 'badge-rejected' },
    };
    const statusInfo = statusMap[status] || { label: status, className: '' };
    return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.label}</span>;
  };

  if (loading) {
    return (
      <div className="rental-posts-container">
        <h1>Bài Đăng Của Tôi</h1>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rental-posts-container">
        <h1>Bài Đăng Của Tôi</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="rental-posts-container">
      <div className="posts-header">
        <h1>Bài Đăng Của Tôi</h1>
        <div className="posts-header-nav">
          <Link to="/rental-posts/create" className="create-post-btn">
            + Tạo Bài Đăng
          </Link>
          <Link to="/rental-posts" className="header-link">
            Tất Cả Bài Đăng
          </Link>
          <Link to="/landlord" className="header-link">
            Dashboard
          </Link>
        </div>
      </div>

      {myPosts.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa đăng bài nào. <Link to="/rental-posts/create">Tạo bài đăng đầu tiên</Link></p>
        </div>
      ) : (
        <div className="posts-list">
          {myPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div>
                  <h3>{post.title}</h3>
                  <p className="post-meta">
                    {post.address_detail && `${post.address_detail} • `}
                    {post.province_name && post.province_name}
                  </p>
                </div>
                {getStatusBadge(post.status)}
              </div>

              <div className="post-content">
                <p>{post.description}</p>
              </div>

              <div className="post-details">
                <div className="detail-item">
                  <span className="detail-label">Giá:</span>
                  <span className="detail-value">{post.price?.toLocaleString('vi-VN')} VND/tháng</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Diện tích:</span>
                  <span className="detail-value">{post.area} m²</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Max Tenants:</span>
                  <span className="detail-value">{post.max_tenants}</span>
                </div>
                {post.electricity_price && (
                  <div className="detail-item">
                    <span className="detail-label">Điện:</span>
                    <span className="detail-value">{post.electricity_price?.toLocaleString('vi-VN')} VND/kWh</span>
                  </div>
                )}
                {post.water_price && (
                  <div className="detail-item">
                    <span className="detail-label">Nước:</span>
                    <span className="detail-value">{post.water_price?.toLocaleString('vi-VN')} VND/m³</span>
                  </div>
                )}
              </div>

              {post.amenities && post.amenities.length > 0 && (
                <div className="amenities">
                  <strong>Tiện nghi:</strong>
                  <div className="amenities-list">
                    {post.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="post-actions">
                {post.status === 'pending' && (
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(post.id)}
                  >
                    Chỉnh Sửa
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(post.id)}
                >
                  Xóa
                </button>
                <Link
                  to={`/rental-posts/${post.id}`}
                  className="action-btn view-btn"
                >
                  Xem Chi Tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentalPostsView;
