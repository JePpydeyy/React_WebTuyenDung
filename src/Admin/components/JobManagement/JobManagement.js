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
  const [formData, setFormData] = useState({
    Name: '',
    Brands: '',
    Position: '',
    Salary: '',
    Workplace: '',
    Slot: '',
    'Post-date': new Date().toISOString().split('T')[0],
    'Due date': '',
    'Job Description': '',
    'Job Requirements': '',
    Welfare: '',
    status: 'show',
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(''); // State để hiển thị preview hình ảnh

  const statusDisplayMap = {
    show: 'Đang tuyển',
    hidden: 'Tạm dừng',
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Handle DD/MM/YYYY or YYYY-MM-DD
    const parts = dateString.includes('/') ? dateString.split('/') : dateString.split('-');
    const date = dateString.includes('/')
      ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      : new Date(dateString);
    if (isNaN(date)) return 'Không hợp lệ';
    return date.toLocaleDateString('vi-VN');
  };

  const toBackendDate = (dateString) => {
    if (!dateString) return '';
    // Convert YYYY-MM-DD to DD/MM/YYYY for API
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  const toFormDate = (dateString) => {
    if (!dateString) return '';
    // Convert DD/MM/YYYY to YYYY-MM-DD for form
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString;
  };

  const sanitizeText = (str) => {
    if (!str || str === '0') return 'Không có thông tin';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_JOBS_URL}?status=show`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token để xác thực
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không thể tải danh sách công việc: ${response.status}`);
      }
      const data = await response.json();
      return data.map(job => ({
        id: job._id,
        title: sanitizeText(job.Name),
        brand: sanitizeText(job.Brands),
        level: sanitizeText(job.Position.charAt(0).toUpperCase() + job.Position.slice(1)),
        salary: sanitizeText(job.Salary),
        location: sanitizeText(job.Workplace),
        deadline: formatDate(job['Due date']),
        status: statusDisplayMap[job.status] || job.status,
        description: sanitizeText(job['Job Description']),
        requirements: sanitizeText(job['Job Requirements']),
        benefits: sanitizeText(job.Welfare),
        slot: job.Slot,
        postDate: formatDate(job['Post-date']),
        image: job.Image || '', // Thêm trường image
      }));
    } catch (error) {
      showNotification(`Lỗi khi tải danh sách công việc: ${error.message}`, 'error');
      console.error(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const displayJobs = async (jobsToShow = null) => {
    const data = jobsToShow || (await fetchJobs());
    setJobs(data);
    setFilteredJobs(data);
  };

  const handleViewJob = async (jobId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_JOBS_URL}/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token để xác thực
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không tìm thấy công việc: ${response.status}`);
      }
      const job = await response.json();
      setSelectedJob({
        id: job._id,
        title: sanitizeText(job.Name),
        brand: sanitizeText(job.Brands),
        level: sanitizeText(job.Position.charAt(0).toUpperCase() + job.Position.slice(1)),
        salary: sanitizeText(job.Salary),
        location: sanitizeText(job.Workplace),
        deadline: formatDate(job['Due date']),
        status: statusDisplayMap[job.status] || job.status,
        description: sanitizeText(job['Job Description']),
        requirements: sanitizeText(job['Job Requirements']),
        benefits: sanitizeText(job.Welfare),
        slot: job.Slot,
        postDate: formatDate(job['Post-date']),
        image: job.Image || '', // Thêm trường image
      });
    } catch (error) {
      showNotification(`Lỗi khi tải chi tiết công việc: ${error.message}`, 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      Name: '',
      Brands: '',
      Position: '',
      Salary: '',
      Workplace: '',
      Slot: '',
      'Post-date': new Date().toISOString().split('T')[0],
      'Due date': '',
      'Job Description': '',
      'Job Requirements': '',
      Welfare: '',
      status: 'show',
    });
    setFormErrors({});
    setShowModal(true);
  };

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
        Name: job.title,
        Brands: job.brand,
        Position: job.level,
        Salary: job.salary,
        Workplace: job.location,
        Slot: job.slot,
        'Post-date': toFormDate(job.postDate),
        'Due date': toFormDate(job.deadline),
        'Job Description': job.description,
        'Job Requirements': job.requirements,
        Welfare: job.benefits,
        status: reverseStatusMap[job.status] || job.status,
      });
      setFormErrors({});
      setShowModal(true);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      try {
        const response = await fetch(`${API_JOBS_URL}/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token để xác thực
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Không thể xóa công việc: ${response.status}`);
        }
        await displayJobs();
        showNotification('Đã xóa công việc thành công!', 'success');
      } catch (error) {
        showNotification(`Lỗi khi xóa công việc: ${error.message}`, 'error');
        console.error(error);
      }
    }
  };

  const handleToggleVisibility = async (jobId) => {
    try {
      const response = await fetch(`${API_JOBS_URL}/${jobId}/toggle-visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token để xác thực
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không thể thay đổi trạng thái: ${response.status}`);
      }
      const updatedJob = await response.json();
      setSelectedJob(null);
      await displayJobs();
      showNotification(updatedJob.message, 'success');
    } catch (error) {
      showNotification(`Lỗi khi thay đổi trạng thái: ${error.message}`, 'error');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewJob(prev => ({ ...prev, Image: reader.result })); // Lưu base64
        setImagePreview(reader.result); // Hiển thị preview
      };
      reader.readAsDataURL(file);
    } else {
      setNewJob(prev => ({ ...prev, Image: '' }));
      setImagePreview('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.Name.trim()) errors.Name = 'Tên công việc là bắt buộc';
    if (!formData.Brands.trim()) errors.Brands = 'Thương hiệu là bắt buộc';
    if (!formData.Position.trim()) errors.Position = 'Cấp bậc là bắt buộc';
    if (!formData.Salary.trim()) errors.Salary = 'Mức lương là bắt buộc';
    if (!formData.Workplace.trim()) errors.Workplace = 'Địa điểm là bắt buộc';
    if (!formData['Due date']) errors['Due date'] = 'Hạn nộp là bắt buộc';
    if (!formData.Slot || formData.Slot <= 0) errors.Slot = 'Số lượng tuyển phải lớn hơn 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const url = modalMode === 'add' ? API_JOBS_URL : `${API_JOBS_URL}/${formData._id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: formData.Name,
          Brands: formData.Brands,
          Position: formData.Position,
          Salary: formData.Salary,
          Workplace: formData.Workplace,
          Slot: parseInt(formData.Slot),
          'Post-date': toBackendDate(formData['Post-date']),
          'Due date': toBackendDate(formData['Due date']),
          'Job Description': formData['Job Description'],
          'Job Requirements': formData['Job Requirements'],
          Welfare: formData.Welfare,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Không thể ${modalMode === 'add' ? 'thêm' : 'cập nhật'} công việc: ${response.status}`);
      }

      await displayJobs();
      setShowModal(false);
      setFormData({
        Name: '',
        Brands: '',
        Position: '',
        Salary: '',
        Workplace: '',
        Slot: '',
        'Post-date': new Date().toISOString().split('T')[0],
        'Due date': '',
        'Job Description': '',
        'Job Requirements': '',
        Welfare: '',
        status: 'show',
      });
      setImagePreview('');
      setFormErrors({});
      showNotification(modalMode === 'add' ? 'Thêm công việc thành công!' : 'Cập nhật công việc thành công!', 'success');
    } catch (error) {
      showNotification(`Lỗi khi ${modalMode === 'add' ? 'thêm' : 'cập nhật'} công việc: ${error.message}`, 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const search = document.querySelector('.search-bar')?.value.trim().toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const level = document.getElementById('levelFilter').value;
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
    if (level) filtered = filtered.filter(j => j.level === level);

    setFilteredJobs(filtered);
    if (filtered.length === 0) {
      showNotification('Không tìm thấy công việc phù hợp', 'info');
    }
  };

  const debouncedSearch = debounce(() => handleApplyFilters(), 300);

  const handleSearchChange = () => {
    debouncedSearch();
  };

  const handleResetFilters = () => {
    document.querySelector('.search-bar').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('levelFilter').value = '';
    setFilteredJobs(jobs);
  };

  useEffect(() => {
    displayJobs();
  }, []);

  const uniqueLevels = [...new Set(jobs.map(job => job.level))];
  const uniqueStatuses = [...new Set(jobs.map(job => job.status))];

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          className={`${styles.searchBar} search-bar`}
          placeholder="Tìm kiếm công việc..."
          onChange={handleSearchChange}
        />
        <select id="statusFilter" onChange={handleApplyFilters}>
          <option value="">- Tất cả trạng thái -</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select id="levelFilter" onChange={handleApplyFilters}>
          <option value="">- Tất cả cấp bậc -</option>
          {uniqueLevels.map(level => (
            <option key={level} value={level}>
              {level}
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
              <th>Cấp Bậc</th>
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
                  <td>{job.level}</td>
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
      </div>

      {selectedJob && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setSelectedJob(null)}>
              ×
            </span>
            <h3>Chi Tiết Công Việc: {selectedJob.title}</h3>
            <div className={styles.jobDetails}>
              {selectedJob.image && (
                <div className={`${styles.detailGroup} ${styles.full}`}>
                  <label>Hình ảnh:</label>
                  <img
                    src={selectedJob.image}
                    alt={selectedJob.title}
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </div>
              )}
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
                  <label>Cấp bậc:</label>
                  <p>{selectedJob.level}</p>
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
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className={formErrors.Name ? styles.errorInput : ''}
                  />
                  {formErrors.Name && <p className={styles.error}>{formErrors.Name}</p>}
                </div>
                <div className={styles.detailGroup}>
                  <label>Thương hiệu: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="Brands"
                    value={formData.Brands}
                    onChange={handleInputChange}
                    className={formErrors.Brands ? styles.errorInput : ''}
                  />
                  {formErrors.Brands && <p className={styles.error}>{formErrors.Brands}</p>}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Cấp bậc: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="Position"
                    value={formData.Position}
                    onChange={handleInputChange}
                    className={formErrors.Position ? styles.errorInput : ''}
                  />
                  {formErrors.Position && <p className={styles.error}>{formErrors.Position}</p>}
                </div>
                <div className={styles.detailGroup}>
                  <label>Mức lương: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="Salary"
                    value={formData.Salary}
                    onChange={handleInputChange}
                    className={formErrors.Salary ? styles.errorInput : ''}
                  />
                  {formErrors.Salary && <p className={styles.error}>{formErrors.Salary}</p>}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Địa điểm: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="Workplace"
                    value={formData.Workplace}
                    onChange={handleInputChange}
                    className={formErrors.Workplace ? styles.errorInput : ''}
                  />
                  {formErrors.Workplace && <p className={styles.error}>{formErrors.Workplace}</p>}
                </div>
                <div className={styles.detailGroup}>
                  <label>Hạn nộp: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="date"
                    name="Due date"
                    value={formData['Due date']}
                    onChange={handleInputChange}
                    className={formErrors['Due date'] ? styles.errorInput : ''}
                  />
                  {formErrors['Due date'] && <p className={styles.error}>{formErrors['Due date']}</p>}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Ngày đăng:</label>
                  <input
                    type="date"
                    name="Post-date"
                    value={formData['Post-date']}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.detailGroup}>
                  <label>Số lượng tuyển: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="number"
                    name="Slot"
                    value={formData.Slot}
                    onChange={handleInputChange}
                    min="1"
                    className={formErrors.Slot ? styles.errorInput : ''}
                  />
                  {formErrors.Slot && <p className={styles.error}>{formErrors.Slot}</p>}
                </div>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Hình ảnh:</label>
                <input
                  type="file"
                  accept="image/*"
                  name="Image"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <p>Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Mô tả công việc:</label>
                <textarea
                  name="Job Description"
                  value={formData['Job Description']}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Yêu cầu công việc:</label>
                <textarea
                  name="Job Requirements"
                  value={formData['Job Requirements']}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Quyền lợi:</label>
                <textarea
                  name="Welfare"
                  value={formData.Welfare}
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