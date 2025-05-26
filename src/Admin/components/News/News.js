import React, { useState, useEffect } from 'react';
import styles from './New.module.css';

const API_URL = 'https://api-tuyendung-cty.onrender.com/api/new';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const itemsPerPage = 10;

  // Status mapping for display
  const statusDisplayMap = {
    show: 'Hiển thị',
    hidden: 'Đã ẩn',
  };

  // Status mapping for backend
  const statusBackendMap = {
    'Hiển thị': 'show',
    'Đã ẩn': 'hidden',
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const normalizeVietnamese = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const sanitizeHTML = (str) => {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Fetch all news
  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_URL}`);
      if (!response.ok) throw new Error(`Không thể tải danh sách tin tức: ${response.status}`);
      const data = await response.json();
      console.log('Raw API data:', data);
      if (!Array.isArray(data)) {
        console.error('API trả về dữ liệu không phải mảng:', data);
        showNotification('Dữ liệu tin tức không hợp lệ', 'error');
        return [];
      }
      const sanitizedData = data
        .filter(item => item && typeof item === 'object' && item.id)
        .map((item, index) => {
          console.log(`Processing item ${index}:`, item);
          return {
            ...item,
            id: sanitizeHTML(item.id.toString()),
            title: sanitizeHTML(item.title || ''),
            slug: sanitizeHTML(item.slug || ''),
            thumbnailCaption: sanitizeHTML(item.thumbnailCaption || ''),
            publishedAt: formatDate(item.publishedAt),
            status: statusDisplayMap[item.status] || item.status || 'Hiển thị',
            views: item.views || 0,
            contentBlocks: Array.isArray(item.contentBlocks) ? item.contentBlocks : [],
          };
        });
      console.log('Sanitized news data:', sanitizedData);
      return sanitizedData;
    } catch (error) {
      console.error('Lỗi fetchNews:', error);
      showNotification(`Lỗi khi tải danh sách tin tức: ${error.message}`, 'error');
      return [];
    }
  };

  // Display news with pagination
  const displayNews = async (page = 1, data = null) => {
    try {
      const displayData = data || (await fetchNews());
      console.log('displayData:', displayData);
      if (!Array.isArray(displayData)) {
        console.error('displayData không phải mảng:', displayData);
        setNews([]);
        setTotalPages(1);
        showNotification('Không có dữ liệu tin tức để hiển thị', 'error');
        return;
      }
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, displayData.length);
      const paginatedData = displayData.slice(startIndex, endIndex);
      setNews(paginatedData);
      setTotalPages(Math.ceil(displayData.length / itemsPerPage) || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Lỗi displayNews:', error);
      showNotification(`Lỗi khi hiển thị tin tức: ${error.message}`, 'error');
    }
  };

  const handlePageChange = (page) => {
    displayNews(page, filteredNews);
  };

  // View news details
  const viewNews = async (id) => {
    try {
      if (!id) throw new Error('ID tin tức không hợp lệ');
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`Không tìm thấy tin tức: ${response.status}`);
      const newsItem = await response.json();
      console.log('Fetched news item:', newsItem);
      if (newsItem.status === 'hidden') return;
      setSelectedNews({
        ...newsItem,
        id: sanitizeHTML(newsItem.id.toString()),
        title: sanitizeHTML(newsItem.title || ''),
        slug: sanitizeHTML(newsItem.slug || ''),
        thumbnailCaption: sanitizeHTML(newsItem.thumbnailCaption || ''),
        publishedAt: formatDate(newsItem.publishedAt),
        status: statusDisplayMap[newsItem.status] || newsItem.status || 'Hiển thị',
        contentBlocks: Array.isArray(newsItem.contentBlocks)
          ? newsItem.contentBlocks.map(block => ({
              ...block,
              content: block.type === 'text' ? sanitizeHTML(block.content || '') : block.content,
              caption: block.caption ? sanitizeHTML(block.caption) : block.caption,
            }))
          : [],
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi viewNews:', error);
      showNotification(`Lỗi khi tải thông tin tin tức: ${error.message}`, 'error');
    }
  };

  // Hide news (soft delete)
  const hideNews = async (id) => {
    if (!id) {
      showNotification('ID tin tức không hợp lệ', 'error');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn ẩn tin tức này?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Không thể ẩn tin tức: ${response.status}`);
        showNotification('Đã ẩn tin tức thành công', 'success');
        setFilteredNews(filteredNews ? filteredNews.filter(n => n.id !== id) : null);
        await displayNews(currentPage, filteredNews);
      } catch (error) {
        console.error('Lỗi hideNews:', error);
        showNotification(`Lỗi khi ẩn tin tức: ${error.message}`, 'error');
      }
    }
  };

  // Edit news with fallback fetch
  const editNews = async (newsItem) => {
    console.log('editNews called with item:', newsItem);
    let itemToEdit = newsItem;

    // If newsItem is invalid, try fetching from API
    if (!newsItem || !newsItem.id) {
      console.error('newsItem không hợp lệ:', newsItem);
      if (newsItem && newsItem.id) {
        try {
          const response = await fetch(`${API_URL}/${newsItem.id}`);
          if (!response.ok) throw new Error('Không thể tải tin tức');
          itemToEdit = await response.json();
          console.log('Fetched item for editing:', itemToEdit);
        } catch (error) {
          console.error('Lỗi fetch item:', error);
          showNotification('Không thể chỉnh sửa: Tin tức không hợp lệ', 'error');
          return;
        }
      } else {
        showNotification('Không thể chỉnh sửa: Tin tức không hợp lệ', 'error');
        return;
      }
    }

    setIsEditing(true);
    setEditForm({
      id: itemToEdit.id,
      title: itemToEdit.title || '',
      slug: itemToEdit.slug || '',
      thumbnailUrl: itemToEdit.thumbnailUrl || '',
      thumbnailCaption: itemToEdit.thumbnailCaption || '',
      publishedAt: itemToEdit.publishedAt
        ? itemToEdit.publishedAt.split('/').reverse().join('-')
        : new Date().toISOString().split('T')[0],
      views: itemToEdit.views || 0,
      rating: itemToEdit.rating
        ? `${itemToEdit.rating.score || 0}/${itemToEdit.rating.votes || 0}`
        : '0/0',
      status: itemToEdit.status || 'Hiển thị',
      contentBlocks: Array.isArray(itemToEdit.contentBlocks)
        ? itemToEdit.contentBlocks.map(block => ({
            type: block.type || 'text',
            content: block.content || '',
            url: block.url || '',
            caption: block.caption || '',
            file: null, // For new file uploads
          }))
        : [],
    });
  };

  // Handle form change (text inputs)
  const handleFormChange = (e, index = null, field = null) => {
    if (index !== null && field) {
      const updatedBlocks = [...editForm.contentBlocks];
      updatedBlocks[index] = { ...updatedBlocks[index], [field]: e.target.value };
      setEditForm({ ...editForm, contentBlocks: updatedBlocks });
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
  };

  // Handle file change for contentBlocks with preview
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updatedBlocks = [...editForm.contentBlocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      file,
      url: URL.createObjectURL(file), // Set preview URL for the selected file
    };
    setEditForm({ ...editForm, contentBlocks: updatedBlocks });
  };

  // Add new content block
  const addContentBlock = (type = 'text') => {
    setEditForm({
      ...editForm,
      contentBlocks: [
        ...editForm.contentBlocks,
        { type, content: '', url: '', caption: '', file: null },
      ],
    });
  };

  // Remove content block
  const removeContentBlock = (index) => {
    setEditForm({
      ...editForm,
      contentBlocks: editForm.contentBlocks.filter((_, i) => i !== index),
    });
  };

  // Save edited news
  const saveNews = async () => {
    try {
      if (!editForm) throw new Error('Dữ liệu chỉnh sửa không hợp lệ');
      const [score, votes] = editForm.rating.split('/').map(Number);
      if (isNaN(score) || isNaN(votes)) {
        throw new Error('Đánh giá phải có định dạng score/votes hợp lệ');
      }

      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('slug', editForm.slug);
      formData.append('thumbnailUrl', editForm.thumbnailUrl);
      formData.append('thumbnailCaption', editForm.thumbnailCaption);
      formData.append('publishedAt', new Date(editForm.publishedAt).toISOString());
      formData.append('views', editForm.views.toString());
      formData.append('rating', JSON.stringify({ score, votes }));
      formData.append('status', statusBackendMap[editForm.status] || editForm.status);

      // Prepare contentBlocks for submission
      const contentBlocksForSubmission = editForm.contentBlocks.map(block => ({
        type: block.type,
        content: block.type === 'text' ? block.content : undefined,
        url: block.url && !block.file ? block.url : undefined, // Keep existing URL if no new file
        caption: block.type === 'image' ? block.caption : undefined,
      }));

      // Append contentBlocks as JSON string
      formData.append('contentBlocks', JSON.stringify(contentBlocksForSubmission));

      // Append new image files
      editForm.contentBlocks.forEach((block, index) => {
        if (block.type === 'image' && block.file) {
          formData.append('images', block.file);
        }
      });

      console.log('Sending update request with formData');
      const response = await fetch(`${API_URL}/${editForm.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error(`Không thể cập nhật tin tức: ${response.status}`);
      const result = await response.json();
      showNotification(result.message || 'Đã cập nhật tin tức thành công', 'success');
      setIsEditing(false);
      setSelectedNews(null);
      await displayNews(currentPage, filteredNews);
    } catch (error) {
      console.error('Lỗi saveNews:', error);
      showNotification(`Lỗi khi cập nhật tin tức: ${error.message}`, 'error');
    }
  };

  // Apply filters
  const applyFilters = async () => {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.querySelector('.search-bar')?.value.trim();

    try {
      let newsItems = await fetchNews();
      console.log('Filtering newsItems:', newsItems);

      if (statusFilter) {
        newsItems = newsItems.filter(n => n.status === statusFilter);
      }

      if (searchTerm) {
        const normalizedSearchTerm = normalizeVietnamese(searchTerm);
        newsItems = newsItems.filter(item =>
          normalizeVietnamese(item.title).includes(normalizedSearchTerm) ||
          normalizeVietnamese(item.id).includes(normalizedSearchTerm) ||
          normalizeVietnamese(item.slug).includes(normalizedSearchTerm)
        );
      }

      setFilteredNews(newsItems);
      if (newsItems.length === 0) {
        showNotification('Không tìm thấy tin tức phù hợp', 'info');
      }
      await displayNews(1, newsItems);
    } catch (error) {
      console.error('Lỗi applyFilters:', error);
      showNotification(`Lỗi khi áp dụng bộ lọc/tìm kiếm: ${error.message}`, 'error');
    }
  };

  // Reset filters
  const resetFilters = async () => {
    document.getElementById('statusFilter').value = '';
    document.querySelector('.search-bar').value = '';
    setFilteredNews(null);
    await displayNews(1);
  };

  useEffect(() => {
    displayNews(1);
  }, []);

  const getStatusClass = (status) => {
    const statusMap = {
      'Hiển thị': styles.hienThi,
      'Đã ẩn': styles.daAn,
    };
    return statusMap[status] || '';
  };

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filters}>
        <input type="text" className="search-bar" placeholder="Tìm kiếm tin tức..." onChange={applyFilters} />
        <select id="statusFilter" onChange={applyFilters}>
          <option value="">- Tất cả trạng thái -</option>
          <option value="Hiển thị">Hiển thị</option>
          <option value="Đã ẩn">Đã ẩn</option>
        </select>
        <button onClick={applyFilters}><i className="fa-solid fa-filter"></i> Áp dụng</button>
        <button onClick={resetFilters}><i className="fa-solid fa-rotate"></i> Đặt lại</button>
      </div>

      {/* News list */}
      <div className={styles.newsList}>
        <h3>Danh Sách Tin Tức</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu Đề</th>
              <th>Ngày Đăng</th>
              <th>Lượt Xem</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu phù hợp</td></tr>
            ) : (
              news.map((item, index) => {
                console.log(`Rendering item ${index}:`, item);
                return (
                  <tr key={item.id || `news-${index}`}>
                    <td>{item.id || 'N/A'}</td>
                    <td>{item.title || 'Không có tiêu đề'}</td>
                    <td>{item.publishedAt || 'N/A'}</td>
                    <td>{item.views || 0}</td>
                    <td><span className={`${styles.status} ${getStatusClass(item.status)}`}>{item.status}</span></td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.view}
                          onClick={() => {
                            console.log('View button clicked for ID:', item.id);
                            viewNews(item.id);
                          }}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className={styles.edit}
                          onClick={() => {
                            console.log('Edit button clicked for item:', item);
                            editNews(item);
                          }}
                          disabled={!item.id}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          className={styles.delete}
                          onClick={() => {
                            console.log('Delete button clicked for ID:', item.id);
                            hideNews(item.id);
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button onClick={() => handlePageChange(1)}><i className="fa-solid fa-angles-left"></i></button>
          <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))}><i className="fa-solid fa-angle-left"></i></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={page === currentPage ? styles.active : ''}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}><i className="fa-solid fa-angle-right"></i></button>
          <button onClick={() => handlePageChange(totalPages)}><i className="fa-solid fa-angles-right"></i></button>
        </div>
      </div>

      {/* News details modal */}
      {selectedNews && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => { setSelectedNews(null); setIsEditing(false); }}>×</span>
            {isEditing && editForm ? (
              <>
                <h3>Chỉnh Sửa Tin Tức: {editForm.title}</h3>
                <div className={styles.editForm}>
                  <div className={styles.detailGroup}>
                    <label>Tiêu đề:</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Slug:</label>
                    <input
                      type="text"
                      name="slug"
                      value={editForm.slug}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Thumbnail URL:</label>
                    <input
                      type="text"
                      name="thumbnailUrl"
                      value={editForm.thumbnailUrl}
                      onChange={handleFormChange}
                      placeholder="Nhập URL hình ảnh thumbnail"
                    />
                    {editForm.thumbnailUrl && (
                      <div className={styles.thumbnailPreview}>
                        <p>Xem trước:</p>
                        <img
                          src={editForm.thumbnailUrl}
                          alt="Thumbnail Preview"
                          className={styles.imagePreview}
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Thumbnail Caption:</label>
                    <input
                      type="text"
                      name="thumbnailCaption"
                      value={editForm.thumbnailCaption}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Ngày đăng:</label>
                    <input
                      type="date"
                      name="publishedAt"
                      value={editForm.publishedAt}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Lượt xem:</label>
                    <input
                      type="number"
                      name="views"
                      value={editForm.views}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Đánh giá (score/votes):</label>
                    <input
                      type="text"
                      name="rating"
                      value={editForm.rating}
                      onChange={handleFormChange}
                      placeholder="Nhập dạng score/votes, ví dụ: 3/15"
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Trạng thái:</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleFormChange}
                    >
                      <option value="Hiển thị">Hiển thị</option>
                      <option value="Đã ẩn">Đã ẩn</option>
                    </select>
                  </div>
                  <div className={`${styles.detailGroup} ${styles.full}`}>
                    <label>Nội dung:</label>
                    {editForm.contentBlocks.map((block, index) => (
                      <div key={index} className={styles.contentBlock}>
                        <select
                          value={block.type}
                          onChange={(e) => handleFormChange({ target: { value: e.target.value } }, index, 'type')}
                        >
                          <option value="text">Văn bản</option>
                          <option value="image">Hình ảnh</option>
                        </select>
                        {block.type === 'text' ? (
                          <textarea
                            value={block.content}
                            onChange={(e) => handleFormChange(e, index, 'content')}
                            placeholder="Nội dung văn bản"
                          />
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, index)}
                            />
                            {(block.url || block.file) && (
                              <img
                                src={block.url || (block.file && URL.createObjectURL(block.file))}
                                alt="Image Preview"
                                className={styles.imagePreview}
                                onError={(e) => (e.target.style.display = 'none')}
                              />
                            )}
                            <input
                              type="text"
                              value={block.caption}
                              onChange={(e) => handleFormChange(e, index, 'caption')}
                              placeholder="Chú thích hình ảnh"
                            />
                          </>
                        )}
                        <button
                          className={styles.removeBlock}
                          onClick={() => removeContentBlock(index)}
                        >
                          Xóa khối
                        </button>
                      </div>
                    ))}
                    <div className={styles.addBlockButtons}>
                      <button onClick={() => addContentBlock('text')}>Thêm khối văn bản</button>
                      <button onClick={() => addContentBlock('image')}>Thêm khối hình ảnh</button>
                    </div>
                  </div>
                  <div className={styles.detailAction}>
                    <button className={styles.save} onClick={saveNews}>Lưu</button>
                    <button className={styles.cancel} onClick={() => setIsEditing(false)}>Hủy</button>
                  </div>
                </div>
              </>
            ) : (
              selectedNews && (
                <>
                  <h3>{selectedNews.title}</h3>
                  <div className={styles.newsDetails}>
                    <div className={styles.detailRow}>
                      <div className={styles.detailGroup}>
                        <label>ID:</label>
                        <p>{selectedNews.id}</p>
                      </div>
                      <div className={styles.detailGroup}>
                        <label>Trạng thái:</label>
                        <p><span className={`${styles.status} ${getStatusClass(selectedNews.status)}`}>{selectedNews.status}</span></p>
                      </div>
                    </div>
                    <div className={styles.detailRow}>
                      <div className={styles.detailGroup}>
                        <label>Ngày đăng:</label>
                        <p>{selectedNews.publishedAt}</p>
                      </div>
                      <div className={styles.detailGroup}>
                        <label>Lượt xem:</label>
                        <p>{selectedNews.views}</p>
                      </div>
                    </div>
                    <div className={styles.detailRow}>
                      <div className={styles.detailGroup}>
                        <label>Slug:</label>
                        <p>{selectedNews.slug}</p>
                      </div>
                      <div className={styles.detailGroup}>
                        <label>Đánh giá:</label>
                        <p>{selectedNews.rating ? `${selectedNews.rating.score}/${selectedNews.rating.votes}` : '0/0'}</p>
                      </div>
                    </div>
                    <div className={`${styles.detailGroup} ${styles.full}`}>
                      <label>Thumbnail:</label>
                      <p>
                        <img src={selectedNews.thumbnailUrl} alt={selectedNews.thumbnailCaption} style={{ maxWidth: '100%' }} />
                        <span>{selectedNews.thumbnailCaption}</span>
                      </p>
                    </div>
                    <div className={`${styles.detailGroup} ${styles.full}`}>
                      <label>Nội dung:</label>
                      {selectedNews.contentBlocks.map((block, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                          {block.type === 'text' ? (
                            <p>{block.content}</p>
                          ) : (
                            <p>
                              <img src={block.url} alt={block.caption} style={{ maxWidth: '100%' }} />
                              <span>{block.caption}</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className={styles.detailAction}>
                      <button
                        className={styles.edit}
                        onClick={() => {
                          console.log('Modal Edit button clicked for item:', selectedNews);
                          editNews(selectedNews);
                        }}
                      >
                        <i className="fa-solid fa-edit"></i> Sửa
                      </button>
                      <button
                        className={styles.delete}
                        onClick={() => hideNews(selectedNews.id)}
                      >
                        <i className="fa-solid fa-trash"></i> Xóa
                      </button>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;