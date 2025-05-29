import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Job.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const bannerImages = [
  '/assets/images/BANNER5.jpg',
  '/assets/images/BANNER6.jpg',
  '/assets/images/BANNER7.jpg',
];

const Jobcontent = () => {
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerTimer = useRef(null);

  // Banner slider functions
  const stopBannerAuto = useCallback(() => {
    if (bannerTimer.current) clearInterval(bannerTimer.current);
  }, []);

  const nextBannerSlide = useCallback(() => {
    setBannerIdx((prev) => (prev + 1) % bannerImages.length);
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

  const prevBannerSlide = useCallback(() => {
    setBannerIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  }, []);

  useEffect(() => {
    startBannerAuto();
    return stopBannerAuto;
  }, [startBannerAuto, stopBannerAuto]);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    brand: '',
    workplace: '',
    name: '',
    keyword: '',
  });
  const [searching, setSearching] = useState(false);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

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

  // Fetch jobs from API with enhanced debugging
  useEffect(() => {
    const fetchJobs = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout
      try {
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
        console.log('API Response:', data); // Log dữ liệu để debug
        if (!Array.isArray(data)) throw new Error('Dữ liệu trả về không phải là mảng');
        setJobs(data);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu từ API:', err);
        setError(err.message);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Generate dropdown options
  useEffect(() => {
    const brands = Array.from(
      new Set(
        jobs
          .flatMap((job) => (job.Brands ? job.Brands.split(',').map((b) => b.trim()) : []))
          .filter(Boolean)
      )
    );
    const workplaces = Array.from(
      new Set(
        jobs
          .flatMap((job) => (job.Workplace ? job.Workplace.split(',').map((p) => p.trim()) : []))
          .filter(Boolean)
      )
    );
    const names = Array.from(new Set(jobs.map((job) => job.Name).filter(Boolean)));
    setBrandOptions(brands);
    setWorkplaceOptions(workplaces);
    setNameOptions(names);
  }, [jobs]);

  // Filter jobs
  const filteredJobs = React.useMemo(() => {
    if (!searching) return jobs;
    return jobs.filter((job) => {
      const brandMatch =
        !searchForm.brand ||
        (job.Brands &&
          job.Brands.split(',')
            .map((b) => b.trim())
            .includes(searchForm.brand));
      const workplaceMatch =
        !searchForm.workplace ||
        (job.Workplace &&
          job.Workplace.split(',')
            .map((place) => place.trim())
            .includes(searchForm.workplace));
      const nameMatch = !searchForm.name || job.Name === searchForm.name;
      const keyword = searchForm.keyword?.trim().toLowerCase();
      const keywordMatch =
        !keyword ||
        (job.Name && job.Name.toLowerCase().includes(keyword)) ||
        (job.Brands && job.Brands.toLowerCase().includes(keyword)) ||
        (job.Workplace && job.Workplace.toLowerCase().includes(keyword));
      return brandMatch && workplaceMatch && nameMatch && keywordMatch;
    });
  }, [jobs, searchForm, searching]);

  // Sort and filter jobs by type
  const jobListingsNewStore = [...filteredJobs]
    .filter((job) => job.JobType === 'Store block jobs') // Sửa từ job['Job Type'] thành job.JobType
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const jobListingsNewOffice = [...filteredJobs]
    .filter((job) => job.JobType === 'Office work') // Sửa từ job['Job Type'] thành job.JobType
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Debug log to check filtered jobs
  useEffect(() => {
    console.log('Filtered Store Jobs:', jobListingsNewStore);
    console.log('Filtered Office Jobs:', jobListingsNewOffice);
  }, [jobListingsNewStore, jobListingsNewOffice]);

  return (
    <main>
      {/* Banner Section */}
      <section className={styles.banner}>
        <div className={styles.bannerWrapper}>
          {bannerImages.map((src, idx) => (
            <img
              key={src}
              className={`${styles.bannerImage} ${idx === bannerIdx ? styles.active : ''} ${
                idx === (bannerIdx - 1 + bannerImages.length) % bannerImages.length ? styles.prev : ''
              }`}
              src={src}
              alt={`Banner ${idx + 1}`}
              loading="lazy"
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
            <div>Lỗi: {error}</div>
          ) : jobListingsNewStore.length === 0 ? (
            <div>Không có việc làm mới nhất tại cửa hàng.</div>
          ) : (
            jobListingsNewStore.slice(0, storeVisible).map((job, idx) => (
              <div key={job._id || idx} className={styles.jobCard}>
                <div className={styles.jobCardContent}>
                  <div className={styles.jobCardTitle}>{job.Name}</div>
                  <p className={styles.jobCardInfo}><strong>Thương hiệu:</strong> {job.Brands}</p>
                  <p className={styles.jobCardInfo}><strong>Nơi làm việc:</strong> {job.Workplace}</p>
                  <p className={styles.jobCardInfo}><strong>Mức lương:</strong> {job.Salary}</p>
                  <p className={styles.jobCardInfo}><strong>Số lượng:</strong> {job.Slot}</p>
                  <p className={styles.jobCardInfo}><strong>Ngày hết hạn:</strong> {job['Due date']}</p>
                  <Link to={`/DetailJob/${job._id}`} className={styles.jobCardButton}>Xem chi tiết</Link>
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
            <div>Lỗi: {error}</div>
          ) : jobListingsNewOffice.length === 0 ? (
            <div>Không có việc làm mới nhất tại văn phòng.</div>
          ) : (
            jobListingsNewOffice.slice(0, officeVisible).map((job, idx) => (
              <div key={job._id || idx} className={styles.jobCard}>
                <div className={styles.jobCardContent}>
                  <div className={styles.jobCardTitle}>{job.Name}</div>
                  <p className={styles.jobCardInfo}><strong>Thương hiệu:</strong> {job.Brands}</p>
                  <p className={styles.jobCardInfo}><strong>Nơi làm việc:</strong> {job.Workplace}</p>
                  <p className={styles.jobCardInfo}><strong>Mức lương:</strong> {job.Salary}</p>
                  <p className={styles.jobCardInfo}><strong>Số lượng:</strong> {job.Slot}</p>
                  <p className={styles.jobCardInfo}><strong>Ngày hết hạn:</strong> {job['Due date']}</p>
                  <Link to={`/DetailJob/${job._id}`} className={styles.jobCardButton}>Xem chi tiết</Link>
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