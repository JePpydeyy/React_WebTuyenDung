import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './NewsDetail.module.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return 'Không xác định';
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '');
  return `${baseUrl}/${url.replace(/^\/+/, '')}`;
}

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, src: '', caption: '' });
  const [article, setArticle] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Fetch specific news article
  const fetchArticle = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/new/${id}`);
      if (!res.ok) throw new Error('Không tìm thấy bài viết');
      const data = await res.json();
      if (data.status !== 'show') throw new Error('Bài viết không khả dụng');
      setArticle(data);
    } catch (err) {
      console.error('Lỗi khi fetch tin tức:', err);
      setError(err.message);
      setArticle(null);
    }
  }, [id]);

  // Fetch other news
  const fetchOtherNews = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/new`);
      const data = await res.json();
      const filteredNews = Array.isArray(data)
        ? data
            .filter((item) => item.id !== id && item.status === 'show')
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 3)
        : [];
      console.log('Fetched other news:', filteredNews); // Debug
      setOtherNews(filteredNews);
    } catch (err) {
      console.error('Lỗi khi fetch tin tức khác:', err);
      setOtherNews([]);
    }
  }, [id]);

  // Fetch jobs with retry mechanism
  const fetchJobs = useCallback(async (retries = 3, delay = 1000) => {
    const controller = new AbortController();
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/job`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}, Response: ${errorText}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Dữ liệu trả về không phải là mảng');
        const currentDate = new Date();
        const sortedJobs = data
          .filter((job) => job.status === 'show')
         
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        console.log('Fetched jobs:', sortedJobs); // Debug
        setJobs(sortedJobs);
        setError(null);
        return;
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err);
        if (attempt === retries) {
          setError(`Không thể tải việc làm: ${err.message}`);
          setJobs([]);
        } else {
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Run all fetches concurrently
    Promise.all([fetchArticle(), fetchOtherNews(), fetchJobs()]).finally(() => {
      setLoading(false);
    });
  }, [fetchArticle, fetchOtherNews, fetchJobs]);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchArticle(), fetchOtherNews(), fetchJobs()]);
    setLoading(false);
  };

  const goBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const goToJobs = (e) => {
    e.preventDefault();
    navigate('/job');
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          Đang tải bài viết...
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>
          {error}{' '}
          <button className={styles.backButton} onClick={handleRetry}>
            Thử lại
          </button>
        </div>
      ) : article ? (
        <div className={styles.mainLayout}>
          <div className={styles.articleDetail}>
            <div className={styles.articleHeader}>
              <img
                className={styles.thumbnail}
                src={getImageUrl(article.thumbnailUrl)}
                alt={article.thumbnailCaption || article.title}
                loading="lazy"
              />
              <div className={styles.articleTitle}>
                <h1>{article.title}</h1>
                <div className={styles.publishDate}>
                  Ngày đăng: {formatDate(article.publishedAt)}
                </div>
              </div>
            </div>
            <div className={styles.articleContent}>
              {article.contentBlocks.map((block, idx) =>
                block.type === 'text' ? (
                  <div className={styles.contentBlock} key={idx}>
                    <div className={styles.contentText}>{block.content}</div>
                  </div>
                ) : (
                  <div className={styles.contentBlock} key={idx}>
                    <img
                      src={getImageUrl(block.url)}
                      alt={block.caption}
                      className={styles.articleImage}
                      onClick={() =>
                        setModal({ open: true, src: getImageUrl(block.url), caption: block.caption })
                      }
                      loading="lazy"
                    />
                    {block.caption && (
                      <div className={styles.imageCaption}>{block.caption}</div>
                    )}
                  </div>
                )
              )}
            </div>
            <button
              type="button"
              className={styles.backButton}
              onClick={goBack}
              title="Quay lại"
            >
              Quay lại
            </button>
          </div>
          <div className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Tin tức khác</h2>
            <div className={styles.newsGrid}>
              {otherNews.length > 0 ? (
                otherNews.map((news, idx) => (
                  <div className={styles.gridItem} key={news._id || idx}>
                    <div className={styles.gridImage}>
                      <img
                        src={getImageUrl(news.thumbnailUrl)}
                        alt={news.title}
                        loading="lazy"
                      />
                    </div>
                    <a
                      href="#"
                      className={styles.gridTitle}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/news/${news.slug}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {news.title}
                    </a>
                    <div className={styles.gridDate}>
                      Ngày đăng {formatDate(news.publishedAt)}
                    </div>
                    <div className={styles.gridExcerpt}>
                      {news.contentBlocks &&
                      news.contentBlocks[0] &&
                      news.contentBlocks[0].content
                        ? news.contentBlocks[0].content.slice(0, 80) + '...'
                        : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có tin tức khác.</div>
              )}
            </div>
            <h2 className={styles.sidebarTitle}>Việc làm nổi bật</h2>
            <div className={styles.jobsGrid}>
              {loading ? (
                <div>Đang tải...</div>
              ) : error ? (
                <div>
                  Lỗi: {error}{' '}
                  <button
                    className={styles.loadMoreBtn}
                    onClick={() => {
                      setLoading(true);
                      fetchJobs();
                    }}
                  >
                    Thử lại
                  </button>
                </div>
              ) : jobs.length > 0 ? (
                jobs.map((job, idx) => (
                  <div key={job._id || idx} className={styles.jobCard}>
                    <div className={styles.jobCardContent}>
                      <div className={styles.jobCardTitle}>{job.Name || 'Không xác định'}</div>
                      <p className={styles.jobCardInfo}>
                        <strong>Thương hiệu:</strong>{' '}
                        {Array.isArray(job.Brands) ? job.Brands.join(', ') : job.Brands || 'Không xác định'}
                      </p>
                      <p className={styles.jobCardInfo}>
                        <strong>Nơi làm việc:</strong> {job.Workplace || 'Không xác định'}
                      </p>
                      <p className={styles.jobCardInfo}>
                        <strong>Mức lương:</strong> {job.Salary || 'Không xác định'}
                      </p>
                      <p className={styles.jobCardInfo}>
                        <strong>Số lượng:</strong> {job.Slot || 'Không xác định'}
                      </p>
                      <p className={styles.jobCardInfo}>
                        <strong>Ngày hết hạn:</strong> {formatDate(job['Due date'])}
                      </p>
                      <Link to={`/DetailJob/${job._id}`} className={styles.jobCardButton}>
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có việc làm nổi bật.</div>
              )}
            </div>
            {jobs.length > 3 && (
              <button
                className={styles.viewMoreBtn}
                onClick={goToJobs}
                aria-label="Xem thêm việc làm"
              >
                Xem thêm
              </button>
            )}
          </div>
          {modal.open && (
            <div
              className={styles.modal}
              onClick={() => setModal({ open: false, src: '', caption: '' })}
            >
              <img
                src={getImageUrl(modal.src)}
                alt={modal.caption}
                className={styles.modalImage}
              />
              <div className={styles.modalCaption}>{modal.caption}</div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.errorMessage}>Không tìm thấy bài viết!</div>
      )}
    </div>
  );
};

export default NewsDetail;