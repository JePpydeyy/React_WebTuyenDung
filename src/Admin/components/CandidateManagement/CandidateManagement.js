import React, { useState, useEffect } from 'react';
import styles from './CandidateManagement.module.css';

const CandidateManagement = () => {
  const API_URL = 'http://localhost:3000/candidates';
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState(null);
  const [positions, setPositions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const itemsPerPage = 5;

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
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return date.toLocaleDateString('vi-VN');
    }
    return dateString;
  };

  const sanitizeHTML = (str) => {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_URL}?hidden=false`);
      if (!response.ok) throw new Error(`Không thể tải danh sách ứng viên: ${response.status}`);
      const data = await response.json();
      return data.map(candidate => ({
        ...candidate,
        name: sanitizeHTML(candidate.name),
        email: sanitizeHTML(candidate.email),
        position: sanitizeHTML(candidate.position),
        date: formatDate(candidate.date),
        birthdate: formatDate(candidate.birthdate),
        gender: sanitizeHTML(candidate.gender),
        address: sanitizeHTML(candidate.address),
        education: sanitizeHTML(candidate.education),
        experience: sanitizeHTML(candidate.experience),
        skills: sanitizeHTML(candidate.skills),
        notes: sanitizeHTML(candidate.notes),
      }));
    } catch (error) {
      showNotification(`Lỗi khi tải danh sách ứng viên: ${error.message}`, 'error');
      console.error(error);
      return [];
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${API_URL}?hidden=false`);
      if (!response.ok) throw new Error(`Không thể tải danh sách vị trí: ${response.status}`);
      const data = await response.json();
      const uniquePositions = [...new Set(data.map(c => c.position).filter(Boolean))];
      setPositions(uniquePositions);
    } catch (error) {
      showNotification(`Lỗi khi tải danh sách vị trí: ${error.message}`, 'error');
      console.error(error);
    }
  };

  const displayCandidates = async (page = 1, data = null) => {
    const displayData = data || (await fetchCandidates());
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, displayData.length);
    const paginatedData = displayData.slice(startIndex, endIndex);
    setCandidates(paginatedData);
    setTotalPages(Math.ceil(displayData.length / itemsPerPage));
    setCurrentPage(page);
  };

  const handlePageChange = (page) => {
    displayCandidates(page, filteredCandidates);
  };

  const viewCandidate = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`Không tìm thấy ứng viên: ${response.status}`);
      const candidate = await response.json();
      if (candidate.hidden) return;
      setSelectedCandidate({
        ...candidate,
        name: sanitizeHTML(candidate.name),
        email: sanitizeHTML(candidate.email),
        position: sanitizeHTML(candidate.position),
        date: formatDate(candidate.date),
        birthdate: formatDate(candidate.birthdate),
        gender: sanitizeHTML(candidate.gender),
        address: sanitizeHTML(candidate.address),
        education: sanitizeHTML(candidate.education),
        experience: sanitizeHTML(candidate.experience),
        skills: sanitizeHTML(candidate.skills),
        notes: sanitizeHTML(candidate.notes),
      });
    } catch (error) {
      showNotification(`Lỗi khi tải thông tin ứng viên: ${error.message}`, 'error');
      console.error(error);
    }
  };

  const viewCV = (cvUrl) => {
    if (cvUrl) {
      window.open(cvUrl, '_blank');
    } else {
      showNotification('Không tìm thấy CV của ứng viên', 'error');
    }
  };

  const changeStatus = async (id, newStatus) => {
    const validStatuses = ['Mới', 'Đang phỏng vấn', 'Đã tuyển dụng', 'Đã từ chối'];
    if (!validStatuses.includes(newStatus)) {
      showNotification('Trạng thái không hợp lệ', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error(`Không thể cập nhật trạng thái: ${response.status}`);
      setSelectedCandidate(null);
      await displayCandidates(currentPage, filteredCandidates);
      await fetchPositions();
      showNotification(`Đã cập nhật trạng thái thành "${newStatus}"`, 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      showNotification(`Lỗi khi cập nhật trạng thái: ${error.message}`, 'error');
      console.error(error);
    }
  };

  const hideCandidate = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn ẩn ứng viên này?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hidden: true })
        });
        if (!response.ok) throw new Error(`Không thể ẩn ứng viên: ${response.status}`);
        setFilteredCandidates(filteredCandidates.filter(c => c.id !== id));
        await displayCandidates(currentPage, filteredCandidates);
        await fetchPositions();
      } catch (error) {
        showNotification(`Lỗi khi ẩn ứng viên: ${error.message}`, 'error');
        console.error(error);
      }
    }
  };

  const applyFilters = async () => {
    const positionFilter = document.getElementById('positionFilter').value;
    const searchTerm = document.querySelector('.search-bar')?.value.trim();

    try {
      let candidates = await fetchCandidates();

      if (positionFilter) {
        candidates = candidates.filter(c => c.position === positionFilter);
      }

      if (searchTerm) {
        const normalizedSearchTerm = normalizeVietnamese(searchTerm);
        candidates = candidates.filter(candidate =>
          normalizeVietnamese(candidate.name).includes(normalizedSearchTerm) ||
          normalizeVietnamese(candidate.email).includes(normalizedSearchTerm) ||
          normalizeVietnamese(candidate.id).includes(normalizedSearchTerm) ||
          (candidate.position && normalizeVietnamese(candidate.position).includes(normalizedSearchTerm))
        );
      }

      setFilteredCandidates(candidates);
      if (candidates.length === 0) {
        showNotification('Không tìm thấy ứng viên phù hợp', 'info');
      }
      await displayCandidates(1, candidates);
    } catch (error) {
      showNotification(`Lỗi khi áp dụng bộ lọc/tìm kiếm: ${error.message}`, 'error');
      console.error(error);
    }
  };

  const resetFilters = async () => {
    document.getElementById('positionFilter').value = '';
    document.querySelector('.search-bar').value = '';
    setFilteredCandidates(null);
    await displayCandidates(1);
    await fetchPositions();
  };

  useEffect(() => {
    displayCandidates(1);
    fetchPositions();
  }, []);

  const getStatusClass = (status) => {
    const statusMap = {
      'Mới': styles.moi,
      'Đang phỏng vấn': styles.phongVan,
      'Đã tuyển dụng': styles.duocNhan,
      'Đã từ chối': styles.tuChoi
    };
    return statusMap[status] || '';
  };

  return (
    <div className={styles.container}>
      {/* Bộ lọc */}
      <div className={styles.filters}>
        <input type="text" className={styles.searchBar} placeholder="Tìm kiếm ứng viên..." onChange={applyFilters} />
        <select id="positionFilter" onChange={applyFilters}>
          <option value="">- Tất cả vị trí -</option>
          {positions.map((pos, index) => (
            <option key={index} value={pos}>{pos}</option>
          ))}
        </select>
        <button onClick={applyFilters}><i className="fa-solid fa-filter"></i> Áp dụng</button>
        <button onClick={resetFilters}><i className="fa-solid fa-rotate"></i> Đặt lại</button>
      </div>

      {/* Danh sách hồ sơ */}
      <div className={styles.applications}>
        <h3>Danh Sách Hồ Sơ Ứng Tuyển</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
            {candidates.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu phù hợp</td></tr>
            ) : (
              candidates.map(candidate => (
                <tr key={candidate.id}>
                  <td>{candidate.id}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>{candidate.position}</td>
                  <td>{candidate.date}</td>
                  <td><span className={`${styles.status} ${getStatusClass(candidate.status)}`}>{candidate.status}</span></td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.view} onClick={() => viewCandidate(candidate.id)}><i className="fa-solid fa-eye"></i></button>
                      <button className={styles.viewCV} onClick={() => viewCV(candidate.cvUrl)}><i className="fa-solid fa-file-pdf"></i></button>
                      <button className={styles.delete} onClick={() => hideCandidate(candidate.id)}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button onClick={() => handlePageChange(1)}><i className="fa-solid fa-angles-left"></i></button>
          <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))}><i className="fa-solid fa-angle-left"></i></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={page === currentPage ? styles.active : ''}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}><i className="fa-solid fa-angle-right"></i></button>
          <button onClick={() => handlePageChange(totalPages)}><i className="fa-solid fa-angles-right"></i></button>
        </div>
      </div>

      {/* Modal chi tiết ứng viên */}
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
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Địa chỉ:</label>
                <p>{selectedCandidate.address}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Ngày nộp hồ sơ:</label>
                <p>{selectedCandidate.date}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Trình độ học vấn:</label>
                <p>{selectedCandidate.education}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Kinh nghiệm làm việc:</label>
                <p>{selectedCandidate.experience}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Kỹ năng:</label>
                <p>{selectedCandidate.skills}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Ghi chú:</label>
                <p>{selectedCandidate.notes}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>CV:</label>
                <p><button className={styles.viewCV} onClick={() => viewCV(selectedCandidate.cvUrl)}><i className="fa-solid fa-file-pdf"></i> Xem CV</button></p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Đổi Trạng thái:</label>
              </div>
              <div className={styles.detailAction}>
                <button className={`${styles.statusBtn} ${styles.moi}`} onClick={() => changeStatus(selectedCandidate.id, 'Mới')}>Đánh dấu Mới</button>
                <button className={`${styles.statusBtn} ${styles.phongVan}`} onClick={() => changeStatus(selectedCandidate.id, 'Đang phỏng vấn')}>Đánh dấu Phỏng vấn</button>
                <button className={`${styles.statusBtn} ${styles.duocNhan}`} onClick={() => changeStatus(selectedCandidate.id, 'Đã tuyển dụng')}>Đánh dấu Tuyển dụng</button>
                <button className={`${styles.statusBtn} ${styles.tuChoi}`} onClick={() => changeStatus(selectedCandidate.id, 'Đã từ chối')}>Đánh dấu Từ chối</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;