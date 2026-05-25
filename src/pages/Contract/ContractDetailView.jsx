import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContracts } from '../../hooks/useContracts';
import './Contract.css';

const ContractDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentContract, fetchContractById, loading, error, terminateContract, deleteContract } = useContracts();

  useEffect(() => {
    fetchContractById(id);
  }, [id, fetchContractById]);

  const getReturnPath = () => {
    if (user?.role === 'landlord') return '/contracts/landlord';
    if (user?.role === 'admin') return '/admin/contracts';
    return '/contracts/my';
  };

  const handleTerminate = async () => {
    if (window.confirm('Bạn chắc chắn muốn kết thúc hợp đồng này?')) {
      try {
        await terminateContract(id);
        alert('Kết thúc hợp đồng thành công');
        navigate(getReturnPath());
      } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn chắc chắn muốn xóa hợp đồng này?')) {
      try {
        await deleteContract(id);
        alert('Xóa hợp đồng thành công');
        navigate(getReturnPath());
      } catch (err) {
        alert('Lỗi: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const canTerminate = user && (
    user.id === currentContract?.landlord_id || 
    user.role === 'admin'
  );

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error || !currentContract) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error || 'Không thể tải chi tiết hợp đồng'}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="rental-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chi Tiết Hợp Đồng</h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5>{currentContract.post_title}</h5>
              <span className={`badge ${currentContract.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                {currentContract.status === 'active' ? 'Đang Hoạt Động' : 'Đã Kết Thúc'}
              </span>
            </div>

            <div className="card-body">
              {/* Thông tin bài đăng */}
              <div className="mb-4">
                <h6 className="text-primary">📍 Thông Tin Bài Đăng</h6>
                <p><strong>Địa chỉ:</strong> {currentContract.address_detail}</p>
                <p><strong>Tỉnh/Thành Phố:</strong> {currentContract.province_name}</p>
                <p><strong>Phường/Xã:</strong> {currentContract.ward_name}</p>
                <p><strong>Giá:</strong> {currentContract.post_price?.toLocaleString()} VNĐ/tháng</p>
              </div>

              {/* Thông tin các bên */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="text-success">👤 Người Thuê</h6>
                  <p><strong>Tên:</strong> {currentContract.tenant_name}</p>
                  <p><strong>Email:</strong> {currentContract.tenant_email}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-info">👤 Chủ Nhà</h6>
                  <p><strong>Tên:</strong> {currentContract.landlord_name}</p>
                  <p><strong>Email:</strong> {currentContract.landlord_email}</p>
                  <p><strong>SĐT:</strong> {currentContract.landlord_phone}</p>
                </div>
              </div>

              {/* Thông tin hợp đồng */}
              <div className="mb-4">
                <h6 className="text-primary">📋 Điều Khoản Hợp Đồng</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Ngày Bắt Đầu:</strong> {new Date(currentContract.start_date).toLocaleDateString('vi-VN')}
                    </p>
                    <p>
                      <strong>Ngày Kết Thúc:</strong> {new Date(currentContract.end_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Thời Hạn:</strong>{' '}
                      {Math.ceil(
                        (new Date(currentContract.end_date) - new Date(currentContract.start_date)) / (1000 * 60 * 60 * 24 * 30)
                      )}{' '}
                      tháng
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin tài chính */}
              <div className="mb-4">
                <h6 className="text-primary">💰 Thông Tin Tài Chính</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="alert alert-info">
                      <strong>Tiền Thuê Hàng Tháng:</strong>
                      <br />
                      {currentContract.monthly_rent?.toLocaleString()} VNĐ
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="alert alert-warning">
                      <strong>Tiền Đặt Cọc:</strong>
                      <br />
                      {currentContract.deposit_amount?.toLocaleString()} VNĐ
                    </div>
                  </div>
                </div>
              </div>

              {/* Link hợp đồng */}
              {currentContract.contract_url && (
                <div className="mb-4">
                  <h6 className="text-primary">📄 Tài Liệu Hợp Đồng</h6>
                  <a
                    href={currentContract.contract_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    Xem File PDF
                  </a>
                </div>
              )}

              {/* Ngày tạo */}
              <div className="text-muted small">
                <p>
                  <strong>Ngày Tạo:</strong> {new Date(currentContract.created_at).toLocaleString('vi-VN')}
                </p>
                <p>
                  <strong>Cập Nhật Lần Cuối:</strong> {new Date(currentContract.updated_at).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h6>Hành Động</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {canTerminate && currentContract.status === 'active' && (
                  <button
                    className="btn btn-danger"
                    onClick={handleTerminate}
                  >
                    🔚 Kết Thúc Hợp Đồng
                  </button>
                )}

                {user?.id === currentContract?.tenant_id && currentContract.status === 'active' && (
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    🗑️ Xóa Hợp Đồng
                  </button>
                )}

                {currentContract.status === 'terminated' && (
                  <div className="alert alert-warning">
                    ⚠️ Hợp đồng này đã kết thúc
                  </div>
                )}

                {!canTerminate && user?.id !== currentContract?.tenant_id && (
                  <div className="alert alert-info">
                    ℹ️ Bạn không có quyền chỉnh sửa hợp đồng này
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="card shadow-sm mt-3">
            <div className="card-header bg-light">
              <h6>Trạng Thái</h6>
            </div>
            <div className="card-body">
              <p>
                <strong>Tình Trạng:</strong>{' '}
                <span className={`badge ${currentContract.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                  {currentContract.status === 'active' ? '✓ Đang Hoạt Động' : '✗ Đã Kết Thúc'}
                </span>
              </p>
              <p className="text-muted small">
                {currentContract.status === 'active'
                  ? 'Hợp đồng này đang có hiệu lực'
                  : 'Hợp đồng này đã được kết thúc'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailView;
