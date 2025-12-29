import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import '../Profile.css';

const EditProfileView = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    looking_for_area: '',
    identity_card: '',
    address_detail: '',
  });
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const { profile, loading: fetchLoading, fetchProfile, updateProfile, loading: updateLoading, error: updateError } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        looking_for_area: profile.looking_for_area || '',
        identity_card: profile.identity_card || '',
        address_detail: profile.address_detail || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Tên không được trống';
    }
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
      await updateProfile(formData);
      alert('Cập nhật profile thành công');
      navigate('/profile');
    } catch (err) {
      console.error('Lỗi cập nhật profile:', err);
    }
  };

  if (fetchLoading) {
    return <div className="profile-container"><p>Đang tải...</p></div>;
  }

  return (
    <div className="profile-container">
      <div className="edit-profile-card">
        <h2>Chỉnh Sửa Profile</h2>

        {updateError && <div className="error-message">{updateError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Họ và Tên: *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={errors.full_name ? 'input-error' : ''}
            />
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Số Điện Thoại:</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          {user?.role === 'tenant' && (
            <div className="form-group">
              <label htmlFor="looking_for_area">Khu Vực Tìm Kiếm:</label>
              <input
                type="text"
                id="looking_for_area"
                name="looking_for_area"
                value={formData.looking_for_area}
                onChange={handleChange}
                placeholder="VD: Quận 1, TP.HCM"
              />
            </div>
          )}

          {user?.role === 'landlord' && (
            <>
              <div className="form-group">
                <label htmlFor="identity_card">Số CCCD/CMND:</label>
                <input
                  type="text"
                  id="identity_card"
                  name="identity_card"
                  value={formData.identity_card}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address_detail">Địa Chỉ Chi Tiết:</label>
                <textarea
                  id="address_detail"
                  name="address_detail"
                  value={formData.address_detail}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" disabled={updateLoading} className="submit-btn">
              {updateLoading ? 'Đang cập nhật...' : 'Cập Nhật'}
            </button>
            <button type="button" onClick={() => navigate('/profile')} className="cancel-btn">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileView;
