import React, { useEffect, useRef, useState } from 'react';
import styles from './About.module.css'; // Import CSS Module

const bannerImages = [
  '/assets/images/BANNER2.jpg',
  '/assets/images/BANNER1.jpg'
];

const features = [
  { img: '/assets/images/acfc-a.png', title: 'Authentic', desc: '100% sản phẩm chính hãng' },
  { img: '/assets/images/acfc-c.png', title: 'Convenient', desc: 'Mua sắm thời trang hàng hiệu chỉ trong 1 cú click' },
  { img: '/assets/images/acfc-f.png', title: 'Family', desc: 'Đa dạng hóa sản phẩm cho mọi thành viên trong gia đình' },
  { img: '/assets/images/acfc-c.png', title: 'Catch the trends', desc: 'Bắt nhịp những xu hướng thời trang mới nhất thế giới' }
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
  'ax.svg', 'banana_republic.svg', 'ck_1.svg', 'cottonon_hover.svg', 'dockers.svg', 'fcuk_hover.svg',
  'gap.svg', 'guess.svg', 'karl.svg', 'levis_hover.svg', 'mango.svg', 'mothercare.svg', 'nike.svg',
  'old_navy.svg', 'ovs.svg', 'owndays.svg', 'parfois.svg', 'polo.svg', 'sisley.svg', 'sunnies_face.svg',
  'sunnies_studios.svg', 'swarovski.svg', 'tommy_hilfiger.svg', 'typo.svg'
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
    wrapper.addEventListener('touchmove', handleDragMove, { passive: false });
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

      {/* About */}
      <div className={styles.about}>
        <h1>ACFC Việt Nam</h1>
        <p>
          ACFC - Thành viên thuộc tập đoàn Imex Pan Pacific Group (IPPG), là nhà phân phối và quản lý các thương hiệu thời trang quốc tế hàng đầu Việt Nam. Với hệ thống hơn 300 cửa hàng tại các trung tâm thành phố lớn trên toàn quốc, ACFC mang sứ mệnh đưa người Việt đến gần hơn với kinh đô thời trang hàng hiệu. Đến với ACFC, chúng tôi mang đến các dịch vụ mua sắm hàng hiệu chính hãng, đẳng cấp; kèm theo đó là các đặc quyền ưu đãi dành cho khách hàng thành viên, khách hàng VIP với sự quy tụ của hơn 25 thương hiệu thời trang quốc tế. ACFC định hướng mang đến làn gió mới cho những người yêu thời trang, thích cái đẹp và muốn lan tỏa đam mê thời trang đến với cộng đồng.
        </p>
        <p>
          Các thương hiệu ACFC phân phối độc quyền tại thị trường Việt Nam như NIKE, Mango, Levi's, Gap, Old Navy, Calvin Klein, Tommy Hilfiger, Mothercare, OVS, Banana Republic, Owndays, French Connection, Parfois, Cotton:on, Typo, Polo Ralph Lauren, Dockers, Sunnies Studios, Sunnies Face, Swarovski, Guess, Sisley, United Colors Of Benetton, ...
        </p>
        <img src="/assets/images/about.png" alt="About ACFC Image" loading="lazy" />
      </div>

      {/* Stats */}
      <div className={styles.statsSection}>
        <h2 className={styles.statsTitle}>NHỮNG CON SỐ ẤN TƯỢNG</h2>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>25+</div>
            <div className={styles.statDescription}>THƯƠNG HIỆU QUỐC TẾ<br />CHUYÊN PHÂN PHỐI ĐỘC QUYỀN</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>300+</div>
            <div className={styles.statDescription}>CỬA HÀNG<br />THỜI TRANG - MỸ PHẨM</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>3700+</div>
            <div className={styles.statDescription}>NHÂN VIÊN</div>
          </div>
        </div>
      </div>

      {/* Route */}
      <div className={styles.route}>
        <img src="/assets/images/lo_trinh_phat_trien_2024.jpg" alt="Development Roadmap 2024" loading="lazy" />
      </div>

      {/* Brand */}
      <div className={styles.brand}>
        <h2>Thương hiệu phân phối</h2>
        <div className={styles.brandLogos}>
          {brandLogos.map((logo, idx) => (
            <div className={styles.brandItem} key={idx}>
              <img src={`/assets/images/${logo}`} alt={logo.replace('.svg', '') + ' Logo'} />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className={styles.testimonialSection}>
        <div className={styles.testimonialSlider} ref={testimonialSliderRef}>
          {testimonials.map((item, idx) => (
            <div
              className={`${styles.testimonialSlide} ${idx === testimonialIdx ? styles.active : ''} ${
                idx === (testimonialIdx - 1 + testimonials.length) % testimonials.length ? styles.prev : ''
              }`}
              key={idx}
            >
              <div className={styles.testimonialImage}>
                <img src={item.img} alt={item.author} loading="lazy" />
              </div>
              <div className={styles.testimonialContent}>
                <div className={styles.testimonialQuote}>{`"${item.quote}"`}</div>
                <div className={styles.testimonialAuthor}>{item.author}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          className={`${styles.bannerBtn} ${styles.testimonialBtnLeft}`}
          aria-label="Previous Testimonial"
          onClick={() => {
            prevTestimonialSlide();
            stopTestimonialAuto();
          }}
        >
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <button
          className={`${styles.bannerBtn} ${styles.testimonialBtnRight}`}
          aria-label="Next Testimonial"
          onClick={() => {
            nextTestimonialSlide();
            stopTestimonialAuto();
          }}
        >
          <i className="fa-solid fa-angle-right"></i>
        </button>
        <div className={styles.bannerIndicators}>
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.indicator} ${idx === testimonialIdx ? styles.active : ''}`}
              onClick={() => {
                showTestimonialSlide(idx);
                stopTestimonialAuto();
              }}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;