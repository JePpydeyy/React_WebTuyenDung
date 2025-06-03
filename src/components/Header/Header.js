import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css'; // Import CSS Module
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation(); // Track current route

  // Close nav when route changes
  useEffect(() => {
    setIsNavOpen(false);
  }, [location]);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  // Handle link click: reload if already on the same page
  const handleLinkClick = (path) => {
    if (location.pathname === path) {
      window.location.reload(); // Reload the page if on the same route
    }
    setIsNavOpen(false); // Close nav
  };

  return (
    <header className={styles.header}>
      <Link
        to="/"
        onClick={() => handleLinkClick('/')}
        aria-label="Go to Home page"
      >
        <img className={styles.logo} src="/assets/images/Logo.png" alt="Logo" loading="lazy" />
      </Link>
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
            <Link
              to="/"
              className={location.pathname === '/' ? styles.active : ''}
              onClick={() => handleLinkClick('/')}
              aria-label="Go to Home page"
            >
              <i className="fas fa-home"></i> Trang chủ
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === '/about' ? styles.active : ''}
              onClick={() => handleLinkClick('/about')}
              aria-label="Go to About page"
            >
              <i className="fas fa-info-circle"></i> Giới thiệu
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className={location.pathname === '/news' ? styles.active : ''}
              onClick={() => handleLinkClick('/news')}
              aria-label="Go to News page"
            >
              <i className="fas fa-newspaper"></i> Nhịp sống ACFC
            </Link>
          </li>
          <li>
            <Link
              to="/JobContent"
              className={location.pathname === '/JobContent' ? styles.active : ''} // Fixed route path
              onClick={() => handleLinkClick('/JobContent')}
              aria-label="Go to Career Opportunities page"
            >
              <i className="fas fa-briefcase"></i> Cơ hội nghề nghiệp
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={location.pathname === '/contact' ? styles.active : ''}
              onClick={() => handleLinkClick('/contact')}
              aria-label="Go to Contact page"
            >
              <i className="fas fa-envelope"></i> Liên hệ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;