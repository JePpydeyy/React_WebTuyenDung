import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Job.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const bannerImages = [
  '/assets/images/BANNER1.jpg',
  '/assets/images/BANNER2.jpg',
  '/assets/images/BANNER3.jpg',

  
];

const Jobcontent = () => {
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerTimer = useRef(null);
  const bannerRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loadedImages, setLoadedImages] = useState([bannerImages[0]]);

  // Banner slider functions
  const stopBannerAuto = useCallback(() => {
    if (bannerTimer.current) clearInterval(bannerTimer.current);
  }, []);

  const nextBannerSlide = useCallback(() => {
    setBannerIdx((prev) => (prev + 1) % bannerImages.length);
  }, []);

  const prevBannerSlide = useCallback(() => {
    setBannerIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  }, []);

  const startBannerAuto = useCallback(() => {
    stopBannerAuto();
    bannerTimer.current = setInterval(nextBannerSlide, 5000);
  }, [stopBannerAuto, nextBannerSlide]);

  const showBannerSlide = useCallback(
    (idx) => {
      setBannerIdx(idx);
      stopBannerAuto();
    },
    [stopBannerAuto]
  );

  // Swipe handling functions
  const handleSwipeStart = useCallback((clientX) => {
    setIsMouseDown(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsDragging(false);
    stopBannerAuto();
  }, [stopBannerAuto]);

  const handleSwipeMove = useCallback((clientX) => {
    if (!isMouseDown) return;
    setCurrentX(clientX);
    const diffX = Math.abs(clientX - startX);
    if (diffX > 10) {
      setIsDragging(true);
    }
  }, [isMouseDown, startX]);

  const handleSwipeEnd = useCallback(() => {
    if (!isMouseDown) return;
    setIsMouseDown(false);
    if (isDragging) {
      const diffX = currentX - startX;
      const threshold = window.innerWidth * 0.1; // 10% of viewport width
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          prevBannerSlide();
        } else {
          nextBannerSlide();
        }
      }
    }
    setIsDragging(false);
    setTimeout(() => {
      startBannerAuto();
    }, 3000);
  }, [isMouseDown, isDragging, currentX, startX, prevBannerSlide, nextBannerSlide, startBannerAuto]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    handleSwipeStart(e.clientX);
  }, [handleSwipeStart]);

  const handleMouseMove = useCallback((e) => {
    handleSwipeMove(e.clientX);
  }, [handleSwipeMove]);

  const handleMouseUp = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  const handleMouseLeave = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    handleSwipeStart(touch.clientX);
  }, [handleSwipeStart]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging) {
      e.preventDefault(); // Prevent scrolling during swipe
    }
    const touch = e.touches[0];
    handleSwipeMove(touch.clientX);
  }, [isDragging, handleSwipeMove]);

  const handleTouchEnd = useCallback(() => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  useEffect(() => {
    startBannerAuto();
    return stopBannerAuto;
  }, [startBannerAuto, stopBannerAuto]);

  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isMouseDown, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const preloadImages = async () => {
      const nextIdx = (bannerIdx + 1) % bannerImages.length;
      const prevIdx = (bannerIdx - 1 + bannerImages.length) % bannerImages.length;
      const imagesToLoad = [bannerImages[bannerIdx], bannerImages[nextIdx], bannerImages[prevIdx]];
      const uniqueImages = [...new Set(imagesToLoad)];
      setLoadedImages(uniqueImages);
    };
    preloadImages();
  }, [bannerIdx]);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    brand: '',
    workplace: '',
    name: '',
    keyword: '',
  });
  const [searching, setSearching] = useState(false);

  const handleSearchChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log('Input changed:', { name, value }); // Debug
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchForm.keyword && !searchForm.brand && !searchForm.workplace && !searchForm.name) {
      alert('Vui lòng nhập ít nhất một tiêu chí tìm kiếm!');
      return;
    }
    setSearching(true);
    setStoreVisible(4);
    setOfficeVisible(4);
  };

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeVisible, setStoreVisible] = useState(4);
  const [officeVisible, setOfficeVisible] = useState(4);
  const [brandOptions, setBrandOptions] = useState([]);
  const [workplaceOptions, setWorkplaceOptions] = useState([]);
  const [nameOptions, setNameOptions] = useState([]);

  // Fetch jobs from API with retry mechanism
  const fetchJobs = useCallback(async (retries = 3, delay = 1000) => {
    const controller = new AbortController();
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const res = await fetch('https://api-tuyendung-cty.onrender.com/api/job', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}, Response: ${errorText}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Dữ liệu trả về không phải là mảng');
        const filteredJobs = data.filter((job) => job.status === 'show');
        setJobs(filteredJobs);
        setError(null);
        return;
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err);
        if (attempt === retries) {
          setError(`Không thể tải dữ liệu: ${err.message}`);
          setJobs([]);
        } else {
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Generate dropdown options
  useEffect(() => {
    const brands = Array.from(
      new Set(
        jobs
          .flatMap((job) => (Array.isArray(job.Brands) ? job.Brands : []))
          .filter(Boolean)
      )
    );
    const workplaces = Array.from(
      new Set(
        jobs
          .map((job) => job.Workplace)
          .filter(Boolean)
      )
    );
    const names = Array.from(
      new Set(
        jobs
          .map((job) => job.Name)
          .filter(Boolean)
      )
    );
    setBrandOptions(brands);
    setWorkplaceOptions(workplaces);
    setNameOptions(names);
  }, [jobs]);

  // Debug searchForm state
  useEffect(() => {
    console.log('searchForm:', searchForm);
  }, [searchForm]);

  // Filter jobs
  const filteredJobs = React.useMemo(() => {
    if (!searching) return jobs;
    return jobs.filter((job) => {
      const brandMatch =
        !searchForm.brand ||
        (Array.isArray(job.Brands) && job.Brands.includes(searchForm.brand));
      const workplaceMatch =
        !searchForm.workplace ||
        (job.Workplace && job.Workplace === searchForm.workplace);
      const nameMatch = !searchForm.name || job.Name === searchForm.name;
      const keyword = searchForm.keyword?.trim().toLowerCase();
      const keywordMatch =
        !keyword ||
        (job.Name && job.Name.toLowerCase().includes(keyword)) ||
        (Array.isArray(job.Brands) && job.Brands.some((brand) => brand.toLowerCase().includes(keyword))) ||
        (job.Workplace && job.Workplace.toLowerCase().includes(keyword));
      return brandMatch && workplaceMatch && nameMatch && keywordMatch;
    });
  }, [jobs, searchForm, searching]);

  // Sort and filter jobs by type
  const jobListingsNewStore = [...filteredJobs]
    .filter((job) => job.JobType === 'Store block jobs')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const jobListingsNewOffice = [...filteredJobs]
    .filter((job) => job.JobType === 'Office work')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Debug log to check filtered jobs
  useEffect(() => {
    console.log('Filtered Store Jobs:', jobListingsNewStore);
    console.log('Filtered Office Jobs:', jobListingsNewOffice);
  }, [jobListingsNewStore, jobListingsNewOffice]);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Không xác định';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <main>
      {/* Banner Section */}
      <section className={styles.banner}>
        <div
          className={`${styles.bannerWrapper} ${isDragging ? styles.dragging : ''}`}
          ref={bannerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              prevBannerSlide();
              stopBannerAuto();
            } else if (e.key === 'ArrowRight') {
              nextBannerSlide();
              stopBannerAuto();
            }
          }}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {bannerImages.map((src, idx) => (
            <img
              key={src}
              className={`${styles.bannerImage} ${idx === bannerIdx ? styles.active : ''} ${
                idx === (bannerIdx - 1 + bannerImages.length) % bannerImages.length ? styles.prev : ''
              }`}
              src={loadedImages.includes(src) ? src : '/assets/images/placeholder.jpg'}
              srcSet={`${src} 1x, ${src.replace('.webp', '@2x.webp')} 2x`}
              alt={`Banner ${idx + 1}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'low'}
              draggable={false}
            />
          ))}
          <button
            className={`${styles.bannerBtn} ${styles.bannerBtnLeft}`}
            onClick={() => {
              prevBannerSlide();
              stopBannerAuto();
            }}
            aria-label="Previous Banner"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button
            className={`${styles.bannerBtn} ${styles.bannerBtnRight}`}
            onClick={() => {
              nextBannerSlide();
              stopBannerAuto();
            }}
            aria-label="Next Banner"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <div className={styles.bannerIndicators}>
            {bannerImages.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.indicator} ${idx === bannerIdx ? styles.active : ''}`}
                onClick={() => showBannerSlide(idx)}
                aria-label={`Go to banner ${idx + 1}`}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Job Search Section */}
      <div className={styles.jobSearch}>
        <div className={styles.jobSearchContainer}>
          <p className={styles.jobSearchTitle}>Tìm kiếm công việc phù hợp</p>
          <form className={styles.jobSearchForm} onSubmit={handleSearchSubmit}>
            <div className={styles.jobSearchField}>
              <input
                type="text"
                name="keyword"
                placeholder="Từ khóa (tên công việc, thương hiệu, nơi làm việc)"
                className={styles.jobSearchInput}
                value={searchForm.keyword}
                onChange={handleSearchChange}
                onFocus={() => console.log('Input focused')} // Debug
                onKeyDown={(e) => console.log('Key down:', e.key)} // Debug
              />
            </div>
            <div className={styles.jobSearchField}>
              <i className={`fa fa-briefcase ${styles.jobSearchFieldIcon}`}></i>
              <select
                name="brand"
                className={styles.jobSearchSelect}
                value={searchForm.brand}
                onChange={handleSearchChange}
              >
                <option value="">Thương hiệu</option>
                {brandOptions.map((brand, idx) => (
                  <option key={idx} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div className={styles.jobSearchField}>
              <i className={`fa fa-map-marker-alt ${styles.jobSearchFieldIcon}`}></i>
              <select
                name="workplace"
                className={styles.jobSearchSelect}
                value={searchForm.workplace}
                onChange={handleSearchChange}
              >
                <option value="">Nơi làm việc</option>
                {workplaceOptions.map((place, idx) => (
                  <option key={idx} value={place}>{place}</option>
                ))}
              </select>
            </div>
            <div className={styles.jobSearchField}>
              <i className={`fa fa-user-tie ${styles.jobSearchFieldIcon}`}></i>
              <select
                name="name"
                className={styles.jobSearchSelect}
                value={searchForm.name}
                onChange={handleSearchChange}
              >
                <option value="">Vị trí tuyển dụng</option>
                {nameOptions.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className={styles.jobSearchButton} disabled={loading}>
              <i className="fa fa-search"></i>
              <span>{loading ? 'Đang tải...' : 'Tìm kiếm'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Job Listings - Store */}
      <section className={styles.jobListings}>
        <h1 className={styles.jobListingsTitle}>Việc làm tại Cửa hàng</h1>
        <div className={styles.jobListingsGrid}>
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div>
              Lỗi: {error}{' '}
              <button
                className={styles.loadMoreBtn}
                onClick={() => {
                  setLoading(true);
                  fetchJobs();
                }}
              >
                Thử lại
              </button>
            </div>
          ) : jobListingsNewStore.length === 0 ? (
            <div>Không có việc làm mới nhất tại cửa hàng.</div>
          ) : (
            jobListingsNewStore.slice(0, storeVisible).map((job, idx) => (
              <div key={job._id || idx} className={styles.jobCard}>
                <div className={styles.jobCardContent}>
                  <div className={styles.jobCardTitle}>{job.Name || 'Không xác định'}</div>
                  <p className={styles.jobCardInfo}>
                    <strong>Thương hiệu:</strong>{' '}
                    {Array.isArray(job.Brands) ? job.Brands.join(', ') : job.Brands || 'Không xác định'}
                  </p>
                  <p className={styles.jobCardInfo}>
                    <strong>Nơi làm việc:</strong> {job.Workplace || 'Không xác định'}
                  </p>
                  <p className={styles.jobCardInfo}>
                    <strong>Mức lương:</strong> {job.Salary || 'Không xác định'}
                  </p>
                  <p className={styles.jobCardInfo}>
                    <strong>Số lượng:</strong> {job.Slot || 'Không xác định'}
                  </p>
                  <p className={styles.jobCardInfo}>
                    <strong>Ngày hết hạn:</strong> {formatDate(job['Due date'])}
                  </p>
                  <Link to={`/DetailJob/${job._id}`} className={styles.jobCardButton}>
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        {storeVisible < jobListingsNewStore.length && (
          <div className={styles.jobListingsMore}>
            <button
              className={styles.loadMoreBtn}
              onClick={() => setStoreVisible(storeVisible + 4)}
            >
              Xem thêm
            </button>
          </div>
        )}
      </section>

      {/* Job Listings - Office */}
      <section className={styles.jobListings}>
        <h1 className={styles.jobListingsTitle}>Việc làm tại văn phòng</h1>
        <div className={styles.jobListingsGrid}>
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div>
              Lỗi: {error}{' '}
              <button
                className={styles.loadMoreBtn}
                onClick={() => {
                  setLoading(true);
                  fetchJobs();
                }}
              >
                Thử lại
              </button>
            </div>
          ) : jobListingsNewOffice.length === 0 ? (
            <div>Không có việc làm mới nhất tại văn phòng.</div>
          ) : (
            jobListingsNewOffice.slice(0, officeVisible).map((job, idx) => (
              <div key={job._id || idx} className={styles.jobCard}>
                <div className={styles.jobCardContent}>
                  <div className={styles.jobCardTitle}>{job.Name || 'Không xác định'}</div>
                  <p className={styles.jobCardInfo}>
                    <strong>Thương hiệu:</strong>{' '}
                    {Array.isArray(job.Brands) ? job.Brands.join(', ') : job.Brands || 'Không xác định'}
                  </p>
                  <p className={styles.jobCardInfo}>
                    <strong>Nơi làm việc:</strong> {job.Workplace || 'Không xác định'}
                  </p>
                  <p className={styles.jobCardInfo}>
                    <strong>Mức lương:</strong> {job.Salary || 'Không xác định'}
                  </p>
                  <p className={styles.jobCardInfo}>
                    <strong>Số lượng:</strong> {job.Slot || 'Không xác định'}
                  </p>
                  <p className={styles.jobCardInfo}>
                    <strong>Ngày hết hạn:</strong> {formatDate(job['Due date'])}
                  </p>
                  <Link to={`/DetailJob/${job._id}`} className={styles.jobCardButton}>
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        {officeVisible < jobListingsNewOffice.length && (
          <div className={styles.jobListingsMore}>
            <button
              className={styles.loadMoreBtn}
              onClick={() => setOfficeVisible(officeVisible + 4)}
            >
              Xem thêm
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Jobcontent;
