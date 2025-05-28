import React from 'react';
import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth(); 

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    console.log('Token sau khi đăng xuất:', localStorage.getItem('adminToken')); // Phải là null
    console.log('User sau khi đăng xuất:', localStorage.getItem('user')); // Phải là null
    checkAuth(); // Kích hoạt kiểm tra lại token
    navigate('/admin/login');
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <a href="/admin">
          <img src="https://api-tuyendung-cty.onrender.com/images/Logo.svg" alt="Logo" />
        </a>
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
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <i className="fa-solid fa-right-from-bracket"></i> Đăng Xuất
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;