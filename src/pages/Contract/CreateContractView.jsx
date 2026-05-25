import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContracts } from '../../hooks/useContracts';
import rentalPostService from '../../services/rentalPostService';
import './Contract.css';

const CreateContractView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createContract, loading, error, clearError } = useContracts();
  
  const [formData, setFormData] = useState({
    post_id: new URLSearchParams(window.location.search).get('post_id') || '',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    deposit_amount: '',
    contract_url: '',
  });

  const [postInfo, setPostInfo] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [fetchingPost, setFetchingPost] = useState(false);

  useEffect(() => {
    // Lấy thông tin bài đăng từ URL parameter
    const postId = new URLSearchParams(window.location.search).get('post_id');
    if (!postId) {
      setValidationError('Thiếu thông tin bài đăng');
      return;
    }

    // Fetch post details
    const fetchPostDetails = async () => {
      setFetchingPost(true);
      try {
        const data = await rentalPostService.getPostById(postId);
        setPostInfo(data.post);
        setFormData(prev => ({
          ...prev,
          monthly_rent: data.post.price || ''
        }));
      } catch {
        setValidationError('Không thể tải thông tin bài đăng');
      } finally {
        setFetchingPost(false);
      }
    };

    fetchPostDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    // Validation
    if (!formData.post_id) {
      setValidationError('Vui lòng chọn bài đăng');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setValidationError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    const sd = new Date(formData.start_date);
    const ed = new Date(formData.end_date);
    if (isNaN(sd.getTime()) || isNaN(ed.getTime())) {
      setValidationError('Ngày không hợp lệ');
      return;
    }
    if (sd >= ed) {
      setValidationError('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    // minimum 30 days
    const diff = ed - sd;
    const minMs = 30 * 24 * 60 * 60 * 1000;
    if (diff < minMs) {
      setValidationError('Thời hạn hợp đồng phải ít nhất 30 ngày');
      return;
    }

    if (!formData.monthly_rent || formData.monthly_rent <= 0) {
      setValidationError('Vui lòng nhập tiền thuê hàng tháng hợp lệ');
      return;
    }

    if (!formData.deposit_amount || formData.deposit_amount <= 0) {
      setValidationError('Vui lòng nhập tiền đặt cọc hợp lệ');
      return;
    }

    try {
      await createContract(formData);
      navigate('/contracts/my');
    } catch (err) {
      // Error từ hook sẽ được set trong error state
      console.error('Lỗi tạo hợp đồng:', err);
    }
  };

  if (!user || user.role !== 'tenant') {
    return (
      <div className="rental-container">
        <div className="error-message" style={{ marginTop: '20px' }}>
          Chỉ người thuê mới có thể tạo hợp đồng
        </div>
      </div>
    );
  }

  return (
    <div className="rental-container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', background: 'var(--primary-gradient)', color: 'white' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>📋 Tạo Hợp Đồng Thuê Phòng</h2>
          </div>
          <div style={{ padding: '30px' }}>
            {(error || validationError) && (
              <div style={{ background: '#fee', border: '1px solid #fcc', padding: '12px', borderRadius: '6px', marginBottom: '20px', color: '#c33' }}>
                {error || validationError}
              </div>
            )}

            {fetchingPost && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Đang tải thông tin bài đăng...
              </div>
            )}

            {postInfo && (
              <div style={{ background: '#f0f4ff', border: '1px solid #e0e8ff', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#333', fontWeight: 'bold' }}>📌 Bài đăng: {postInfo.title}</h5>
                <p style={{ margin: '6px 0', color: '#555' }}>💰 Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(postInfo.price)}/tháng</p>
                <p style={{ margin: '6px 0', color: '#555' }}>📍 Địa chỉ: {postInfo.address_detail}</p>
                <p style={{ margin: '6px 0', color: '#555' }}>🏘️ Quận: {postInfo.ward_name}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  ID Bài Đăng *
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    background: '#f5f5f5',
                    cursor: 'not-allowed'
                  }}
                  id="post_id"
                  name="post_id"
                  value={formData.post_id}
                  onChange={handleChange}
                  disabled
                  readOnly
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Ngày Bắt Đầu *
                  </label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Ngày Kết Thúc *
                  </label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Tiền Thuê Hàng Tháng (VNĐ) *
                  </label>
                  <input
                    type="number"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    id="monthly_rent"
                    name="monthly_rent"
                    value={formData.monthly_rent}
                    onChange={handleChange}
                    placeholder="5000000"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Tiền Đặt Cọc (VNĐ) *
                  </label>
                  <input
                    type="number"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    id="deposit_amount"
                    name="deposit_amount"
                    value={formData.deposit_amount}
                    onChange={handleChange}
                    placeholder="10000000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Link Hợp Đồng (PDF)
                </label>
                <input
                  type="url"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  id="contract_url"
                  name="contract_url"
                  value={formData.contract_url}
                  onChange={handleChange}
                  placeholder="https://example.com/contract.pdf"
                />
                <small style={{ color: '#666', fontSize: '0.85em', marginTop: '6px', display: 'block' }}>
                  Vui lòng cung cấp link tới file hợp đồng (nếu có)
                </small>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  disabled={loading}
                  onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? '⏳ Đang tạo...' : '✅ Tạo hợp đồng'}
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#e0e0e0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate(-1)}
                  onMouseEnter={(e) => (e.target.style.background = '#d0d0d0')}
                  onMouseLeave={(e) => (e.target.style.background = '#e0e0e0')}
                >
                  ← Quay lại
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContractView;
