import React, { useEffect, useRef, useState } from 'react';
import './News.css';

const bannerImages = [
  '/assets/images/BANNER5.jpg',
  '/assets/images/BANNER6.jpg',
  '/assets/images/BANNER7.jpg',
];

const latestPost = {
  image: '/assets/images/tintuc1.jpg',
  title: 'HAPPY HOUR - FASHION DAY: INSIDE WOW! THAM GIA WORKSHOP DRAW YOUR TEE & LỄ TRAO GIẢI STYLE UP WITH ACFC',
  date: '09/08/2024',
  excerpt: 'Tuần vừa qua, đại gia đình ACFC & VFBS đã cùng nhau tạo nên một Happy Hour - Fashion Day với chủ đề INSIDE WOW, chương trình đã thu hút đông đảo tín đồ thời trang nhà ACFC & VFBS nhiệt tình tham gia, để lại thật nhiều ấn tượng và cảm xúc!'
};

const postsGrid = [
  {
    image: '/assets/images/tintuc2.png',
    title: 'CÙNG SINH VIÊN HUTECH THAM GIA ACFC COMPANY TOUR',
    date: '07/08/2024',
    excerpt: 'Lần đầu tiên, ACFC tổ chức chuyến tham quan thực tế Company Tour đầy ý nghĩa dành cho các bạn sinh viên chuyên ngành Kinh doanh Quốc tế - trường Đại học Công nghệ TPHCM (HUTECH) vào ngày 30/7/2024.'
  },
  {
    image: '/assets/images/tintuc3.jpg',
    title: 'ACFC ĐỒNG HÀNH CÙNG SINH VIÊN THỜI TRANG TẠI SR FASHION CAREER DAY 2024',
    date: '16/07/2024',
    excerpt: 'Tại sự kiện SR Fashion Career Day 2024 vào ngày 13/7/2024, ACFC rất vinh dự khi được mời đến để giao lưu và kết nối với các bạn sinh viên có niềm đam mê với thời trang. Với chủ đề "Những hướng đi trong ngành thời trang bán lẻ", đại diện Nhân sự của ACFC đã chia sẻ về công ty và các cơ hội nghề nghiệp trong tại ACFC nói riêng và trong ngành thời trang bán lẻ hiện nay.'
  },
  {
    image: '/assets/images/tintuc4.png',
    title: 'STYLE UP WITH ACFC: CUỘC THI ẢNH THỜI TRANG CỦA NHÀ ACFC VÀ VFBS',
    date: '02/07/2024',
    excerpt: 'Tháng 6 vừa qua, ACFC đã mang đến một sân chơi thú vị dành cho các tín đồ thời trang: Cuộc thi ảnh thời trang "Style Up With ACFC" độc đáo, đậm chất thời trang dành cho các ACFC-ers và VFBS-ers.'
  },
  {
    image: '/assets/images/tintuc8.jpg',
    title: 'ACFC RA MẮT BỘ SƯU TẬP THỜI TRANG MỚI',
    date: '25/06/2024',
    excerpt: 'ACFC tự hào giới thiệu bộ sưu tập thời trang mới, kết hợp xu hướng hiện đại và phong cách độc đáo, mang đến trải nghiệm mới mẻ cho khách hàng.'
  },
  {
    image: '/assets/images/tintuc9.jpg',
    title: 'HỘI THẢO THỜI TRANG BỀN VỮNG CÙNG ACFC',
    date: '20/06/2024',
    excerpt: 'ACFC tổ chức hội thảo về thời trang bền vững, chia sẻ các sáng kiến bảo vệ môi trường và trách nhiệm xã hội trong ngành thời trang.'
  },
  // ...Thêm các post khác nếu muốn
];

const featuredPost = {
  image: '/assets/images/tintinnoibat.png',
  title: 'ACFC CHINH PHỤC THỊ TRƯỜNG THỜI TRANG VIỆT NAM',
  date: '01/06/2024',
  excerpt: 'ACFC không ngừng đổi mới và phát triển để mang đến những trải nghiệm thời trang đẳng cấp cho khách hàng Việt Nam.'
};

const featuredGrid = [
  {
    image: '/assets/images/tintuc5.jpg',
    title: 'HÀNH TRÌNH PHÁT TRIỂN BỀN VỮNG CỦA ACFC',
    date: '15/05/2024',
    excerpt: 'ACFC cam kết phát triển bền vững, chú trọng đến môi trường và cộng đồng trong mọi hoạt động kinh doanh.'
  },
  {
    image: '/assets/images/tintuc6.png',
    title: 'ACFC ĐỒNG HÀNH CÙNG CỘNG ĐỒNG',
    date: '10/04/2024',
    excerpt: 'Nhiều hoạt động thiện nguyện và hỗ trợ cộng đồng được ACFC tổ chức thường xuyên, lan tỏa giá trị tích cực.'
  },
  {
    image: '/assets/images/tintuc10.jpg',
    title: 'ACFC HỖ TRỢ SINH VIÊN KHỞI NGHIỆP',
    date: '05/04/2024',
    excerpt: 'ACFC tổ chức chương trình hỗ trợ sinh viên khởi nghiệp, cung cấp cơ hội học hỏi và phát triển kỹ năng trong ngành thời trang.'
  }
];

function getInitialShowCount() {
  if (window.innerWidth <= 767) return 3;
  return 6;
}

const News = () => {
  // Banner carousel state
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  // Posts grid state
  const [showCount, setShowCount] = useState(getInitialShowCount());
  const [showCountFeatured, setShowCountFeatured] = useState(getInitialShowCount());

  // Banner auto slide
  useEffect(() => {
    startAuto();
    return stopAuto;
    // eslint-disable-next-line
  }, [current]);

  // Responsive posts grid
  useEffect(() => {
    const handleResize = () => {
      setShowCount(getInitialShowCount());
      setShowCountFeatured(getInitialShowCount());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function showSlide(index) {
    setCurrent(index);
  }

  function nextSlide() {
    setCurrent((prev) => (prev + 1) % bannerImages.length);
  }

  function prevSlide() {
    setCurrent((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  }

  function startAuto() {
    stopAuto();
    timerRef.current = setInterval(nextSlide, 3000);
  }

  function stopAuto() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  // Banner hover pause
  const bannerWrapperRef = useRef(null);
  useEffect(() => {
    const wrapper = bannerWrapperRef.current;
    if (!wrapper) return;
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
    return () => {
      wrapper.removeEventListener('mouseenter', stopAuto);
      wrapper.removeEventListener('mouseleave', startAuto);
    };
    // eslint-disable-next-line
  }, []);

  // Posts grid "Xem thêm"
  const handleViewMore = () => setShowCount(postsGrid.length);
  const handleViewMoreFeatured = () => setShowCountFeatured(featuredGrid.length);

  return (
    <>
      <section className="banner">
        <div className="banner-wrapper" ref={bannerWrapperRef}>
          {bannerImages.map((src, idx) => (
            <img
              key={src}
              className={
                'banner-image' +
                (idx === current ? ' active' : '') +
                (idx === (current - 1 + bannerImages.length) % bannerImages.length ? ' prev' : '')
              }
              src={src}
              alt="Banner"
              style={{ pointerEvents: idx === current ? 'auto' : 'none' }}
            />
          ))}
          <button className="banner-btn banner-btn-left" onClick={() => { prevSlide(); stopAuto(); }}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button className="banner-btn banner-btn-right" onClick={() => { nextSlide(); stopAuto(); }}>
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <div className="banner-indicators">
            {bannerImages.map((_, idx) => (
              <span
                key={idx}
                className={'indicator' + (idx === current ? ' active' : '')}
                onClick={() => { showSlide(idx); stopAuto(); }}
              ></span>
            ))}
          </div>
        </div>
      </section>
      <div className="container-lastest">
        <div className="latest-post">
          <h2 className="latest-post-title">Bài viết mới nhất</h2>
          <div className="post-item">
            <div className="post-image">
              <img src={latestPost.image} alt={latestPost.title} />
            </div>
            <div className="post-content">
              <a href="#" className="post-title">{latestPost.title}</a>
              <div className="post-date">Ngày đăng {latestPost.date}</div>
              <div className="post-excerpt">{latestPost.excerpt}</div>
            </div>
          </div>
        </div>
        <div className="posts-grid">
          {postsGrid.map((post, idx) => (
            <div
              className={'grid-item' + (idx >= showCount ? ' hidden' : '')}
              key={idx}
              style={{ display: idx >= showCount ? 'none' : '' }}
            >
              <div className="grid-image">
                <img src={post.image} alt={post.title} />
              </div>
              <a href="#" className="grid-title">{post.title}</a>
              <div className="grid-date">Ngày đăng {post.date}</div>
              <div className="grid-excerpt">{post.excerpt}</div>
            </div>
          ))}
          {showCount < postsGrid.length && (
            <button className="view-more-btn" onClick={handleViewMore}>Xem thêm</button>
          )}
        </div>
      </div>
      <hr />
      <div className="container-featured">
        <div className="featured-post">
          <h2 className="featured-post-title">Bài viết nổi bật</h2>
          <div className="post-item">
            <div className="post-image">
              <img src={featuredPost.image} alt={featuredPost.title} />
            </div>
            <div className="post-content">
              <a href="#" className="post-title">{featuredPost.title}</a>
              <div className="post-date">Ngày đăng {featuredPost.date}</div>
              <div className="post-excerpt">{featuredPost.excerpt}</div>
            </div>
          </div>
        </div>
        <div className="posts-grid">
          {featuredGrid.map((post, idx) => (
            <div
              className={'grid-item' + (idx >= showCountFeatured ? ' hidden' : '')}
              key={idx}
              style={{ display: idx >= showCountFeatured ? 'none' : '' }}
            >
              <div className="grid-image">
                <img src={post.image} alt={post.title} />
              </div>
              <a href="#" className="grid-title">{post.title}</a>
              <div className="grid-date">Ngày đăng {post.date}</div>
              <div className="grid-excerpt">{post.excerpt}</div>
            </div>
          ))}
          {showCountFeatured < featuredGrid.length && (
            <button className="view-more-btn" onClick={handleViewMoreFeatured}>Xem thêm</button>
          )}
        </div>
      </div>
    </>
  );
};

export default News;