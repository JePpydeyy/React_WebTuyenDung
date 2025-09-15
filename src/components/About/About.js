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
      <div className={styles.box}>

      </div>
      <div className={styles.sectionAbout}>
        <h2 className={styles.sectionTitle}>GIỚI THIỆU VỀ CHÚNG TÔI</h2>
        <div className={styles.aboutText}>
          <p>PPMVN ra đời nhằm đáp ứng nhu cầu cấp thiết của thị trường về một dịch vụ quản lý bất động sản chuyên nghiệp, tiên phong ứng dụng công nghệ và đề cao sự minh bạch. Với khát vọng dẫn đầu, chúng tôi tập trung hiện thực hóa sứ mệnh mang đến giải pháp quản lý toàn diện, hiệu quả cho chung cư, văn phòng và căn hộ dịch vụ – kiến tạo những môi trường sống và làm việc an toàn, tiện nghi, văn minh.</p>
        </div>
      </div>

      <div className={styles.aboutList}>
        <div className={styles.aboutItem}>
          <div className={styles.imageDiv}>
            <img className={styles.img} src={`/assets/images/about01.png`}/>
          </div>
          <p className={styles.text}>
            Đội ngũ nhân sự chủ chốt được đào
            tạo tại các trường đại học danh tiếng
            trong và ngoài nước, đáp ứng tiêu
            chuẩn cao của môi trường làm việc
            hiện đại.
          </p>
        </div>
        <div className={styles.aboutItem}>
          <div className={styles.imageDiv}>
            <img className={styles.img} src={`/assets/images/about01.png`}/>
          </div>
          <p className={styles.text}>
            Đội ngũ nhân sự chủ chốt được đào
            tạo tại các trường đại học danh tiếng
            trong và ngoài nước, đáp ứng tiêu
            chuẩn cao của môi trường làm việc
            hiện đại.
          </p>
        </div>
        <div className={styles.aboutItem}>
          <div className={styles.imageDiv}>
            <img className={styles.img} src={`/assets/images/about01.png`}/>
          </div>
          <p className={styles.text}>
            Đội ngũ nhân sự chủ chốt được đào
            tạo tại các trường đại học danh tiếng
            trong và ngoài nước, đáp ứng tiêu
            chuẩn cao của môi trường làm việc
            hiện đại.
          </p>
        </div>
        <div className={styles.aboutItem}>
          <div className={styles.imageDiv}>
            <img className={styles.img} src={`/assets/images/about01.png`}/>
          </div>
          <p className={styles.text}>
            Đội ngũ nhân sự chủ chốt được đào
            tạo tại các trường đại học danh tiếng
            trong và ngoài nước, đáp ứng tiêu
            chuẩn cao của môi trường làm việc
            hiện đại.
          </p>
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