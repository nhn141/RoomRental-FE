import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContracts } from '../../hooks/useContracts';
import './Contract.css';

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
      <div className="contracts-container">
        <div className="error-message">
          Chỉ người thuê mới có thể xem trang này
        </div>
      </div>
    );
  }

  return (
    <div className="contracts-container">
      <div className="page-header">
        <button 
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'landlord' ? '/landlord' : '/tenant')}
          className="home-btn"
          title="Về Dashboard"
        >
          🏠
        </button>
      </div>
      <div className="contracts-header">
        <h1>Hợp Đồng Của Tôi</h1>
        <div className="contracts-header-nav">
          <button
            className="create-contract-btn"
            onClick={() => navigate('/rental-posts')}
          >
            + Tạo Hợp Đồng Mới
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filter */}
      <div className="filter-section">
        <button
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          Tất Cả ({myContracts.length})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
          onClick={() => setStatusFilter('active')}
        >
          Đang Hoạt Động ({myContracts.filter(c => c.status === 'active').length})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'terminated' ? 'active' : ''}`}
          onClick={() => setStatusFilter('terminated')}
        >
          Đã Kết Thúc ({myContracts.filter(c => c.status === 'terminated').length})
        </button>
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="loading-state">
          <p>Đang tải...</p>
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có hợp đồng nào. Hãy tìm phòng và tạo hợp đồng!</p>
        </div>
      ) : (
        <div className="contracts-grid">
          {filteredContracts.map((contract) => (
            <div key={contract.id} className="contract-card">
              <div className="contract-header">
                <h3>{contract.post_title}</h3>
                <span className={`status-badge status-${contract.status}`}>
                  {contract.status === 'active' ? 'Đang Hoạt Động' : 'Đã Kết Thúc'}
                </span>
              </div>

              <div className="contract-body">
                <p className="landlord">
                  <strong>Chủ Nhà:</strong> {contract.landlord_name}
                </p>
                <p className="price">
                  <strong>Tiền Thuê:</strong> {contract.monthly_rent?.toLocaleString('vi-VN')} VNĐ/tháng
                </p>
                <p>
                  <strong>Tiền Cọc:</strong> {contract.deposit_amount?.toLocaleString('vi-VN')} VNĐ
                </p>
                <p className="date-range">
                  <strong>Thời Gian:</strong> {new Date(contract.start_date).toLocaleDateString('vi-VN')} - {new Date(contract.end_date).toLocaleDateString('vi-VN')}
                </p>
              </div>

              <div className="contract-footer">
                <button
                  className="view-btn"
                  onClick={() => handleViewDetail(contract.id)}
                >
                  Chi Tiết
                </button>
                {contract.status === 'active' && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(contract.id)}
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContractsView;
