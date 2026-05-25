import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';
import profileService from '../../services/profileService';
import './Profile.css';

const PublicProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await profileService.getPublicProfile(id);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải hồ sơ người dùng');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const getRoleDisplay = (role) => {
    const roleMap = {
      tenant: 'Người thuê',
      landlord: 'Chủ nhà',
      admin: 'Quản trị viên',
    };

    return roleMap[role] || role;
  };

  const handleStartChat = async () => {
    if (!profile) return;
    setCreatingChat(true);
    try {
      const data = await chatService.createConversation({ recipient_id: profile.id });
      navigate(`/chat?conversationId=${data.conversation.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo hội thoại');
    } finally {
      setCreatingChat(false);
    }
  };

  if (loading) {
    return <div className="profile-container"><p>Đang tải...</p></div>;
  }

  if (error) {
    return <div className="profile-container"><div className="error-message">{error}</div></div>;
  }

  if (!profile) {
    return <div className="profile-container"><p>Không tìm thấy hồ sơ</p></div>;
  }

  const isCurrentUser = String(user?.id) === String(profile.id);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Hồ sơ người dùng</h2>

        <div className="avatar-section">
          <div className="avatar-display">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Ảnh đại diện" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div className="avatar-info">
            <p className="avatar-name">{profile.full_name || profile.email}</p>
            <span className="role-badge">{getRoleDisplay(profile.role)}</span>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-row">
            <label>Tên:</label>
            <span>{profile.full_name || 'Chưa cập nhật'}</span>
          </div>
          <div className="profile-row">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          {profile.phone_number && (
            <div className="profile-row">
              <label>Số điện thoại:</label>
              <span>{profile.phone_number}</span>
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
              <span>{Number(profile.reputation_score).toFixed(1)}</span>
            </div>
          )}
          {profile.target_province_name && (
            <div className="profile-row">
              <label>Khu vực tìm phòng:</label>
              <span>{[profile.target_ward_name, profile.target_province_name].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {profile.budget_min && (
            <div className="profile-row">
              <label>Ngân sách:</label>
              <span>
                {Number(profile.budget_min).toLocaleString('vi-VN')} - {Number(profile.budget_max).toLocaleString('vi-VN')} VND
              </span>
            </div>
          )}
          {profile.bio && (
            <div className="profile-row">
              <label>Giới thiệu:</label>
              <span>{profile.bio}</span>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Quay lại
          </button>
          {!isCurrentUser && (
            <button type="button" className="edit-btn" onClick={handleStartChat} disabled={creatingChat}>
              {creatingChat ? 'Đang tạo...' : 'Gửi tin nhắn'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfileView;
