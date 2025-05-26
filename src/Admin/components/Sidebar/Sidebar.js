import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => (
  <div className={styles.sidebar}>
    <div className={styles.logo}>
      <img src="../images/logo.png" alt="Logo" />
    </div>
    <ul>
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
        <a href="/admin/job">
          <i className="fa-solid fa-briefcase"></i> Quản Lý Công Việc
        </a>
      </li>
      <li>
        <a href="/admin/submit-profile">
          <i className="fa-solid fa-address-card"></i> Hồ Sơ Ứng Tuyển
        </a>
      </li>
      <li>
        <a href="#">
          <i className="fa-solid fa-right-from-bracket"></i> Đăng Xuất
        </a>
      </li>
    </ul>
  </div>
);

export default Sidebar;