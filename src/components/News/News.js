import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styles from './News.module.css';

const bannerImages = [
  '/assets/images/BANNER1.jpg',
  '/assets/images/BANNER2.jpg',
];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Loại bỏ '/api' nếu có ở cuối biến môi trường để tránh lặp '/api/api'
  const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '');
  return `${baseUrl}/${url.replace(/^\/+/, '')}`;
}

function getInitialShowCount() {
  return window.innerWidth <= 767 ? 3 : 6;
}

const News = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [showCount, setShowCount] = useState(getInitialShowCount());
  const timerRef = useRef(null);
  const bannerWrapperRef = useRef(null);
  
  // Touch/Swipe states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Preload banner images
  useEffect(() => {
    bannerImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Banner auto slide
  useEffect(() => {
    const startAuto = () => {
      stopAuto();
      timerRef.current = setInterval(nextSlide, 3000);
    };
    const stopAuto = () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    startAuto();
    return stopAuto;
  }, []);

  // Banner hover pause
  useEffect(() => {
    const wrapper = bannerWrapperRef.current;
    if (!wrapper) return;
    const stopAuto = () => clearInterval(timerRef.current);
    const startAuto = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(nextSlide, 3000);
    };
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
    return () => {
      wrapper.removeEventListener('mouseenter', stopAuto);
      wrapper.removeEventListener('mouseleave', startAuto);
    };
  }, []);

  // Responsive grid
  useEffect(() => {
    const handleResize = () => setShowCount(getInitialShowCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch news
  useEffect(() => {
    console.log('API_URL:', process.env.REACT_APP_API_URL); // Debug biến môi trường
    console.log('BASE_URL:', process.env.BASE_URL); // Debug biến môi trường
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/new`)
      .then((res) => res.json())
      .then((data) => {
        const sortedData = Array.isArray(data)
          ? data
              .filter((item) => item.status === 'show')
              .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
              .slice(0, 10)
          : [];
        setNewsData(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi fetch tin tức:', err);
        setNewsData([]);
        setLoading(false);
      });
  }, []);

  // Sắp xếp bài viết nổi bật theo views
  const featuredPosts = [...newsData].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);
  const featuredPost = featuredPosts[0];
  const featuredGridPosts = featuredPosts.slice(1, 8);

  const latestPost = newsData[0];
  const latestGridPosts = newsData.slice(1);

  const showSlide = (index) => setCurrent(index);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % bannerImages.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  const handleViewMore = () => setShowCount(newsData.length);

  // Touch/Swipe handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    // Stop auto slide when user starts touching
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      // Restart auto slide
      timerRef.current = setInterval(nextSlide, 3000);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setIsDragging(false);
    // Restart auto slide
    timerRef.current = setInterval(nextSlide, 3000);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
    // Stop auto slide when user starts dragging
    if (timerRef.current) clearInterval(timerRef.current);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      // Restart auto slide
      timerRef.current = setInterval(nextSlide, 3000);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setIsDragging(false);
    // Restart auto slide
    timerRef.current = setInterval(nextSlide, 3000);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      // Restart auto slide
      timerRef.current = setInterval(nextSlide, 3000);
    }
  };

  return (
    <>
      <section className={styles.banner}>
        <div 
          className={styles.bannerWrapper} 
          ref={bannerWrapperRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {bannerImages.map((src, idx) => (
            <img
              key={src}
              className={`${styles.bannerImage} ${idx === current ? styles.active : ''} ${
                idx === (current - 1 + bannerImages.length) % bannerImages.length ? styles.prev : ''
              }`}
              src={src}
              alt={`Banner ${idx + 1}`}
              loading="lazy"
              draggable={false}
            />
          ))}
          <button
            className={`${styles.bannerBtn} ${styles.bannerBtnLeft}`}
            onClick={prevSlide}
            aria-label="Banner trước"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button
            className={`${styles.bannerBtn} ${styles.bannerBtnRight}`}
            onClick={nextSlide}
            aria-label="Banner tiếp theo"
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <div className={styles.bannerIndicators}>
            {bannerImages.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.indicator} ${idx === current ? styles.active : ''}`}
                onClick={() => showSlide(idx)}
                aria-label={`Chuyển đến banner ${idx + 1}`}
              ></span>
            ))}
          </div>
        </div>
      </section>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          Đang tải tin tức...
        </div>
      ) : (
        <>
          <div className={styles.containerLatest}>
            <div className={styles.latestPost}>
              <h2 className={styles.latestPostTitle}>Bài viết mới nhất</h2>
              {latestPost ? (
                <div className={styles.postItem}>
                  <div className={styles.postImage}>
                    <img
                      src={getImageUrl(latestPost.thumbnailUrl)}
                      alt={latestPost.title}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.postContent}>
                    <Link to={`/news/${latestPost.id}`} className={styles.postTitle}>
                      {latestPost.title}
                    </Link>
                    <div className={styles.postDate}>
                      Ngày đăng {formatDate(latestPost.publishedAt)}
                    </div>
                    <div className={styles.postExcerpt}>
                      {latestPost.contentBlocks &&
                      latestPost.contentBlocks[0] &&
                      latestPost.contentBlocks[0].content
                        ? latestPost.contentBlocks[0].content.slice(0, 120) + '...'
                        : ''}
                    </div>
                  </div>
                </div>
              ) : (
                <div>Không có bài viết mới nhất.</div>
              )}
            </div>
            <div className={styles.postsGrid}>
              {latestGridPosts.length > 0 ? (
                latestGridPosts.map((post, idx) => (
                  <div
                    className={`${styles.gridItem} ${idx >= showCount - 1 ? styles.hidden : ''}`}
                    key={post._id || idx}
                  >
                    <div className={styles.gridImage}>
                      <img
                        src={getImageUrl(post.thumbnailUrl)}
                        alt={post.title}
                        loading="lazy"
                      />
                    </div>
                    <Link to={`/news/${post.id}`} className={styles.gridTitle}>
                      {post.title}
                    </Link>
                    <div className={styles.gridDate}>
                      Ngày đăng {formatDate(post.publishedAt)}
                    </div>
                    <div className={styles.gridExcerpt}>
                      {post.contentBlocks &&
                      post.contentBlocks[0] &&
                      post.contentBlocks[0].content
                        ? post.contentBlocks[0].content.slice(0, 80) + '...'
                        : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có bài viết bổ sung.</div>
              )}
            </div>
            {showCount < newsData.length && (
              <button
                className={styles.viewMoreBtn}
                onClick={handleViewMore}
                aria-label="Xem thêm tin tức"
              >
                Xem thêm
              </button>
            )}
          </div>
          <hr className={styles.divider} />
          <div className={styles.containerFeatured}>
            <div className={styles.featuredPost}>
              <h2 className={styles.featuredPostTitle}>Bài viết nổi bật</h2>
              {featuredPost ? (
                <div className={styles.postItem}>
                  <div className={styles.postImage}>
                    <img
                      src={getImageUrl(featuredPost.thumbnailUrl)}
                      alt={featuredPost.title}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.postContent}>
                    <Link to={`/news/${featuredPost.id}`} className={styles.postTitle}>
                      {featuredPost.title}
                    </Link>
                    <div className={styles.postDate}>
                      Ngày đăng {formatDate(featuredPost.publishedAt)}
                    </div>
                    <div className={styles.postExcerpt}>
                      {featuredPost.contentBlocks &&
                      featuredPost.contentBlocks[0] &&
                      featuredPost.contentBlocks[0].content
                        ? featuredPost.contentBlocks[0].content.slice(0, 120) + '...'
                        : ''}
                    </div>
                  </div>
                </div>
              ) : (
                <div>Không có bài viết nổi bật.</div>
              )}
            </div>
            <div className={styles.postsGrid}>
              {featuredGridPosts.length > 0 ? (
                featuredGridPosts.map((post, idx) => (
                  <div className={styles.gridItem} key={post._id || idx}>
                    <div className={styles.gridImage}>
                      <img
                        src={getImageUrl(post.thumbnailUrl)}
                        alt={post.title}
                        loading="lazy"
                      />
                    </div>
                    <Link to={`/news/${post.id}`} className={styles.gridTitle}>
                      {post.title}
                    </Link>
                    <div className={styles.gridDate}>
                      Ngày đăng {formatDate(post.publishedAt)}
                    </div>
                    <div className={styles.gridExcerpt}>
                      {post.contentBlocks &&
                      post.contentBlocks[0] &&
                      post.contentBlocks[0].content
                        ? post.contentBlocks[0].content.slice(0, 80) + '...'
                        : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có bài viết nổi bật bổ sung.</div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default News;