import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NewsDetail.css';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, src: '', caption: '' });
  const [article, setArticle] = useState(null);
  const [otherNews, setOtherNews] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('https://api-tuyendung-cty.onrender.com/api/new')
      .then(res => res.json())
      .then(data => {
        const found = data.find(item => item.id === id);
        setArticle(found);
        setOtherNews(data.filter(item => item.id !== id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const shareOnFacebook = (e) => {
    e.preventDefault();
    if (!article) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&e=${title}`, '_blank', 'width=600,height=400');
  };

  const goBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Đang tải bài viết...
        </div>
      ) : article ? (
        <div className="main-layout">
          <div className="article-detail">
            <div className="article-header fade-in">
              <img className="thumbnail" src={article.thumbnailUrl} alt={article.thumbnailCaption || article.title} />
              <div className="article-title">
                <h1>{article.title}</h1>
                <div className="publish-date">Ngày đăng: {formatDate(article.publishedAt)}</div>
              </div>
            </div>
            <div className="article-content fade-in">
              {article.contentBlocks.map((block, idx) =>
                block.type === 'text' ? (
                  <div className="content-block" key={idx}>
                    <div className="content-text">{block.content}</div>
                  </div>
                ) : (
                  <div className="content-block" key={idx}>
                    <img
                      src={block.url}
                      alt={block.caption}
                      className="article-image"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setModal({ open: true, src: block.url, caption: block.caption })}
                    />
                    {block.caption && <div className="image-caption">{block.caption}</div>}
                  </div>
                )
              )}
            </div>
            <a href="#" className="back-button" onClick={goBack}>← Quay lại</a>
            <div className="share-section fade-in">
              <h3 className="share-title">Chia sẻ bài viết</h3>
              <div className="share-buttons">
                <a href="#" className="share-btn facebook" onClick={shareOnFacebook} title="Facebook">📘</a>
              </div>
            </div>
          </div>
          <div className="sidebar">
            <h2 className="sidebar-title">Tin tức khác</h2>
            <div className="news-grid">
              {otherNews.map((news, idx) => (
                <div className="grid-item" key={news._id || idx}>
                  <div className="grid-image">
                    <img src={news.thumbnailUrl} alt={news.title} />
                  </div>
                  <a
                    href="#"
                    className="grid-title"
                    onClick={e => {
                      e.preventDefault();
                      navigate(`/news/${news.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {news.title}
                  </a>
                  <div className="grid-date">Ngày đăng {formatDate(news.publishedAt)}</div>
                  <div className="grid-excerpt">
                    {news.contentBlocks && news.contentBlocks[0] && news.contentBlocks[0].content
                      ? news.contentBlocks[0].content.slice(0, 80) + '...'
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {modal.open && (
            <div
              style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', zIndex: 1000, cursor: 'pointer', padding: 20
              }}
              onClick={() => setModal({ open: false, src: '', caption: '' })}
            >
              <img src={modal.src} alt={modal.caption} style={{ maxWidth: '90%', maxHeight: '80%', borderRadius: 8 }} />
              <div style={{
                color: 'white', fontSize: '1.2rem', textAlign: 'center', marginTop: 20,
                background: 'rgba(0,0,0,0.7)', padding: '15px 20px', borderRadius: 8
              }}>{modal.caption}</div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Không tìm thấy bài viết!</div>
      )}
    </div>
  );
};

export default NewsDetail;