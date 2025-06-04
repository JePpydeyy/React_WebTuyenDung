import React, { useEffect, useRef, useState } from 'react';
import styles from './About.module.css'; // Import CSS Module

const bannerImages = [
  '/assets/images/BANNER2.jpg',
  '/assets/images/BANNER1.jpg'
];

const features = [
  { img: '/assets/images/4.jpg', title: 'PREMIER', desc: 'Chất lượng cao cấp, dẫn đầu ngành' },
  { img: '/assets/images/4.jpg', title: 'PROPERTY', desc: 'Quản lý bất động sản, phát triển tài sản' },
  { img: '/assets/images/3.jpg', title: 'MANAGEMENT', desc: 'Chuyên nghiệp, duy trì giá trị bền vững' }
];

const testimonials = [
  {
    img: '/assets/images/ms-phi-phuong.jpg',
    quote: 'Trải qua quá trình từng làm việc cho những tập đoàn Đa quốc gia nhưng tôi vẫn có ước mọng tìm được một tập đoàn trong nước có môi trường làm việc chuyên nghiệp để đầu quân, đem sức mình cùng giúp sức xây dựng xã hội, xây dựng đất nước, và IPPG là điểm đến hội tụ đủ tất cả mong muốn đó. Với tầm nhìn xa của Chủ Tịch trong việc tạo dựng một nền tảng kinh doanh rõ ràng, minh bạch, bền vững và đặc biệt hơn là lịch sử của tập đoàn, sự trở về xây dựng đất nước của Chủ Tịch đã truyền cảm hứng cho tôi trong suốt thời gian làm việc vừa qua, luôn nghĩ nhiều hơn cho ACFC cũng như IPPG. Với tôi IPPG không hẳn chỉ là công ty mà còn làm mãi nhà, là điểm đến cuối cùng mà tôi luôn muốn gắn bó.',
    author: '- Ms. Vũ Thị Phi Phượng - CEO -'
  },
  {
    img: '/assets/images/mr-louis-nguyen.jpg',
    quote: 'Tôi rất tự hào khi được làm việc tại ACFC, một môi trường chuyên nghiệp và sáng tạo. Chúng tôi luôn nỗ lực mang đến những trải nghiệm thời trang tốt nhất cho khách hàng Việt Nam.',
    author: '- Mr. Louis Nguyen - Manager -'
  }
];

const brandLogos = [
  "tienphat-logo-300x200-1.png",
  "hoabinh-house-300x200-1.jpg",
  "Tien-Thinh-300x200-1.jpg",
  "Paxsky-logo-300x200-1.jpg",
  "Suntec-logo-300x200-1.jpg",
  "longhoang-logo-1-300x200-1.jpg",
  "namlong-logo-1-300x200-1.jpg",
  "thanhbinhphu-logo-300x200-1.jpg",
  "Logo-SW-300x200-1.jpg",
  "HOANG-PHUC-LAND-300x72.png",
  "RIVERA-PARK-SG.png",
  "CENTRAL-PREMIUM.png",
  "dockland.jpg",
  "logo-the-western-capital.png",
  "Logo-Gia-Loc.png"
];

const About = () => {
  // Banner slider state
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerTimer = useRef(null);
  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  // Testimonial slider state
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonialTimer = useRef(null);

  // Banner auto slide
  useEffect(() => {
    startBannerAuto();
    return stopBannerAuto;
  }, [bannerIdx]);

  function showBannerSlide(idx) {
    setBannerIdx(idx);
  }
  function nextBannerSlide() {
    setBannerIdx((prev) => (prev + 1) % bannerImages.length);
  }
  function prevBannerSlide() {
    setBannerIdx((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  }
  function startBannerAuto() {
    stopBannerAuto();
    bannerTimer.current = setInterval(nextBannerSlide, 5000);
  }
  function stopBannerAuto() {
    if (bannerTimer.current) clearInterval(bannerTimer.current);
  }

  // Drag handling
  const handleDragStart = (e) => {
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    isDragging.current = true;
    stopBannerAuto();
    e.preventDefault(); // Prevent text selection or scrolling
  };

  const handleDragMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        prevBannerSlide();
      } else {
        nextBannerSlide();
      }
      isDragging.current = false; // Reset after swipe
    }
  };

  const handleDragEnd = () => {
    if (isDragging.current) {
      isDragging.current = false;
      dragStartX.current = null;
      startBannerAuto();
    }
  };

  // Banner event listeners
  const bannerWrapperRef = useRef(null);
  useEffect(() => {
    const wrapper = bannerWrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener('touchstart', handleDragStart, { passive: false });
    wrapper.addEventListener('touchmove', handleDragMove, { passivemissable: true, passive: false });
    wrapper.addEventListener('touchend', handleDragEnd);
    wrapper.addEventListener('mousedown', handleDragStart);
    wrapper.addEventListener('mousemove', handleDragMove);
    wrapper.addEventListener('mouseup', handleDragEnd);
    wrapper.addEventListener('mouseleave', handleDragEnd);
    wrapper.addEventListener('mouseenter', stopBannerAuto);
    wrapper.addEventListener('mouseleave', startBannerAuto);

    return () => {
      wrapper.removeEventListener('touchstart', handleDragStart);
      wrapper.removeEventListener('touchmove', handleDragMove);
      wrapper.removeEventListener('touchend', handleDragEnd);
      wrapper.removeEventListener('mousedown', handleDragStart);
      wrapper.removeEventListener('mousemove', handleDragMove);
      wrapper.removeEventListener('mouseup', handleDragEnd);
      wrapper.removeEventListener('mouseleave', handleDragEnd);
      wrapper.removeEventListener('mouseenter', stopBannerAuto);
      wrapper.removeEventListener('mouseleave', startBannerAuto);
    };
  }, []);

  // Testimonial auto slide
  useEffect(() => {
    startTestimonialAuto();
    return stopTestimonialAuto;
  }, [testimonialIdx]);

  function showTestimonialSlide(idx) {
    setTestimonialIdx(idx);
  }
  function nextTestimonialSlide() {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  }
  function prevTestimonialSlide() {
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }
  function startTestimonialAuto() {
    stopTestimonialAuto();
    testimonialTimer.current = setInterval(nextTestimonialSlide, 5000);
  }
  function stopTestimonialAuto() {
    if (testimonialTimer.current) clearInterval(testimonialTimer.current);
  }

  // Testimonial hover events
  const testimonialSliderRef = useRef(null);
  useEffect(() => {
    const slider = testimonialSliderRef.current;
    if (!slider) return;
    slider.addEventListener('mouseenter', stopTestimonialAuto);
    slider.addEventListener('mouseleave', startTestimonialAuto);
    return () => {
      slider.removeEventListener('mouseenter', stopTestimonialAuto);
      slider.removeEventListener('mouseleave', startTestimonialAuto);
    };
  }, []);
  return (
    <div>
      {/* Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerWrapper} ref={bannerWrapperRef}>
          {bannerImages.map((src, idx) => (
            <img
              key={src}
              className={`${styles.bannerImage} ${idx === bannerIdx ? styles.active : ''} ${
                idx === (bannerIdx - 1 + bannerImages.length) % bannerImages.length ? styles.prev : ''
              }`}
              src={src}
              alt={`Banner ${idx + 1}`}
              style={{ pointerEvents: idx === bannerIdx ? 'auto' : 'none' }}
            />
          ))}
          <button
            className={`${styles.bannerBtn} ${styles.bannerBtnLeft}`}
            aria-label="Previous Slide"
            onClick={() => {
              prevBannerSlide();
              stopBannerAuto();
            }}
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button
            className={`${styles.bannerBtn} ${styles.bannerBtnRight}`}
            aria-label="Next Slide"
            onClick={() => {
              nextBannerSlide();
              stopBannerAuto();
            }}
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <div className={styles.bannerIndicators}>
            {bannerImages.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.indicator} ${idx === bannerIdx ? styles.active : ''}`}
                onClick={() => {
                  showBannerSlide(idx);
                  stopBannerAuto();
                }}
              ></span>
            ))}
          </div>
        </div>
      </section>
      
     <div className={styles.ppmvnIntro}>
  <h2>GIỚI THIỆU VỀ PPM.VN</h2>
  <p>
    PPM.VN là công ty chuyên cung cấp dịch vụ quản lý, tư vấn quản lý bất động sản toàn diện với mục tiêu mang lại giá trị cao nhất cho khách hàng sử dụng và vận hành các dự án lớn trên cả nước. Chúng tôi cam kết mang lại cho khách hàng sự hài lòng với chất lượng dịch vụ hàng đầu, chuyên nghiệp và minh bạch. Đội ngũ của chúng tôi có kinh nghiệm phong phú trong lĩnh vực tư vấn giải pháp, cung cấp các dịch vụ cao cấp và có sự kết nối mạnh mẽ với các đối tác trong nước và quốc tế.
  </p>
  <p><strong>Tên tiếng Việt:</strong> Công ty TNHH Quản lý tài sản Premier Việt Nam (PPM.VN)</p>
  <p><strong>Tên tiếng Anh:</strong> Premier Property Management Vietnam Company Limited</p>
  <p><strong>Trụ sở chính:</strong> 110 Cao Thắng, Phường 4, Quận 3, Tp. Hồ Chí Minh, Việt Nam</p>
  <p><strong>Hotline:</strong> 0898 514 239</p>
  <p><strong>Email:</strong> vanhanh@ppmvn.vn</p> {/* Sửa lỗi email */}
  <p><strong>Số tài khoản:</strong> 189 100000 386 533</p>
  <a
    href="https://ppmvn.vn/wp-content/uploads/2023/04/PROFILE-2023.04.12-da-nen.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className={styles.brochureBtn}
  >
    TẢI BROCHURE
  </a>
</div>
      {/* Features */}
      <div className={styles.features}>
        {features.map((f, idx) => (
          <div className={styles.feature} key={idx}>
            <img src={f.img} alt={`${f.title} Icon`} />
            <h2>{f.title}</h2>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
      <div className={styles.Aboutcty}>
<div className={styles.giaTriCotLoi}>
  <img src="/assets/images/hand2.webp" alt="Handshake representing core values" className={styles.giaTriCotLoiImage} />
  <div className={styles.giaTriCotLoiContent}>
    <h2>GIÁ TRỊ CỐT LÕI</h2>
    <p>
     Chúng tôi là những chiến binh với nhiệt huyết và khát vọng dẫn đầu luôn sẵn sàng đón nhận thử thách, linh hoạt thích nghi với mọi hoàn cảnh, tận tâm trách nhiệm trong công việc và chân thành tử tế trong các mối quan hệ.
    </p>
    <ul>
      <li>Khát vọng dẫn đầu</li>
      <li>Linh hoạt thích nghi</li>
      <li>Tân tâm trách nhiệm</li>
      <li>Chân thành và uy tín</li>
    </ul>
  </div>
</div>
<div className={styles.nguyenTacHoatDong}>
  <div className={styles.nguyenTacHoatDongContent}>
    <h2>NGUYÊN TẮC HOẠT ĐỘNG</h2>
    <p>
      Chúng tôi tuân thủ 6 Quy chế cốt lõi quan trọng trong hoạt động:
    </p>
    <ul>
      <li>Lấy uy tín làm nền tảng cốt lõi trong hoạt động</li>
      <li>Cung cấp dịch vụ với chất lượng cao nhất</li>
      <li>Mang đến môi trường làm việc chuyên nghiệp, minh bạch</li>
      <li>Giai quyết vấn đề nhanh chóng và hiệu quả</li>
      <li>Nâng cao năng lực hợp tác, cùng phát triển</li>
      <li>Kiểm soát chặt chẽ chi phí hoạt động và hiệu quả</li>
    </ul>
  </div>
  <img src="/assets/images/hand1.webp" alt="Handshake representing operating principles" className={styles.nguyenTacHoatDongImage} />
</div>
    </div>
<div className={styles.statsSection}>
  <h2 className={styles.statsTitle}>NHỮNG CON SỐ ẤN TƯỢNG</h2>
  <div className={styles.statsContainer}>
    <div className={styles.statItem}>
      <div className={styles.statNumber}>3+</div>
      <div className={styles.statDescription}>Năm hoạt động</div>
    </div>
    <div className={styles.statItem}>
      <div className={styles.statNumber}>200+</div>
      <div className={styles.statDescription}>Số khách hàng đã phục vụ</div>
    </div>
    <div className={styles.statItem}>
      <div className={styles.statNumber}>200+</div>
      <div className={styles.statDescription}>Số nhân viên công ty</div>
    </div>
    <div className={styles.statItem}>
      <div className={styles.statNumber}>12+</div>
      <div className={styles.statDescription}>Số đối tác tin tưởng</div>
    </div>
  </div>
</div>

  <div className={styles.sodocongty}>
  <h2 className={styles.maptitle}>Sơ đồ công ty</h2>
  <img src="/assets/images/PPMvn-SO-DO-TO-CHUC-Nen-trang.png" alt="Company Structure" className={styles.companyStructureImage} loading="lazy" />
</div>
      {/* Brand */}
      <div className={styles.brand}>
        <h2>Đối Tác</h2>
        <div className={styles.brandLogos}>
          {brandLogos.map((logo, idx) => (
            <div className={styles.brandItem} key={idx}>
              <img src={`/assets/images/${logo}`} alt={logo.replace('.svg', '') + ' Logo'} />
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default About;