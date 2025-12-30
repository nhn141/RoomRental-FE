import React, { useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Profile.css';

const ProfileView = () => {
  const { profile, loading, error, fetchProfile } = useProfile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="profile-container"><p>Đang tải...</p></div>;
  }

  if (error) {
    return <div className="profile-container"><div className="error-message">{error}</div></div>;
  }

  if (!profile) {
    return <div className="profile-container"><p>Không tìm thấy profile</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'landlord' ? '/landlord' : '/tenant')}
          className="home-btn"
          title="Về Dashboard"
        >
          🏠
        </button>
      </div>
      <div className="profile-card">
        <h2>Thông Tin Cá Nhân</h2>
        <div className="profile-content">
          <div className="profile-row">
            <label>Tên:</label>
            <span>{profile.full_name}</span>
          </div>
          <div className="profile-row">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          <div className="profile-row">
            <label>Vai Trò:</label>
            <span className="role-badge">{profile.role}</span>
          </div>
          {profile.phone_number && (
            <div className="profile-row">
              <label>Số Điện Thoại:</label>
              <span>{profile.phone_number}</span>
            </div>
          )}
          
          {/* Tenant specific fields */}
          {profile.role === 'tenant' && (
            <>
              {profile.gender && (
                <div className="profile-row">
                  <label>Giới Tính:</label>
                  <span>
                    {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}
                  </span>
                </div>
              )}
              {profile.dob && (
                <div className="profile-row">
                  <label>Ngày Sinh:</label>
                  <span>{new Date(profile.dob).toLocaleDateString('vi-VN')}</span>
                </div>
              )}
              {profile.target_province_name && (
                <div className="profile-row">
                  <label>Tỉnh/Thành Phố:</label>
                  <span>{profile.target_province_name}</span>
                </div>
              )}
              {profile.target_ward_name && (
                <div className="profile-row">
                  <label>Phường/Xã:</label>
                  <span>{profile.target_ward_name}</span>
                </div>
              )}
              {profile.budget_min && (
                <div className="profile-row">
                  <label>Ngân Sách:</label>
                  <span>
                    {profile.budget_min.toLocaleString('vi-VN')} - {profile.budget_max.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              )}
              {profile.bio && (
                <div className="profile-row">
                  <label>Giới Thiệu:</label>
                  <span>{profile.bio}</span>
                </div>
              )}
            </>
          )}

          {/* Landlord specific fields */}
          {profile.role === 'landlord' && (
            <>
              {profile.gender && (
                <div className="profile-row">
                  <label>Giới Tính:</label>
                  <span>
                    {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}
                  </span>
                </div>
              )}
              {profile.dob && (
                <div className="profile-row">
                  <label>Ngày Sinh:</label>
                  <span>{new Date(profile.dob).toLocaleDateString('vi-VN')}</span>
                </div>
              )}
              {profile.identity_card && (
                <div className="profile-row">
                  <label>Số CCCD/CMND:</label>
                  <span>{profile.identity_card}</span>
                </div>
              )}
              {profile.address_detail && (
                <div className="profile-row">
                  <label>Địa Chỉ:</label>
                  <span>{profile.address_detail}</span>
                </div>
              )}
              {profile.reputation_score !== undefined && (
                <div className="profile-row">
                  <label>Điểm Uy Tín:</label>
                  <span>{profile.reputation_score.toFixed(1)} ⭐</span>
                </div>
              )}
              {profile.bio && (
                <div className="profile-row">
                  <label>Giới Thiệu:</label>
                  <span>{profile.bio}</span>
                </div>
              )}
            </>
          )}

          {/* Admin specific fields */}
          {profile.role === 'admin' && (
            <>
              {profile.department && (
                <div className="profile-row">
                  <label>Phòng Ban:</label>
                  <span>{profile.department}</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="profile-actions">
          <a href="/profile/edit" className="edit-btn">
            ✏️ Chỉnh sửa hồ sơ
          </a>
          <button 
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
