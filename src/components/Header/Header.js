import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <img className="logo" src="/assets/images/Logo.svg" alt="Logo" />
      <nav>
        <ul>
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/about">Giới thiệu</Link></li>
          <li><Link to="/news">Nhịp sống ACFC</Link></li>
          <li><Link to="/co-hoi-nghe-nghiep">Cơ hội nghề nghiệp</Link></li>
          <li><Link to="/lien-he">Liên hệ</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;