// src/components/JobManagement.js
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
  const [modalMode, setModalMode] = useState('add');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    JobType: '',
    Name: '',
    Brands: [],
    Position: '',
    Workplace: '',
    Salary: '',
    Slot: '',
    'Post-date': new Date().toISOString().split('T')[0],
    'Due date': '',
    'Job Description': '',
    'Work Experience': '',
    Welfare: [],
    status: 'show',
    Degree: '',
    'Job Requirements': [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const statusDisplayMap = {
    show: 'Đang tuyển',
    hidden: 'Tạm dừng',
  };

  // Format date DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) return dateString;
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('vi-VN');
  };

  // Convert date to DD/MM/YYYY for backend
  const toBackendDate = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    return `${d}/${m}/${y}`;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for form
  const toFormDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) {
      const [d, m, y] = dateString.split('/');
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return dateString;
  };

  // Fetch jobs from API
  const fetchJobs = async () => {
    if (!token) {
      console.log('No token found, skipping fetch');
      return [];
    }
    setIsLoading(true);
    try {
      const response = await fetch(API_JOBS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          setToken('');
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        }
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      return data.map(job => ({
        id: job._id,
        title: job.Name || '',
        brand: job.Brands || '',
        brandsArr: job.Brands ? job.Brands.split(', ').filter(Boolean) : [],
        jobType: job.JobType || '',
        salary: job.Salary || '',
        location: job.Workplace || '',
        deadline: formatDate(job['Due date']) || '',
        status: statusDisplayMap[job.status] || job.status,
        description: Array.isArray(job['Job Description']) ? job['Job Description'].join('\n') : job['Job Description'] || '',
        workExperience: job['Work Experience'] || '',
        benefits: Array.isArray(job.Welfare) ? job.Welfare.join('\n') : job.Welfare || '',
        welfareArr: Array.isArray(job.Welfare) ? job.Welfare : [],
        slot: job.Slot || 0,
        postDate: formatDate(job['Post-date']) || '',
        degree: job.Degree || '',
        requirements: Array.isArray(job['Job Requirements']) ? job['Job Requirements'].join('\n') : job['Job Requirements'] || '',
        jobRequirementsArr: Array.isArray(job['Job Requirements']) ? job['Job Requirements'] : [],
        position: job.Position || '',
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
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
    setJobs(data);
    setFilteredJobs(data.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(data.length / itemsPerPage));
    setCurrentPage(page);
  };

  const handlePageChange = (page) => displayJobs(page, jobs);

  // View job details
  const handleViewJob = async (jobId) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_JOBS_URL}/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          setToken('');
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        }
        throw new Error(`HTTP error ${response.status}`);
      }
      const job = await response.json();
      setSelectedJob({
        id: job._id,
        title: job.Name || '',
        brand: job.Brands || '',
        jobType: job.JobType || '',
        salary: job.Salary || '',
        location: job.Workplace || '',
        deadline: formatDate(job['Due date']) || '',
        status: statusDisplayMap[job.status] || job.status,
        description: Array.isArray(job['Job Description']) ? job['Job Description'].join('\n') : job['Job Description'] || '',
        workExperience: job['Work Experience'] || '',
        benefits: Array.isArray(job.Welfare) ? job.Welfare.join('\n') : job.Welfare || '',
        slot: job.Slot || 0,
        postDate: formatDate(job['Post-date']) || '',
        degree: job.Degree || '',
        requirements: Array.isArray(job['Job Requirements']) ? job['Job Requirements'].join('\n') : job['Job Requirements'] || '',
        position: job.Position || '',
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Lỗi khi lấy chi tiết công việc');
    } finally {
      setIsLoading(false);
    }
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({
      JobType: '',
      Name: '',
      Brands: [],
      Position: '',
      Workplace: '',
      Salary: '',
      Slot: '',
      'Post-date': new Date().toISOString().split('T')[0],
      'Due date': '',
      'Job Description': '',
      'Work Experience': '',
      Welfare: [],
      status: 'show',
      Degree: '',
      'Job Requirements': [],
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Open edit modal
  const handleOpenEditModal = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const reverseStatusMap = { 'Đang tuyển': 'show', 'Tạm dừng': 'hidden' };
      setModalMode('edit');
      setFormData({
        _id: job.id,
        JobType: job.jobType,
        Name: job.title,
        Brands: job.brandsArr,
        Position: job.position,
        Workplace: job.location,
        Salary: job.salary,
        Slot: job.slot,
        'Post-date': toFormDate(job.postDate),
        'Due date': toFormDate(job.deadline),
        'Job Description': job.description,
        'Work Experience': job.workExperience,
        Welfare: job.welfareArr,
        status: reverseStatusMap[job.status] || job.status,
        Degree: job.degree,
        'Job Requirements': job.jobRequirementsArr,
      });
      setFormErrors({});
      setShowModal(true);
    }
  };

  // Delete job (soft delete)
  const handleDeleteJob = async (jobId) => {
    if (!token) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_JOBS_URL}/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('adminToken');
            setToken('');
            alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
          }
          throw new Error(`HTTP error ${response.status}`);
        }
        await displayJobs(currentPage);
        alert('Xóa công việc thành công (xóa mềm)');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Lỗi khi xóa công việc');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle job visibility
  const handleToggleVisibility = async (jobId) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_JOBS_URL}/${jobId}/toggle-visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          setToken('');
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        }
        throw new Error(`HTTP error ${response.status}`);
      }
      setSelectedJob(null);
      await displayJobs(currentPage);
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Lỗi khi thay đổi trạng thái');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Brands') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(item => item),
      }));
    } else if (name === 'Job Requirements' || name === 'Welfare') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split('\n').map(item => item.trim()).filter(item => item),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.Name.trim()) errors.Name = 'Tên công việc là bắt buộc';
    if (!formData.Brands.length) errors.Brands = 'Thương hiệu là bắt buộc';
    if (!formData.JobType.trim()) errors.JobType = 'Loại công việc là bắt buộc';
    if (!formData.Salary.trim()) errors.Salary = 'Mức lương là bắt buộc';
    if (!formData.Workplace.trim()) errors.Workplace = 'Địa điểm là bắt buộc';
    if (!formData['Due date']) errors['Due date'] = 'Hạn nộp là bắt buộc';
    if (!formData.Slot || formData.Slot <= 0) errors.Slot = 'Số lượng tuyển phải lớn hơn 0';
    if (!formData['Post-date']) errors['Post-date'] = 'Ngày đăng là bắt buộc';
    if (!formData.Degree.trim()) errors.Degree = 'Trình độ là bắt buộc';
    if (!formData['Work Experience'].trim()) errors['Work Experience'] = 'Kinh nghiệm làm việc là bắt buộc';
    if (!formData.Position.trim()) errors.Position = 'Vị trí là bắt buộc';
    if (!formData['Job Requirements'].length) errors['Job Requirements'] = 'Yêu cầu công việc là bắt buộc';
    if (!formData.Welfare.length) errors.Welfare = 'Quyền lợi là bắt buộc';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!');
      return;
    }
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        JobType: formData.JobType,
        Name: formData.Name,
        Brands: formData.Brands.join(', '),
        Position: formData.Position,
        Workplace: formData.Workplace,
        Salary: formData.Salary,
        Slot: parseInt(formData.Slot),
        'Post-date': toBackendDate(formData['Post-date']),
        'Due date': toBackendDate(formData['Due date']),
        Degree: formData.Degree,
        'Work Experience': formData['Work Experience'],
        'Job Description': formData['Job Description'].split('\n').filter(Boolean),
        'Job Requirements': formData['Job Requirements'],
        Welfare: formData.Welfare,
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
          localStorage.removeItem('adminToken');
          setToken('');
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        }
        throw new Error(errorData.error || 'Lỗi khi lưu công việc');
      }

      await displayJobs(1);
      setShowModal(false);
      setFormData({
        JobType: '',
        Name: '',
        Brands: [],
        Position: '',
        Workplace: '',
        Salary: '',
        Slot: '',
        'Post-date': new Date().toISOString().split('T')[0],
        'Due date': '',
        'Job Description': '',
        'Work Experience': '',
        Welfare: [],
        status: 'show',
        Degree: '',
        'Job Requirements': [],
      });
      setFormErrors({});
      alert(modalMode === 'add' ? 'Thêm công việc thành công!' : 'Cập nhật công việc thành công!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Đã xảy ra lỗi khi lưu công việc: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & search
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
    if (jobType) filtered = filtered.filter(j => j.jobType.toLowerCase() === jobType.toLowerCase());

    setFilteredJobs(filtered.slice(0, itemsPerPage));
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  const debouncedSearch = debounce(() => handleApplyFilters(), 300);
  const handleSearchChange = () => debouncedSearch();
  const handleResetFilters = () => {
    document.querySelector('.search-bar').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('levelFilter').value = '';
    displayJobs(1);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    setToken(storedToken || '');
    if (storedToken) {
      displayJobs();
    } else {
      setJobs([]);
      setFilteredJobs([]);
    }
  }, []);

  const uniqueJobTypes = [...new Set(jobs.map(job => job.jobType))];
  const uniqueStatuses = [...new Set(jobs.map(job => job.status))];

  // Pagination buttons
  const getPaginationButtons = () => {
    const maxButtons = 5;
    const buttons = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    buttons.push(
      <button key="first" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
        <i className="fa-solid fa-angles-left"></i>
      </button>
    );
    buttons.push(
      <button key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <i className="fa-solid fa-angle-left"></i>
      </button>
    );
    if (startPage > 1) buttons.push(<span key="start-ellipsis">...</span>);
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
    if (endPage < totalPages) buttons.push(<span key="end-ellipsis">...</span>);
    buttons.push(
      <button key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <i className="fa-solid fa-angle-right"></i>
      </button>
    );
    buttons.push(
      <button key="last" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
        <i className="fa-solid fa-angles-right"></i>
      </button>
    );
    return buttons;
  };

  return (
    <div className={styles.container}>
      {!token && <p>Vui lòng đăng nhập để quản lý công việc.</p>}
      <div className={styles.filters}>
        <input
          type="text"
          className={`${styles.searchBar} search-bar`}
          placeholder="Tìm kiếm công việc..."
          onChange={handleSearchChange}
          disabled={!token}
        />
        <select id="statusFilter" onChange={handleApplyFilters} disabled={!token}>
          <option value="">- Tất cả trạng thái -</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select id="levelFilter" onChange={handleApplyFilters} disabled={!token}>
          <option value="">- Tất cả loại công việc -</option>
          {uniqueJobTypes.map(jobType => (
            <option key={jobType} value={jobType}>{jobType}</option>
          ))}
        </select>
        <button onClick={handleApplyFilters} disabled={!token}>
          <i className="fa-solid fa-filter"></i> Áp dụng
        </button>
        <button onClick={handleResetFilters} disabled={!token}>
          <i className="fa-solid fa-rotate"></i> Đặt lại
        </button>
      </div>

      <div className={styles.jobs}>
        <h3>
          Danh Sách Công Việc
          <button onClick={handleOpenAddModal} disabled={!token}>
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
                <td colSpan="8" style={{ textAlign: 'center' }}>Đang tải...</td>
              </tr>
            ) : filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy công việc nào</td>
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
                      className={`${styles.status} ${job.status === 'Đang tuyển' ? styles.active : styles.inactive}`}
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
        <div className={styles.pagination}>{getPaginationButtons()}</div>
      </div>

      {selectedJob && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setSelectedJob(null)}>×</span>
            <h3>Chi Tiết Công Việc: {selectedJob.title}</h3>
            <div className={styles.jobDetails}>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}><label>ID:</label><p>{selectedJob.id}</p></div>
                <div className={styles.detailGroup}><label>Trạng thái:</label>
                  <p>
                    <span className={`${styles.status} ${selectedJob.status === 'Đang tuyển' ? styles.active : styles.inactive}`}>{selectedJob.status}</span>
                  </p>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}><label>Tên công việc:</label><p>{selectedJob.title}</p></div>
                <div className={styles.detailGroup}><label>Thương hiệu:</label><p>{selectedJob.brand}</p></div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}><label>Loại công việc:</label><p>{selectedJob.jobType}</p></div>
                <div className={styles.detailGroup}><label>Mức lương:</label><p>{selectedJob.salary}</p></div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}><label>Địa điểm:</label><p>{selectedJob.location}</p></div>
                <div className={styles.detailGroup}><label>Hạn nộp:</label><p>{selectedJob.deadline}</p></div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}><label>Ngày đăng:</label><p>{selectedJob.postDate}</p></div>
                <div className={styles.detailGroup}><label>Số lượng tuyển:</label><p>{selectedJob.slot}</p></div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}><label>Trình độ:</label><p>{selectedJob.degree}</p></div>
                <div className={styles.detailGroup}><label>Vị trí:</label><p>{selectedJob.position}</p></div>
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
                  className={`${styles.statusBtn} ${selectedJob.status === 'Đang tuyển' ? styles.inactive : styles.active}`}
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
            <span className={styles.close} onClick={() => setShowModal(false)}>×</span>
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
                    value={formData.Brands.join(', ')}
                    onChange={handleInputChange}
                    className={formErrors.Brands ? styles.errorInput : ''}
                    placeholder="Nhập các thương hiệu, cách nhau bằng dấu phẩy"
                  />
                  {formErrors.Brands && <p className={styles.error}>{formErrors.Brands}</p>}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Loại công việc: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="JobType"
                    value={formData.JobType}
                    onChange={handleInputChange}
                    className={formErrors.JobType ? styles.errorInput : ''}
                  />
                  {formErrors.JobType && <p className={styles.error}>{formErrors.JobType}</p>}
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
                  <label>Ngày đăng: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="date"
                    name="Post-date"
                    value={formData['Post-date']}
                    onChange={handleInputChange}
                    className={formErrors['Post-date'] ? styles.errorInput : ''}
                  />
                  {formErrors['Post-date'] && <p className={styles.error}>{formErrors['Post-date']}</p>}
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
              <div className={styles.detailRow}>
                <div className={styles.detailGroup}>
                  <label>Trình độ: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="Degree"
                    value={formData.Degree}
                    onChange={handleInputChange}
                    className={formErrors.Degree ? styles.errorInput : ''}
                  />
                  {formErrors.Degree && <p className={styles.error}>{formErrors.Degree}</p>}
                </div>
                <div className={styles.detailGroup}>
                  <label>Vị trí: <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    name="Position"
                    value={formData.Position}
                    onChange={handleInputChange}
                    className={formErrors.Position ? styles.errorInput : ''}
                  />
                  {formErrors.Position && <p className={styles.error}>{formErrors.Position}</p>}
                </div>
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Kinh nghiệm làm việc: <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  name="Work Experience"
                  value={formData['Work Experience']}
                  onChange={handleInputChange}
                  className={formErrors['Work Experience'] ? styles.errorInput : ''}
                />
                {formErrors['Work Experience'] && <p className={styles.error}>{formErrors['Work Experience']}</p>}
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
                <label>Yêu cầu công việc: <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  name="Job Requirements"
                  value={formData['Job Requirements'].join('\n')}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Nhập các yêu cầu, mỗi yêu cầu trên một dòng"
                  className={formErrors['Job Requirements'] ? styles.errorInput : ''}
                />
                {formErrors['Job Requirements'] && <p className={styles.error}>{formErrors['Job Requirements']}</p>}
              </div>
              <div className={`${styles.detailGroup} ${styles.full}`}>
                <label>Quyền lợi: <span style={{ color: 'red' }}>*</span></label>
                <textarea
                  name="Welfare"
                  value={formData.Welfare.join('\n')}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Nhập các quyền lợi, mỗi quyền lợi trên một dòng"
                  className={formErrors.Welfare ? styles.errorInput : ''}
                />
                {formErrors.Welfare && <p className={styles.error}>{formErrors.Welfare}</p>}
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