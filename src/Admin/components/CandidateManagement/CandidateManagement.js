import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import styles from './CandidateManagement.module.css';

const API_URL = 'https://api-tuyendung-cty.onrender.com/api/profile';

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState(null);
  const [positions, setPositions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // Status mapping for display (backend -> UI)
  const statusDisplayMap = {
    pending: 'Mới',
    reviewed: 'Đã xem xét',
    interview: 'Đang phỏng vấn',
    accepted: 'Đã tuyển dụng',
    rejected: 'Đã từ chối',
  };

  // Status mapping for backend (UI -> backend)
  const statusBackendMap = {
    'Mới': 'pending',
    'Đã xem xét': 'reviewed',
    'Đang phỏng vấn': 'interview',
    'Đã tuyển dụng': 'accepted',
    'Đã từ chối': 'rejected',
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const normalizeVietnamese = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  };

  const sanitizeHTML = (str) => {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
      navigate('/admin/login');
      return null;
    }
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  };

  // Fetch all candidates
  const fetchCandidates = async () => {
    setIsLoading(true);
    const headers = getAuthHeaders();
    if (!headers) return [];
    try {
      const response = await fetch(API_URL, { headers });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
        navigate('/admin/login');
        return [];
      }
      if (!response.ok) throw new Error(`Không thể tải danh sách ứng viên: ${response.status} ${response.statusText}`);
      const data = await response.json();
      return data.map(candidate => ({
        ...candidate,
        id: candidate._id || candidate.jobId,
        name: sanitizeHTML(candidate.form?.fullName),
        email: sanitizeHTML(candidate.form?.email),
        phone: sanitizeHTML(candidate.form?.phone),
        position: sanitizeHTML(candidate.jobName),
        workplace: sanitizeHTML(candidate.jobWorkplace),
        desiredWorkplace: sanitizeHTML(candidate.form?.desiredWorkplace),
        date: formatDate(candidate.appliedAt),
        birthdate: formatDate(candidate.form?.dob),
        gender: sanitizeHTML(candidate.form?.gender),
        note: sanitizeHTML(candidate.form?.note),
        resume: candidate.form?.resume,
        status: statusDisplayMap[candidate.status] || candidate.status,
      }));
    } catch (error) {
      console.error('Error fetching candidates:', error);
      showNotification(`Lỗi khi tải danh sách ứng viên: ${error.message}`, 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Update positions based on fetched candidates
  const updatePositions = (candidatesData) => {
    const uniquePositions = [...new Set(candidatesData.map(c => c.position).filter(Boolean))];
    setPositions(uniquePositions);
  };

  // Display candidates with pagination
  const displayCandidates = (page = 1, data) => {
    const displayData = data || (filteredCandidates || candidates);
    if (displayData.length === 0) {
      setCandidates([]);
      setTotalPages(1);
      setCurrentPage(1);
      setFilteredCandidates(null);
      return;
    }
    updatePositions(displayData);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, displayData.length);
    const paginatedData = displayData.slice(startIndex, endIndex);
    setCandidates(paginatedData);
    setTotalPages(Math.ceil(displayData.length / itemsPerPage));
    setCurrentPage(page);
  };

  const handlePageChange = (page) => {
    displayCandidates(page, filteredCandidates || candidates);
  };

  // View candidate details
  const viewCandidate = async (id) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { headers });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
        navigate('/admin/login');
        return;
      }
      if (!response.ok) throw new Error(`Không tìm thấy ứng viên: ${response.status} ${response.statusText}`);
      const candidate = await response.json();
      setSelectedCandidate({
        ...candidate,
        id: candidate._id || candidate.jobId,
        name: sanitizeHTML(candidate.form?.fullName),
        email: sanitizeHTML(candidate.form?.email),
        phone: sanitizeHTML(candidate.form?.phone),
        position: sanitizeHTML(candidate.jobName),
        workplace: sanitizeHTML(candidate.jobWorkplace),
        desiredWorkplace: sanitizeHTML(candidate.form?.desiredWorkplace),
        date: formatDate(candidate.appliedAt),
        birthdate: formatDate(candidate.form?.dob),
        gender: sanitizeHTML(candidate.form?.gender),
        note: sanitizeHTML(candidate.form?.note),
        resume: candidate.form?.resume,
        status: statusDisplayMap[candidate.status] || candidate.status,
      });
    } catch (error) {
      console.error('Error viewing candidate:', error);
      showNotification(`Lỗi khi tải thông tin ứng viên: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // View CV using a Blob response
  const viewCV = async (candidateId) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${candidateId}/cv`, { headers });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
        navigate('/admin/login');
        return;
      }
      if (!response.ok) {
        throw new Error(`Không thể tải CV: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error('Error viewing CV:', error);
      showNotification('Không tìm thấy CV của ứng viên hoặc lỗi server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Update candidate status
  const changeStatus = async (id, newStatus) => {
    const backendStatus = statusBackendMap[newStatus];
    if (!backendStatus) {
      showNotification('Trạng thái không hợp lệ', 'error');
      return;
    }
    const headers = getAuthHeaders();
    if (!headers) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: backendStatus }),
      });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
        navigate('/admin/login');
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không thể cập nhật trạng thái: ${response.status}`);
      }
      const updatedCandidates = candidates.map(c =>
        c.id === id ? { ...c, status: newStatus } : c
      );
      const updatedFiltered = filteredCandidates
        ? filteredCandidates.map(c => c.id === id ? { ...c, status: newStatus } : c)
        : null;
      setCandidates(updatedCandidates);
      setFilteredCandidates(updatedFiltered);
      setSelectedCandidate(null);
      displayCandidates(currentPage, updatedFiltered || updatedCandidates);
      showNotification(`Đã cập nhật trạng thái thành "${newStatus}"`, 'success');
    } catch (error) {
      console.error('Error changing status:', error);
      showNotification(`Lỗi khi cập nhật trạng thái: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Soft delete (hide) candidate
  const hideCandidate = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ứng viên này?')) return;
    const headers = getAuthHeaders();
    if (!headers) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
        navigate('/admin/login');
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không thể ẩn ứng viên: ${response.status}`);
      }
      const updatedCandidates = candidates.map(c =>
        c.id === id ? { ...c, status: 'Đã từ chối' } : c
      );
      const updatedFiltered = filteredCandidates
        ? filteredCandidates.map(c => c.id === id ? { ...c, status: 'Đã từ chối' } : c)
        : null;
      setCandidates(updatedCandidates);
      setFilteredCandidates(updatedFiltered);
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(null);
      }
      displayCandidates(currentPage, updatedFiltered || updatedCandidates);
      showNotification('Đã xóa ứng viên thành công', 'success');
    } catch (error) {
      console.error('Error hiding candidate:', error);
      showNotification(`Lỗi khi ẩn ứng viên: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters with debounced search
  const handleApplyFilters = async () => {
    const positionFilter = document.getElementById('positionFilter')?.value;
    const statusFilter = document.getElementById('statusFilter')?.value;
    const searchTerm = document.querySelector('.search-bar')?.value.trim().toLowerCase();
    let candidatesData = await fetchCandidates();

    if (searchTerm) {
      const normalizedSearchTerm = normalizeVietnamese(searchTerm);
      candidatesData = candidatesData.filter(
        candidate =>
          normalizeVietnamese(candidate.name).includes(normalizedSearchTerm) ||
          normalizeVietnamese(candidate.email).includes(normalizedSearchTerm) ||
          normalizeVietnamese(candidate.id).includes(normalizedSearchTerm) ||
          (candidate.position && normalizeVietnamese(candidate.position).includes(normalizedSearchTerm))
      );
    }
    if (positionFilter) {
      candidatesData = candidatesData.filter(c => c.position === positionFilter);
    }
    if (statusFilter) {
      candidatesData = candidatesData.filter(c => c.status === statusFilter);
    }

    setFilteredCandidates(candidatesData);
    if (candidatesData.length === 0) {
      showNotification('Không tìm thấy ứng viên phù hợp', 'info');
    }
    displayCandidates(1, candidatesData);
  };

  const debouncedSearch = debounce(() => handleApplyFilters(), 300);

  const handleSearchChange = () => {
    debouncedSearch();
  };

  // Reset filters
  const resetFilters = async () => {
    document.getElementById('positionFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.querySelector('.search-bar').value = '';
    setFilteredCandidates(null);
    const freshData = await fetchCandidates();
    setCandidates(freshData);
    displayCandidates(1, freshData);
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showNotification('Vui lòng đăng nhập để tiếp tục', 'error');
      navigate('/admin/login');
      return;
    }
    const loadCandidates = async () => {
      const freshData = await fetchCandidates();
      setCandidates(freshData);
      displayCandidates(1, freshData);
    };
    loadCandidates();
  }, [navigate]);

  const uniqueStatuses = [...new Set(candidates.map(candidate => candidate.status))];

  const getStatusClass = (status) => {
    const statusMap = {
      'Mới': styles.moi,
      'Đã xem xét': styles.daXemXet,
      'Đang phỏng vấn': styles.phongVan,
      'Đã tuyển dụng': styles.duocNhan,
      'Đã từ chối': styles.tuChoi,
    };
    return statusMap[status] || '';
  };

  // Create pagination buttons
  const getPaginationButtons = () => {
    const maxButtons = 5;
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || isLoading}
      >
        <i className="fa-solid fa-angles-left"></i>
      </button>
    );

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <i className="fa-solid fa-angle-left"></i>
      </button>
    );

    if (startPage > 1) {
      buttons.push(<span key="start-ellipsis">...</span>);
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          className={page === currentPage ? styles.active : ''}
          onClick={() => handlePageChange(page)}
          disabled={isLoading}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      buttons.push(<span key="end-ellipsis">...</span>);
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        <i className="fa-solid fa-angle-right"></i>
      </button>
    );

    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
      >
        <i className="fa-solid fa-angles-right"></i>
      </button>
    );

    return buttons;
  };

  return (
    <div className={styles.container}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          className="search-bar"
          placeholder="Tìm kiếm ứng viên..."
          onChange={handleSearchChange}
          disabled={isLoading}
        />
        <select id="positionFilter" onChange={handleApplyFilters} disabled={isLoading}>
          <option value="">- Tất cả vị trí -</option>
          {positions.map((pos, index) => (
            <option key={index} value={pos}>{pos}</option>
          ))}
        </select>
        <select id="statusFilter" onChange={handleApplyFilters} disabled={isLoading}>
          <option value="">- Tất cả trạng thái -</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button onClick={handleApplyFilters} disabled={isLoading}>
          <i className="fa-solid fa-filter"></i> Áp dụng
        </button>
        <button onClick={resetFilters} disabled={isLoading}>
          <i className="fa-solid fa-rotate"></i> Đặt lại
        </button>
      </div>

      {/* Candidate list */}
      <div className={styles.applications}>
        <h3>Danh Sách Hồ Sơ Ứng Tuyển</h3>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Số Điện Thoại</th>
              <th>Vị Trí Ứng Tuyển</th>
              <th>Ngày Nộp</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 && !isLoading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu phù hợp</td></tr>
            ) : (
              candidates.map((candidate, index) => (
                <tr key={candidate.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>{candidate.position}</td>
                  <td>{candidate.date}</td>
                  <td><span className={`${styles.status} ${getStatusClass(candidate.status)}`}>{candidate.status}</span></td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.view} onClick={() => viewCandidate(candidate.id)} disabled={isLoading}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className={styles.viewCV} onClick={() => viewCV(candidate.id)} disabled={isLoading}>
                        <i className="fa-solid fa-file-pdf"></i>
                      </button>
                      <button className={styles.delete} onClick={() => hideCandidate(candidate.id)} disabled={isLoading}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={styles.pagination}>
          {getPaginationButtons()}
        </div>
      </div>

      {/* Candidate details modal */}
      {selectedCandidate && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setSelectedCandidate(null)}>×</span>
            <h3>Thông tin chi tiết: {selectedCandidate.name}</h3>
            <div className={styles.candidateDetails}>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>ID:</label>
                  <p>{selectedCandidate.id}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Trạng thái:</label>
                  <p><span className={`${styles.status} ${getStatusClass(selectedCandidate.status)}`}>{selectedCandidate.status}</span></p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Họ tên:</label>
                  <p>{selectedCandidate.name}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Email:</label>
                  <p>{selectedCandidate.email}</p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Số điện thoại:</label>
                  <p>{selectedCandidate.phone}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Giới tính:</label>
                  <p>{selectedCandidate.gender}</p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Ngày sinh:</label>
                  <p>{selectedCandidate.birthdate}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Vị trí ứng tuyển:</label>
                  <p>{selectedCandidate.position}</p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Nơi làm việc:</label>
                  <p>{selectedCandidate.workplace}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Nơi làm việc mong muốn:</label>
                  <p>{selectedCandidate.desiredWorkplace}</p>
                </div>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Ngày nộp hồ sơ:</label>
                <p>{selectedCandidate.date}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Ghi chú:</label>
                <p>{selectedCandidate.note || 'Không có'}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>CV:</label>
                <p>
                  <button className={styles.viewCV} onClick={() => viewCV(selectedCandidate.id)} disabled={isLoading}>
                    <i className="fa-solid fa-file-pdf"></i> Xem CV
                  </button>
                </p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Đổi Trạng thái:</label>
              </div>
              <div className={styles.detailAction}>
                <button
                  className={`${styles.statusBtn} ${styles.moi}`}
                  onClick={() => changeStatus(selectedCandidate.id, 'Mới')}
                  disabled={isLoading}
                >
                  Đánh dấu Mới
                </button>
                <button
                  className={`${styles.statusBtn} ${styles.phongVan}`}
                  onClick={() => changeStatus(selectedCandidate.id, 'Đang phỏng vấn')}
                  disabled={isLoading}
                >
                  Đánh dấu Phỏng vấn
                </button>
                <button
                  className={`${styles.statusBtn} ${styles.duocNhan}`}
                  onClick={() => changeStatus(selectedCandidate.id, 'Đã tuyển dụng')}
                  disabled={isLoading}
                >
                  Đánh dấu Tuyển dụng
                </button>
                <button
                  className={`${styles.statusBtn} ${styles.tuChoi}`}
                  onClick={() => changeStatus(selectedCandidate.id, 'Đã từ chối')}
                  disabled={isLoading}
                >
                  Đánh dấu Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;