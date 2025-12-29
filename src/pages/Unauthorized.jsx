import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Error.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-box">
        <h1>403</h1>
        <h2>Không Có Quyền Truy Cập</h2>
        <p>Xin lỗi, bạn không có quyền truy cập trang này.</p>
        <button onClick={() => navigate('/login')} className="error-btn">
          Quay Lại Đăng Nhập
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
