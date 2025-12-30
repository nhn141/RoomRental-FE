import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContracts } from '../../hooks/useContracts';
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

  useEffect(() => {
    // Lấy thông tin bài đăng từ URL parameter
    const postId = new URLSearchParams(window.location.search).get('post_id');
    if (!postId) {
      setValidationError('Thiếu thông tin bài đăng');
      return;
    }

    // Fetch post details (nên call API rental-posts/:id)
    const fetchPostDetails = async () => {
      try {
        // TODO: import rentalPostService
        // const postData = await rentalPostService.getPostById(postId);
        // setPostInfo(postData.post);
        console.log('Fetching post details for:', postId);
      } catch (err) {
        setValidationError('Không thể tải thông tin bài đăng');
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
      <div className="container mt-4">
        <div className="alert alert-danger">
          Chỉ người thuê mới có thể tạo hợp đồng
        </div>
      </div>
    );
  }

  return (
    <div className="rental-container">
      <div className="page-header">
        <button 
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'landlord' ? '/landlord' : '/tenant')}
          className="home-btn"
          title="Về Dashboard"
        >
          🏠
        </button>
      </div>
      <div className="card">
        <div className="card-header">
          <h2>Tạo Hợp Đồng Thuê Phòng</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {validationError && <div className="alert alert-danger">{validationError}</div>}

          {postInfo && (
            <div className="alert alert-info mb-3">
              <h5>Bài đăng: {postInfo.title}</h5>
              <p>Giá: {postInfo.price?.toLocaleString()} VNĐ/tháng</p>
              <p>Địa chỉ: {postInfo.address_detail}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="post_id" className="form-label">
                ID Bài Đăng *
              </label>
              <input
                type="text"
                className="form-control"
                id="post_id"
                name="post_id"
                value={formData.post_id}
                onChange={handleChange}
                disabled
                readOnly
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="start_date" className="form-label">
                    Ngày Bắt Đầu *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="end_date" className="form-label">
                    Ngày Kết Thúc *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="monthly_rent" className="form-label">
                    Tiền Thuê Hàng Tháng (VNĐ) *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="monthly_rent"
                    name="monthly_rent"
                    value={formData.monthly_rent}
                    onChange={handleChange}
                    placeholder="5000000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="deposit_amount" className="form-label">
                    Tiền Đặt Cọc (VNĐ) *
                  </label>
                  <input
                    type="number"
                    className="form-control"
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
            </div>

            <div className="form-group mb-3">
              <label htmlFor="contract_url" className="form-label">
                Link Hợp Đồng (PDF)
              </label>
              <input
                type="url"
                className="form-control"
                id="contract_url"
                name="contract_url"
                value={formData.contract_url}
                onChange={handleChange}
                placeholder="https://example.com/contract.pdf"
              />
              <small className="text-muted">
                Vui lòng cung cấp link tới file hợp đồng (nếu có)
              </small>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Đang tạo...' : 'Tạo Hợp Đồng'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Quay Lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContractView;
