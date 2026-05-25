import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import './Profile.css';

const ProfileView = () => {
  const { profile, loading, error, fetchProfile } = useProfile();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      tenant: 'Người thuê',
      landlord: 'Chủ nhà',
      admin: 'Quản trị viên',
    };

    return roleMap[role] || role;
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
      <div className="profile-card">
        <h2>Thông tin cá nhân</h2>

        <div className="avatar-section">
          <div className="avatar-display">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Ảnh đại diện"
                className="avatar-img"
              />
            ) : (
              <div className="avatar-placeholder">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div className="avatar-info">
            <p className="avatar-name">{profile.full_name}</p>
            <span className="role-badge">{getRoleDisplay(profile.role)}</span>
          </div>
        </div>

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
            <label>Vai trò:</label>
            <span className="role-badge">{getRoleDisplay(profile.role)}</span>
          </div>

          {profile.phone_number && (
            <div className="profile-row">
              <label>Số điện thoại:</label>
              <span>{profile.phone_number}</span>
            </div>
          )}

          {profile.role === 'tenant' && (
            <>
              {profile.gender && (
                <div className="profile-row">
                  <label>Giới tính:</label>
                  <span>{profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}</span>
                </div>
              )}
              {profile.dob && (
                <div className="profile-row">
                  <label>Ngày sinh:</label>
                  <span>{new Date(profile.dob).toLocaleDateString('vi-VN')}</span>
                </div>
              )}
              {profile.target_province_name && (
                <div className="profile-row">
                  <label>Tỉnh/Thành phố đang tìm phòng:</label>
                  <span>{profile.target_province_name}</span>
                </div>
              )}
              {profile.target_ward_name && (
                <div className="profile-row">
                  <label>Phường/Xã đang tìm phòng:</label>
                  <span>{profile.target_ward_name}</span>
                </div>
              )}
              {profile.budget_min && (
                <div className="profile-row">
                  <label>Ngân sách:</label>
                  <span>
                    {profile.budget_min.toLocaleString('vi-VN')} - {profile.budget_max.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              )}
              {profile.bio && (
                <div className="profile-row">
                  <label>Giới thiệu:</label>
                  <span>{profile.bio}</span>
                </div>
              )}
            </>
          )}

          {profile.role === 'landlord' && (
            <>
              {profile.gender && (
                <div className="profile-row">
                  <label>Giới tính:</label>
                  <span>{profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}</span>
                </div>
              )}
              {profile.dob && (
                <div className="profile-row">
                  <label>Ngày sinh:</label>
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
                  <label>Địa chỉ:</label>
                  <span>{profile.address_detail}</span>
                </div>
              )}
              {profile.reputation_score !== undefined && (
                <div className="profile-row">
                  <label>Điểm uy tín:</label>
                  <span>{profile.reputation_score.toFixed(1)} ⭐</span>
                </div>
              )}
              {profile.bio && (
                <div className="profile-row">
                  <label>Giới thiệu:</label>
                  <span>{profile.bio}</span>
                </div>
              )}
            </>
          )}

          {profile.role === 'admin' && profile.department && (
            <div className="profile-row">
              <label>Phòng ban:</label>
              <span>{profile.department}</span>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <Link to="/profile/edit" className="edit-btn">
            Chỉnh sửa hồ sơ
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
