import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Index.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faSearch, faBriefcase, faMapMarkerAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';

// Static data
const bannerImages = [
  '/assets/images/Banner1.jpg',
  '/assets/images/Banner2.jpg',
];

const ppmvnValues = [
  { img: '/assets/images/01.png', text: 'Lịch sử hình thành', link: '#' },
  { img: '/assets/images/02.png', text: 'Tầm nhìn sứ mệnh - Giá trị cốt lõi', link: '#' },
  { img: '/assets/images/03.png', text: 'Danh hiệu & Giải thưởng', link: '#' },
  { img: '/assets/images/04.png', text: 'Tinh thần PPMVN', link: '#' },
];

const benefits = [
  {
    icon: '/assets/images/pl-01.png',
    title: 'Lương thưởng và chế độ đãi ngộ hấp dẫn',
    items: [
      'Mức lương cạnh tranh, chế độ thưởng KPI theo quý, năm.',
      'Tham gia bảo hiểm full lương (BHYT, BHXH, BHTN).',
      'Hưởng các chính sách phúc lợi đặc biệt dành cho nhân viên như hỗ trợ chi phí đào tạo, nghỉ phép dài ngày.',
      'Tham gia các chương trình gắn kết nội bộ: Happy Friday, Year End Party, Team Building, ...',
    ],
  },
  {
    icon: '/assets/images/pl-02.png',
    title: 'Môi trường làm việc chuyên nghiệp, hiện đại',
    items: [
      'PPM nơi hội tụ những cá nhân tài năng và tận tâm trong lĩnh vực quản lý bất động sản.',
      'Không gian làm việc hiện đại, được trang bị đầy đủ trang thiết bị hỗ trợ công việc như: Laptop, điện thoại, phần mềm quản lý tòa nhà chuyên dụng, ...',
      'Môi trường làm việc chuyên nghiệp, khuyến khích sáng tạo và đổi mới.',
      'Cơ hội làm việc với đội ngũ quản lý giàu kinh nghiệm trong ngành quản lý và vận hành bất động sản.',
    ],
  },
  {
    icon: '/assets/images/pl-03.png',
    title: 'Chương trình đào tạo bài bản, cơ hội phát triển nghề nghiệp',
    items: [
      'Học hỏi và phát triển cùng đội ngũ chuyên gia hàng đầu trong lĩnh vực quản lý bất động sản và dịch vụ vận hành.',
      'Tham gia các khóa đào tạo định kỳ về kỹ năng quản lý tòa nhà, bảo trì kỹ thuật, và dịch vụ vệ sinh, cảnh quan.',
      'Cơ hội thăng tiến rõ ràng với lộ trình phát triển nghề nghiệp chuyên sâu.',
    ],
  },
];

const Index = () => {
  // Banner slider state
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

      {/* PPMVN Values Section */}
      <section className={styles['acfc-values-section']}>
        <h2 className={styles['section-title']}>PPMVN Việt Nam</h2>
        <div className={styles['values-grid']}>
          {ppmvnValues.map((value, idx) => (
            <div key={idx} className={styles['value-item']}>
              <img src={value.img} alt={value.text} loading="lazy" />
              <Link to={value.link}>
                <p className={styles['value-text']}>{value.text}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <div className={styles.container}>
        <h1>Dịch vụ của chúng tôi</h1>
        <div className={styles.servicesGrid}>
          {/* Service Card 1 */}
          <div className={styles.serviceCard}>
            <div className={styles.content}>
              <div className={styles.serviceIcon}>
                <img src="/assets/images/service1.svg" alt="Quản lý vận hành icon" loading="lazy" />
              </div>
              <h3 className={styles.serviceTitle}>Quản lý vận hành</h3>
              <p className={styles.serviceDescription}>
                Dịch vụ trọn gói quản lý khai thác vận hành cho mọi loại hình bất động sản nhằm mang đến môi trường làm việc, sinh sống an toàn hiệu quả cho khách hàng.
              </p>
            </div>
          </div>
          {/* Service Card 2 */}
          <div className={styles.serviceCard}>
            <div className={styles.content}>
              <div className={styles.serviceIcon}>
                <img src="/assets/images/service2.svg" alt="Cung cấp nhân sự icon" loading="lazy" />
              </div>
              <h3 className={styles.serviceTitle}>Cung cấp nhân sự</h3>
              <p className={styles.serviceDescription}>
                Cung cấp đội ngũ Nhân sự, dịch vụ chất lượng cao từ Lễ tân, Bảo vệ, Quản lý đến vận hành các Tòa nhà chung cư, Tòa nhà văn phòng, Trung tâm thương mại, Khu đô thị, Khu nghỉ dưỡng.
              </p>
            </div>
          </div>
          {/* Service Card 3 */}
          <div className={styles.serviceCard}>
            <div className={styles.content}>
              <div className={styles.serviceIcon}>
                <img src="/assets/images/service3.svg" alt="Tư vấn vận hành icon" loading="lazy" />
              </div>
              <h3 className={styles.serviceTitle}>Tư vấn vận hành</h3>
              <p className={styles.serviceDescription}>
                Tư vấn & cung cấp các giải pháp quản lý hiệu quả nhằm tối ưu hóa, quản lý và khai thác vận hành tòa nhà. Tư vấn kỹ thuật, hệ thống quy trình tác nghiệp cũng như an ninh trật tự.
              </p>
            </div>
          </div>
          {/* Service Card 4 */}
          <div className={styles.serviceCard}>
            <div className={styles.content}>
              <div className={styles.serviceIcon}>
                <img src="/assets/images/service4.svg" alt="Bảo trì, Bảo dưỡng icon" loading="lazy" />
              </div>
              <h3 className={styles.serviceTitle}>Bảo trì, Bảo dưỡng</h3>
              <p className={styles.serviceDescription}>
                Cung cấp dịch vụ vận hành, bảo trì bảo dưỡng giúp nâng cao năng suất, chất lượng tổng thể của hệ thống thiết bị, kỹ thuật tòa nhà thông qua các chương trình kiểm tra định kỳ.
              </p>
            </div>
          </div>
          {/* Service Card 5 */}
          <div className={styles.serviceCard}>
            <div className={styles.content}>
              <div className={styles.serviceIcon}>
                <img src="/assets/images/service5.svg" alt="Dịch vụ Vệ sinh icon" loading="lazy" />
              </div>
              <h3 className={styles.serviceTitle}>Dịch vụ Vệ sinh</h3>
              <p className={styles.serviceDescription}>
                Cung cấp dịch vụ Vệ sinh, Xử lý côn trùng, Khử khuẩn cho toàn bộ Tòa nhà với Đội ngũ Vệ sinh nhiệt huyết và giám sát giàu kinh nghiệm.
              </p>
            </div>
          </div>
          {/* Service Card 6 */}
          <div className={styles.serviceCard}>
            <div className={styles.content}>
              <div className={styles.serviceIcon}>
                <img src="/assets/images/service6.svg" alt="Cảnh quan môi trường icon" loading="lazy" />
              </div>
              <h3 className={styles.serviceTitle}>Cảnh quan môi trường</h3>
              <p className={styles.serviceDescription}>
                Dịch vụ chăm sóc cảnh quan, tạo môi trường làm việc ngập tràn cây xanh được chăm sóc cắt tỉa cẩn thận. Định kỳ phòng trừ các loại vật gây hại như mối, côn trùng, sâu bọ...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <section className={styles['video-section']}>
        <h2>Video Giới Thiệu</h2>
        <div className={styles['video-container']}>
          <iframe
            src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FPPM.VN.Ltd%2Fvideos%2F9490759834354567%2F"
            title="Giới thiệu công ty PPMVN"
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
