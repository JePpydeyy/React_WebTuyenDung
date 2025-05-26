import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Job.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const bannerImages = [
  '/image/BANNER5.jpg',
  '/image/BANNER6.jpg',
  '/image/BANNER7.jpg',
];

const Jobcontent = () => {
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerTimer = useRef(null);

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
  }, [bannerIdx, startBannerAuto, stopBannerAuto]); // Thêm startBannerAuto và stopBannerAuto vào dependency array

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
    setSearching(true);
    setStoreVisible(4);
    setOfficeVisible(4);
  };

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeVisible, setStoreVisible] = useState(4);
  const [officeVisible, setOfficeVisible] = useState(4);
  const [brandOptions, setBrandOptions] = useState([]);
  const [workplaceOptions, setWorkplaceOptions] = useState([]);
  const [nameOptions, setNameOptions] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('https://api-tuyendung-cty.onrender.com/api/job');
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const brands = Array.from(
      new Set(
        jobs
          .flatMap(job => (job.Brands ? job.Brands.split(',') : []))
          .map(brand => brand.trim())
          .filter(Boolean)
      )
    );
    const workplaces = Array.from(
      new Set(
        jobs
          .flatMap(job => (job.Workplace ? job.Workplace.split(',') : []))
          .map(place => place.trim())
          .filter(Boolean)
      )
    );
    const names = Array.from(new Set(jobs.map(job => job.Name).filter(Boolean)));
    setBrandOptions(brands);
    setWorkplaceOptions(workplaces);
    setNameOptions(names);
  }, [jobs]);

  const filteredJobs = React.useMemo(() => {
    if (!searching) return jobs;
    return jobs.filter(job => {
      const brandMatch =
        !searchForm.brand ||
        (job.Brands &&
          job.Brands.split(',').map(b => b.trim()).includes(searchForm.brand));
      const workplaceMatch =
        !searchForm.workplace ||
        (job.Workplace &&
          job.Workplace.split(',').map(place => place.trim()).includes(searchForm.workplace));
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

  const jobListingsNewStore = [...filteredJobs]
    .filter((job) => job['Job Type'] === 'Store block jobs')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const jobListingsNewOffice = [...filteredJobs]
    .filter((job) => job['Job Type'] === 'Office work')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <main>
      <section className={styles.banner}>
        <div className={styles['banner-wrapper']}>
          {bannerImages.map((src, idx) => (
            <img
              key={src}
              className={`${styles['banner-image']} ${idx === bannerIdx ? styles.active : ''} ${
                idx === (bannerIdx - 1 + bannerImages.length) % bannerImages.length ? styles.prev : ''
              }`}
              src={src}
              alt={`Banner ${idx + 1}`}
              loading="lazy"
            />
          ))}
          <button
            className={`${styles['banner-btn']} ${styles['banner-btn-left']}`}
            onClick={() => {
              prevBannerSlide();
              stopBannerAuto();
            }}
            aria-label="Previous Banner"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button
            className={`${styles['banner-btn']} ${styles['banner-btn-right']}`}
            onClick={() => {
              nextBannerSlide();
              stopBannerAuto();
            }}
            aria-label="Next Banner"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <div className={styles['banner-indicators']}>
            {bannerImages.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.indicator} ${idx === bannerIdx ? styles.active : ''}`}
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

      <div className={styles['job-search']}>
        <div className={styles['job-search_container']}>
          <p className={styles['job-search_title']}>Tìm kiếm công việc phù hợp</p>
          <form className={styles['job-search_form']} onSubmit={handleSearchSubmit}>
            <div className={styles['job-search_field']}>
             
              <input
                type="text"
                name="keyword"
                placeholder="Từ khóa (tên công việc, thương hiệu, nơi làm việc)"
                className={styles['job-search_input']}
                value={searchForm.keyword}
                onChange={handleSearchChange}
              />
            </div>
            <div className={styles['job-search_field']}>
              <i className={`fa fa-briefcase ${styles['job-search_field-icon']}`}></i>
              <select
                name="brand"
                className={styles['job-search_select']}
                value={searchForm.brand}
                onChange={handleSearchChange}
              >
                <option value="">Thương hiệu</option>
                {brandOptions.map((brand, idx) => (
                  <option key={idx} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div className={styles['job-search_field']}>
              <i className={`fa fa-map-marker-alt ${styles['job-search_field-icon']}`}></i>
              <select
                name="workplace"
                className={styles['job-search_select']}
                value={searchForm.workplace}
                onChange={handleSearchChange}
              >
                <option value="">Nơi làm việc</option>
                {workplaceOptions.map((place, idx) => (
                  <option key={idx} value={place}>{place}</option>
                ))}
              </select>
            </div>
            <div className={styles['job-search_field']}>
              <i className={`fa fa-user-tie ${styles['job-search_field-icon']}`}></i>
              <select
                name="name"
                className={styles['job-search_select']}
                value={searchForm.name}
                onChange={handleSearchChange}
              >
                <option value="">Vị trí tuyển dụng</option>
                {nameOptions.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className={styles['job-search_button']}>
              <i className="fa fa-search"></i>
              <span>Tìm kiếm</span>
            </button>
          </form>
        </div>
      </div>

      <section className={styles['job-listings']}>
        <h1 className={styles['job-listings_title']}>Việc làm tại Cửa hàng</h1>
        <div className={styles['job-listings_grid']}>
          {loading ? (
            <div>Đang tải...</div>
          ) : jobListingsNewStore.length === 0 ? (
            <div>Không có việc làm mới nhất.</div>
          ) : (
            jobListingsNewStore.slice(0, storeVisible).map((job, idx) => (
              <div key={job._id || idx} className={styles['job-card']}>
                <div className={styles['job-card_content']}>
                  <div className={styles['job-card_title']}>{job.Name}</div>
                  <p className={styles['job-card_info']}><strong>Thương hiệu:</strong> {job.Brands}</p>
                  <p className={styles['job-card_info']}><strong>Nơi làm việc:</strong> {job.Workplace}</p>
                  <p className={styles['job-card_info']}><strong>Mức lương:</strong> {job.Salary}</p>
                  <p className={styles['job-card_info']}><strong>Số lượng:</strong> {job.Slot}</p>
                  <p className={styles['job-card_info']}><strong>Ngày hết hạn:</strong> {job['Due date']}</p>
                 <Link to={`/DetailJob/${job._id}`} className={styles['job-card_button']}>Xem chi tiết</Link>
                </div>
              </div>
            ))
          )}
        </div>
        {storeVisible < jobListingsNewStore.length && (
          <div className={styles['job-listings_more']}>
            <button className={styles['load-more-btn']} onClick={() => setStoreVisible(storeVisible + 4)}>
              Xem thêm
            </button>
          </div>
        )}
      </section>

      <section className={styles['job-listings']}>
        <h1 className={styles['job-listings_title']}>Việc làm tại văn phòng </h1>
        <div className={styles['job-listings_grid']}>
          {loading ? (
            <div>Đang tải...</div>
          ) : jobListingsNewOffice.length === 0 ? (
            <div>Không có việc làm mới nhất.</div>
          ) : (
            jobListingsNewOffice.slice(0, officeVisible).map((job, idx) => (
              <div key={job._id || idx} className={styles['job-card']}>
                <div className={styles['job-card_content']}>
                  <div className={styles['job-card_title']}>{job.Name}</div>
                  <p className={styles['job-card_info']}><strong>Thương hiệu:</strong> {job.Brands}</p>
                  <p className={styles['job-card_info']}><strong>Nơi làm việc:</strong> {job.Workplace}</p>
                  <p className={styles['job-card_info']}><strong>Mức lương:</strong> {job.Salary}</p>
                  <p className={styles['job-card_info']}><strong>Số lượng:</strong> {job.Slot}</p>
                  <p className={styles['job-card_info']}><strong>Ngày hết hạn:</strong> {job['Due date']}</p>
                 <Link to={`/DetailJob/${job._id}`} className={styles['job-card_button']}>Xem chi tiết</Link>
                </div>
              </div>
            ))
          )}
        </div>
        {officeVisible < jobListingsNewOffice.length && (
          <div className={styles['job-listings_more']}>
            <button className={styles['load-more-btn']} onClick={() => setOfficeVisible(officeVisible + 4)}>
              Xem thêm
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Jobcontent;