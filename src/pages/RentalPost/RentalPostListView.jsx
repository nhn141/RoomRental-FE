import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRentalPosts } from '../../hooks/useRentalPosts';
import { useLocation } from '../../hooks/useLocation';
import './RentalPost.css';

const RentalPostListView = () => {
  const { user } = useAuth();
  const { posts, loading, error, fetchAllPosts, deletePost, approvePost, rejectPost } = useRentalPosts();
  const { provinces } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const urlStatusFilter = ['pending', 'approved', 'rejected'].includes(statusParam) ? statusParam : 'all';
  
  const [filter, setFilter] = useState(urlStatusFilter);
  const [filters, setFilters] = useState({
    status: '',
    province_code: '',
    min_price: '',
    max_price: '',
    min_area: '',
    max_area: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    const params = {};
    
    if (user?.role === 'admin' && filter !== 'all') {
      params.status = filter;
    }
    
    if (filters.province_code) params.province_code = filters.province_code;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.min_area) params.min_area = filters.min_area;
    if (filters.max_area) params.max_area = filters.max_area;
    
    fetchAllPosts(params);
  };

  useEffect(() => {
    applyFilters();
  }, [filter]);

  useEffect(() => {
    setFilter(urlStatusFilter);
  }, [urlStatusFilter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      province_code: '',
      min_price: '',
      max_price: '',
      min_area: '',
      max_area: '',
    });
    setFilter('all');
    fetchAllPosts({});
  };

  if (loading) {
    return <div className="rental-container"><p>Đang tải...</p></div>;
  }

  if (error) {
    return <div className="rental-container"><div className="error-message">{error}</div></div>;
  }

  return (
    <div className="rental-container">

      <div className="posts-header">
        <h1>Danh Sách Bài Đăng Cho Thuê</h1>
        <div className="posts-header-nav">
          {user?.role === 'landlord' && (
            <>
              <Link to="/rental-posts/create" className="create-post-btn">
                + Tạo bài đăng
              </Link>
              <Link to="/my-rental-posts" className="header-link">
                Bài Đăng Của Tôi
              </Link>
            </>
          )}
          <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'landlord' ? '/landlord' : '/tenant'} className="header-link">
            Dashboard
          </Link>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
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

      {/* Advanced Filters */}
      <div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-btn"
        >
          {showFilters ? '▼' : '▶'} {showFilters ? 'Ẩn' : 'Hiển Thị'} Bộ Lọc Nâng Cao
        </button>
      </div>

      {showFilters && (
        <div className="filter-advanced-panel">
          <div className="filter-grid">
            {/* Tỉnh/Thành Phố */}
            <div className="filter-field">
              <label>Tỉnh/Thành Phố</label>
              <select
                name="province_code"
                value={filters.province_code}
                onChange={handleFilterChange}
              >
                <option value="">-- Tất cả --</option>
                {provinces.map(province => (
                  <option key={province.id} value={province.id}>
                    {province.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Giá tối thiểu */}
            <div className="filter-field">
              <label>Giá tối thiểu (VNĐ)</label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleFilterChange}
                placeholder="VD: 1000000"
              />
            </div>

            {/* Giá tối đa */}
            <div className="filter-field">
              <label>Giá tối đa (VNĐ)</label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder="VD: 10000000"
              />
            </div>

            {/* Diện tích tối thiểu */}
            <div className="filter-field">
              <label>Diện tích tối thiểu (m²)</label>
              <input
                type="number"
                name="min_area"
                value={filters.min_area}
                onChange={handleFilterChange}
                placeholder="VD: 20"
              />
            </div>

            {/* Diện tích tối đa */}
            <div className="filter-field">
              <label>Diện tích tối đa (m²)</label>
              <input
                type="number"
                name="max_area"
                value={filters.max_area}
                onChange={handleFilterChange}
                placeholder="VD: 100"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="filter-actions">
            <button
              onClick={handleApplyFilters}
              className="btn-filter"
            >
              🔍 Lọc
            </button>
            <button
              onClick={handleResetFilters}
              className="btn-reset"
            >
              ↻ Đặt Lại
            </button>
          </div>
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
                  Xem chi tiết
                </button>

                {user?.role === 'admin' && post.status === 'pending' && (
                  <div className="admin-actions">
                    <button
                      className="approve-btn"
                      onClick={async () => {
                        if (!window.confirm('Bạn chắc chắn muốn duyệt bài này?')) return;
                        try {
                          await approvePost(post.id);
                          applyFilters();
                        } catch (err) {
                          console.error('Approve error', err);
                        }
                      }}
                    >
                      Duyệt
                    </button>
                    <button
                      className="reject-btn"
                      onClick={async () => {
                        const reason = window.prompt('Lý do từ chối (tùy chọn):');
                        if (reason === null) return; // cancel
                        try {
                          await rejectPost(post.id, reason);
                          applyFilters();
                        } catch (err) {
                          console.error('Reject error', err);
                        }
                      }}
                    >
                      Từ Chối
                    </button>
                  </div>
                )}

                {user?.role === 'landlord' && post.user_id === user?.id && (
                  <div className="landlord-actions">
                    <button
                      onClick={() => navigate(`/rental-posts/${post.id}/edit`)}
                      className="edit-btn"
                    >
                      Sửa
                    </button>
                    <button
                      className="delete-btn"
                      onClick={async () => {
                        if (!window.confirm('Bạn chắc chắn muốn xóa bài đăng này?')) return;
                        try {
                          await deletePost(post.id);
                          applyFilters();
                        } catch (err) {
                          console.error('Delete error', err);
                        }
                      }}
                    >
                      Xóa
                    </button>
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
