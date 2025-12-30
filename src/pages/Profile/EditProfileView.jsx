import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useLocation } from '../../hooks/useLocation';
import '../Profile.css';

const EditProfileView = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    // Tenant fields
    target_province_code: '',
    target_ward_code: '',
    budget_min: '',
    budget_max: '',
    gender: '',
    dob: '',
    bio: '',
    // Landlord fields
    identity_card: '',
    address_detail: '',
    // Admin fields
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [provinceNameDisplay, setProvinceNameDisplay] = useState('');
  const [wardNameDisplay, setWardNameDisplay] = useState('');
  const { user } = useAuth();
  const { profile, loading: fetchLoading, fetchProfile, updateProfile, loading: updateLoading, error: updateError } = useProfile();
  const { provinces, wards, loadingProvinces, loadingWards, fetchWards } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      const formDataToSet = {
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        target_province_code: profile.target_province_code || '',
        target_ward_code: profile.target_ward_code || '',
        budget_min: profile.budget_min || '',
        budget_max: profile.budget_max || '',
        gender: profile.gender || '',
        dob: profile.dob || '',
        bio: profile.bio || '',
        identity_card: profile.identity_card || '',
        address_detail: profile.address_detail || '',
        department: profile.department || '',
      };
      setFormData(formDataToSet);

      // Set display names từ profile
      setProvinceNameDisplay(profile.target_province_name || '');
      setWardNameDisplay(profile.target_ward_name || '');

      // Fetch wards khi có province_code
      if (profile.target_province_code) {
        fetchWards(profile.target_province_code);
      }
    }
  }, [profile, fetchWards]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'target_province_code') {
      // Tìm province object để lấy display name
      const selectedProvince = provinces.find(p => p.id === value);
      setFormData(prev => ({
        ...prev,
        target_province_code: value,
        target_ward_code: '',
      }));
      setProvinceNameDisplay(selectedProvince ? (selectedProvince.full_name || selectedProvince.name) : value);
      setWardNameDisplay('');
      
      // Fetch wards khi select province
      if (value) {
        fetchWards(value);
      }
    } else if (name === 'target_ward_code') {
      // Tìm ward object để lấy display name
      const selectedWard = wards.find(w => w.id === value);
      setFormData(prev => ({
        ...prev,
        target_ward_code: value,
      }));
      setWardNameDisplay(selectedWard ? (selectedWard.name_with_type || selectedWard.name) : value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

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
            <>
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
                <label htmlFor="target_province_code">Tỉnh/Thành Phố: *</label>
                <input
                  type="text"
                  id="target_province_code"
                  name="target_province_code"
                  value={provinceNameDisplay}
                  onChange={handleChange}
                  placeholder="Nhập hoặc chọn tỉnh/thành phố..."
                  list="provinces-list"
                  style={{ width: '100%' }}
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
                <label htmlFor="target_ward_code">Phường/Xã: *</label>
                <input
                  type="text"
                  id="target_ward_code"
                  name="target_ward_code"
                  value={wardNameDisplay}
                  onChange={handleChange}
                  placeholder="Nhập hoặc chọn phường/xã..."
                  list="wards-list"
                  disabled={!formData.target_province_code}
                  style={{ width: '100%' }}
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
                  rows="4"
                  placeholder="Giới thiệu về bản thân..."
                />
              </div>
            </>
          )}

          {user?.role === 'landlord' && (
            <>
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

              <div className="form-group">
                <label htmlFor="bio">Giới Thiệu:</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Giới thiệu về bản thân..."
                />
              </div>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className="form-group">
                <label htmlFor="department">Phòng Ban:</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="VD: Quản lý Nội dung"
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
