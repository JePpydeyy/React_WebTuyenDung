import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './NewsDetail.module.css';

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

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, src: '', caption: '' });
  const [article, setArticle] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch specific news article
    fetch(`${process.env.REACT_APP_API_URL}/new/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Không tìm thấy bài viết');
        }
        return res.json();
      })
      .then((data) => {
        // Ensure the article has status: "show"
        if (data.status !== 'show') {
          throw new Error('Bài viết không khả dụng');
        }
        setArticle(data);
      })
      .catch((err) => {
        console.error('Lỗi khi fetch tin tức:', err);
        setError(err.message);
        setArticle(null);
      });

    // Fetch other news for sidebar
    fetch(`${process.env.REACT_APP_API_URL}/new`)
      .then((res) => res.json())
      .then((data) => {
        const filteredNews = Array.isArray(data)
          ? data
              .filter((item) => item.id !== id && item.status === 'show') // Filter for status: "show"
              .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
              .slice(0, 3) // Limit to 3 other news
          : [];
        setOtherNews(filteredNews);
      })
      .catch((err) => {
        console.error('Lỗi khi fetch tin tức khác:', err);
        setOtherNews([]);
      });

    // Fetch jobs for sidebar
    fetch(`${process.env.REACT_APP_API_URL}/job`)
      .then((res) => res.json())
      .then((data) => {
        const currentDate = new Date();
        const sortedJobs = Array.isArray(data)
          ? data
              .filter((job) => job.status === 'show') // Filter for status: "show"
              .filter((job) => new Date(job['Due date']) >= currentDate) // Filter jobs not expired
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt
              .slice(0, 3) // Limit to 3 jobs
          : [];
        setJobs(sortedJobs);
      })
      .catch((err) => {
        console.error('Lỗi khi fetch việc làm:', err);
        setJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
        <div className={styles.errorMessage}>{error}</div>
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
                        navigate(`/news/${news.id}`);
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
              {jobs.length > 0 ? (
                jobs.map((job, idx) => (
                  <div key={job._id || idx} className={styles.jobCard}>
                    <div className={styles.jobCardContent}>
                      <div className={styles.jobCardTitle}>{job.Name}</div>
                      <p className={styles.jobCardInfo}><strong>Thương hiệu:</strong> {job.Brands}</p>
                      <p className={styles.jobCardInfo}><strong>Nơi làm việc:</strong> {job.Workplace}</p>
                      <p className={styles.jobCardInfo}><strong>Mức lương:</strong> {job.Salary}</p>
                      <p className={styles.jobCardInfo}><strong>Số lượng:</strong> {job.Slot}</p>
                      <p className={styles.jobCardInfo}><strong>Ngày hết hạn:</strong> {formatDate(job['Due date'])}</p>
                      <Link to={`/DetailJob/${job._id}`} className={styles.jobCardButton}>Xem chi tiết</Link>
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