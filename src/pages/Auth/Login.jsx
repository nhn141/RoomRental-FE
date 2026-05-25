import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, role);
      const from = location.state?.from?.pathname;
      navigate(from || `/${role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Đăng Nhập</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            <label>Chọn vai trò:</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                Admin
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'landlord' ? 'active' : ''}`}
                onClick={() => setRole('landlord')}
              >
                Chủ Nhà
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'tenant' ? 'active' : ''}`}
                onClick={() => setRole('tenant')}
              >
                Người Thuê
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
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

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-links">
          {role !== 'admin' && (
            <p>
              Chưa có tài khoản?{' '}
              <Link to={`/register/${role}`}>Đăng ký ngay</Link>
            </p>
          )}
          <p>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </p>
          <p>
            Đã có mã đặt lại? <Link to="/reset-password">Đặt lại bằng mã</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
