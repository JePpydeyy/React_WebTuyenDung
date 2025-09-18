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

  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const valueRef = useRef(null);

  const handleScroll = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  const [activeTab, setActiveTab] = useState(null);

  const handleClick = (ref, index) => {
    setActiveTab(index); // Lưu tab đang active
    ref.current?.scrollIntoView({ behavior: "smooth" });
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

      {/* tầm nhìn sứ mệnh giá trị cốt lõi */}
      <div className={styles.ss3}>
        <h2 className={styles.sectionTitle3}>TẦM NHÌN - SỨ MỆNH - GIÁ TRỊ CỐT LÕI</h2>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutTabsNav}>
              <div
                className={`${styles.tabButton} ${activeTab === 0 ? styles.active : ""}`}
                onClick={() => handleClick(visionRef, 0)}
              >
                <div className={styles.outerCircle}>
                  <div className={`${styles.circle} ${activeTab === 0 ? styles.animate : ''}`}></div>
                </div>
                <span className={styles.name}>Tầm nhìn</span>
              </div>

               <div
                  className={`${styles.tabButton} ${activeTab === 1 ? styles.active : ""}`}
                  onClick={() => handleClick(missionRef, 1)}
                >
                <div className={styles.outerCircle}>
                  <div className={`${styles.circle} ${activeTab === 1 ? styles.animate : ''}`}></div>
                </div>
                <span className={styles.name}>Sứ mệnh</span>
              </div>

              <div
                className={`${styles.tabButton} ${activeTab === 2 ? styles.active : ""}`}
                onClick={() => handleClick(valueRef, 2)}
              >
                <div className={styles.outerCircle}>
                  <div className={`${styles.circle} ${activeTab === 2 ? styles.animate : ''}`}></div>
                </div>
                <span className={styles.name}>Giá trị cốt lõi</span>
              </div>
            </div>


          <div className={styles.aboutContent}>
            <div className={styles.contentItem} ref={visionRef}>
              <div className={styles.imageContent}>
                <img className={styles.img} src='/assets/images/tamnhin.jpg' />
              </div>
              <div className={styles.textContent}>
                <h3 className={styles.h3}>Tầm nhìn</h3>
                <p>Trở thành đơn vị đào tạo và nghiên cứu khoa học hàng đầu trong lĩnh vực Ngân hàng,Tài
                  chính, Công nghệ và các chuyên môn ưu tiên của phát triển kinh tế quan trọng tại khu vực. Là
                  nơi hồi tụ tinh hoa trí thức, đào tạo sâu những giá trị thực nghiệm mang tính thời đại, ứng dụng
                  công nghệ cao, trang bị sẵn sàng những kỹ năng kiến thức để cán bộ nhân viên học viên sẵn
                  sàng với thời cuộc, vững vàng tiến tới tương lai, hiện thực hóa những giấc mơ cao đẹp.
                </p>
              </div>
            </div>
             <div className={styles.contentItem} ref={missionRef}>
              <div className={styles.imageContent}>
                <img className={styles.img} src='/assets/images/tamnhin.jpg' />
              </div>
              <div className={styles.textContent}>
                <h3 className={styles.h3}>Sứ mệnh</h3>
                <p> <strong>1. Với học viên và cộng đồng:</strong>  Xây dựng môi trường học tập chuyên nghiệp, đa chiều và sáng
                    tạo, đào tạo nguồn nhân lực chất lượng cao cho thị trường lao động có trình độ chuyên môn
                    sâu về ngân hàng, tài chính và thích ứng linh hoạt trong kỷ nguyên số. <br></br>
                    <strong>2. Với ngành giáo dục và công nghệ</strong>: Liên kết tri thức Việt Nam với thế giới thông qua việc
                    thúc đẩy nghiên cứu ứng dụng và chuyển giao công nghệ đột phá, góp phần nâng cao hiệu quả
                    hoạt động của ngân hàng, các tổ chức tài chính và các doanh nghiệp tăng cường tính bảo mật
                    và tinh cậy.<br></br>
                    <strong>3. Với đối tác:</strong> Xây dựng và duy trì quan hệ hợp tác minh bạch, bền vững, quy tụ trí tuệ và
                    nguồn lực quốc tế nhằm tạo giá trị gia tăng và phát triển toàn diện.
                </p>
              </div>
            </div>
             <div className={styles.contentItem} ref={valueRef}>
              <div className={styles.imageContent}>
                <img className={styles.img} src='/assets/images/tamnhin.jpg' />
              </div>
              <div className={styles.textContent}>
                <h3 className={styles.h3}>Giá trị cốt lõi</h3>
                <p>Trở thành đơn vị đào tạo và nghiên cứu khoa học hàng đầu trong lĩnh vực Ngân hàng,Tài
                  chính, Công nghệ và các chuyên môn ưu tiên của phát triển kinh tế quan trọng tại khu vực. Là
                  nơi hồi tụ tinh hoa trí thức, đào tạo sâu những giá trị thực nghiệm mang tính thời đại, ứng dụng
                  công nghệ cao, trang bị sẵn sàng những kỹ năng kiến thức để cán bộ nhân viên học viên sẵn
                  sàng với thời cuộc, vững vàng tiến tới tương lai, hiện thực hóa những giấc mơ cao đẹp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      <div className={styles.bod}>
        <h2 className={styles.sectionTitle3}>LỜI CHIA SẺ CỦA BOD</h2>
        <div className={styles.listBod}>
          <div className={styles.itemBod}>
            <div className={styles.imageBod}>
              <img className={styles.img} src='/assets/images/giamdoc.png'/>
            </div>
            <div className={styles.nameBod}>
              <h3 className={styles.h3}>ông Trần Công Diệu</h3>
            </div>
            <div className={styles.desBod}>
              <p className={styles.p}>PPM.VN tự hào tiên phong trong quản lý và tư vấn bất động sản, cam kết mang lại giá trị tối ưu với dịch vụ chuyên nghiệp, minh bạch. Đội ngũ giàu kinh nghiệm cùng mạng lưới đối tác trong và ngoài nước là nền tảng để chúng tôi đảm bảo sự hài lòng cho khách hàng, vận hành các dự án lớn hiệu quả và bền vững</p>
            </div>
          </div>
          {/* <div className={styles.itemBod}>
            <div className={styles.imageBod}>
              <img className={styles.img} src='/assets/images/giamdoc.png'/>
            </div>
            <div className={styles.nameBod}>
              <h3 className={styles.h3}>ông Trần Công Diệu</h3>
            </div>
            <div className={styles.desBod}>
              <p className={styles.p}>PPM.VN tự hào tiên phong trong quản lý và tư vấn bất động sản, cam kết mang lại giá trị tối ưu với dịch vụ chuyên nghiệp, minh bạch. Đội ngũ giàu kinh nghiệm cùng mạng lưới đối tác trong và ngoài nước là nền tảng để chúng tôi đảm bảo sự hài lòng cho khách hàng, vận hành các dự án lớn hiệu quả và bền vững</p>
            </div>
          </div>
          <div className={styles.itemBod}>
            <div className={styles.imageBod}>
              <img className={styles.img} src='/assets/images/giamdoc.png'/>
            </div>
            <div className={styles.nameBod}>
              <h3 className={styles.h3}>ông Trần Công Diệu</h3>
            </div>
            <div className={styles.desBod}>
              <p className={styles.p}>PPM.VN tự hào tiên phong trong quản lý và tư vấn bất động sản, cam kết mang lại giá trị tối ưu với dịch vụ chuyên nghiệp, minh bạch. Đội ngũ giàu kinh nghiệm cùng mạng lưới đối tác trong và ngoài nước là nền tảng để chúng tôi đảm bảo sự hài lòng cho khách hàng, vận hành các dự án lớn hiệu quả và bền vững</p>
            </div>
          </div> */}
        </div>
      </div>
      <div className={styles.project}>
        <h2 className={styles.sectionTitle4}>DỰ ÁN NỔI BẬT</h2>
        <div className={styles.description}>
          <p className={styles.p}>PPMVN tự hào mang đến những dự án chung cư và tòa nhà văn phòng hiện đại, đẳng cấp, đáp ứng nhu cầu sống và làm việc thời thượng. Với thiết kế tinh tế, vị trí chiến lược và tiện ích vượt trội, mỗi dự án là sự kết hợp hoàn hảo giữa không gian sống tiện nghi và môi trường làm việc chuyên nghiệp. PPMVN cam kết kiến tạo giá trị bền vững, nâng tầm chất lượng cuộc sống và thành công cho khách hàng</p>
        </div>
        <div className={styles.listProject}>
          <div className={styles.itemProject}>
            <div className={styles.imageProject}>
              <img className={styles.img} src='/assets/images/pr.png'/>
              <div className={styles.nameProject}>
                <h3 className={styles.h3}>Dự án nổi bật</h3>
              </div>
            </div>
          </div>
          <div className={styles.itemProject}>
            <div className={styles.imageProject}>
              <img className={styles.img} src='/assets/images/pr.png'/>
              <div className={styles.nameProject}>
                <h3 className={styles.h3}>Dự án nổi bật</h3>
                <button></button>
              </div>
            </div>
          </div>
          <div className={styles.itemProject}>
            <div className={styles.imageProject}>
              <img className={styles.img} src='/assets/images/pr.png'/>
              <div className={styles.nameProject}>
                <h3 className={styles.h3}>Dự án nổi bật</h3>
                <button></button>
              </div>
            </div>
          </div>
          <div className={styles.itemProject}>
            <div className={styles.imageProject}>
              <img className={styles.img} src='/assets/images/pr.png'/>
              <div className={styles.nameProject}>
                <h3 className={styles.h3}>Dự án nổi bật</h3>
                <button></button>
              </div>
            </div>
          </div>
          <div className={styles.itemProject}>
            <div className={styles.imageProject}>
              <img className={styles.img} src='/assets/images/pr.png'/>
              <div className={styles.nameProject}>
                <h3 className={styles.h3}>Dự án nổi bật</h3>
                <button></button>
              </div>
            </div>
          </div>
          <div className={styles.itemProject}>
            <div className={styles.imageProject}>
              <img className={styles.img} src='/assets/images/pr.png'/>
              <div className={styles.nameProject}>
                <h3 className={styles.h3}>Dự án nổi bật</h3>
                <button></button>
              </div>
            </div>
          </div>
          <div className={styles.itemProject}>
            <div className={styles.imageProject}>
              <img className={styles.img} src='/assets/images/pr.png'/>
              <div className={styles.nameProject}>
                <h3 className={styles.h3}>Dự án nổi bật</h3>
                <button></button>
              </div>
            </div>
          </div>
          <div className={styles.itemProject}>
            <div className={styles.imageProject}>
              <img className={styles.img} src='/assets/images/pr.png'/>
              <div className={styles.nameProject}>
                <h3 className={styles.h3}>Dự án nổi bật</h3>
                <button></button>
              </div>
            </div>
          </div>
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