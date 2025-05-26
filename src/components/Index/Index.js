import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Index.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const bannerImages = [
  '/image/BANNER5.jpg',
  '/image/BANNER6.jpg',
  '/image/BANNER7.jpg',
];

const acfcValues = [
  { img: '/image/01.png', text: 'Lịch sử hình thành', link: '#' },
  { img: '/image/02.png', text: 'Tầm nhìn sứ mệnh - Giá trị cốt lõi', link: '#' },
  { img: '/image/03.png', text: 'Danh hiệu & Giải thưởng', link: '#' },
  { img: '/image/04.png', text: 'Tinh thần ACFC', link: '#' },
];

const acfcLoveItems = [
  {
    title: '5 LÝ DO<br>BẠN YÊU ACFC',
    info: 'ACFC - Happy Place To Work',
    images: null,
    reverse: false,
  },
  {
    info: 'ACFC - Happy Place To Work',
    images: ['/image/ms-phi-phuong.jpg', '/image/mr-louis-nguyen.jpg', '/image/tintuc3.jpg'],
    reverse: false,
  },
  {
    info: 'Lương thưởng - Chế độ phúc lợi hấp dẫn',
    images: ['/image/ms-phi-phuong.jpg', '/image/mr-louis-nguyen.jpg', '/image/tintuc3.jpg'],
    reverse: true,
  },
  {
    info: 'Trung thực, chính trực',
    images: ['/image/ms-phi-phuong.jpg', '/image/mr-louis-nguyen.jpg', '/image/tintuc3.jpg'],
    reverse: false,
  },
  {
    info: 'Thỏa sức sáng tạo trong công việc',
    images: ['/image/ms-phi-phuong.jpg', '/image/mr-louis-nguyen.jpg', '/image/tintuc3.jpg'],
    reverse: true,
  },
];

const benefits = [
  {
    icon: '/public/assets/images/pl-01.png',
    title: 'Lương thưởng và chế độ đãi ngộ hấp dẫn',
    items: [
      'Mức lương cạnh tranh, chế độ thưởng KPI theo quý, năm.',
      'Tham gia bảo hiểm full lương (BHYT, BHXH, BHTN).',
      'Mua hàng hiệu giá ưu đãi với chính sách giảm giá nội bộ 30 – 50%, được tham gia mua hàng tại nhiều sự kiện Internal Sale với mức ưu đãi lên đến 80%.',
      'Tham gia các chương trình gắn kết nội bộ: Happy Friday, Year End Party, Team Building, ...',
    ],
  },
  {
    icon: 'public/image/pl-02.png',
    title: 'Môi trường làm việc thân thiện, trẻ trung, năng động',
    items: [
      'ACFC – Happy place to work, nơi hội tụ những cá nhân tài năng, cá tính và đầy năng lượng trong công việc.',
      'Không gian làm việc hiện đại, được trang bị đầy đủ trang thiết bị hỗ trợ công việc như: Laptop, điện thoại, phần mềm nghe gọi miễn phí 3CX, ...',
      'Môi trường làm việc trẻ trung, chuyên nghiệp.',
      'Cơ hội làm việc với các anh chị cấp quản lý nổi tiếng trong ngành thời trang.',
    ],
  },
  {
    icon: 'public/image/pl-03.png',
    title: 'Chương trình đào tạo bài bản, cơ hội học tập và phát triển',
    items: [
      'Học hỏi và phát triển cùng đội ngũ những người có kinh nghiệm dẫn đầu trong ngành thời trang bán lẻ.',
      'Tham gia khóa học đào tạo định kỳ và phát sinh của công ty để liên tục nâng cấp kiến thức, kỹ năng.',
    ],
  },
];

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
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

  return (
    <div className={styles['a-l-img']}>
      <div className={styles.carousel}>
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`${styles['carousel-item']} ${idx === currentIndex ? styles.active : ''}`}
          >
            <img src={img} alt={`Slide ${idx + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

const Index = () => {
  // Banner slider state
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerTimer = useRef(null);

  const nextBannerSlide = useCallback(() => {
    setBannerIdx((prev) => (prev + 1) % bannerImages.length);
  }, []);

  const prevBannerSlide = useCallback(() => {
    setBannerIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
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
  }, []);

  useEffect(() => {
    startBannerAuto();
    return stopBannerAuto;
  }, [startBannerAuto, stopBannerAuto]);

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
  };

  // Fetch jobs from API
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

  // Generate dropdown options
  useEffect(() => {
    const brands = Array.from(
      new Set(
        jobs
          .flatMap((job) => (job.Brands ? job.Brands.split(',') : []))
          .map((brand) => brand.trim())
          .filter(Boolean)
      )
    );
    const workplaces = Array.from(
      new Set(
        jobs
          .flatMap((job) => (job.Workplace ? job.Workplace.split(',') : []))
          .map((place) => place.trim())
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

  return (
    <main>
      {/* Banner Section */}
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

      {/* Latest Jobs Section */}
      <section className={styles['container-lastest']}>
        <div className={styles['job-search']}>
          <div className={styles['job-search_container']}>
            <p className={styles['job-search_title']}>Tìm kiếm công việc phù hợp</p>
            <form className={styles['job-search_form']} onSubmit={handleSearchSubmit}>
              <div className={styles['job-search_field']}>
                <input
                  type="text"
                  name="keyword"
                  placeholder="Từ khóa(tên công việc, thương hiệu, nơi làm việc)"
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
              <button
                type="submit"
                className={styles['job-search_button']}
                disabled={loading}
                aria-label="Tìm kiếm công việc"
              >
                <i className="fa fa-search"></i>
                <span>{loading ? 'Đang tải...' : 'Tìm kiếm'}</span>
              </button>
            </form>
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
              filteredJobs.map((job, idx) => (
                <div key={job._id || idx} className={styles['job-card']}>
                  <div className={styles['job-title-block']}>{job.Name}</div>
                  <div className={styles['job-details-wrapper']}>
                    <p className={styles['job-brand']}>
                      <strong>Thương hiệu:</strong> {job.Brands}
                    </p>
                    <p className={styles['job-location']}>
                      <strong>Nơi làm việc:</strong> {job.Workplace}
                    </p>
                    <p className={styles['job-salary']}>
                      <strong>Mức lương:</strong> {job.Salary}
                    </p>
                    <p className={styles['job-quantity']}>
                      <strong>Số lượng tuyển:</strong> {job.Slot}
                    </p>
                    <p className={styles['job-date']}>
                      <strong>Ngày hết hạn:</strong> {job['Due date']}
                    </p>
                    <Link to={`/DetailJob/${job._id}`} className={styles['job-apply-btn']}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <section className={styles['watch-more']}>
            <button className={styles['watch-more-btn']}>Xem thêm</button>
          </section>
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

      {/* ACFC Love Section */}
      <section className={styles['acfc-love']}>
        <h2>5 Lý Do Bạn Yêu ACFC</h2>
        <div className={styles['acfc-love-grid']}>
          {acfcLoveItems.map((item, idx) => (
            <div
              key={idx}
              className={`${styles['acfc-l-box']} ${item.reverse ? styles['reverse'] : ''}`}
            >
              {item.title ? (
                <div className={styles['text-only-box']}>
                  <h3
                    className={styles['a-l-title']}
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></h3>
                  <div className={styles['a-l-info']}>{item.info}</div>
                </div>
              ) : (
                <>
                  {item.reverse ? (
                    <>
                      <div className={styles['a-l-info']}>{item.info}</div>
                      <Carousel images={item.images} />
                    </>
                  ) : (
                    <>
                      <Carousel images={item.images} />
                      <div className={styles['a-l-info']}>{item.info}</div>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className={styles['video-section']}>
        <h2>Video Giới Thiệu</h2>
        <div className={styles['video-container']}>
          <iframe
            src="https://www.youtube.com/embed/rKaqO1Lnmnc"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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