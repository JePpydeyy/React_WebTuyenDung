import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faBuilding,
  faBriefcase,
  faUsers,
  faStar,
  faGraduationCap,
  faDollarSign,
  faCalendar,
  faLocationDot,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import styles from './JobDetail.module.css';

const bannerImages = [
  '/assets/images/BANNER1.jpg',
  '/assets/images/BANNER2.jpg',
];

// Format date to Vietnamese locale (e.g., "ngày 29 tháng 06 năm 2025")
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const bannerRef = useRef(null);

  // Parse workplace into individual locations
  const parseWorkplaces = (workplaceString) => {
    if (!workplaceString) return [];
    const parts = workplaceString.split('-')[0].split(',').map((part) => part.trim());
    return parts.filter((part) => part !== '');
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log('Đang tải công việc với ID:', jobId);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/job/${jobId}`);
        if (!res.ok) throw new Error('Không tìm thấy công việc');
        const data = await res.json();
        console.log('Dữ liệu công việc:', data);
        if (!data._id || !data.Name || !data.Workplace) {
          throw new Error('Dữ liệu công việc không đầy đủ');
        }
        // Ensure the job has status: "show"
        if (data.status !== 'show') {
          throw new Error('Công việc không khả dụng');
        }
        setJob(data);
      } catch (err) {
        console.error('Lỗi khi tải công việc:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestJobs = async () => {
      try {
        const res = await fetch('https://api-tuyendung-cty.onrender.com/api/job');
        const data = await res.json();
        const currentDate = new Date();
        const sortedJobs = Array.isArray(data)
          ? data
              .filter((job) => job.status === 'show') // Filter for status: "show"
              .filter((job) => new Date(job['Due date']) >= currentDate) // Filter non-expired jobs
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt
              .slice(0, 3) // Limit to 3 jobs
          : [];
        setLatestJobs(sortedJobs);
      } catch (err) {
        console.error('Lỗi khi tải công việc mới:', err);
        setLatestJobs([]);
      }
    };

    if (jobId) {
      fetchJob();
      fetchLatestJobs();
    }
  }, [jobId]);

  useEffect(() => {
    bannerImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const startBannerAuto = () => {
      stopBannerAuto();
      bannerTimer.current = setInterval(nextBannerSlide, 5000);
    };

    const stopBannerAuto = () => {
      if (bannerTimer.current) clearInterval(bannerTimer.current);
    };

    if (!isDragging) {
      startBannerAuto();
    } else {
      stopBannerAuto();
    }

    return stopBannerAuto;
  }, [bannerIdx, isDragging]);

  const showBannerSlide = (idx) => {
    setBannerIdx(idx);
    setCurrentTranslate(0);
    setPrevTranslate(0);
    setVelocity(0);
  };

  const nextBannerSlide = () => {
    setBannerIdx((prev) => (prev + 1) % bannerImages.length);
    setCurrentTranslate(0);
    setPrevTranslate(0);
    setVelocity(0);
  };

  const prevBannerSlide = () => {
    setBannerIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    setCurrentTranslate(0);
    setPrevTranslate(0);
    setVelocity(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setPrevTranslate(currentTranslate);
    setVelocity(0);
    setLastMoveTime(Date.now());
    if (bannerRef.current) {
      bannerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diffX = currentX - startX;
    const currentTime = Date.now();
    const timeDiff = currentTime - lastMoveTime;
    if (timeDiff > 0) {
      const newVelocity = (diffX - (currentTranslate - prevTranslate)) / timeDiff;
      setVelocity(newVelocity);
    }
    setCurrentTranslate(prevTranslate + diffX);
    setLastMoveTime(currentTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (bannerRef.current) {
      bannerRef.current.style.cursor = 'grab';
    }

    const threshold = window.innerWidth * 0.25; // Reduced to 25% for smoother response
    const absVelocity = Math.abs(velocity);
    const momentumThreshold = 0.5; // Pixels per millisecond

    if (absVelocity > momentumThreshold) {
      if (velocity > 0) {
        prevBannerSlide();
      } else {
        nextBannerSlide();
      }
    } else if (currentTranslate > threshold) {
      prevBannerSlide();
    } else if (currentTranslate < -threshold) {
      nextBannerSlide();
    } else {
      setCurrentTranslate(0); // Smooth snap-back
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (bannerRef.current) {
        bannerRef.current.style.cursor = 'grab';
      }
      setCurrentTranslate(0);
      setVelocity(0);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.originalOverflow = originalOverflow;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = document.body.dataset.originalOverflow || 'auto';
    delete document.body.dataset.originalOverflow;
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
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, resume: 'File CV không được vượt quá 5MB' }));
        return;
      }
      setFormData((prev) => ({ ...prev, resume: file }));
      setFormErrors((prev) => ({ ...prev, resume: null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.workplace) errors.workplace = 'Vui lòng chọn địa điểm làm việc';
    if (!formData.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^\d{10,11}$/.test(formData.phone.trim())) errors.phone = 'Số điện thoại không hợp lệ';
    if (!formData.gender) errors.gender = 'Vui lòng chọn giới tính';
    if (!formData.dob) errors.dob = 'Vui lòng chọn ngày sinh';
    else {
      const today = new Date();
      const dobDate = new Date(formData.dob);
      if (dobDate > today) errors.dob = 'Ngày sinh không thể là ngày trong tương lai';
    }
    if (!formData.email.trim()) errors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.email = 'Email không hợp lệ';
    if (!formData.resume) errors.resume = 'Vui lòng tải lên CV';
    return errors;
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    const dobISO = formData.dob ? new Date(formData.dob).toISOString() : '';

    const form = {
      desiredWorkplace: formData.workplace,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      dob: dobISO,
      email: formData.email.trim(),
      note: formData.note.trim(),
    };

    const applicationData = new FormData();
    applicationData.append('jobId', jobId || '');
    applicationData.append('jobName', job?.Name || '');
    applicationData.append('jobWorkplace', job?.Workplace || '');
    applicationData.append('form', JSON.stringify(form));
    applicationData.append('status', 'pending');
    if (formData.resume) {
      applicationData.append('resume', formData.resume);
    }

    try {
      console.log('Form object:', form);
      console.log('FormData entries:', Object.fromEntries(applicationData));

      const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: 'POST',
        body: applicationData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('API error response:', errorData);
        throw new Error(`Không thể gửi: ${res.status} - ${errorData.message || 'Lỗi không xác định'}`);
      }

      const data = await res.json();
      console.log('Ứng tuyển thành công:', data);
      alert('Ứng tuyển thành công! Chúng tôi sẽ liên hệ sớm.');
      closeModal();
    } catch (err) {
      console.error('Lỗi khi gửi ứng tuyển:', err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  if (loading) return <div className={styles.jobDetailDiv}>Đang tải...</div>;
  if (error) return <div className={styles.jobDetailDiv}>Lỗi: {error}</div>;
  if (!job) return <div className={styles.jobDetailDiv}>Không tìm thấy công việc</div>;

  const workplaceOptions = parseWorkplaces(job.Workplace);

  return (
    <main>
      <section className={styles.jobBanner}>
        <div
          className={styles.jobBannerWrapper}
          ref={bannerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {bannerImages.map((src, idx) => (
            <img
              key={`banner-${idx}`}
              className={`${styles.jobBannerImage} ${
                idx === bannerIdx ? styles.jobBannerImageActive : ''
              } ${
                idx === (bannerIdx - 1 + bannerImages.length) % bannerImages.length
                  ? styles.jobBannerImagePrev
                  : ''
              }`}
              src={src}
              alt={`Banner ${idx + 1}`}
              style={{
                transform: `translateX(${currentTranslate}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              }}
              loading="lazy"
            />
          ))}
          <button
            className={`${styles.jobBannerBtn} ${styles.jobBannerBtnLeft}`}
            onClick={prevBannerSlide}
            aria-label="Banner trước"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button
            className={`${styles.jobBannerBtn} ${styles.jobBannerBtnRight}`}
            onClick={nextBannerSlide}
            aria-label="Banner tiếp theo"
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <div className={styles.jobBannerIndicators}>
            {bannerImages.map((_, idx) => (
              <span
                key={`indicator-${idx}`}
                className={`${styles.jobIndicator} ${idx === bannerIdx ? styles.jobIndicatorActive : ''}`}
                onClick={() => showBannerSlide(idx)}
                aria-label={`Chuyển đến banner ${idx + 1}`}
              ></span>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.jobDetailDiv}>
        <h1>{job.Name}</h1>
        <div className={styles.jobDetailsGrid}>
          <div className={styles.jobDetailColumn}>
            <h2>
              <FontAwesomeIcon icon={faBuilding} />
              Thương hiệu
            </h2>
            <ul>
              <li>{job.Brands}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2>
              <FontAwesomeIcon icon={faBriefcase} />
              Cấp bậc
            </h2>
            <ul>
              <li>{job.Position || 'Nhân viên'}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2>
              <FontAwesomeIcon icon={faUsers} />
              Số lượng
            </h2>
            <ul>
              <li>{job.Slot}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2>
              <FontAwesomeIcon icon={faStar} />
              Kinh nghiệm
            </h2>
            <ul>
              <li>{job['Work Experience'] || 'Không yêu cầu'}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2>
              <FontAwesomeIcon icon={faGraduationCap} />
              Bằng cấp
            </h2>
            <ul>
              <li>{job.Degree || 'Trung học phổ thông'}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2>
              <FontAwesomeIcon icon={faDollarSign} />
              Mức lương
            </h2>
            <ul>
              <li>{job.Salary}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2>
              <FontAwesomeIcon icon={faCalendar} />
              Hết hạn nộp
            </h2>
            <ul>
              <li>{formatDate(job['Due date'])}</li>
            </ul>
          </div>
          <div className={styles.jobDetailColumn}>
            <h2>
              <FontAwesomeIcon icon={faLocationDot} />
              Nơi làm việc
            </h2>
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
              {Array.isArray(job['Job Description']) && job['Job Description'].length > 0
                ? job['Job Description'].map((item, idx) => (
                    <li key={idx}>{item.trim()}</li>
                  ))
                : <li>Đang cập nhật thông tin mô tả công việc...</li>}
            </ul>
          </div>
          <div className={styles.jobSection}>
            <h3>Yêu cầu công việc</h3>
            <ul>
              {Array.isArray(job['Job Requirements']) && job['Job Requirements'].length > 0
                ? job['Job Requirements'].map((item, idx) => <li key={idx}>{item.trim()}</li>)
                : <li>Đang cập nhật...</li>}
            </ul>
          </div>
          <div className={styles.jobSection}>
            <h3>Quyền lợi</h3>
            <ul>
              {Array.isArray(job['Welfare']) && job['Welfare'].length > 0
                ? job['Welfare'].map((item, idx) => <li key={idx}>{item.trim()}</li>)
                : <li>Đang cập nhật...</li>}
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
              .filter((latestJob) => latestJob._id !== jobId)
              .map((latestJob, idx) => (
                <div key={latestJob._id || idx} className={styles.jobCard}>
                  <div className={styles.jobCardHeader}>{latestJob.Name}</div>
                  <div className={styles.jobCardContent}>
                    <div className={styles.jobCardTitle}>Thương hiệu: {latestJob.Brands}</div>
                    <div className={styles.jobCardInfo}>
                      <strong>Nơi làm việc:</strong> {latestJob.Workplace}
                    </div>
                    <div className={styles.jobCardInfo}>
                      <strong>Mức lương:</strong> {latestJob.Salary}
                    </div>
                    <div className={styles.jobCardInfo}>
                      <strong>Số lượng tuyển:</strong> {latestJob.Slot}
                    </div>
                    <div className={styles.jobCardInfo}>
                      <strong>Ngày hết hạn:</strong> {formatDate(latestJob['Due date'])}
                    </div>
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
          <Link to="/JobContent" className={styles.jobBackToProducts}>
            Xem Thêm
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.jobModal}>
          <div className={styles.jobModalContent}>
            <div className={styles.jobModalHeader}>
              <div className={styles.jobModalTitle}>Ứng tuyển ngay</div>
              <button className={styles.jobClose} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={styles.jobModalBody}>
              <div className={styles.jobPosition}>
                <strong>Vị trí ứng tuyển:</strong> {job.Name}
                <br />
                <strong>Việc làm tại:</strong> {job.Workplace}
              </div>
              <form onSubmit={submitApplication}>
                <div className={styles.jobFormGroup}>
                  <label className={styles.jobLabel}>
                    Địa điểm làm việc mong muốn<span className={styles.jobRequired}>*</span>
                  </label>
                  <select
                    name="workplace"
                    value={formData.workplace}
                    onChange={handleFormChange}
                    className={`${styles.jobSelect} ${formErrors.workplace ? styles.jobInputError : ''}`}
                  >
                    <option value="">- Chọn địa điểm -</option>
                    {workplaceOptions.map((location, idx) => (
                      <option key={idx} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {formErrors.workplace && (
                    <span className={styles.jobError}>{formErrors.workplace}</span>
                  )}
                </div>
                <div className={styles.jobFormRow}>
                  <div className={styles.jobFormGroup}>
                    <label className={styles.jobLabel}>
                      Họ và tên<span className={styles.jobRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Nhập họ tên"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className={`${styles.jobInput} ${formErrors.fullName ? styles.jobInputError : ''}`}
                    />
                    {formErrors.fullName && (
                      <span className={styles.jobError}>{formErrors.fullName}</span>
                    )}
                  </div>
                  <div className={styles.jobFormGroup}>
                    <label className={styles.jobLabel}>
                      Điện thoại<span className={styles.jobRequired}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className={`${styles.jobInput} ${formErrors.phone ? styles.jobInputError : ''}`}
                    />
                    {formErrors.phone && (
                      <span className={styles.jobError}>{formErrors.phone}</span>
                    )}
                  </div>
                </div>
                <div className={styles.jobFormRow}>
                  <div className={styles.jobFormGroup}>
                    <label className={styles.jobLabel}>
                      Giới tính<span className={styles.jobRequired}>*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      className={`${styles.jobSelect} ${formErrors.gender ? styles.jobInputError : ''}`}
                    >
                      <option value="">- Chọn giới tính -</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    {formErrors.gender && (
                      <span className={styles.jobError}>{formErrors.gender}</span>
                    )}
                  </div>
                  <div className={styles.jobFormGroup}>
                    <label className={styles.jobLabel}>
                      Ngày sinh<span className={styles.jobRequired}>*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleFormChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`${styles.jobInput} ${formErrors.dob ? styles.jobInputError : ''}`}
                    />
                    {formErrors.dob && (
                      <span className={styles.jobError}>{formErrors.dob}</span>
                    )}
                  </div>
                </div>
                <div className={styles.jobFormGroup}>
                  <label className={styles.jobLabel}>
                    Email<span className={styles.jobRequired}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`${styles.jobInput} ${formErrors.email ? styles.jobInputError : ''}`}
                  />
                  {formErrors.email && (
                    <span className={styles.jobError}>{formErrors.email}</span>
                  )}
                </div>
                <div className={styles.jobFormGroup}>
                  <label className={styles.jobLabel}>Ghi chú</label>
                  <textarea
                    name="note"
                    placeholder="Nhập lưu ý đến nhà tuyển dụng"
                    value={formData.note}
                    onChange={handleFormChange}
                    className={styles.jobTextarea}
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
                      className={styles.jobFileInput}
                    />
                    <label htmlFor="resume" className={styles.jobFileBtn}>
                      <FontAwesomeIcon icon={faFile} />
                      Tải lên CV
                    </label>
                    <span>{formData.resume ? formData.resume.name : 'Chưa có tệp nào được chọn'}</span>
                  </div>
                  {formErrors.resume && (
                    <span className={styles.jobError}>{formErrors.resume}</span>
                  )}
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