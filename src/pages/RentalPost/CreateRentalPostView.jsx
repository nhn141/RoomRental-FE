import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentalPosts } from '../../hooks/useRentalPosts';
import './RentalPost.css';

const CreateRentalPostView = () => {
  const navigate = useNavigate();
  const { createPost, loading, error } = useRentalPosts();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    address: '',
    num_bedrooms: '',
    num_bathrooms: '',
    amenities: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được trống';
    if (!formData.description.trim()) newErrors.description = 'Mô tả không được trống';
    if (!formData.price) newErrors.price = 'Giá không được trống';
    if (!formData.area) newErrors.area = 'Diện tích không được trống';
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được trống';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createPost(formData);
      alert('Tạo bài đăng thành công! Chờ duyệt từ admin.');
      navigate('/rental-posts');
    } catch (err) {
      console.error('Lỗi tạo bài đăng:', err);
    }
  };

  return (
    <div className="rental-container">
      <h2>Tạo Bài Đăng Cho Thuê</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="rental-form">
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="title">Tiêu Đề: *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="VD: Phòng cho thuê ngõ 45 Hàng Bồ"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Giá (VND): *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="5000000"
              className={errors.price ? 'input-error' : ''}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="area">Diện Tích (m²): *</label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="30"
              className={errors.area ? 'input-error' : ''}
            />
            {errors.area && <span className="error-text">{errors.area}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="num_bedrooms">Số Phòng Ngủ:</label>
            <input
              type="number"
              id="num_bedrooms"
              name="num_bedrooms"
              value={formData.num_bedrooms}
              onChange={handleChange}
              placeholder="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="num_bathrooms">Số Phòng Tắm:</label>
            <input
              type="number"
              id="num_bathrooms"
              name="num_bathrooms"
              value={formData.num_bathrooms}
              onChange={handleChange}
              placeholder="1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="address">Địa Chỉ: *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="45 Hàng Bồ, Hoàn Kiếm, Hà Nội"
              className={errors.address ? 'input-error' : ''}
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="description">Mô Tả Chi Tiết: *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về phòng..."
              rows="5"
              className={errors.description ? 'input-error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="amenities">Tiện Nghi (cách nhau bằng dấu phẩy):</label>
            <textarea
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Máy lạnh, Tủ lạnh, ..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Đang tạo...' : 'Tạo Bài Đăng'}
          </button>
          <button type="button" onClick={() => navigate('/rental-posts')} className="cancel-btn">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRentalPostView;
