import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../hooks/useLocation';
import './Auth.css';

const RegisterTenant = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: '',
    target_province_code: '',
    target_ward_code: '',
    budget_min: '',
    budget_max: '',
    gender: '',
    dob: '',
    bio: '',
  });
  const [provinceNameDisplay, setProvinceNameDisplay] = useState('');
  const [wardNameDisplay, setWardNameDisplay] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerTenant } = useAuth();
  const { provinces, wards, fetchWards } = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'target_province_code') {
      const selectedProvince = provinces.find(p => p.id === value);
      setFormData((prev) => ({
        ...prev,
        target_province_code: value,
        target_ward_code: '',
      }));
      setProvinceNameDisplay(selectedProvince ? (selectedProvince.full_name || selectedProvince.name) : value);
      setWardNameDisplay('');
      
      if (value) {
        fetchWards(value);
      }
    } else if (name === 'target_ward_code') {
      const selectedWard = wards.find(w => w.id === value);
      setFormData((prev) => ({
        ...prev,
        target_ward_code: value,
      }));
      setWardNameDisplay(selectedWard ? (selectedWard.name_with_type || selectedWard.name) : value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await registerTenant(registerData);
      navigate('/tenant');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box register-box">
        <h2>Đăng Ký Người Thuê</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="full_name">Họ và Tên:</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Nhập họ tên"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Số điện thoại:</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Giới Tính:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">-- Chọn --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dob">Ngày Sinh:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_province_code">Tỉnh/Thành Phố cần tìm phòng:</label>
            <input
              type="text"
              id="target_province_code"
              name="target_province_code"
              value={provinceNameDisplay}
              onChange={handleChange}
              placeholder="Nhập hoặc chọn tỉnh/thành phố..."
              list="provinces-list"
            />
            <datalist id="provinces-list">
              {provinces.map(province => (
                <option key={province.id} value={province.id}>
                  {province.full_name || province.name}
                </option>
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="target_ward_code">Phường/Xã cần tìm phòng:</label>
            <input
              type="text"
              id="target_ward_code"
              name="target_ward_code"
              value={wardNameDisplay}
              onChange={handleChange}
              placeholder="Nhập hoặc chọn phường/xã..."
              list="wards-list"
              disabled={!formData.target_province_code}
            />
            <datalist id="wards-list">
              {wards.map(ward => (
                <option key={ward.id} value={ward.id}>
                  {ward.name_with_type || ward.name}
                </option>
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="budget_min">Ngân Sách Tối Thiểu (VND):</label>
            <input
              type="number"
              id="budget_min"
              name="budget_min"
              value={formData.budget_min}
              onChange={handleChange}
              placeholder="VD: 2000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget_max">Ngân Sách Tối Đa (VND):</label>
            <input
              type="number"
              id="budget_max"
              name="budget_max"
              value={formData.budget_max}
              onChange={handleChange}
              placeholder="VD: 5000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Giới Thiệu:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Giới thiệu về bản thân..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <div className="password-input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <p className="auth-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterTenant;
