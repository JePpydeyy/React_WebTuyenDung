import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext'; 

const Sidebar = ({ isAlwaysVisible = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Thêm dòng này
  const { checkAuth } = useAuth(); // Thêm dòng này

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    checkAuth(); // Đã có
    navigate('/admin/login'); // Đã có
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  return (
    <>
      {/* Nút toggle luôn hiển thị trên mobile */}
      <button className={`${styles.toggleButton} ${styles.mobileToggle}`} onClick={toggleSidebar}>
        <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar hoặc Menu */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <a href="/admin">
              <img src="https://api-tuyendung-cty.onrender.com/images/Logo.svg" alt="Logo" />
            </a>
          </div>
          {/* Nút toggle trong sidebar, chỉ hiển thị trên desktop */}
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        <ul className={styles.menu}>
          <li>
            <a href="/admin">
              <i className="fa-solid fa-chart-line"></i> Dashboard
            </a>
          </li>
          <li>
            <a href="/admin/news">
              <i className="fa-regular fa-newspaper"></i> Tin Tức
            </a>
          </li>
          <li>
            <a href="/admin/jobs">
              <i className="fa-solid fa-briefcase"></i> Quản Lý Công Việc
            </a>
          </li>
          <li>
            <a href="/admin/submit-profile">
              <i className="fa-solid fa-address-card"></i> Hồ Sơ Ứng Tuyển
            </a>
          </li>
          <li>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <i className="fa-solid fa-right-from-bracket"></i> Đăng Xuất
          </button>
        </li>
        </ul>
      </div>

      {/* Overlay khi menu mở trên di động */}
      {isOpen && (
        <div className={styles.overlay} onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;