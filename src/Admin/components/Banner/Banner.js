import React, { useState, useEffect } from 'react';
import styles from './Banner.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

// Giả lập ObjectId (sử dụng timestamp + random cho test)
const generateObjectId = () => {
  const timestamp = Date.now().toString(16);
  const random = Math.floor(Math.random() * 1000000).toString(16).padStart(6, '0');
  return `${timestamp}${random}`;
};

const Banner = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    image: null,
    startDate: '',
    endDate: '',
    status: 'Hiện',
    page: 'Trang Chủ',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPage, setFilterPage] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  const pages = ['Trang Chủ', 'Tin Tức', 'Giới Thiệu', 'Liên Hệ', 'Công Việc'];
  const statusOptions = ['Hiện', 'Ẩn', 'Không thời hạn'];

  // Fetch banners with mock data using ObjectId
  useEffect(() => {
    const fetchBanners = async () => {
      const mockBanners = [
        { 
          id: generateObjectId(), 
          title: 'Banner Quảng Cáo Trang Chủ 1', 
          image: 'https://via.placeholder.com/400x200/4CAF50/ffffff?text=Banner+Trang+Chu', 
          startDate: '2025-06-01', 
          endDate: '2025-06-10', 
          status: 'Hiện', 
          page: 'Trang Chủ' 
        },
        { 
          id: generateObjectId(), 
          title: 'Banner Tin Tức 1', 
          image: 'https://via.placeholder.com/400x200/2196F3/ffffff?text=Banner+Tin+Tuc', 
          startDate: '2025-05-20', 
          endDate: '2025-05-25', 
          status: 'Ẩn', 
          page: 'Tin Tức' 
        },
        { 
          id: generateObjectId(), 
          title: 'Banner Giới Thiệu 1', 
          image: 'https://via.placeholder.com/400x200/FF9800/ffffff?text=Banner+Gioi+Thieu', 
          startDate: '', 
          endDate: '', 
          status: 'Không thời hạn', 
          page: 'Giới Thiệu' 
        },
        { 
          id: generateObjectId(), 
          title: 'Banner Liên Hệ 1', 
          image: 'https://via.placeholder.com/400x200/9C27B0/ffffff?text=Banner+Lien+He', 
          startDate: '2025-06-03', 
          endDate: '2025-06-15', 
          status: 'Hiện', 
          page: 'Liên Hệ' 
        },
        { 
          id: generateObjectId(), 
          title: 'Banner Công Việc 1', 
          image: 'https://via.placeholder.com/400x200/F44336/ffffff?text=Banner+Cong+Viec', 
          startDate: '2025-06-01', 
          endDate: '2025-06-02', 
          status: 'Ẩn', 
          page: 'Công Việc' 
        },
      ];
      setBanners(mockBanners);
    };
    fetchBanners();
  }, []);

  // Auto update status based on date
  useEffect(() => {
    const updateBannerStatus = () => {
      const now = new Date();
      setBanners(prevBanners => 
        prevBanners.map(banner => {
          if (banner.startDate && banner.endDate && banner.status !== 'Không thời hạn') {
            const start = new Date(banner.startDate);
            const end = new Date(banner.endDate);
            const newStatus = now >= start && now <= end ? 'Hiện' : 'Ẩn';
            return { ...banner, status: newStatus };
          }
          return banner;
        })
      );
    };

    const interval = setInterval(updateBannerStatus, 60000); // Check every minute
    updateBannerStatus(); // Initial check

    return () => clearInterval(interval);
  }, []);

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPage = filterPage === 'Tất cả' || banner.page === filterPage;
    const matchesStatus = filterStatus === 'Tất cả' || banner.status === filterStatus;
    return matchesSearch && matchesPage && matchesStatus;
  });

  const handleAddBanner = () => {
    setEditingBanner(null);
    setNewBanner({
      title: '',
      image: null,
      startDate: '',
      endDate: '',
      status: 'Hiện',
      page: 'Trang Chủ',
    });
    setIsModalOpen(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setNewBanner({
      title: banner.title,
      image: banner.image,
      startDate: banner.startDate,
      endDate: banner.endDate,
      status: banner.status,
      page: banner.page,
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBanner({ ...newBanner, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateBanner = () => {
    if (!newBanner.title.trim()) {
      alert('Vui lỏng nhập tiêu đề banner');
      return false;
    }
    if (!newBanner.image) {
      alert('Vui lòng chọn hình ảnh');
      return false;
    }
    if (newBanner.startDate && newBanner.endDate) {
      if (new Date(newBanner.startDate) > new Date(newBanner.endDate)) {
        alert('Ngày bắt đầu không thể sau ngày kết thúc');
        return false;
      }
    }
    return true;
  };

  const handleSaveBanner = async () => {
    if (!validateBanner()) return;

    if (editingBanner) {
      // Update existing banner
      setBanners(banners.map(banner =>
        banner.id === editingBanner.id ? { ...banner, ...newBanner } : banner
      ));
    } else {
      // Add new banner
      const newId = generateObjectId();
      setBanners([...banners, { id: newId, ...newBanner }]);
    }

    setNewBanner({ title: '', image: null, startDate: '', endDate: '', status: 'Hiện', page: 'Trang Chủ' });
    setEditingBanner(null);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = (banner) => {
    setBannerToDelete(banner);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBanner = async () => {
    if (bannerToDelete) {
      setBanners(banners.filter((banner) => banner.id !== bannerToDelete.id));
      setIsDeleteModalOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    setBanners(banners.map(banner =>
      banner.id === id ? { 
        ...banner, 
        status: banner.status === 'Hiện' ? 'Ẩn' : 'Hiện' 
      } : banner
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hiện': return styles.statusActive;
      case 'Ẩn': return styles.statusInactive;
      case 'Không thời hạn': return styles.statusUnlimited;
      default: return '';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterPage('Tất cả');
    setFilterStatus('Tất cả');
  };

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.header}>
        <h2>
          <i className="fa-solid fa-image"></i> Quản Lý Banner
        </h2>
        <button className={styles.addButton} onClick={handleAddBanner}>
          <i className="fa-solid fa-plus"></i> Thêm Banner
        </button>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={filterPage}
            onChange={(e) => setFilterPage(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="Tất cả">Tất cả trang</option>
            {pages.map(page => (
              <option key={page} value={page}>{page}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button onClick={clearFilters} className={styles.clearButton}>
            <i className="fa-solid fa-filter-circle-xmark"></i> Xóa bộ lọc
          </button>
        </div>
      </div>

      <div className={styles.bannerList}>
        {filteredBanners.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fa-solid fa-image fa-3x"></i>
            <p>Không tìm thấy banner nào phù hợp</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.bannerTable}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu Đề</th>
                  <th>Hình Ảnh</th>
                  <th>Thuộc Trang</th>
                  <th>Trạng Thái</th>
                  <th>Thời Gian</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((banner, index) => (
                  <tr key={banner.id}>
                    <td data-label="STT">{index + 1}</td>
                    <td data-label="Tiêu Đề">
                      <div className={styles.titleCell}>
                        {banner.title}
                      </div>
                    </td>
                    <td data-label="Hình Ảnh">
                      <img 
                        src={banner.image} 
                        alt={banner.title} 
                        className={styles.bannerImage}
                        loading="lazy"
                      />
                    </td>
                    <td data-label="Thuộc Trang">
                      <span className={styles.pageTag}>{banner.page}</span>
                    </td>
                    <td data-label="Trạng Thái">
                      <span className={`${styles.statusBadge} ${getStatusColor(banner.status)}`}>
                        {banner.status}
                      </span>
                    </td>
                    <td data-label="Thời Gian">
                      {banner.startDate && banner.endDate ? (
                        <div className={styles.dateRange}>
                          <div>{banner.startDate}</div>
                          <div>đến</div>
                          <div>{banner.endDate}</div>
                        </div>
                      ) : (
                        <span className={styles.unlimited}>Không thời hạn</span>
                      )}
                    </td>
                    <td data-label="Hành Động">
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditBanner(banner)}
                          title="Chỉnh sửa"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.toggleButton}`}
                          onClick={() => handleToggleStatus(banner.id)}
                          title={banner.status === 'Hiện' ? 'Ẩn banner' : 'Hiển thị banner'}
                        >
                          <i className={`fa-solid ${banner.status === 'Hiện' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteConfirm(banner)}
                          title="Xóa"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                <i className="fa-solid fa-image"></i>
                {editingBanner ? 'Chỉnh Sửa Banner' : 'Thêm Banner Mới'}
              </h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tiêu Đề *</label>
                  <input
                    type="text"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    placeholder="Nhập tiêu đề banner"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Hình Ảnh *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  {newBanner.image && (
                    <div className={styles.imagePreview}>
                      <img
                        src={newBanner.image}
                        alt="Preview"
                        className={styles.previewImage}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Thuộc Trang</label>
                  <select
                    value={newBanner.page}
                    onChange={(e) => setNewBanner({ ...newBanner, page: e.target.value })}
                  >
                    {pages.map(page => (
                      <option key={page} value={page}>{page}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Trạng Thái</label>
                  <select
                    value={newBanner.status}
                    onChange={(e) => setNewBanner({ ...newBanner, status: e.target.value })}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Ngày Bắt Đầu</label>
                  <input
                    type="date"
                    value={newBanner.startDate}
                    onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ngày Kết Thúc</label>
                  <input
                    type="date"
                    value={newBanner.endDate}
                    onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleSaveBanner}>
                <i className="fa-solid fa-save"></i>
                {editingBanner ? 'Cập Nhật' : 'Lưu'}
              </button>
              <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-times"></i>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <div className={styles.confirmHeader}>
              <i className="fa-solid fa-exclamation-triangle"></i>
              <h3>Xác Nhận Xóa</h3>
            </div>
            <div className={styles.confirmBody}>
              <p>Bạn có chắc chắn muốn xóa banner <strong>"{bannerToDelete?.title}"</strong>?</p>
              <p className={styles.warningText}>Hành động này không thể hoàn tác.</p>
            </div>
            <div className={styles.confirmActions}>
              <button className={styles.confirmButton} onClick={handleDeleteBanner}>
                <i className="fa-solid fa-trash"></i>
                Xóa
              </button>
              <button className={styles.cancelButton} onClick={() => setIsDeleteModalOpen(false)}>
                <i className="fa-solid fa-times"></i>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;