import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './News.css';

const bannerImages = [
  '/assets/images/BANNER5.jpg',
  '/assets/images/BANNER6.jpg',
  '/assets/images/BANNER7.jpg',
];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Hàm chuẩn hóa link ảnh từ API
function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://api-tuyendung-cty.onrender.com/${url.replace(/^\/+/, '')}`;
}

function getInitialShowCount() {
  if (window.innerWidth <= 767) return 3;
  return 6;
}

const News = () => {
  // Banner carousel state
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  // News API state
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [showCount, setShowCount] = useState(getInitialShowCount());

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
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch news from API
  useEffect(() => {
    setLoading(true);
    fetch('https://api-tuyendung-cty.onrender.com/api/new')
      .then(res => res.json())
      .then(data => {
        setNewsData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
  }, []);

  const handleViewMore = () => setShowCount(newsData.length);

  // Lấy bài viết mới nhất và nổi bật (ví dụ: bài đầu và bài thứ 2)
  const latestPost = newsData[0];
  const featuredPost = newsData[1];

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
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Đang tải tin tức...
        </div>
      ) : (
        <>
          <div className="container-lastest">
            <div className="latest-post">
              <h2 className="latest-post-title">Bài viết mới nhất</h2>
              {latestPost && (
                <div className="post-item">
                  <div className="post-image">
                    <img src={getImageUrl(latestPost.thumbnailUrl)} alt={latestPost.title} />
                  </div>
                  <div className="post-content">
                    <Link to={`/news/${latestPost.id}`} className="post-title">{latestPost.title}</Link>
                    <div className="post-date">Ngày đăng {formatDate(latestPost.publishedAt)}</div>
                    <div className="post-excerpt">
                      {latestPost.contentBlocks && latestPost.contentBlocks[0] && latestPost.contentBlocks[0].content
                        ? latestPost.contentBlocks[0].content.slice(0, 120) + '...'
                        : ''}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="posts-grid">
              {newsData.slice(1).map((post, idx) => (
                <div
                  className={'grid-item' + (idx >= showCount - 1 ? ' hidden' : '')}
                  key={post._id || idx}
                  style={{ display: idx >= showCount - 1 ? 'none' : '' }}
                >
                  <div className="grid-image">
                    <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} />
                  </div>
                  <Link to={`/news/${post.id}`} className="grid-title">{post.title}</Link>
                  <div className="grid-date">Ngày đăng {formatDate(post.publishedAt)}</div>
                  <div className="grid-excerpt">
                    {post.contentBlocks && post.contentBlocks[0] && post.contentBlocks[0].content
                      ? post.contentBlocks[0].content.slice(0, 80) + '...'
                      : ''}
                  </div>
                </div>
              ))}
              {showCount < newsData.length && (
                <button className="view-more-btn" onClick={handleViewMore}>Xem thêm</button>
              )}
            </div>
          </div>
          <hr />
          <div className="container-featured">
            <div className="featured-post">
              <h2 className="featured-post-title">Bài viết nổi bật</h2>
              {featuredPost && (
                <div className="post-item">
                  <div className="post-image">
                    <img src={getImageUrl(featuredPost.thumbnailUrl)} alt={featuredPost.title} />
                  </div>
                  <div className="post-content">
                    <Link to={`/news/${featuredPost.id}`} className="post-title">{featuredPost.title}</Link>
                    <div className="post-date">Ngày đăng {formatDate(featuredPost.publishedAt)}</div>
                    <div className="post-excerpt">
                      {featuredPost.contentBlocks && featuredPost.contentBlocks[0] && featuredPost.contentBlocks[0].content
                        ? featuredPost.contentBlocks[0].content.slice(0, 120) + '...'
                        : ''}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="posts-grid">
              {newsData.slice(2, 8).map((post, idx) => (
                <div className="grid-item" key={post._id || idx}>
                  <div className="grid-image">
                    <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} />
                  </div>
                  <Link to={`/news/${post.id}`} className="grid-title">{post.title}</Link>
                  <div className="grid-date">Ngày đăng {formatDate(post.publishedAt)}</div>
                  <div className="grid-excerpt">zz
                    {post.contentBlocks && post.contentBlocks[0] && post.contentBlocks[0].content
                      ? post.contentBlocks[0].content.slice(0, 80) + '...'
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default News;