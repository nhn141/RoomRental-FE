import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res?.message || 'Nếu email tồn tại, bạn sẽ nhận được mã đặt lại mật khẩu.');
      // Optionally navigate to reset page so user can enter token
      // navigate('/reset-password');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Quên Mật Khẩu</h2>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email đã đăng ký:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Đang gửi...' : 'Gửi mã đặt lại'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            <a href="/login">Quay lại đăng nhập</a>
          </p>
          <p>
            Đã có mã đặt lại? <a href="/reset-password">Nhấn vào đây để đặt lại mật khẩu</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
