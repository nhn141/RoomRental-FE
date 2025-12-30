import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const RegisterLandlord = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: '',
    identity_card: '',
    address_detail: '',
    gender: '',
    dob: '',
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerLandlord } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      await registerLandlord(registerData);
      navigate('/landlord');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box register-box">
        <h2>Đăng Ký Chủ Nhà</h2>

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
            <label htmlFor="identity_card">Số CCCD/CMND:</label>
            <input
              type="text"
              id="identity_card"
              name="identity_card"
              value={formData.identity_card}
              onChange={handleChange}
              placeholder="Nhập số CCCD/CMND"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address_detail">Địa chỉ chi tiết:</label>
            <textarea
              id="address_detail"
              name="address_detail"
              value={formData.address_detail}
              onChange={handleChange}
              placeholder="Nhập địa chỉ chi tiết"
              rows="3"
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
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterLandlord;
