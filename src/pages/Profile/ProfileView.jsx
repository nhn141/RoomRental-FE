import React, { useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import '../Profile.css';

const ProfileView = () => {
  const { profile, loading, error, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
          <div className="profile-row">
            <label>Trạng Thái:</label>
            <span className={profile.is_active ? 'status-active' : 'status-inactive'}>
              {profile.is_active ? 'Hoạt động' : 'Vô hiệu'}
            </span>
          </div>
          <div className="profile-row">
            <label>Tạo Lúc:</label>
            <span>{new Date(profile.created_at).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
        <a href="/profile/edit" className="edit-btn">
          Chỉnh Sửa Profile
        </a>
      </div>
    </div>
  );
};

export default ProfileView;
