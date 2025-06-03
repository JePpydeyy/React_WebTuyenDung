import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Index.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faSearch, faBriefcase, faMapMarkerAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';

// Static data (unchanged)
const bannerImages = [
  '/assets/images/BANNER2.jpg',
  '/assets/images/BANNER3.jpg',
  '/assets/images/BANNER4.jpg',
];

const acfcValues = [
  { img: '/assets/images/01.png', text: 'Lịch sử hình thành', link: '#' },
  { img: '/assets/images/02.png', text: 'Tầm nhìn sứ mệnh - Giá trị cốt lõi', link: '#' },
  { img: '/assets/images/03.png', text: 'Danh hiệu & Giải thưởng', link: '#' },
  { img: '/assets/images/04.png', text: 'Tinh thần ACFC', link: '#' },
];

const acfcLoveItems = [
  {
    title: '5 LÝ DO<br>BẠN YÊU ACFC',
    info: 'Trung thực, chính trực',
    reverse: false,
  },
  {
    info: 'ACFC - Happy Place To Work',
    images: ['/assets/images/banner-web-01.png', '/assets/images/banner-web-02.png', '/assets/images/banner-web-03.png'],
    reverse: false,
  },
  {
    info: 'Thỏa sức sáng tạo trong công việc',
    images: ['/assets/images/banner-web-04.png', '/assets/images/banner-web-05.png', '/assets/images/banner-web-06.png'],
    reverse: true,
  },
  {
    info: 'Lương thưởng - Chế độ phúc lợi hấp dẫn',
    images: ['/assets/images/banner-web-07.png', '/assets/images/banner-web-08.png', '/assets/images/banner-web-09.png'],
    reverse: false,
  },
  {
    info: 'Bạn được tôn trọng vì bạn là chính bạn mà không phải ai khác',
    images: ['/assets/images/banner-web-10.png', '/assets/images/banner-web-11.png', '/assets/images/banner-web-12.png'],
    reverse: true,
  },
];

const benefits = [
  {
    icon: '/assets/images/pl-01.png',
    title: 'Lương thưởng và chế độ đãi ngộ hấp dẫn',
    items: [
      'Mức lương cạnh tranh, chế độ thưởng KPI theo quý, năm.',
      'Tham gia bảo hiểm full lương (BHYT, BHXH, BHTN).',
      'Mua hàng hiệu giá ưu đãi với chính sách giảm giá nội bộ 30 – 50%, được tham gia mua hàng tại nhiều sự kiện Internal Sale với mức ưu đãi lên đến 80%.',
      'Tham gia các chương trình gắn kết nội bộ: Happy Friday, Year End Party, Team Building, ...',
    ],
  },
  {
    icon: '/assets/images/pl-02.png',
    title: 'Môi trường làm việc thân thiện, trẻ trung, năng động',
    items: [
      'ACFC – Happy place to work, nơi hội tụ những cá nhân tài năng, cá tính và đầy năng lượng trong công việc.',
      'Không gian làm việc hiện đại, được trang bị đầy đủ trang thiết bị hỗ trợ công việc như: Laptop, điện thoại, phần mềm nghe gọi miễn phí 3CX, ...',
      'Môi trường làm việc trẻ trung, chuyên nghiệp.',
      'Cơ hội làm việc với các anh chị cấp quản lý nổi tiếng trong ngành thời trang.',
    ],
  },
  {
    icon: '/assets/images/pl-03.png',
    title: 'Chương trình đào tạo bài bản, cơ hội học tập và phát triển',
    items: [
      'Học hỏi và phát triển cùng đội ngũ những người có kinh nghiệm dẫn đầu trong ngành thời trang bán lẻ.',
      'Tham gia khóa học đào tạo định kỳ và phát sinh của công ty để liên tục nâng cấp kiến thức, kỹ năng.',
    ],
  },
];

// Carousel component (unchanged)
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const timerRef = useRef(null);
  const carouselRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTranslateX(0);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTranslateX(0);
  }, [images.length]);

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    timerRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide, stopAutoSlide]);

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [startAutoSlide, stopAutoSlide]);

  const handleDragStart = useCallback((clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    stopAutoSlide();
  }, [stopAutoSlide]);

  const handleDragMove = useCallback((clientX) => {
    if (!isDragging) return;
    const diffX = clientX - startX;
    setTranslateX(diffX);
  }, [isDragging, startX]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 100;
    if (translateX < -threshold) {
      nextSlide();
    } else if (translateX > threshold) {
      prevSlide();
    }
    setTranslateX(0);
    startAutoSlide();
  }, [isDragging, translateX, nextSlide, prevSlide, startAutoSlide]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  return (
    <div
      className={styles['a-l-img']}
      ref={carouselRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.carousel}>
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`${styles['carousel-item']} ${idx === currentIndex ? styles.active : ''}`}
            style={{
              transform: `translateX(${translateX}px)`,
              transition: isDragging ? 'none' : 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <img src={img} alt={`Slide ${idx + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

const Index = () => {
  // Banner slider state (unchanged)
  const [bannerIdx, setBannerIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const bannerTimer = useRef(null);
  const bannerRef = useRef(null);

  const nextBannerSlide = useCallback(() => {
    setBannerIdx((prev) => (prev + 1) % bannerImages.length);
    setTranslateX(0);
  }, []);

  const prevBannerSlide = useCallback(() => {
    setBannerIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    setTranslateX(0);
  }, []);

  const stopBannerAuto = useCallback(() => {
    if (bannerTimer.current) clearInterval(bannerTimer.current);
  }, []);

  const startBannerAuto = useCallback(() => {
    stopBannerAuto();
    bannerTimer.current = setInterval(nextBannerSlide, 5000);
  }, [nextBannerSlide, stopBannerAuto]);

  const showBannerSlide = useCallback((idx) => {
    setBannerIdx(idx);
    setTranslateX(0);
  }, []);

  useEffect(() => {
    startBannerAuto();
    return stopBannerAuto;
  }, [startBannerAuto, stopBannerAuto]);

  const handleBannerDragStart = useCallback((clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    stopBannerAuto();
  }, [stopBannerAuto]);

  const handleBannerDragMove = useCallback((clientX) => {
    if (!isDragging) return;
    const diffX = clientX - startX;
    setTranslateX(diffX);
  }, [isDragging, startX]);

  const handleBannerDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 100;
    if (translateX < -threshold) {
      nextBannerSlide();
    } else if (translateX > threshold) {
      prevBannerSlide();
    }
    setTranslateX(0);
    startBannerAuto();
  }, [isDragging, translateX, nextBannerSlide, prevBannerSlide, startBannerAuto]);

  const handleBannerMouseDown = (e) => {
    e.preventDefault();
    handleBannerDragStart(e.clientX);
  };

  const handleBannerMouseMove = (e) => {
    handleBannerDragMove(e.clientX);
  };

  const handleBannerMouseUp = () => {
    handleBannerDragEnd();
  };

  const handleBannerTouchStart = (e) => {
    handleBannerDragStart(e.touches[0].clientX);
  };

  const handleBannerTouchMove = (e) => {
    handleBannerDragMove(e.touches[0].clientX);
  };

  const handleBannerTouchEnd = () => {
    handleBannerDragEnd();
  };

  // Search form state
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    brand: '',
    workplace: '',
    name: '',
  });
  const [searching, setSearching] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandOptions, setBrandOptions] = useState([]);
  const [workplaceOptions, setWorkplaceOptions] = useState([]);
  const [nameOptions, setNameOptions] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(8);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
    setVisibleJobs(8);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchForm.keyword && !searchForm.brand && !searchForm.workplace && !searchForm.name) {
      alert('Vui lòng nhập ít nhất một tiêu chí tìm kiếm!');
      return;
    }
    setSearching(true);
    setVisibleJobs(8);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('https://api-tuyendung-cty.onrender.com/api/job');
        if (!res.ok) throw new Error('Không thể tải dữ liệu công việc');
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        alert('Đã có lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    // Generate options for search dropdowns
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

  const filteredJobs = React.useMemo(() => {
    if (!searching) return jobs.filter((job) => job.status === 'show');
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
      const statusMatch = job.status === 'show';
      return brandMatch && workplaceMatch && nameMatch && keywordMatch && statusMatch;
    });
  }, [jobs, searchForm, searching]);

  const handleViewMore = () => {
    setVisibleJobs((prev) => prev + 4);
  };

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
          className={styles['banner-wrapper']}
          ref={bannerRef}
          onMouseDown={handleBannerMouseDown}
          onMouseMove={handleBannerMouseMove}
          onMouseUp={handleBannerMouseUp}
          onMouseLeave={handleBannerMouseUp}
          onTouchStart={handleBannerTouchStart}
          onTouchMove={handleBannerTouchMove}
          onTouchEnd={handleBannerTouchEnd}
        >
          {bannerImages.map((src, idx) => (
            <img
              key={src}
              className={`${styles['banner-image']} ${idx === bannerIdx ? styles.active : ''} ${
                idx === (bannerIdx - 1 + bannerImages.length) % bannerImages.length ? styles.prev : ''
              }`}
              src={src}
              alt={`Banner ${idx + 1}`}
              loading="lazy"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: isDragging ? 'none' : 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
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
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button
            className={`${styles['banner-btn']} ${styles['banner-btn-right']}`}
            onClick={() => {
              nextBannerSlide();
              stopBannerAuto();
            }}
            aria-label="Next Banner"
          >
            <FontAwesomeIcon icon={faAngleRight} />
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

      {/* Job Search and Listings */}
      <section className={styles['container-lastest']}>
        <div className={styles['job-search']}>
          <div className={styles['job-search_container']}>
            <p className={styles['job-search_title']}>Tìm kiếm công việc phù hợp</p>
            <div className={styles['job-search_form']}>
              <div className={styles['job-search_field']}>
                <FontAwesomeIcon icon={faSearch} className={styles['job-search_field-icon']} />
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
                <FontAwesomeIcon icon={faBriefcase} className={styles['job-search_field-icon']} />
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
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles['job-search_field-icon']} />
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
                <FontAwesomeIcon icon={faUserTie} className={styles['job-search_field-icon']} />
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
              <button
                type="button"
                className={styles['job-search_button']}
                onClick={handleSearchSubmit}
                disabled={loading}
                aria-label="Tìm kiếm công việc"
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>{loading ? 'Đang tải...' : 'Tìm kiếm'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles['hot-jobs']}>
          <h1>Việc làm nổi bật</h1>
          <div className={styles['job-list']}>
            {loading ? (
              <div>Đang tải...</div>
            ) : filteredJobs.length === 0 ? (
              <div>Không có việc làm phù hợp.</div>
            ) : (
              filteredJobs.slice(0, visibleJobs).map((job, idx) => (
                <div key={job._id || idx} className={styles['job-card']}>
                  <div className={styles['job-title-block']}>{job.Name}</div>
                  <div className={styles['job-details-wrapper']}>
                    <p className={styles['job-brand']}>
                      <strong>Thương hiệu:</strong> {Array.isArray(job.Brands) ? job.Brands.join(', ') : job.Brands || 'Không xác định'}
                    </p>
                    <p className={styles['job-location']}>
                      <strong>Nơi làm việc:</strong> {job.Workplace || 'Không xác định'}
                    </p>
                    <p className={styles['job-salary']}>
                      <strong>Mức lương:</strong> {job.Salary || 'Không xác định'}
                    </p>
                    <p className={styles['job-quantity']}>
                      <strong>Số lượng tuyển:</strong> {job.Slot || 'Không xác định'}
                    </p>
                    <p className={styles['job-date']}>
                      <strong>Ngày hết hạn:</strong> {formatDate(job['Due date'])}
                    </p>
                    <Link to={`/DetailJob/${job._id}`} className={styles['job-apply-btn']}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          {filteredJobs.length > visibleJobs && (
            <section className={styles['watch-more']}>
              <button className={styles['watch-more-btn']} onClick={handleViewMore}>
                Xem thêm
              </button>
            </section>
          )}
        </div>
      </section>

      {/* ACFC Values Section */}
      <section className={styles['acfc-values-section']}>
        <h2 className={styles['section-title']}>ACFC Việt Nam</h2>
        <div className={styles['values-grid']}>
          {acfcValues.map((value, idx) => (
            <div key={idx} className={styles['value-item']}>
              <img src={value.img} alt={value.text} loading="lazy" />
              <Link to={value.link}>
                <p className={styles['value-text']}>{value.text}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

       <div className={styles.container}>
      {/* ACFC Love Section */}
      <section className={`${styles['acfc-love']} ${styles['tttable-mobile']}`}>
        <h2 className={styles['section-title']}>Dịch vụ của chúng tôi</h2>
        <div className={styles['services-grid']}>
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Line"
                  height="512"
                  viewBox="0 0 512 512"
                  width="512"
                >
                  <g>
                    <path d="m480 376v-88h-16v88h-48v-32h-16v32h-48v-280h112v176h16v-184a8 8 0 0 0 -8-8h-8v-24a8 8 0 0 0 -8-8h-40v-32h-16v32h-40a8 8 0 0 0 -8 8v24h-8a8 8 0 0 0 -8 8v48h-40a7.9986 7.9986 0 0 0 -5.6567 2.3433l-64 64a7.9986 7.9986 0 0 0 -2.3433 5.6567v46.606l-42.7935-36.68a8.0017 8.0017 0 0 0 -10.413 0l-56 48a8.0009 8.0009 0 0 0 -2.7935 6.074v33.87l-27.8838-16.73a7.9989 7.9989 0 0 0 -8.2324 0l-40 24a8.0007 8.0007 0 0 0 -3.8838 6.86v56h-16v16h42.2276a240.0477 240.0477 0 0 0 395.5448 0h42.2276v-16zm-112-312h80v16h-80zm-23.72 328a282.9447 282.9447 0 0 1 -24.4365 40h-127.6873a282.9447 282.9447 0 0 1 -24.4362-40zm-104.28-180.6865 59.3135-59.3135h36.6865v224h-40v-32h-16v32h-40zm-112 64.3665 48-41.1431 48 41.1431v100.32h-40v-32h-16v32h-40zm-80 48.85 32-19.2 32 19.2v51.47h-24v-32h-16v32h-24zm29.99 67.47h71.94a300.507 300.507 0 0 0 22.6817 40h-55.2458a224.5257 224.5257 0 0 1 -39.3759-40zm106.195 56a284.7418 284.7418 0 0 0 23.59 26.78 223.2746 223.2746 0 0 1 -67.26-26.78zm52.0518 31.1343a260.7882 260.7882 0 0 1 -31.4328-31.1343h102.392a260.7882 260.7882 0 0 1 -31.4325 31.1343q-9.8025.8613-19.7635.8657-9.9534 0-19.7635-.8657zm91.5785-31.1343h43.67a223.2746 223.2746 0 0 1 -67.26 26.78 284.7418 284.7418 0 0 0 23.59-26.78zm66.8188-16h-55.2456a300.507 300.507 0 0 0 22.6815-40h71.94a224.5257 224.5257 0 0 1 -39.3759 40z"></path>
                    <path d="m144 288h16v40h-16z"></path>
                    <path d="m192 288h16v40h-16z"></path>
                    <path d="m256 288h16v40h-16z"></path>
                    <path d="m304 288h16v40h-16z"></path>
                    <path d="m256 232h16v40h-16z"></path>
                    <path d="m304 232h16v40h-16z"></path>
                    <path d="m368 232h16v40h-16z"></path>
                    <path d="m400 232h16v40h-16z"></path>
                    <path d="m368 176h16v40h-16z"></path>
                    <path d="m400 176h16v40h-16z"></path>
                    <path d="m368 120h16v40h-16z"></path>
                    <path d="m400 120h16v40h-16z"></path>
                    <path d="m432 232h16v40h-16z"></path>
                    <path d="m368 288h16v40h-16z"></path>
                    <path d="m400 288h16v40h-16z"></path>
                    <path d="m432 288h16v40h-16z"></path>
                    <path d="m432 176h16v40h-16z"></path>
                    <path d="m432 120h16v40h-16z"></path>
                    <path d="m304 176h16v40h-16z"></path>
                    <path d="m20.8115 271.3374a8.0012 8.0012 0 0 0 8.647-1.4888l114.8415-107.185 42.5786 35.4824a8.0008 8.0008 0 0 0 11-.72l91.3672-98.981 18.3169 12.2109a8 8 0 0 0 12.3979-5.86l8-80a8 8 0 0 0 -10.2592-8.4585l-80 24a8 8 0 0 0 -2.1387 14.3188l16.3022 10.8687-60.6591 67.3994-42.084-35.07a8.0007 8.0007 0 0 0 -10.58.2974l-42.8569 40 10.917 11.6972 37.6981-35.1853 42.5786 35.4824a8.001 8.001 0 0 0 11.0679-.7944l72-80a8 8 0 0 0 -1.5088-12.0078l-9.8511-6.5674 52.2642-15.6792-5.4868 54.8642-12.9263-8.6176a7.999 7.999 0 0 0 -10.3159 1.23l-90.8418 98.412-42.1584-35.1318a8 8 0 0 0 -10.58.2974l-106.5416 99.4386v-26.1134l61.4585-57.3614-10.917-11.6972-64 59.7334a8.0009 8.0009 0 0 0 -2.5415 5.8486v48a8.0011 8.0011 0 0 0 4.8115 7.3374z"></path>
                  </g>
                </svg>
              ),
              title: 'Quản lý vận hành',
              description:
                'Dịch vụ trọn gói quản lý khai thác vận hành cho mọi loại hình bất động sản nhằm mang đến môi trường làm việc, sinh sống an toàn hiệu quả cho khách hàng.',
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  width="512"
                  height="512"
                  viewBox="0 0 512 512"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                    <path d="M1273 5025 c-198 -36 -364 -123 -509 -269 -127 -127 -206 -263 -257 -445 -21 -74 -22 -95 -25 -766 l-3 -691 -47 -24 c-26 -14 -88 -65 -137 -115 -100 -99 -146 -175 -187 -305 -23 -75 -23 -77 -23 -605 l0 -530 27 -51 c40 -76 70 -107 140 -144 60 -32 69 -34 186 -38 l122 -4 0 -239 0 -239 800 0 800 0 0 -240 0 -240 1440 0 1440 0 0 1280 0 1280 -160 0 -160 0 0 458 0 457 -360 360 -360 360 -360 -360 -360 -360 -2 -344 -3 -343 -154 136 c-85 75 -157 136 -161 136 -4 0 -101 -83 -216 -185 -114 -102 -211 -184 -214 -183 -3 2 -33 21 -67 43 l-61 40 -4 690 c-3 670 -4 692 -25 766 -30 107 -74 207 -129 292 -63 98 -200 231 -303 295 -196 120 -445 168 -668 127z m357 -168 c209 -57 367 -171 481 -345 47 -72 75 -134 107 -242 14 -48 17 -137 20 -706 l3 -652 -98 23 c-54 13 -152 35 -217 50 -145 34 -166 49 -166 123 0 41 5 53 31 78 55 51 144 178 188 268 69 141 92 250 98 454 l6 172 -72 0 c-183 0 -355 69 -490 196 l-81 76 -81 -76 c-135 -127 -307 -196 -490 -196 l-72 0 6 -172 c5 -202 29 -310 96 -450 41 -88 134 -220 190 -272 26 -25 31 -37 31 -78 0 -74 -21 -89 -166 -123 -65 -15 -163 -37 -217 -50 l-98 -23 3 652 c3 569 6 658 20 706 32 108 60 170 108 244 118 180 303 306 520 352 80 17 262 12 340 -9z m-138 -767 c104 -78 250 -140 375 -158 l48 -8 -1 -85 c-4 -197 -96 -402 -250 -551 -73 -71 -94 -87 -166 -128 l-58 -32 -66 37 c-79 44 -199 156 -260 241 -89 125 -145 289 -148 433 l-1 85 51 8 c125 18 301 95 384 167 19 17 36 30 37 31 2 0 26 -18 55 -40z m2733 -270 l220 -220 -445 0 -445 0 220 220 c121 121 222 220 225 220 3 0 104 -99 225 -220z m-305 -1100 l0 -720 -80 0 -80 0 0 218 0 218 -160 143 -160 143 0 359 0 359 240 0 240 0 0 -720z m640 320 l0 -400 -240 0 -240 0 0 400 0 400 240 0 240 0 0 -400z m-3210 -45 c38 -19 79 -35 90 -35 11 0 52 16 90 35 38 19 72 35 74 35 2 0 10 -16 16 -35 6 -19 32 -55 57 -80 l45 -46 -22 -62 c-12 -34 -31 -86 -42 -114 l-19 -53 -199 0 -199 0 -19 53 c-11 28 -30 80 -42 115 l-23 62 46 46 c25 24 51 60 57 79 6 19 14 35 16 35 2 0 36 -16 74 -35z m1867 -290 l247 -220 -252 -3 c-139 -1 -365 -1 -504 0 l-252 3 249 222 c138 123 253 222 257 220 4 -1 119 -101 255 -222z m-2096 -204 c66 -179 119 -328 119 -333 0 -4 -153 -8 -340 -8 l-340 0 0 -320 0 -320 589 -2 c578 -3 590 -3 617 -24 53 -39 69 -71 69 -134 0 -63 -16 -95 -69 -134 -27 -21 -36 -21 -726 -21 -690 0 -699 0 -726 21 -15 11 -37 33 -48 48 -20 27 -21 41 -24 499 -2 321 1 494 9 540 16 100 78 216 154 292 89 89 175 129 393 181 97 23 183 42 191 41 9 -1 58 -123 132 -326z m959 284 c142 -33 208 -54 261 -81 38 -20 68 -40 67 -44 -2 -4 -58 -56 -125 -115 l-123 -109 0 -858 0 -858 -160 0 -160 0 0 185 c0 102 4 185 9 185 20 0 96 89 120 140 36 75 36 193 2 260 -32 61 -74 113 -105 130 l-26 13 0 264 0 263 -100 0 c-55 0 -100 4 -100 8 0 5 50 145 111 312 137 374 127 350 134 350 3 0 91 -20 195 -45z m-502 -313 c-1 -5 -28 -77 -58 -160 -51 -141 -57 -152 -80 -152 -23 0 -29 11 -80 152 -30 83 -56 155 -58 160 -2 4 60 8 138 8 78 0 140 -4 138 -8z m3302 -72 l0 -80 -400 0 -400 0 0 80 0 80 400 0 400 0 0 -80z m-1280 -240 l0 -160 -160 0 -160 0 0 -160 0 -160 -80 0 -80 0 0 -720 0 -720 -400 0 -400 0 0 1040 0 1040 640 0 640 0 0 -160z m1280 -960 l0 -960 -160 0 -160 0 0 720 0 720 -80 0 -80 0 0 160 0 160 -160 0 -160 0 0 80 0 80 400 0 400 0 0 -960z m-3200 640 l0 -160 -480 0 -480 0 0 160 0 160 480 0 480 0 0 -160z m2560 -80 l0 -80 -400 0 -400 0 0 80 0 80 400 0 400 0 0 -80z m160 -880 l0 -640 -80 0 -80 0 0 240 0 240 -400 0 -400 0 0 -240 0 -240 -80 0 -80 0 0 640 0 640 560 0 560 0 0 -640z m-2720 0 l0 -160 -480 0 -480 0 0 160 0 160 480 0 480 0 0 -160z m2400 -480 l0 -160 -240 0 -240 0 0 160 0 160 240 0 240 0 0 -160z"></path>
                    <path d="M3600 3200 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M3600 2880 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M4240 3200 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M4240 2880 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2480 2080 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2800 2080 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2480 1760 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2800 1760 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2480 1440 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2800 1440 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2480 1120 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2800 1120 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2480 800 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2800 800 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2480 480 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M2800 480 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M3440 1280 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M3760 1280 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M4080 1280 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M3440 960 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M3760 960 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                    <path d="M4080 960 l0 -80 80 0 80 0 0 80 0 80 -80 0 -80 0 0 -80z"></path>
                  </g>
                </svg>
              ),
              title: 'Cung cấp nhân sự',
              description:
                'Cung cấp đội ngũ Nhân sự, dịch vụ chất lượng cao từ Lễ tân, Bảo vệ, Quản lý đến vận hành các Tòa nhà chung cư, Tòa nhà văn phòng, Trung tâm thương mại, Khu đô thị, Khu nghỉ dưỡng.',
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  width="512"
                  height="512"
                  viewBox="0 0 512 512"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                    <path d="M2397 5095 c-22 -7 -50 -24 -64 -37 -47 -44 -53 -68 -53 -212 l0 -134 -67 -21 c-38 -11 -106 -39 -152 -61 l-84 -41 -86 84 c-100 98 -132 117 -199 117 -63 0 -113 -32 -213 -136 -89 -92 -109 -127 -109 -188 0 -69 14 -92 111 -192 l90 -92 -39 -78 c-22 -44 -50 -112 -63 -151 l-23 -73 -133 0 c-147 0 -172 -7 -217 -60 -40 -49 -48 -92 -45 -246 4 -130 6 -143 29 -177 46 -67 87 -81 237 -85 l132 -4 26 -76 c14 -43 41 -108 60 -146 l35 -70 -84 -85 c-46 -47 -91 -100 -100 -118 -18 -36 -21 -108 -6 -149 13 -33 181 -207 228 -236 39 -24 124 -28 162 -8 14 7 66 53 116 101 l90 89 70 -35 c38 -20 105 -48 149 -63 l80 -27 5 -140 c6 -157 14 -182 78 -225 34 -24 42 -25 202 -25 160 0 168 1 202 25 64 43 72 68 78 224 l5 140 78 27 c43 15 110 43 149 63 l72 36 97 -95 c59 -57 108 -97 126 -100 15 -4 34 -9 41 -11 7 -2 34 1 60 8 39 10 64 28 149 111 112 109 133 142 133 212 0 63 -20 96 -117 196 l-83 86 39 79 c21 43 48 109 60 146 l22 66 132 4 c150 4 191 18 237 85 23 34 25 47 29 177 3 154 -5 197 -45 246 -45 53 -70 60 -217 60 l-133 0 -23 73 c-13 39 -41 107 -63 151 l-39 78 90 92 c97 100 111 123 111 192 0 61 -20 96 -109 188 -100 104 -150 136 -213 136 -67 0 -99 -19 -199 -117 l-86 -84 -84 41 c-46 22 -114 50 -151 61 l-68 21 0 134 c0 148 -7 173 -60 217 -17 15 -47 31 -68 37 -54 15 -269 12 -315 -5z m293 -306 c6 -197 6 -198 111 -224 88 -21 194 -64 269 -110 94 -57 104 -54 235 75 61 61 115 110 120 110 16 0 175 -164 175 -180 0 -8 -49 -65 -110 -125 -88 -87 -110 -115 -110 -138 0 -15 20 -62 45 -105 49 -86 86 -178 105 -264 20 -90 25 -92 219 -98 l166 -5 3 -119 c2 -78 -1 -123 -9 -132 -9 -11 -46 -14 -166 -14 -86 0 -163 -5 -173 -10 -12 -6 -26 -33 -35 -68 -30 -109 -66 -200 -111 -277 -65 -115 -64 -118 66 -250 61 -61 110 -118 110 -126 0 -9 -38 -53 -84 -98 -71 -69 -88 -81 -103 -72 -10 5 -65 57 -123 115 -114 115 -135 125 -188 87 -70 -49 -196 -101 -338 -140 -66 -18 -68 -24 -74 -210 l-5 -166 -125 0 -125 0 -5 160 c-3 102 -10 168 -18 182 -7 13 -30 27 -55 34 -144 39 -269 91 -339 140 -53 38 -74 28 -188 -87 -58 -58 -113 -110 -123 -115 -15 -9 -32 3 -103 72 -46 45 -84 89 -84 98 0 8 50 65 110 126 130 132 131 135 66 250 -45 77 -81 168 -111 277 -9 35 -23 62 -35 68 -10 5 -87 10 -173 10 -120 0 -157 3 -166 14 -8 9 -11 54 -9 132 l3 119 166 5 c194 6 199 8 219 98 18 83 64 199 110 275 60 99 59 104 -70 232 -60 60 -110 116 -110 125 0 16 158 180 174 180 6 0 60 -49 121 -110 131 -129 141 -132 235 -75 75 46 181 89 269 110 104 26 105 28 109 214 2 86 5 162 7 169 4 9 34 12 127 10 l123 -3 5 -166z"></path>
                    <path d="M2397 4245 c-116 -29 -205 -82 -302 -180 -99 -99 -149 -182 -181 -305 -22 -84 -22 -235 0 -320 75 -298 340 -504 646 -503 265 0 496 148 606 386 37 82 40 116 14 150 -16 19 -30 27 -54 27 -41 0 -51 -12 -103 -120 -128 -262 -422 -368 -681 -245 -86 41 -186 131 -226 205 -96 176 -91 378 13 536 100 154 248 234 430 234 211 0 382 -110 471 -305 44 -94 68 -114 117 -98 15 5 34 22 42 38 12 26 12 35 -3 80 -63 180 -228 342 -416 406 -84 29 -284 36 -373 14z"></path>
                    <path d="M2603 3688 l-113 -112 -45 44 c-32 32 -52 43 -74 43 -43 0 -71 -28 -71 -71 0 -31 10 -46 78 -114 115 -114 110 -115 295 70 129 129 147 151 147 180 0 41 -30 72 -72 72 -26 0 -48 -17 -145 -112z"></path>
                    <path d="M675 4495 c-18 -18 -25 -35 -25 -65 0 -40 0 -40 -39 -40 -52 0 -84 -27 -84 -70 0 -43 40 -80 89 -80 32 0 34 -2 34 -34 0 -75 81 -115 130 -66 13 13 20 33 20 59 l0 38 47 6 c77 8 106 65 62 121 -17 21 -29 26 -65 26 l-44 0 0 43 c0 78 -73 115 -125 62z"></path>
                    <path d="M193 2501 c-47 -12 -119 -57 -143 -90 -29 -42 -50 -106 -50 -155 0 -30 39 -138 144 -397 79 -196 156 -380 172 -410 16 -29 57 -82 90 -116 53 -54 67 -63 97 -63 44 0 77 31 77 73 0 21 -12 40 -44 71 -24 22 -55 57 -70 77 -31 43 -316 739 -316 774 0 30 43 81 75 89 14 4 41 0 60 -8 29 -12 41 -27 64 -78 164 -365 190 -410 275 -471 16 -12 172 -85 346 -162 l315 -142 35 -101 c20 -56 43 -111 53 -122 25 -30 80 -27 106 6 12 15 21 32 21 39 0 7 -61 195 -135 417 -87 258 -134 411 -130 426 14 55 76 79 123 46 12 -8 56 -72 97 -142 69 -118 92 -146 322 -392 221 -236 267 -291 420 -505 94 -132 188 -274 208 -317 65 -136 67 -153 74 -485 6 -294 7 -303 28 -324 26 -27 75 -29 102 -5 17 15 19 39 23 294 8 423 21 459 291 836 153 215 199 270 420 506 229 245 253 275 322 392 41 70 85 134 97 142 47 33 109 9 123 -46 4 -15 -43 -168 -130 -426 -74 -222 -135 -410 -135 -417 0 -7 9 -24 21 -39 26 -33 81 -36 106 -6 10 11 33 66 53 122 l35 101 305 137 c168 74 322 146 342 158 91 56 124 111 289 480 23 51 35 66 64 78 19 8 46 12 60 8 32 -8 75 -59 75 -89 0 -40 -286 -732 -325 -785 -25 -34 -173 -153 -534 -429 -274 -209 -511 -395 -527 -413 -64 -77 -69 -101 -69 -350 0 -221 1 -228 22 -249 27 -27 75 -29 102 -5 18 16 20 35 23 234 3 183 6 222 20 249 12 20 143 127 375 304 598 456 653 500 694 552 57 71 65 90 226 487 152 376 157 397 128 479 -29 84 -107 149 -196 165 -83 15 -196 -36 -239 -107 -11 -18 -57 -115 -103 -217 -112 -252 -104 -245 -416 -383 -134 -59 -245 -106 -247 -105 -1 2 29 95 67 208 61 177 70 212 66 256 -18 192 -234 280 -384 157 -12 -10 -60 -80 -106 -156 -77 -127 -102 -158 -326 -398 -217 -233 -262 -286 -423 -512 -99 -138 -192 -275 -206 -304 -15 -29 -29 -53 -32 -53 -3 0 -17 24 -32 52 -14 29 -106 166 -204 303 -161 225 -203 276 -422 510 -221 236 -250 272 -322 391 -43 71 -92 143 -107 159 -106 106 -296 77 -364 -57 -42 -82 -38 -122 40 -348 38 -113 68 -206 67 -208 -2 -1 -113 46 -247 106 -304 135 -308 139 -393 332 -122 277 -151 322 -231 356 -42 17 -114 24 -152 15z"></path>
                    <path d="M731 1174 c-26 -33 -27 -65 -3 -92 9 -11 169 -135 354 -276 221 -168 344 -268 355 -289 15 -27 18 -65 21 -249 3 -199 5 -218 23 -234 27 -24 75 -22 102 5 21 21 22 28 22 249 0 227 0 227 -27 282 -15 30 -42 70 -60 87 -18 17 -184 147 -368 287 -365 279 -376 285 -419 230z"></path>
                  </g>
                </svg>
              ),
              title: 'Tư vấn vận hành',
              description:
                'Tư vấn & cung cấp các giải pháp quản lý hiệu quả nhằm tối ưu hóa, quản lý và khai thác vận hành tòa nhà. Tư vấn kỹ thuật, hệ thống quy trình tác nghiệp cũng như an ninh trật tự.',
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  width="512"
                  height="512"
                  viewBox="0 0 512 512"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                    <path d="M2180 5010 c-120 -15 -287 -49 -400 -81 -154 -44 -319 -109 -336 -133 -21 -31 -21 -768 1 -810 8 -15 15 -48 15 -72 0 -53 26 -84 69 -84 50 0 68 29 73 119 l3 44 85 29 ann 241 82 474 122 705 122 245 0 430 -32 698 -120 l107 -36 0 -62 c0 -72 17 -96 67 -96 43 0 63 27 63 87 0 33 5 55 15 63 13 11 15 69 15 410 l0 399 -25 19 c-62 49 -371 144 -590 182 -137 24 -442 35 -565 20z m482 -146 c129 -18 377 -80 488 -121 l75 -29 3 -292 c2 -234 0 -292 -11 -292 -7 0 -58 15 -113 34 -121 41 -302 83 -444 102 -139 18 -387 18 -532 -1 -126 -17 -349 -69 -467 -109 -41 -15 -78 -26 -83 -26 -4 0 -8 132 -8 293 l0 294 123 41 c156 52 309 90 434 107 138 18 399 18 535 -1z"></path>
                    <path d="M1434 3731 c-84 -51 -96 -250 -24 -397 27 -55 98 -135 142 -160 12 -6 23 -36 33 -90 40 -213 129 -380 276 -518 131 -123 285 -201 452 -226 288 -43 625 145 791 442 41 75 90 217 106 310 11 64 14 69 64 107 97 73 156 198 156 330 0 139 -49 221 -131 221 -52 0 -96 -19 -142 -62 -42 -40 -48 -77 -17 -108 27 -27 66 -25 107 6 19 14 37 24 40 20 3 -3 5 -37 5 -75 -1 -84 -26 -149 -79 -203 -42 -43 -54 -47 -218 -84 -116 -26 -124 -26 -261 -15 -182 14 -500 14 -673 0 -132 -11 -140 -11 -266 16 -71 15 -146 36 -167 46 -49 25 -95 84 -113 143 -15 50 -20 157 -9 169 4 3 23 -5 43 -18 19 -14 47 -25 62 -25 60 0 80 77 32 122 -73 68 -149 86 -209 49z m387 -632 l35 -9 18 -170 c10 -94 16 -173 14 -176 -8 -7 -52 55 -86 121 -33 65 -66 158 -77 219 l-8 38 34 -7 c19 -4 50 -11 70 -16z m1242 -41 c-20 -87 -68 -198 -115 -269 -22 -33 -42 -58 -44 -56 -6 6 34 348 41 356 7 6 89 28 116 30 15 1 15 -5 2 -61z m-464 42 c107 -6 196 -12 198 -14 4 -4 -46 -474 -52 -493 -6 -18 -160 -89 -231 -107 -78 -20 -151 -20 -234 0 -56 13 -175 63 -219 93 -9 6 -22 84 -41 257 -16 137 -27 250 -26 252 2 2 272 17 371 20 22 1 128 -3 234 -8z"></path>
                    <path d="M3312 3030 c-28 -26 -28 -71 -1 -96 20 -18 51 -19 858 -22 584 -2 844 1 862 9 52 21 58 93 10 118 -13 8 -288 11 -863 11 -836 0 -844 0 -866 -20z"></path>
                    <path d="M3272 2834 c-21 -14 -22 -21 -22 -168 0 -115 3 -157 14 -171 12 -17 31 -20 118 -25 l103 -5 328 -233 327 -234 0 -329 0 -329 -34 0 c-58 0 -159 -37 -202 -74 -23 -20 -52 -58 -65 -88 -24 -53 -24 -54 -24 -423 l0 -370 31 -65 c160 -335 644 -261 704 107 13 76 12 569 0 657 -19 132 -86 208 -212 243 l-58 16 0 327 0 326 305 237 304 237 91 0 c83 0 93 2 115 25 24 23 25 29 25 163 0 126 -2 142 -21 166 l-20 26 -893 0 c-791 0 -894 -2 -914 -16z m1708 -174 l0 -50 -64 0 c-75 0 -46 19 -435 -284 -139 -109 -258 -199 -265 -202 -6 -2 -166 106 -356 241 l-345 245 -67 0 -68 0 0 50 0 50 800 0 800 0 0 -50z m-649 -1472 c20 -9 47 -31 60 -49 l24 -34 0 -350 c0 -387 2 -377 -67 -445 -71 -72 -172 -89 -264 -46 -44 21 -114 87 -114 108 0 5 36 8 80 8 90 0 120 17 120 68 0 56 -32 72 -144 72 l-86 0 0 54 0 54 94 4 c109 4 136 18 136 74 0 51 -27 64 -138 64 l-93 0 3 63 3 62 95 3 c106 3 130 15 130 65 0 56 -22 67 -127 67 l-93 0 0 31 c0 69 44 119 125 140 47 13 216 4 256 -13z"></path>
                    <path d="M20 2790 c-18 -18 -20 -33 -20 -144 0 -110 2 -126 21 -150 20 -25 23 -26 140 -26 115 0 119 -1 123 -22 30 -166 62 -255 115 -325 l39 -51 -30 -29 c-78 -74 -91 -155 -86 -559 4 -350 9 -371 103 -472 l54 -58 -63 -85 c-82 -110 -110 -160 -136 -239 -37 -115 -52 -202 -57 -346 -5 -135 -5 -142 16 -163 21 -21 24 -21 500 -21 l480 0 21 27 c21 26 22 35 17 148 -7 138 -26 251 -62 355 -31 90 -53 128 -153 260 l-79 104 37 56 c63 91 70 133 70 389 l0 226 28 41 c86 130 219 264 352 354 65 44 210 120 229 120 7 0 11 -28 11 -82 1 -134 21 -188 71 -188 22 0 318 137 341 157 24 21 23 75 0 96 -29 26 -62 21 -166 -29 -54 -25 -100 -43 -104 -40 -6 6 -20 189 -21 284 -1 32 -7 49 -26 67 -29 30 -55 32 -86 6 -20 -16 -24 -29 -24 -70 l0 -52 -78 -33 c-164 -72 -325 -185 -451 -316 -43 -45 -79 -80 -80 -78 -1 2 -10 24 -20 51 -17 46 -63 104 -99 123 -16 9 -17 30 -15 273 l3 262 35 -23 c20 -13 46 -44 60 -73 23 -46 25 -64 30 -228 5 -162 7 -180 24 -193 29 -20 70 -17 92 7 17 19 19 37 18 183 -1 171 -9 225 -50 307 -30 60 -105 126 -163 143 -29 8 -50 21 -58 36 -6 12 -17 27 -25 31 -7 5 -203 9 -435 9 -410 0 -424 -1 -443 -20z m200 -145 c0 -34 -1 -35 -40 -35 -39 0 -40 1 -40 35 0 34 1 35 40 35 39 0 40 -1 40 -35z m570 -241 l0 -277 -93 5 c-99 5 -135 18 -178 65 -52 55 -85 152 -99 285 -7 75 -11 85 -39 109 -23 19 -31 34 -31 57 l0 32 220 0 220 0 0 -276z m65 -434 c47 -23 75 -67 75 -119 l0 -31 -88 0 c-105 0 -132 -13 -132 -64 0 -53 22 -65 130 -68 l95 -3 3 -62 3 -63 -85 0 c-47 0 -96 -4 -110 -10 -47 -17 -47 -97 -1 -118 14 -7 64 -12 111 -12 l85 0 -3 -57 -3 -58 -95 -3 c-108 -3 -130 -15 -130 -68 0 -49 28 -64 122 -64 43 0 78 -4 78 -9 0 -4 -18 -29 -40 -54 -53 -60 -109 -81 -194 -75 -80 7 -137 42 -181 112 l-30 49 0 346 c0 312 2 349 18 378 32 59 109 84 240 78 63 -3 101 -10 132 -25z m47 -1121 c137 -182 168 -241 184 -339 l7 -40 -357 0 c-218 0 -356 4 -356 9 0 34 57 179 88 224 20 30 59 86 87 125 l49 70 66 -4 c40 -3 84 0 115 9 28 8 53 15 57 16 3 0 30 -31 60 -70z m216 -566 l3 -53 -380 0 c-213 0 -382 4 -385 9 -3 5 -3 30 0 55 l7 46 376 -2 376 -3 3 -52z"></path>
                    <path d="M3001 2451 c-24 -24 -29 -50 -37 -223 -3 -76 -10 -138 -14 -138 -4 0 -51 20 -104 45 -54 25 -108 45 -122 45 -50 0 -81 -63 -51 -103 14 -20 323 -167 350 -167 10 0 29 11 42 25 20 19 25 35 25 72 0 82 12 183 22 183 23 0 195 -94 271 -147 97 -68 236 -205 298 -294 55 -78 118 -194 148 -271 13 -31 31 -64 41 -73 26 -23 69 -15 93 17 19 25 19 31 7 70 -25 77 -124 261 -184 343 -75 102 -209 235 -310 310 -77 56 -238 145 -323 177 -42 16 -43 18 -43 61 0 37 -5 49 -26 66 -33 26 -58 27 -83 2z"></path>
                    <path d="M2346 1908 c-14 -20oglyphs -16 -120 -16 -883 0 -763 2 -863 16 -883 20 -29 74 -30 100 -1 18 20 19 49 19 884 0 835 -1 864 -19 884 -26 29 -80 28 -100 -1z"></path>
                    <path d="M1376 1429 l-26 -20 0 -304 c0 -274 2 -305 18 -323 26 -32 333 -222 357 -222 25 0 331 190 358 221 15 19 17 50 17 324 l0 304 -26 20 c-26 20 -38 21 -349 21 -311 0 -323 -1 -349 -21z m584 -346 l0 -228 -112 -70 c-62 -38 -117 -70 -123 -70 -6 0 -61 32 -123 70 l-112 70 0 228 0 227 235 0 235 0 0 -227z"></path>
                  </g>
                </svg>
              ),
              title: 'Bảo trì, Bảo dưỡng',
              description:
                'Cung cấp dịch vụ vận hành, bảo trì bảo dưỡng giúp nâng cao năng suất, chất lượng tổng thể của hệ thống thiết bị, kỹ thuật tòa nhà thông qua các chương trình kiểm tra định kỳ.',
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  width="512"
                  height="512"
                  viewBox="0 0 512 512"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                    <path d="M2425 5104 c-114 -24 -225 -84 -314 -169 -43 -42 -92 -100 -111 -134 -32 -56 -42 -64 -108 -97 -190 -92 -317 -288 -329 -504 -16 -292 170 -542 457 -616 48 -12 92 -15 170 -12 99 5 143 16 253 63 16 7 17 -3 17 -128 l0 -135 -62 -7 c-292 -30 -511 -91 -753 -210 -71 -35 -168 -89 -214 -120 -46 -31 -85 -55 -86 -53 -32 38 -165 210 -165 214 0 3 22 39 48 78 70 105 97 195 97 326 0 131 -27 221 -97 326 -81 121 -194 204 -328 241 -46 12 -82 31 -124 65 -256 205 -631 101 -745 -206 -59 -159 -28 -331 83 -468 26 -32 47 -72 54 -101 87 -345 476 -539 802 -399 l45 19 88 -111 87 -111 -89 -90 c-162 -165 -282 -328 -373 -505 l-43 -85 -5 145 c-4 124 -8 152 -28 191 -36 74 -87 125 -160 161 -60 30 -76 33 -152 33 -66 0 -96 -5 -132 -22 -66 -30 -143 -105 -175 -172 l-28 -56 -3 -355 c-5 -542 22 -721 153 -998 111 -235 170 -308 589 -729 387 -390 390 -392 454 -359 39 20 52 44 52 92 0 37 -14 52 -343 384 -189 190 -361 368 -384 395 -141 176 -243 391 -294 623 -20 88 -22 133 -26 497 -4 389 -3 401 16 433 43 68 118 89 189 53 72 -37 72 -37 72 -423 0 -189 5 -381 10 -426 12 -97 53 -217 101 -299 47 -80 710 -749 751 -759 81 -17 143 69 104 144 -8 15 -146 158 -306 317 -160 160 -298 303 -307 319 -20 38 -20 114 1 154 34 67 113 102 193 87 33 -6 73 -42 295 -263 l257 -255 110 -14 c199 -24 342 -94 472 -230 154 -162 244 -343 284 -570 8 -47 15 -112 15 -145 0 -55 3 -63 34 -94 46 -46 86 -46 132 0 31 31 34 39 34 94 0 195 85 444 210 612 149 201 323 305 561 333 l110 14 257 255 c222 221 262 257 295 263 80 15 159 -20 193 -87 21 -40 21 -116 1 -154 -9 -16 -151 -164 -316 -329 -321 -320 -328 -329 -301 -396 7 -16 26 -37 43 -45 63 -33 68 -29 437 344 368 370 390 397 441 543 41 116 49 207 49 588 0 327 1 345 20 376 39 64 129 83 191 42 68 -45 69 -53 69 -427 0 -320 -7 -443 -31 -555 -23 -106 -63 -224 -111 -328 -56 -121 -57 -149 -6 -192 34 -29 66 -32 110 -9 53 28 161 285 202 484 31 154 37 263 34 630 l-3 365 -28 56 c-32 67 -109 142 -175 172 -36 17 -66 22 -132 22 -76 0 -92 -3 -152 -33 -73 -36 -124 -87 -160 -161 -20 -39 -24 -67 -28 -191 l-5 -145 -43 83 c-92 178 -211 341 -373 505 l-89 90 87 111 88 111 45 -19 c326 -140 715 54 802 399 11 44 29 85 55 121 111 149 142 322 83 468 -114 307 -489 411 -745 206 -42 -34 -78 -53 -124 -65 -134 -37 -247 -120 -328 -241 -70 -105 -97 -195 -97 -326 0 -131 27 -221 97 -326 26 -39 48 -75 48 -78 0 -4 -133 -176 -165 -214 -1 -2 -40 22 -86 53 -46 31 -143 85 -214 120 -242 119 -461 180 -753 210 l-62 7 0 135 c0 125 1 135 17 128 110 -47 154 -58 253 -63 78 -3 122 0 170 12 287 74 473 324 457 616 -12 216 -139 412 -329 504 -66 33 -76 41 -108 97 -19 34 -68 92 -111 134 -89 85 -200 145 -314 169 -123 26 -428 15 -565 -20z"></path>
                    <path d="M2425 4530 c-172 -36 -333 -128 -458 -261 -85 -90 -149 -200 -181 -311 -13 -44 -16 -91 -16 -260 0 -169 3 -216 16 -260 32 -111 96 -221 181 -311 125 -133 286 -225 458 -261 123 -26 428 -15 565 20 172 36 333 128 458 261 85 90 149 200 181 311 13 44 16 91 16 260 0 169 -3 216 -16 260 -32 111 -96 221 -181 311 -125 133 -286 225 -458 261 -137 35 -442 46 -565 20z m305 -290 c88 -21 194 -64 269 -110 94 -57 104 -54 235 75 61 61 115 110 120 110 16 0 175 -164 175 -180 0 -8 -49 -65 -110 -125 -88 -87 -110 -115 -110 -138 0 -15 20 -62 45 -105 49 -86 86 -178 105 -264 20 -90 25 -92 219 -98 l166 -5 3 -119 c2 -78 -1 -123 -9 -132 -9 -11 -46 -14 -166 -14 -86 0 -163 -5 -173 -10 -12 -6 -26 -33 -35 -68 -30 -109 -66 -200 -111 -277 -65 -115 -64 -118 66 -250 61 -61 110 -118 110 -126 0 -9 -38 -53 -84 -98 -71 -69 -88 -81 -103 -72 -10 5 -65 57 -123 115 -114 115 -135 125 -188 87 -70 -49 -196 -101 -338 -140 -66 -18 -68 -24 -74 -210 l-5 -166 -125 0 -125 0 -5 160 c-3 102 -10 168 -18 182 -7 13 -30 27 -55 34 -144 39 -269 91 -339 140 -53 38 -74 28 -188 -87 -58 -58 -113 -110 -123 -115 -15 -9 -32 3 -103 72 -46 45 -84 89 -84 98 0 8 50 65 110 126 130 132 131 135 66 250 -45 77 -81 168 -111 277 -9 35 -23 62 -35 68 -10 5 -87 10 -173 10 -120 0 -157 3 -166 14 -8 9 -11 54 -9 132 l3 119 166 5 c194 6 199 8 219 98 18 83 64 199 110 275 60 99 59 104 -70 232 -60 60 -110 116 -110 125 0 16 158 180 174 180 6 0 60 -49 121 -110 131 -129 141 -132 235 -75 75 46 181 89 269 110 104 26 105 28 109 214 2 86 5 162 7 169 4 9 34 12 127 10 l123 -3 5 -166z"></path>
                  </g>
                </svg>
              ),
              title: 'Dịch vụ Vệ sinh',
              description:
                'Cung cấp dịch vụ Vệ sinh, Xử lý côn trùng, Khử khuẩn cho toàn bộ Tòa nhà với Đội ngũ Vệ sinh nhiệt huyết và giám sát giàu kinh nghiệm.',
            }
            ,
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  width="512"
                  height="512"
                  viewBox="0 0 512 512"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                    <path d="M2425 5104 c-114 -24 -225 -84 -314 -169 -43 -42 -92 -100 -111 -134 -32 -56 -42 -64 -108 -97 -190 -92 -317 -288 -329 -504 -16 -292 170 -542 457 -616 48 -12 92 -15 170 -12 99 5 143 16 253 63 16 7 17 -3 17 -128 l0 -135 -62 -7 c-292 -30 -511 -91 -753 -210 -71 -35 -168 -89 -214 -120 -46 -31 -85 -55 -86 -53 -32 38 -165 210 -165 214 0 3 22 39 48 78 70 105 97 195 97 326 0 131 -27 221 -97 326 -81 121 -194 204 -328 241 -46 12 -82 31 -124 65 -256 205 -631 101 -745 -206 -59 -159 -28 -331 83 -468 26 -32 47 -72 54 -101 87 -345 476 -539 802 -399 l45 19 88 -111 87 -111 -89 -90 c-162 -165 -282 -328 -373 -505 l-43 -85 -5 145 c-4 124 -8 152 -28 191 -36 74 -87 125 -160 161 -60 30 -76 33 -152 33 -66 0 -96 -5 -132 -22 -66 -30 -143 -105 -175 -172 l-28 -56 -3 -355 c-5 -542 22 -721 153 -998 111 -235 170 -308 589 -729 387 -390 390 -392 454 -359 39 20 52 44 52 92 0 37 -14 52 -343 384 -189 190 -361 368 -384 395 -141 176 -243 391 -294 623 -20 88 -22 133 -26 497 -4 389 -3 401 16 433 43 68 118 89 189 53 72 -37 72 -37 72 -423 0 -189 5 -381 10 -426 12 -97 53 -217 101 -299 47 -80 710 -749 751 -759 81 -17 143 69 104 144 -8 15 -146 158 -306 317 -160 160 -298 303 -307 319 -20 38 -20 114 1 154 34 67 113 102 193 87 33 -6 73 -42 295 -263 l257 -255 110 -14 c199 -24 342 -94 472 -230 154 -162 244 -343 284 -570 8 -47 15 -112 15 -145 0 -55 3 -63 34 -94 46 -46 86 -46 132 0 31 31 34 39 34 94 0 195 85 444 210 612 149 201 323 305 561 333 l110 14 257 255 c222 221 262 257 295 263 80 15 159 -20 193 -87 21 -40 21 -116 1 -154 -9 -16 -151 -164 -316 -329 -321 -320 -328 -329 -301 -396 7 -16 26 -37 43 -45 63 -33 68 -29 437 344 368 370 390 397 441 543 41 116 49 207 49 588 0 327 1 345 20 376 39 64 129 83 191 42 68 -45 69 -53 69 -427 0 -320 -7 -443 -31 -555 -23 -106 -63 -224 -111 -328 -56 -121 -57 -149 -6 -192 34 -29 66 -32 110 -9 53 28 161 285 202 484 31 154 37 263 34 630 l-3 365 -28 56 c-32 67 -109 142 -175 172 -36 17 -66 22 -132 22 -76 0 -92 -3 -152 -33 -73 -36 -124 -87 -160 -161 -20 -39 -24 -67 -28 -191 l-5 -145 -43 83 c-92 178 -205 333 -359 492 l-102 107 87 110 87 110 45 -19 c326 -140 715 54 802 399 7 29 28 69 54 101 111 137 142 309 83 468 -115 310 -491 412 -749 203 -38 -31 -75 -50 -120 -62 -134 -37 -247 -120 -328 -241 -70 -105 -97 -195 -97 -326 0 -131 27 -221 97 -326 26 -39 48 -75 48 -78 0 -4 -121 -162 -165 -214 -1 -1 -40 23 -86 53 -46 31 -142 85 -214 120 -240 119 -460 180 -752 210 l-63 7 0 135 c0 125 1 135 18 128 109 -47 153 -58 252 -63 184 -8 328 48 456 176 195 196 228 496 83 738 -48 79 -152 174 -239 218 -65 32 -77 43 -109 97 -55 93 -172 199 -273 248 -140 67 -279 85 -423 55z m240 -199 c137 -36 244 -123 309 -254 30 -59 43 -74 74 -87 163 -69 221 -118 275 -232 29 -61 32 -76 32 -162 -1 -75 -6 -107 -24 -153 -32 -81 -115 -168 -199 -209 -62 -31 -73 -33 -172 -33 -92 0 -112 3 -160 26 -30 14 -70 38 -88 54 l-34 28 101 101 c110 111 125 140 97 194 -20 38 -44 52 -91 52 -28 0 -45 -9 -80 -41 l-45 -42 0 176 c0 191 -6 219 -51 243 -55 28 -110 11 -138 -43 -7 -14 -11 -101 -11 -249 l0 -228 -94 92 c-87 86 -96 92 -134 92 -56 0 -91 -31 -99 -88 l-6 -43 127 -127 c69 -70 126 -131 126 -136 0 -4 -26 -19 -57 -34 -52 -24 -70 -27 -163 -27 -99 0 -110 2 -172 33 -84 41 -167 128 -199 209 -18 46 -23 78 -24 153 0 86 3 101 32 162 54 114 112 163 275 232 31 13 44 28 74 87 101 202 315 307 519 254z m-2068 -794 c23 -11 62 -41 85 -66 38 -39 52 -46 114 -59 39 -8 94 -26 122 -40 113 -57 198 -184 209 -312 28 -351 -388 -557 -645 -319 -71 66 -109 133 -126 225 -13 65 -19 76 -69 129 -111 116 -115 264 -11 379 59 67 124 94 214 89 41 -3 81 -12 107 -26z m4139 12 c70 -24 147 -103 168 -173 33 -110 11 -195 -71 -281 -50 -53 -56 -64 -69 -129 -17 -92 -55 -159 -126 -225 -192 -178 -492 -117 -611 125 -29 59 -32 73 -32 160 0 85 3 102 31 160 56 119 160 198 296 226 65 13 78 20 113 58 82 88 190 117 301 79z m-1816 -988 c69 -14 172 -42 230 -61 103 -34 305 -126 345 -157 l20 -16 -20 -6 c-313 -108 -513 -433 -465 -757 22 -156 104 -315 212 -414 25 -23 117 -89 205 -147 88 -58 163 -112 166 -120 4 -10 -26 -46 -82 -101 -84 -81 -91 -86 -132 -86 -112 0 -309 -72 -437 -159 -128 -86 -272 -256 -353 -415 -24 -47 -46 -86 -49 -86 -3 0 -25 39 -49 86 -80 158 -212 314 -343 407 -128 91 -330 167 -447 167 -42 0 -48 4 -143 98 -55 53 -104 104 -108 113 -14 25 5 130 34 192 16 33 49 77 83 109 102 95 129 127 158 179 107 197 56 435 -123 571 -82 62 -165 88 -284 88 -49 0 -88 4 -86 9 5 15 126 119 202 175 259 190 542 306 857 351 162 23 449 13 609 -20z m952 -507 c218 -217 377 -476 466 -758 16 -52 32 -107 36 -122 l6 -27 -55 34 c-71 42 -140 59 -220 53 -96 -8 -166 -45 -261 -139 l-80 -80 -20 22 c-10 12 -91 70 -179 127 -88 58 -181 127 -207 154 -92 95 -148 258 -134 389 29 251 238 447 478 448 l67 1 103 -102z m-2417 -227 c85 -38 144 -126 145 -215 0 -93 -16 -123 -125 -231 -82 -82 -109 -116 -142 -181 -22 -45 -43 -87 -45 -95 -4 -10 -18 -2 -49 28 -24 23 -71 55 -104 70 -52 24 -72 28 -150 28 -78 0 -98 -4 -150 -28 -33 -15 -68 -35 -78 -45 -18 -16 -18 -15 -12 13 40 173 152 428 259 588 l58 87 177 0 c149 0 182 -3 216 -19z"></path>
                    <path d="M2329 2206 c-179 -52 -311 -205 -340 -396 -16 -107 -6 -280 20 -352 30 -78 83 -143 153 -188 72 -47 140 -64 239 -59 92 5 182 46 246 111 42 43 162 246 190 323 76 206 -15 434 -212 531 -65 32 -85 37 -162 40 -54 2 -106 -2 -134 -10z m212 -213 c64 -33 105 -87 118 -156 13 -70 -1 -116 -75 -250 -82 -146 -109 -170 -203 -175 -58 -3 -71 0 -108 24 -22 15 -52 46 -65 68 -21 38 -23 52 -23 176 0 118 3 141 22 180 67 140 208 196 334 133z"></path>
                  <path d="M4523 790 c-32 -13 -57 -57 -56 -98 1 -49 48 -92 99 -92 50 0 94 45 94 95 0 47 -13 71 -50 90 -32 17 -54 18 -87 5z"></path>
                  <path d="M4038 312 c-158 -158 -168 -170 -168 -205 0 -49 13 -73 52 -93 59 -30 80 -17 250 154 86 86 161 168 167 183 22 61 -28 129 -97 129 -34 0 -49 -12 -204 -168z"></path>

                  </g>
                </svg>
              ),
              title: 'Dịch vụ Vệ sinh',
              description:
                'Cung cấp dịch vụ Vệ sinh, Xử lý côn trùng, Khử khuẩn cho toàn bộ Tòa nhà với Đội ngũ Vệ sinh nhiệt huyết và giám sát giàu kinh nghiệm.',
            }
          ].map((service, index) => (
            <div key={index} className={styles['service-item']}>
              <div className={styles['service-icon']}>{service.icon}</div>
              <h3 className={styles['service-title']}>{service.title}</h3>
              <p className={styles['service-description']}>{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>

      {/* Video Section */}
      <section className={styles['video-section']}>
        <h2>Video Giới Thiệu</h2>
        <div className={styles['video-container']}>
          <iframe
            src="https://www.youtube.com/embed/rKaqO1Lnmnc?loop=1&playlist=rKaqO1Lnmnc"
            title="Giới thiệu công ty ACFC"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Benefits Section */}
      <h2 className={styles['benefits-title']}>Phúc lợi công ty</h2>
      <section className={styles['benefits-container']}>
        {benefits.map((benefit, idx) => (
          <div key={idx} className={styles['benefit-card']}>
            <div className={styles['icon-title']}>
              <img src={benefit.icon} alt={`Icon ${idx + 1}`} className={styles['icon-image']} loading="lazy" />
              <h3>{benefit.title}</h3>
            </div>
            <ul>
              {benefit.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Index;