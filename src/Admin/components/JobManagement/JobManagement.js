import React, { useState, useEffect } from 'react';
import styles from './JobManagement.module.css';

const JobManagement = ({ onAddJobClick }) => {
  const initialJobs = [
    {
      id: 'JOB001',
      title: 'Customer Service Executive',
      brand: 'ACFC',
      level: 'Nhân viên',
      salary: 'Negotiation',
      location: 'Thành Phố Hồ Chí Minh',
      deadline: '26/05/2025',
      status: 'Đang tuyển',
      description: `Chịu trách nhiệm tư vấn giải đáp thông tin thông qua điện thoại và các trang mạng xã hội của các thương hiệu của công ty ACFC (Nike, Tommy, Mango, Levi's, Cotton On, Old Navy, MotherCare, CK,...)

Tiếp nhận, trả lời và xử lý các yêu cầu của khách hàng (các vấn đề trong phạm vi chuyên môn, nghiệp vụ) qua điện thoại.

Chuyển thông tin nhận được cho những bộ phận có trách nhiệm giải quyết đúng thời theo dõi kết quả của quá trình đó cho đến khi hoàn tất.

Cập nhật chính sách ưu đãi, khuyến mại và kinh doanh của cửa hàng để có thể hướng dẫn và cung cấp thông tin cần thiết cho khách hàng (qua điện thoại/email,…hoặc trực tiếp).

Nắm bắt các yêu cầu của khách hàng, tìm hiểu những mong muốn của khách hàng đối với dịch vụ tại cửa hàng và báo cáo lên cấp quản lý.

Trực tiếp cập nhật các thông tin dữ liệu khách hàng vào hệ thống theo quy định của Công ty.`,
      requirements: `Trình độ: Tốt nghiệp trung học phổ thông trở lên
Ưu tiên kinh nghiệm trong lĩnh vực chăm sóc khách hàng
Giọng nói dễ nghe
Có thể giao tiếp Tiếng Anh là một lợi thế`,
      benefits: `Lộ trình thăng tiến rõ ràng
Môi trường làm việc chuyên nghiệp
Phụ cấp cơm 520k/tháng
Chế độ bảo hiểm
Du lịch
Đào tạo
Nghỉ phép năm`
    },
    {
      id: 'JOB002',
      title: 'Sales Manager',
      brand: 'Nike',
      level: 'Quản lý',
      salary: '25-30 triệu VND',
      location: 'Hà Nội',
      deadline: '30/05/2025',
      status: 'Đang tuyển',
      description: 'Quản lý đội ngũ bán hàng, phát triển chiến lược kinh doanh...',
      requirements: 'Có kinh nghiệm quản lý ít nhất 3 năm...',
      benefits: 'Lương cạnh tranh, thưởng hiệu suất...'
    }
  ];

  const [jobs, setJobs] = useState(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(null);

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const displayJobs = (jobsToShow = jobs) => {
    setFilteredJobs(jobsToShow);
  };

  const handleViewJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setSelectedJob(job);
  };

  const handleEditJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    onAddJobClick(job); // Gọi hàm từ Job.js để mở form chỉnh sửa
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      const updatedJobs = jobs.filter(j => j.id !== jobId);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      showNotification('Đã xóa công việc!', 'success');
    }
  };

  const handleSearchChange = (e) => {
    const search = e.target.value.trim().toLowerCase();
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

    displayJobs(filtered);
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

    displayJobs(filtered);
  };

  const handleResetFilters = () => {
    document.querySelector('.search-bar').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('levelFilter').value = '';
    displayJobs(jobs);
  };

  useEffect(() => {
    displayJobs();
  }, []);

  return (
    <div className={styles.container}>
      {/* Bộ lọc */}
      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Tìm kiếm công việc..."
          onChange={handleSearchChange}
        />
        <select id="statusFilter" onChange={handleApplyFilters}>
          <option value="">- Tất cả trạng thái -</option>
          <option value="Đang tuyển">Đang tuyển</option>
          <option value="Tạm dừng">Tạm dừng</option>
        </select>
        <select id="levelFilter" onChange={handleApplyFilters}>
          <option value="">- Tất cả cấp bậc -</option>
          <option value="Nhân viên">Nhân viên</option>
          <option value="Trưởng nhóm">Trưởng nhóm</option>
          <option value="Quản lý">Quản lý</option>
          <option value="Giám đốc">Giám đốc</option>
        </select>
        <button onClick={handleApplyFilters}>
          <i className="fa-solid fa-filter"></i> Áp dụng
        </button>
        <button onClick={handleResetFilters}>
          <i className="fa-solid fa-rotate"></i> Đặt lại
        </button>
      </div>

      {/* Danh sách công việc */}
      <div className={styles.jobs}>
        <h3>
          Danh Sách Công Việc
          <button onClick={() => onAddJobClick(null)}>
            <i className="fa-solid fa-plus"></i> Thêm Công Việc
          </button>
        </h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>
                  Không tìm thấy công việc nào
                </td>
              </tr>
            ) : (
              filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>{job.id}</td>
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
                      <button className={styles.edit} onClick={() => handleEditJob(job.id)}>
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

      {/* Modal chi tiết công việc */}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;