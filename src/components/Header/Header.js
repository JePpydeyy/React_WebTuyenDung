import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; // Import CSS Module
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <img className={styles.logo} src="/assets/images/Logo.svg" alt="Logo" loading="lazy" />
      <button
        className={`${styles['nav-toggle']} ${isNavOpen ? styles.open : ''}`}
        onClick={toggleNav}
        aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`${styles.nav} ${isNavOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => setIsNavOpen(false)} aria-label="Go to Home page">
              <i className="fas fa-home"></i> Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsNavOpen(false)} aria-label="Go to About page">
              <i className="fas fa-info-circle"></i> Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/news" onClick={() => setIsNavOpen(false)} aria-label="Go to News page">
              <i className="fas fa-newspaper"></i> Nhịp sống ACFC
            </Link>
          </li>
          <li>
            <Link to="/job" onClick={() => setIsNavOpen(false)} aria-label="Go to Career Opportunities page">
              <i className="fas fa-briefcase"></i> Cơ hội nghề nghiệp
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsNavOpen(false)} aria-label="Go to Contact page">
              <i className="fas fa-envelope"></i> Liên hệ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;