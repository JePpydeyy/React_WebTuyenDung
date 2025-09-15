import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Index.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faSearch, faBriefcase, faMapMarkerAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Static data
const bannerImages = [
  '/assets/images/BANNER1.jpg',
  '/assets/images/BANNER2.jpg',
];

const ppmvnValues = [
  { img: '/assets/images/01.png', text: 'Lịch sử hình thành', link: '#' },
  { img: '/assets/images/02.png', text: 'Tầm nhìn sứ mệnh - Giá trị cốt lõi', link: '#' },
  { img: '/assets/images/03.png', text: 'Danh hiệu & Giải thưởng', link: '#' },
  { img: '/assets/images/04.png', text: 'Tinh thần PPMVN', link: '#' },
];

const benefits = [
  {
    icon: '/assets/images/001.png',
    title: 'Lương thưởng và chế độ đãi ngộ hấp dẫn',
    items: [
      'Mức lương cạnh tranh, chế độ thưởng KPI theo quý, năm.',
      'Tham gia bảo hiểm full lương (BHYT, BHXH, BHTN).',
      'Hưởng các chính sách phúc lợi đặc biệt dành cho nhân viên như hỗ trợ chi phí đào tạo, nghỉ phép dài ngày.',
      'Tham gia các chương trình gắn kết nội bộ: Happy Friday, Year End Party, Team Building, ...',
    ],
  },
  {
    icon: '/assets/images/002.png',
    title: 'Môi trường làm việc chuyên nghiệp, hiện đại',
    items: [
      'PPM nơi hội tụ những cá nhân tài năng và tận tâm trong lĩnh vực quản lý bất động sản.',
      'Không gian làm việc hiện đại, được trang bị đầy đủ trang thiết bị hỗ trợ công việc như: Laptop, điện thoại, phần mềm quản lý tòa nhà chuyên dụng, ...',
      'Môi trường làm việc chuyên nghiệp, khuyến khích sáng tạo và đổi mới.',
      'Cơ hội làm việc với đội ngũ quản lý giàu kinh nghiệm trong ngành quản lý và vận hành bất động sản.',
    ],
  },
  {
    icon: '/assets/images/003.png',
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
  const [visibleJobs, setVisibleJobs] = useState(6);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
    setVisibleJobs(6);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchForm.keyword && !searchForm.brand && !searchForm.workplace && !searchForm.name) {
      alert('Vui lòng nhập ít nhất một tiêu chí tìm kiếm!');
      return;
    }
    setSearching(true);
    setVisibleJobs(6);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/job`);
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

      {/* PPMVN Abouts Section */}
      <section className={styles['container-about']}>
        <h1 className={styles['section-title']}>GIỚI THIỆU VỀ PPM.VN</h1>
        <div className={styles['about-content']}>
          <div className={styles['box-video']}>
            <img></img>
          </div>
          <div className={styles['text-content']}>
            <p>PPM.VN là công ty chuyên cung cấp dịch vụ quản lý, tư vấn quản lý bất động sản toàn diện với mục tiêu mang lại
              giá trị cao nhất cho khách hàng sử dụng và vận hành các dự án lớn trên cả nước. Chúng tôi cam kết mang lại
              cho khách hàng sự hài lòng với chất lượng dịch vụ hàng đầu, chuyên nghiệp và minh bạch. Đội ngũ của chúng
              tôi có kinh nghiệm phong phú trong lĩnh vực tư vấn giải pháp, cung cấp các dịch vụ cao cấp và có sự kết nối
              mạnh mẽ với các đối tác trong nước và quốc tế.
            </p>
            <div className={styles['contact']}>
              <p>Tên tiếng Anh: Premier Property Management Vietnam Company Limited</p>
              <p>Trụ sở chính: 110 Cầu Thành, Phường 4, Quận 3, TP. Hồ Chí Minh, Việt Nam</p>
              <p>Hotline: 0898 514 239</p>
              <p>Email: vanhan@ppmvn.vn</p>
            </div>
          </div>
        </div>
        <div className={styles['container-button']}>
          <button className={styles['watch-more-btn']}> 
            <Link className={styles['watch-more-btn-link']} to={`/about`}>Xem thêm</Link>
          </button>
        </div>
      </section>

      {/* value section */}
      <section className={styles['container-value']}>
        <h1 className={styles['section-title']}>GIÁ TRỊ CỐT LÕI</h1>
        <Swiper
          className={styles["value-swiper"]}
          spaceBetween={16}
          slidesPerView={3}
          breakpoints={{
            1024: { slidesPerView: 3 }, // desktop
            768: { slidesPerView: 2 },  // tablet
            0: { slidesPerView: 1 },    // mobile
          }}
        >
          <SwiperSlide>
            <div className={styles['value-item']}>
              <div className={styles['value-img']}>
                <img src="./assets/images/4.jpg" className={styles['image']} />
              </div>
              <h2 className={styles['value-name']}>PREMIER</h2>
              <p className={styles['value-description']}>
                Chất lượng cao cấp, dẫn đầu nghành
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={styles['value-item']}>
              <div className={styles['value-img']}>
                <img src="./assets/images/4.jpg" className={styles['image']} />
              </div>
              <h2 className={styles['value-name']}>PROPERTY</h2>
              <p className={styles['value-description']}>
                Quản lý bất động sản, phát triển tài sản
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={styles['value-item']}>
              <div className={styles['value-img']}>
                <img src="./assets/images/3.jpg" className={styles['image']} />
              </div>
              <h2 className={styles['value-name']}>MANAGEMENT</h2>
              <p className={styles['value-description']}>
                Chuyên nghiệp, duy trì giá trị bền vững
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* event section */}
      <section className={styles['container-event']}>
        <h1 className={styles['section-title']}>SỰ KIỆN NỔI BẬT</h1>
        <div className={styles['event-list']}>
          <div className={styles['event-item']}>
          </div>
        </div>
      </section>

      {/* Video Section */}
    

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
