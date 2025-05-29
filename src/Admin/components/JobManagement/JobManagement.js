import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import styles from './JobManagement.module.css';

const JobManagement = () => {
  const API_JOBS_URL = 'https://api-tuyendung-cty.onrender.com/api/job';
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    name: '',
    brands: '',
    jobType: '',
    salary: '',
    workplace: '',
    slot: '',
    postDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    jobDescription: '',
    workExperience: '',
    welfare: '',
    status: 'show',
    degree: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const statusDisplayMap = {
    show: 'Đang tuyển',
    hidden: 'Tạm dừng',
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Format date for display (DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin';
    const parts = dateString.includes('/') ? dateString.split('/') : dateString.split('-');
    const date = dateString.includes('/')
      ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      : new Date(dateString);
    if (isNaN(date)) return 'Không hợp lệ';
    return date.toLocaleDateString('vi-VN');
  };

  // Convert date to backend format (DD/MM/YYYY)
  const toBackendDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  // Convert date to form format (YYYY-MM-DD)
  const toFormDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString;
  };

  // Sanitize text to handle undefined/null/empty values
  const sanitizeText = (str) => {
    if (!str || str === '0') return 'Không có thông tin';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Fetch jobs from API
  const fetchJobs = async (showHidden = false) => {
    if (!token) {
      showNotification('Vui lòng đăng nhập để tiếp tục', 'error');
      return [];
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_JOBS_URL}${showHidden ? '' : '?status=show'}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          showNotification('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
          localStorage.removeItem('token');
          setToken('');
          throw new Error('Không có quyền truy cập');
        }
        throw new Error(errorData.message || `Không thể tải danh sách công việc: ${response.status}`);
      }
      const data = await response.json();
      return data.map(job => ({
        id: job._id,
        title: sanitizeText(job.Name),
        brand: sanitizeText(job.Brands),
        jobType: sanitizeText(job['Job Type'] ? job['Job Type'].charAt(0).toUpperCase() + job['Job Type'].slice(1) : ''),
        salary: sanitizeText(job.Salary),
        location: sanitizeText(job.Workplace),
        deadline: formatDate(job['Due date']),
        status: statusDisplayMap[job.status] || job.status,
        description: sanitizeText(job['Job Description']),
        workExperience: sanitizeText(job['Work Experience']),
        benefits: sanitizeText(job.Welfare),
        slot: job.Slot || 0,
        postDate: formatDate(job['Post-date']),
        degree: sanitizeText(job.Degree || ''),
        requirements: sanitizeText(job['Job Requirements'] || ''),
        position: sanitizeText(job.Position || ''),
      }));
    } catch (error) {
      showNotification(`Lỗi khi tải danh sách công việc: ${error.message}`, 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Display jobs with pagination
  const displayJobs = async (page = 1, jobsToShow = null) => {
    const data = jobsToShow || (await fetchJobs());
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);
    const paginatedData = data.slice(startIndex, endIndex);
    setJobs(data);
    setFilteredJobs(paginatedData);
    setTotalPages(Math.ceil(data.length / itemsPerPage));
    setCurrentPage(page);
  };

  // Handle page change
  const handlePageChange = (page) => {
    displayJobs(page, jobs);
  };

  // View job details
  const handleViewJob = async (jobId) => {
    if (!token) {
      showNotification('Vui lòng đăng nhập để tiếp tục', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_JOBS_URL}/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          showNotification('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
          localStorage.removeItem('token');
          setToken('');
          throw new Error('Không có quyền truy cập');
        }
        throw new Error(errorData.message || `Không tìm thấy công việc: ${response.status}`);
      }
      const job = await response.json();
      setSelectedJob({
        id: job._id,
        title: sanitizeText(job.Name),
        brand: sanitizeText(job.Brands),
        jobType: sanitizeText(job['Job Type'] ? job['Job Type'].charAt(0).toUpperCase() + job['Job Type'].slice(1) : ''),
        salary: sanitizeText(job.Salary),
        location: sanitizeText(job.Workplace),
        deadline: formatDate(job['Due date']),
        status: statusDisplayMap[job.status] || job.status,
        description: sanitizeText(job['Job Description']),
        workExperience: sanitizeText(job['Work Experience']),
        benefits: sanitizeText(job.Welfare),
        slot: job.Slot || 0,
        postDate: formatDate(job['Post-date']),
        degree: sanitizeText(job.Degree || ''),
        requirements: sanitizeText(job['Job Requirements'] || ''),
        position: sanitizeText(job.Position || ''),
      });
    } catch (error) {
      showNotification(`Lỗi khi tải chi tiết công việc: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      brands: '',
      jobType: '',
      salary: '',
      workplace: '',
      slot: '',
      postDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      jobDescription: '',
      workExperience: '',
      welfare: '',
      status: 'show',
      degree: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Open edit modal
  const handleOpenEditModal = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const reverseStatusMap = {
        'Đang tuyển': 'show',
        'Tạm dừng': 'hidden',
      };
      setModalMode('edit');
      setFormData({
        _id: job.id,
        name: job.title,
        brands: job.brand,
        jobType: job.jobType,
        salary: job.salary,
        workplace: job.location,
        slot: job.slot,
        postDate: toFormDate(job.postDate),
        dueDate: toFormDate(job.deadline),
        jobDescription: job.description,
        workExperience: job.workExperience,
        welfare: job.benefits,
        status: reverseStatusMap[job.status] || job.status,
        degree: job.degree,
      });
      setFormErrors({});
      setShowModal(true);
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    if (!token) {
      showNotification('Vui lòng đăng nhập để thực hiện thao tác này', 'error');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      try {
        const response = await fetch(`${API_JOBS_URL}/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            showNotification('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
            localStorage.removeItem('token');
            setToken('');
            throw new Error('Không có quyền truy cập');
          }
          throw new Error(errorData.message || `Không thể xóa công việc: ${response.status}`);
        }
        await displayJobs(currentPage);
        showNotification('Đã xóa công việc thành công!', 'success');
      } catch (error) {
        showNotification(`Lỗi khi xóa công việc: ${error.message}`, 'error');
      }
    }
  };

  // Toggle job visibility
  const handleToggleVisibility = async (jobId) => {
    if (!token) {
      showNotification('Vui lòng đăng nhập để thực hiện thao tác này', 'error');
      return;
    }
    try {
      const response = await fetch(`${API_JOBS_URL}/${jobId}/toggle-visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          showNotification('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
          localStorage.removeItem('token');
          setToken('');
          throw new Error('Không có quyền truy cập');
        }
        throw new Error(errorData.message || `Không thể thay đổi trạng thái: ${response.status}`);
      }
      const updatedJob = await response.json();
      setSelectedJob(null);
      await displayJobs(currentPage);
      showNotification(updatedJob.message || 'Cập nhật trạng thái thành công', 'success');
    } catch (error) {
      showNotification(`Lỗi khi thay đổi trạng thái: ${error.message}`, 'error');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Tên công việc là bắt buộc';
    if (!formData.brands.trim()) errors.brands = 'Thương hiệu là bắt buộc';
    if (!formData.jobType.trim()) errors.jobType = 'Loại công việc là bắt buộc';
    if (!formData.salary.trim()) errors.salary = 'Mức lương là bắt buộc';
    if (!formData.workplace.trim()) errors.workplace = 'Địa điểm là bắt buộc';
    if (!formData.dueDate) errors.dueDate = 'Hạn nộp là bắt buộc';
    if (!formData.slot || formData.slot <= 0) errors.slot = 'Số lượng tuyển phải lớn hơn 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showNotification('Vui lòng đăng nhập để thực hiện thao tác này', 'error');
      return;
    }
    if (!validateForm()) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        jobType: formData.jobType,
        name: formData.name,
        brands: formData.brands,
        workplace: formData.workplace,
        salary: formData.salary,
        slot: parseInt(formData.slot),
        postDate: toBackendDate(formData.postDate),
        dueDate: toBackendDate(formData.dueDate),
        degree: formData.degree,
        workExperience: formData.workExperience,
        jobDescription: formData.jobDescription,
        welfare: formData.welfare,
        status: formData.status,
      };

      const url = modalMode === 'add' ? API_JOBS_URL : `${API_JOBS_URL}/${formData._id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          showNotification('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
          localStorage.removeItem('token');
          setToken('');
          throw new Error('Không có quyền truy cập');
        }
        throw new Error(errorData.error || `Không thể ${modalMode === 'add' ? 'thêm' : 'cập nhật'} công việc`);
      }

      await displayJobs(1);
      setShowModal(false);
      setFormData({
        name: '',
        brands: '',
        jobType: '',
        salary: '',
        workplace: '',
        slot: '',
        postDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        jobDescription: '',
        workExperience: '',
        welfare: '',
        status: 'show',
        degree: '',
      });
      setFormErrors({});
      showNotification(modalMode === 'add' ? 'Thêm công việc thành công!' : 'Cập nhật công việc thành công!', 'success');
    } catch (error) {
      showNotification(`Lỗi khi ${modalMode === 'add' ? 'thêm' : 'cập nhật'} công việc: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    const search = document.querySelector('.search-bar')?.value.trim().toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const jobType = document.getElementById('levelFilter').value;
    let filtered = jobs;

    if (search) {
      filtered = filtered.filter(
        j =>
          j.title.toLowerCase().includes(search) ||
          j.brand.toLowerCase().includes(search) ||
          j.location.toLowerCase().includes(search)
      );
    }
    if (status) filtered = filtered.filter(j => j.status === status);
    if (jobType) filtered = filtered.filter(j => j.jobType === jobType);

    setFilteredJobs(filtered.slice(0, itemsPerPage));
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
    if (filtered.length === 0) {
      showNotification('Không tìm thấy công việc phù hợp', 'info');
    }
  };

  // Debounced search
  const debouncedSearch = debounce(() => handleApplyFilters(), 300);

  // Handle search input change
  const handleSearchChange = () => {
    debouncedSearch();
  };

  // Reset filters
  const handleResetFilters = () => {
    document.querySelector('.search-bar').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('levelFilter').value = '';
    displayJobs(1);
  };

  // Handle show/hidden toggle
  const handleShowHiddenToggle = async () => {
    const showHidden = document.getElementById('statusFilter').value === 'Tạm dừng';
    await displayJobs(1, await fetchJobs(showHidden));
  };

  // Watch for token changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token') || '');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initial job fetch
  useEffect(() => {
    if (token) {
      displayJobs();
    } else {
      showNotification('Vui lòng đăng nhập để xem danh sách công việc', 'error');
      setJobs([]);
      setFilteredJobs([]);
    }
  }, [token]);

  const uniqueJobTypes = [...new Set(jobs.map(job => job.jobType))];
  const uniqueStatuses = [...new Set(jobs.map(job => job.status))];

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const maxButtons = 5;
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        <i className="fa-solid fa-angles-left"></i>
      </button>
    );

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
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
        disabled={currentPage === totalPages}
      >
        <i className="fa-solid fa-angle-right"></i>
      </button>
    );

    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <i className="fa-solid fa-angles-right"></i>
      </button>
    );

    return buttons;
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          className={`${styles.searchBar} search-bar`}
          placeholder="Tìm kiếm công việc..."
          onChange={handleSearchChange}
        />
        <select id="statusFilter" onChange={e => { handleApplyFilters(); handleShowHiddenToggle(); }}>
          <option value="">- Tất cả trạng thái -</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select id="levelFilter" onChange={handleApplyFilters}>
          <option value="">- Tất cả loại công việc -</option>
          {uniqueJobTypes.map(jobType => (
            <option key={jobType} value={jobType}>
              {jobType}
            </option>
          ))}
        </select>
        <button onClick={handleApplyFilters}>
          <i className="fa-solid fa-filter"></i> Áp dụng
        </button>
        <button onClick={handleResetFilters}>
          <i className="fa-solid fa-rotate"></i> Đặt lại
        </button>
      </div>

      <div className={styles.jobs}>
        <h3>
          Danh Sách Công Việc
          <button onClick={handleOpenAddModal}>
            <i className="fa-solid fa-plus"></i> Thêm Công Việc
          </button>
        </h3>
        <table>
          <thead>
            <tr>
              <th>Tên Công Việc</th>
              <th>Thương Hiệu</th>
              <th>Loại Công Việc</th>
              <th>Mức Lương</th>
              <th>Địa Điểm</th>
              <th>Hạn Nộp</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  Đang tải...
                </td>
              </tr>
            ) : filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  Không tìm thấy công việc nào
                </td>
              </tr>
            ) : (
              filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.brand}</td>
                  <td>{job.jobType}</td>
                  <td>{job.salary}</td>
                  <td>{job.location}</td>
                  <td>{job.deadline}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        job.status === 'Đang tuyển' ? styles.active : styles.inactive
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.view} onClick={() => handleViewJob(job.id)}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button className={styles.edit} onClick={() => handleOpenEditModal(job.id)}>
                        <i className="fa-solid fa-edit"></i>
                      </button>
                      <button className={styles.delete} onClick={() => handleDeleteJob(job.id)}>
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

      {selectedJob && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setSelectedJob(null)}>
              ×
            </span>
            <h3>Chi Tiết Công Việc: {selectedJob.title}</h3>
            <div className={styles.jobDetails}>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>ID:</label>
                  <p>{selectedJob.id}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Trạng thái:</label>
                  <p>
                    <span
                      className={`${styles.status} ${
                        selectedJob.status === 'Đang tuyển' ? styles.active : styles.inactive
                      }`}
                    >
                      {selectedJob.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Tên công việc:</label>
                  <p>{selectedJob.title}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Thương hiệu:</label>
                  <p>{selectedJob.brand}</p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Loại công việc:</label>
                  <p>{selectedJob.jobType}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Mức lương:</label>
                  <p>{selectedJob.salary}</p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Địa điểm:</label>
                  <p>{selectedJob.location}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Hạn nộp:</label>
                  <p>{selectedJob.deadline}</p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Ngày đăng:</label>
                  <p>{selectedJob.postDate}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Số lượng tuyển:</label>
                  <p>{selectedJob.slot}</p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Trình độ:</label>
                  <p>{selectedJob.degree}</p>
                </div>
                <div className={styles.detailGroup}>
                  <label>Vị trí:</label>
                  <p>{selectedJob.position}</p>
                </div>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Kinh nghiệm làm việc:</label>
                <p>{selectedJob.workExperience}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Mô tả công việc:</label>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedJob.description}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Yêu cầu công việc:</label>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedJob.requirements}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Quyền lợi:</label>
                <p style={{ whiteSpace: 'pre-line' }}>{selectedJob.benefits}</p>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Đổi trạng thái:</label>
                <button
                  className={`${styles.statusBtn} ${
                    selectedJob.status === 'Đang tuyển' ? styles.inactive : styles.active
                  }`}
                  onClick={() => handleToggleVisibility(selectedJob.id)}
                >
                  {selectedJob.status === 'Đang tuyển' ? 'Tạm dừng' : 'Đang tuyển'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setShowModal(false)}>
              ×
            </span>
            <h3>{modalMode === 'add' ? 'Thêm Công Việc Mới' : 'Chỉnh Sửa Công Việc'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Tên công việc: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={formErrors.name ? styles.errorInput : ''}
                  />
                  {formErrors.name && <p className={styles.error}>{formErrors.name}</p>}
                </div>
                <div className={styles.detailGroup}>
                  <label>Thương hiệu: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="brands"
                    value={formData.brands}
                    onChange={handleInputChange}
                    className={formErrors.brands ? styles.errorInput : ''}
                  />
                  {formErrors.brands && <p className={styles.error}>{formErrors.brands}</p>}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Loại công việc: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className={formErrors.jobType ? styles.errorInput : ''}
                  />
                  {formErrors.jobType && <p className={styles.error}>{formErrors.jobType}</p>}
                </div>
                <div className={styles.detailGroup}>
                  <label>Mức lương: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className={formErrors.salary ? styles.errorInput : ''}
                  />
                  {formErrors.salary && <p className={styles.error}>{formErrors.salary}</p>}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Địa điểm: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="workplace"
                    value={formData.workplace}
                    onChange={handleInputChange}
                    className={formErrors.workplace ? styles.errorInput : ''}
                  />
                  {formErrors.workplace && <p className={styles.error}>{formErrors.workplace}</p>}
                </div>
                <div className={styles.detailGroup}>
                  <label>Hạn nộp: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className={formErrors.dueDate ? styles.errorInput : ''}
                  />
                  {formErrors.dueDate && <p className={styles.error}>{formErrors.dueDate}</p>}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Ngày đăng:</label>
                  <input
                    type="date"
                    name="postDate"
                    value={formData.postDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.detailGroup}>
                  <label>Số lượng tuyển: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="number"
                    name="slot"
                    value={formData.slot}
                    onChange={handleInputChange}
                    min="1"
                    className={formErrors.slot ? styles.errorInput : ''}
                  />
                  {formErrors.slot && <p className={styles.error}>{formErrors.slot}</p>}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Trình độ:</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Kinh nghiệm làm việc:</label>
                <input
                  type="text"
                  name="workExperience"
                  value={formData.workExperience}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Mô tả công việc:</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Quyền lợi:</label>
                <textarea
                  name="welfare"
                  value={formData.welfare}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Trạng thái:</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="show">Đang tuyển</option>
                    <option value="hidden">Tạm dừng</option>
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang lưu...' : modalMode === 'add' ? 'Lưu' : 'Cập nhật'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;