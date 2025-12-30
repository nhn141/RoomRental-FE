import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContracts } from '../../hooks/useContracts';
import '../RentalPost/RentalPost.css';

const MyContractsView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { myContracts, fetchMyContracts, loading, error, deleteContract } = useContracts();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.role === 'tenant') {
      fetchMyContracts();
    }
  }, [user?.id]);

  const handleDelete = async (contractId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa hợp đồng này?')) {
      try {
        await deleteContract(contractId);
        alert('Xóa hợp đồng thành công');
      } catch (err) {
        alert('Lỗi khi xóa hợp đồng: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleViewDetail = (contractId) => {
    navigate(`/contracts/${contractId}`);
  };

  const filteredContracts = statusFilter === 'all' 
    ? myContracts 
    : myContracts.filter(c => c.status === statusFilter);

  if (!user || user.role !== 'tenant') {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Chỉ người thuê mới có thể xem trang này
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Hợp Đồng Của Tôi</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/rental-posts')}
        >
          + Tạo Hợp Đồng Mới
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter */}
      <div className="mb-3">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setStatusFilter('all')}
          >
            Tất Cả ({myContracts.length})
          </button>
          <button
            type="button"
            className={`btn ${statusFilter === 'active' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setStatusFilter('active')}
          >
            Đang Hoạt Động ({myContracts.filter(c => c.status === 'active').length})
          </button>
          <button
            type="button"
            className={`btn ${statusFilter === 'terminated' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setStatusFilter('terminated')}
          >
            Đã Kết Thúc ({myContracts.filter(c => c.status === 'terminated').length})
          </button>
        </div>
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="alert alert-info">
          Bạn chưa có hợp đồng nào. Hãy tìm phòng và tạo hợp đồng!
        </div>
      ) : (
        <div className="row">
          {filteredContracts.map((contract) => (
            <div key={contract.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{contract.post_title}</h5>
                    <span
                      className={`badge ${
                        contract.status === 'active' ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {contract.status === 'active' ? 'Đang Hoạt Động' : 'Đã Kết Thúc'}
                    </span>
                  </div>

                  <p className="card-text text-muted small">
                    <strong>Chủ Nhà:</strong> {contract.landlord_name}
                  </p>

                  <div className="mb-2">
                    <p className="card-text">
                      <strong>Tiền Thuê:</strong> {contract.monthly_rent?.toLocaleString()} VNĐ/tháng
                    </p>
                    <p className="card-text">
                      <strong>Tiền Cọc:</strong> {contract.deposit_amount?.toLocaleString()} VNĐ
                    </p>
                    <p className="card-text small text-muted">
                      <strong>Thời Gian:</strong> {new Date(contract.start_date).toLocaleDateString('vi-VN')} - {new Date(contract.end_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewDetail(contract.id)}
                    >
                      Chi Tiết
                    </button>
                    {contract.status === 'active' && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(contract.id)}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContractsView;
