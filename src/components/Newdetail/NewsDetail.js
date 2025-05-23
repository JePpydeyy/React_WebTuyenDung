import React, { useEffect, useState } from 'react';
import './NewsDetail.css';
import { articleData } from '../../data/articleData';
import { otherNewsData } from '../../data/otherNewsData';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const NewsDetail = () => {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, src: '', caption: '' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const shareOnFacebook = (e) => {
    e.preventDefault();
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(articleData.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}"e=${title}`, '_blank', 'width=600,height=400');
  };

  const goBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) window.history.back();
    else alert('Không có trang trước đó để quay lại');
  };

  return (
    <div className="container">
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Đang tải bài viết...
        </div>
      ) : (
        <div className="main-layout">
          <div className="article-detail">
            <div className="article-header fade-in">
              <img className="thumbnail" src={articleData.thumbnailUrl} alt={articleData.thumbnailCaption || articleData.title} />
              <div className="article-title">
                <h1>{articleData.title}</h1>
                <div className="publish-date">Ngày đăng: {formatDate(articleData.publishedAt)}</div>
              </div>
            </div>
            <div className="article-content fade-in">
              {articleData.contentBlocks.map((block, idx) =>
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
              {otherNewsData.map((news, idx) => (
                <div className="grid-item" key={idx}>
                  <div className="grid-image">
                    <img src={news.image} alt={news.title} />
                  </div>
                  <a href="#" className="grid-title">{news.title}</a>
                  <div className="grid-date">Ngày đăng {news.date}</div>
                  <div className="grid-excerpt">{news.excerpt}</div>
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
      )}
    </div>
  );
};

export default NewsDetail;