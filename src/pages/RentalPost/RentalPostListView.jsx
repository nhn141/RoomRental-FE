import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRentalPosts } from '../../hooks/useRentalPosts';
import './RentalPost.css';

const RentalPostListView = () => {
  const { user } = useAuth();
  const { posts, loading, error, fetchAllPosts } = useRentalPosts();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const params = filter !== 'all' ? { status: filter } : {};
    fetchAllPosts(params);
  }, [filter, fetchAllPosts]);

  if (loading) {
    return <div className="rental-container"><p>Đang tải...</p></div>;
  }

  if (error) {
    return <div className="rental-container"><div className="error-message">{error}</div></div>;
  }

  return (
    <div className="rental-container">
      <div className="rental-header">
        <h2>Danh Sách Bài Đăng Cho Thuê</h2>
        {user?.role === 'landlord' && (
          <button onClick={() => navigate('/rental-posts/create')} className="create-btn">
            + Tạo Bài Đăng
          </button>
        )}
      </div>

      {user?.role === 'admin' && (
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất Cả
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Chờ Duyệt
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Đã Duyệt
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Từ Chối
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>Không có bài đăng nào</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <span className={`status-badge status-${post.status}`}>
                  {post.status === 'approved' && 'Đã Duyệt'}
                  {post.status === 'pending' && 'Chờ Duyệt'}
                  {post.status === 'rejected' && 'Từ Chối'}
                </span>
              </div>

              <div className="post-body">
                <p className="price">
                  <strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(post.price)}
                </p>
                <p><strong>Địa chỉ:</strong> {post.address}</p>
                <p><strong>Diện tích:</strong> {post.area} m²</p>
                <p className="description">{post.description?.substring(0, 100)}...</p>
              </div>

              <div className="post-footer">
                <button
                  onClick={() => navigate(`/rental-posts/${post.id}`)}
                  className="view-btn"
                >
                  Xem Chi Tiết
                </button>

                {user?.role === 'admin' && post.status === 'pending' && (
                  <div className="admin-actions">
                    <button className="approve-btn">Duyệt</button>
                    <button className="reject-btn">Từ Chối</button>
                  </div>
                )}

                {user?.role === 'landlord' && post.user_id === user?.id && (
                  <div className="landlord-actions">
                    <button
                      onClick={() => navigate(`/rental-posts/edit/${post.id}`)}
                      className="edit-btn"
                    >
                      Sửa
                    </button>
                    <button className="delete-btn">Xóa</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalPostListView;
