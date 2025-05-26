import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './JobDetail.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const bannerImages = [
  '/image/BANNER5.jpg',
  '/image/BANNER6.jpg',
  '/image/BANNER7.jpg',
];

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    workplace: '',
    fullName: '',
    phone: '',
    gender: '',
    dob: '',
    email: '',
    note: '',
    resume: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [latestJobs, setLatestJobs] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerTimer = useRef(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log('Fetching job with ID:', jobId);
        const res = await fetch(`https://api-tuyendung-cty.onrender.com/api/job/${jobId}`);
        if (!res.ok) throw new Error('Không tìm thấy công việc');
        const data = await res.json();
        console.log('Job data received:', data);
        setJob(data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestJobs = async () => {
      try {
        const res = await fetch('https://api-tuyendung-cty.onrender.com/api/job');
        const data = await res.json();
        const sortedJobs = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
          : [];
        setLatestJobs(sortedJobs);
      } catch (err) {
        console.error('Error fetching latest jobs:', err);
        setLatestJobs([]);
      }
    };

    if (jobId) {
      fetchJob();
      fetchLatestJobs();
    }
  }, [jobId]);

  const startBannerAuto = () => {
    stopBannerAuto();
    bannerTimer.current = setInterval(nextBannerSlide, 5000);
  };

  const stopBannerAuto = () => {
    if (bannerTimer.current) clearInterval(bannerTimer.current);
  };

  const showBannerSlide = (idx) => {
    setBannerIdx(idx);
  };

  const nextBannerSlide = () => {
    setBannerIdx((prev) => (prev + 1) % bannerImages.length);
  };

  const prevBannerSlide = () => {
    setBannerIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  useEffect(() => {
    startBannerAuto();
    return stopBannerAuto;
  }, [bannerIdx]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setFormData({
      workplace: '',
      fullName: '',
      phone: '',
      gender: '',
      dob: '',
      email: '',
      note: '',
      resume: null,
    });
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.dob) errors.dob = 'Vui lòng chọn ngày sinh';
    if (!formData.email.trim()) errors.email = 'Vui lòng nhập email';
    if (!formData.resume) errors.resume = 'Vui lòng tải lên CV';
    return errors;
  };

  const submitApplication = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    alert('Ứng tuyển thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    closeModal();
  };

  if (loading) return <div className={styles.jobDetail}>Đang tải...</div>;
  if (error) return <div className={styles.jobDetail}>Lỗi: {error}</div>;
  if (!job) return <div className={styles.jobDetail}>Không tìm thấy công việc</div>;

  return (
    <main>
      <section className={styles.jobBanner}>
        <div className={styles.jobBannerWrapper}>
          {bannerImages.map((src, idx) => (
            <img
              key={src}
              className={`${styles.jobBannerImage} ${idx === bannerIdx ? styles.jobBannerImageActive : ''} ${
                idx === (bannerIdx - 1 + bannerImages.length) % bannerImages.length ? styles.jobBannerImagePrev : ''
              }`}
              src={src}
              alt={`Banner ${idx + 1}`}
              loading="lazy"
            />
          ))}
          <button
            className={`${styles.jobBannerBtn} ${styles.jobBannerBtnLeft}`}
            onClick={() => {
              prevBannerSlide();
              stopBannerAuto();
            }}
            aria-label="Previous Banner"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button
            className={`${styles.jobBannerBtn} ${styles.jobBannerBtnRight}`}
            onClick={() => {
              nextBannerSlide();
              stopBannerAuto();
            }}
            aria-label="Next Banner"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <div className={styles.jobBannerIndicators}>
            {bannerImages.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.jobIndicator} ${idx === bannerIdx ? styles.jobIndicatorActive : ''}`}
                onClick={() => {
                  showBannerSlide(idx);
                  stopBannerAuto();
                }}
                aria-label={`Go to banner ${idx + 1}`}
              ></span>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.jobDetail}>
        <h1>{job.Name}</h1>
        <div className={styles.jobDetailsGrid}>
          <div className={styles.jobDetailColumn}>
            <h2><i className="fa-solid fa-building"></i>Thương hiệu</h2>
            <ul>
              <li>{job.Brands}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2><i className="fa-solid fa-briefcase"></i>Cấp bậc</h2>
            <ul>
              <li>{job.Position || 'Nhân viên'}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2><i className="fa-solid fa-users"></i>Số lượng</h2>
            <ul>
              <li>{job.Slot}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2><i className="fa-solid fa-star"></i>Kinh nghiệm</h2>
            <ul>
              <li>{job['Work Experience'] || 'Không yêu cầu'}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2><i className="fa-solid fa-graduation-cap"></i>Bằng cấp</h2>
            <ul>
              <li>{job.Degree || 'Trung học phổ thông'}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2><i className="fa-solid fa-dollar-sign"></i>Mức lương</h2>
            <ul>
              <li>{job.Salary}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2><i className="fa-solid fa-calendar"></i>Hết hạn nộp</h2>
            <ul>
              <li>{job['Due date']}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2><i className="fa-solid fa-location-dot"></i>Nơi làm việc</h2>
            <ul>
              <li>{job.Workplace}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.jobContainer}>
        <div className={styles.jobMainContent}>
          <h2>Mô tả công việc</h2>
          <div className={styles.jobSection}>
            <ul>
              {(job['Job Description'] && job['Job Description'] !== '0' 
                ? job['Job Description'] 
                : 'Đang cập nhật thông tin mô tả công việc...'
              ).split('\n').map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.jobSection}>
            <h3>Yêu cầu công việc</h3>
            <ul>
              {(job['Job Requirements'] || 'Đang cập nhật...').split('\n').map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.jobSection}>
            <h3>Quyền lợi</h3>
            <ul>
              {(job['Welfare'] || 'Đang cập nhật...').split('\n').map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <button className={styles.jobApplyBtn} onClick={openModal}>
            Ứng tuyển
          </button>
        </div>

        <div className={styles.jobSidebar}>
          <div className={styles.jobCard}>
            <div className={styles.jobCardHeader}>Công việc mới nhất</div>
          </div>
          {latestJobs.length > 0 ? (
            latestJobs
              .filter(latestJob => latestJob._id !== jobId)
              .map((latestJob, idx) => (
                <div key={latestJob._id || idx} className={styles.jobCard}>
                  <div className={styles.jobCardHeader}>{latestJob.Name}</div>
                  <div className={styles.jobCardContent}>
                    <div className={styles.jobCardTitle}>Thương hiệu: {latestJob.Brands}</div>
                    <div className={styles.jobCardInfo}><strong>Nơi làm việc:</strong> {latestJob.Workplace}</div>
                    <div className={styles.jobCardInfo}><strong>Mức lương:</strong> {latestJob.Salary}</div>
                    <div className={styles.jobCardInfo}><strong>Số lượng tuyển:</strong> {latestJob.Slot}</div>
                    <div className={styles.jobCardInfo}><strong>Ngày đăng:</strong> {new Date(latestJob.createdAt).toLocaleDateString('vi-VN')}</div>
                    <Link 
                      to={`/DetailJob/${latestJob._id}`} 
                      className={styles.jobViewDetails}
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))
          ) : (
            <div className={styles.jobCard}>
              <div className={styles.jobCardContent}>Không có công việc mới</div>
            </div>
          )}
          <Link to="/Job" className={styles.jobBackToProducts}>
            Xem Thêm
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.jobModal}>
          <div className={styles.jobModalContent}>
            <div className={styles.jobModalHeader}>
              <div className={styles.jobModalTitle}>Apply Now</div>
              <button className={styles.jobClose} onClick={closeModal}>×</button>
            </div>
            <div className={styles.jobModalBody}>
              <div className={styles.jobPosition}>
                <strong>Vị trí ứng tuyển:</strong> {job.Name}<br />
                <strong>Việc làm tại:</strong> {job.Workplace}
              </div>
              <form onSubmit={submitApplication}>
                <div className={styles.jobFormGroup}>
                  <label>Địa điểm làm việc mong muốn</label>
                  <select name="workplace" value={formData.workplace} onChange={handleFormChange}>
                    <option value="">- Theo sự sắp xếp -</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                </div>
                <div className={styles.jobFormRow}>
                  <div className={styles.jobFormGroup}>
                    <label>Họ và tên<span className={styles.jobRequired}>*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Nhập họ tên"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      style={{ borderColor: formErrors.fullName ? 'red' : '#ddd' }}
                    />
                  </div>
                  <div className={styles.jobFormGroup}>
                    <label>Điện thoại<span className={styles.jobRequired}>*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={formData.phone}
                      onChange={handleFormChange}
                      style={{ borderColor: formErrors.phone ? 'red' : '#ddd' }}
                    />
                  </div>
                </div>
                <div className={styles.jobFormRow}>
                  <div className={styles.jobFormGroup}>
                    <label>Giới tính</label>
                    <select name="gender" value={formData.gender} onChange={handleFormChange}>
                      <option value="">- Chọn giới tính -</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className={styles.jobFormGroup}>
                    <label>Ngày sinh<span className={styles.jobRequired}>*</span></label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleFormChange}
                      style={{ borderColor: formErrors.dob ? 'red' : '#ddd' }}
                    />
                  </div>
                </div>
                <div className={styles.jobFormGroup}>
                  <label>Email<span className={styles.jobRequired}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={handleFormChange}
                    style={{ borderColor: formErrors.email ? 'red' : '#ddd' }}
                  />
                </div>
                <div className={styles.jobFormGroup}>
                  <label>Ghi chú</label>
                  <textarea
                    name="note"
                    placeholder="Nhập lưu ý đến nhà tuyển dụng"
                    value={formData.note}
                    onChange={handleFormChange}
                  ></textarea>
                </div>
                <div className={styles.jobFormGroup}>
                  <div className={styles.jobFileUpload}>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFormChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="resume" className={styles.jobFileBtn}>
                      <i className="fa-solid fa-file"></i> Tải lên CV
                    </label>
                    <span>{formData.resume ? formData.resume.name : 'Chưa có tệp nào được chọn'}</span>
                  </div>
                  {formErrors.resume && <span className={styles.jobRequired}>{formErrors.resume}</span>}
                </div>
                <div className={styles.jobModalFooter}>
                  <button type="button" className={styles.jobBtnCancel} onClick={closeModal}>
                    Đóng
                  </button>
                  <button type="submit" className={styles.jobBtnSubmit}>
                    Ứng tuyển
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default JobDetail;