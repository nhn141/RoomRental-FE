import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useRentalPosts } from '../../hooks/useRentalPosts';
import { useLocation } from '../../hooks/useLocation';
import { useAuth } from '../../context/AuthContext';
import './RentalPost.css';

const EditRentalPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPost, fetchPostById, updatePost, loading, error } = useRentalPosts();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    address_detail: '',
    province_code: '',
    ward_code: '',
    max_tenants: '',
    amenities: '',
    electricity_price: '',
    water_price: '',
  });
  const { provinces, wards, fetchWards } = useLocation();
  const [provinceNameDisplay, setProvinceNameDisplay] = useState('');
  const [wardNameDisplay, setWardNameDisplay] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        await fetchPostById(id);
      } catch (err) {
        console.error('Lỗi khi lấy bài đăng:', err);
      }
    };
    loadPost();
  }, [id, fetchPostById]);

  useEffect(() => {
    if (currentPost) {
      // Check if landlord owns this post
      if (currentPost.landlord_id !== user?.id) {
        alert('Bạn không có quyền chỉnh sửa bài đăng này');
        navigate('/my-rental-posts');
        return;
      }

      // Check if post can be edited (only pending posts)
      if (currentPost.status !== 'pending') {
        alert('Chỉ có thể chỉnh sửa bài đăng đang chờ duyệt');
        navigate('/my-rental-posts');
        return;
      }

      // Pre-fill form with post data
      setFormData({
        title: currentPost.title || '',
        description: currentPost.description || '',
        price: currentPost.price || '',
        area: currentPost.area || '',
        address_detail: currentPost.address_detail || '',
        province_code: currentPost.province_code || '',
        ward_code: currentPost.ward_code || '',
        max_tenants: currentPost.max_tenants || '',
        amenities: currentPost.amenities ? currentPost.amenities.join(', ') : '',
        electricity_price: currentPost.electricity_price || '',
        water_price: currentPost.water_price || '',
      });
      setProvinceNameDisplay(currentPost.province_name || '');
      setWardNameDisplay(currentPost.ward_name || '');

      if (currentPost.province_code) {
        fetchWards(currentPost.province_code);
      }
    }
  }, [currentPost, user?.id, navigate, fetchWards]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'province_code') {
      const selected = provinces.find(p => p.id === value);
      setFormData(prev => ({ ...prev, province_code: value, ward_code: '' }));
      setProvinceNameDisplay(selected ? (selected.full_name || selected.name) : value);
      setWardNameDisplay('');
      if (value) fetchWards(value);
      return;
    }

    if (name === 'ward_code') {
      const selected = wards.find(w => w.id === value);
      setFormData(prev => ({ ...prev, ward_code: value }));
      setWardNameDisplay(selected ? (selected.name_with_type || selected.name) : value);
      return;
    }

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
    if (!formData.price) newErrors.price = 'Giá không được trống';
    if (!formData.area) newErrors.area = 'Diện tích không được trống';
    if (!formData.address_detail.trim()) newErrors.address_detail = 'Địa chỉ không được trống';
    if (!formData.province_code) newErrors.province_code = 'Tỉnh/TP không được trống';
    if (!formData.ward_code) newErrors.ward_code = 'Phường/Xã không được trống';
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
      const payload = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        max_tenants: formData.max_tenants ? parseInt(formData.max_tenants) : null,
        address_detail: formData.address_detail,
        province_code: formData.province_code,
        ward_code: formData.ward_code,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()).filter(a => a) : [],
        images: currentPost.images || [],
        electricity_price: formData.electricity_price ? parseFloat(formData.electricity_price) : null,
        water_price: formData.water_price ? parseFloat(formData.water_price) : null,
      };

      await updatePost(id, payload);
      alert('Cập nhật bài đăng thành công!');
      navigate('/my-rental-posts');
    } catch (err) {
      console.error('Lỗi cập nhật bài đăng:', err);
    }
  };

  if (loading) {
    return (
      <div className="rental-container">
        <h1>Chỉnh Sửa Bài Đăng</h1>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="rental-container">
        <h1>Chỉnh Sửa Bài Đăng</h1>
        <p>Không tìm thấy bài đăng</p>
      </div>
    );
  }

  return (
    <div className="rental-container">
      <div className="form-header">
        <h1>Chỉnh Sửa Bài Đăng</h1>
        <div className="form-header-links">
          <Link to="/my-rental-posts" className="header-link">
            Bài Đăng Của Tôi
          </Link>
          <Link to="/landlord" className="header-link">
            Dashboard
          </Link>
        </div>
      </div>

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
          <div className="form-group full-width">
            <label htmlFor="description">Mô Tả Chi Tiết:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về phòng..."
              rows="4"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="max_tenants">Số Người Cho Thuê Tối Đa:</label>
            <input
              type="number"
              id="max_tenants"
              name="max_tenants"
              value={formData.max_tenants}
              onChange={handleChange}
              placeholder="2"
            />
          </div>
          <div className="form-group">
            <label htmlFor="electricity_price">Giá Điện (VND/kWh):</label>
            <input
              type="number"
              id="electricity_price"
              name="electricity_price"
              value={formData.electricity_price}
              onChange={handleChange}
              placeholder="3500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="water_price">Giá Nước (VND/m³):</label>
            <input
              type="number"
              id="water_price"
              name="water_price"
              value={formData.water_price}
              onChange={handleChange}
              placeholder="5000"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="province_code">Tỉnh/Thành Phố: *</label>
            <input
              type="text"
              id="province_code"
              name="province_code"
              value={provinceNameDisplay || formData.province_code}
              onChange={(e) => handleChange({ target: { name: 'province_code', value: e.target.value } })}
              placeholder="Nhập hoặc chọn tỉnh/thành phố..."
              list="provinces-list"
              className={errors.province_code ? 'input-error' : ''}
            />
            {errors.province_code && <span className="error-text">{errors.province_code}</span>}
            <datalist id="provinces-list">
              {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.full_name || p.name}</option>
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="ward_code">Phường/Xã: *</label>
            <input
              type="text"
              id="ward_code"
              name="ward_code"
              value={wardNameDisplay || formData.ward_code}
              onChange={(e) => handleChange({ target: { name: 'ward_code', value: e.target.value } })}
              placeholder="Nhập hoặc chọn phường/xã..."
              list="wards-list"
              disabled={!formData.province_code}
              className={errors.ward_code ? 'input-error' : ''}
            />
            {errors.ward_code && <span className="error-text">{errors.ward_code}</span>}
            <datalist id="wards-list">
              {wards.map(w => (
                <option key={w.id} value={w.id}>{w.name_with_type || w.name}</option>
              ))}
            </datalist>
          </div>

          <div className="form-group full-width">
            <label htmlFor="address_detail">Địa Chỉ Chi Tiết: *</label>
            <input
              type="text"
              id="address_detail"
              name="address_detail"
              value={formData.address_detail}
              onChange={handleChange}
              placeholder="VD: Ngõ 45 Hàng Bồ, Tầng 3"
              className={errors.address_detail ? 'input-error' : ''}
            />
            {errors.address_detail && <span className="error-text">{errors.address_detail}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="amenities">Tiện Nghi (cách nhau bởi dấu phẩy):</label>
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
            {loading ? 'Đang cập nhật...' : 'Cập Nhật Bài Đăng'}
          </button>
          <Link to="/my-rental-posts" className="cancel-btn">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditRentalPostView;
