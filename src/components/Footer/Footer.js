import React from 'react';
import styles from './Footer.module.css'; // Import CSS Module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
       
        <div className={styles['footer-columns']}>
          <div className={styles['footer-column']}>
            <h5>Thông tin liên lạc</h5>
            <div className={styles['footer-info']}>
              <p>
                <strong>Địa chỉ: </strong>110 Cao Thắng, Phường 4, Quận 3, Tp. Hồ Chí Minh, Việt Nam
              </p>
              <p>
                <strong>MST: </strong>0316402442
              </p>
              <div className={styles['footer-contact']}>
                <p>
                  <strong>Hotline: </strong>
                  <a href="tel:+84898514239" aria-label="Call our hotline">0898 514 239</a>
                </p>
                <p>
                  <strong>Email: </strong>
                  <a href="mailto:vanhanhtoanha@ppmvn.vn" aria-label="Email us">
                    vanhanhtoanha@ppmvn.vn
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className={styles['footer-column']}>
            <h5>Về chúng tôi</h5>
            <div className={styles['footer-info']}>
              <ul className={styles['footer-list']}>
                <li>
                  <a href="/about" aria-label="Learn about us">Về chúng tôi</a>
                </li>
                <li>
                  <a href="/projects" aria-label="View our projects">Dự án</a>
                </li>
                <li>
                  <a href="/services" aria-label="Explore our products and services">
                    Sản phẩm & Dịch vụ
                  </a>
                </li>
                <li>
                  <a href="/careers" aria-label="View career opportunities">Tuyển dụng</a>
                </li>
                <li>
                  <a href="/news" aria-label="Read our latest news">Tin tức</a>
                </li>
                <li>
                  <a href="/contact" aria-label="Contact us">Liên hệ</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles['footer-column']}>
            <div className={styles['social-links']}>
              <h3>Liên kết mạng xã hội</h3>
              <div className={styles['social-icons']}>
                <a
                  href="https://facebook.com"
                  className={styles['social-icon']}
                  aria-label="Visit our Facebook page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://linkedin.com"
                  className={styles['social-icon']}
                  aria-label="Visit our LinkedIn page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="https://tiktok.com"
                  className={styles['social-icon']}
                  aria-label="Visit our TikTok page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
            <div className={styles['services-section']}>
              <h3>Sản phẩm & Dịch vụ</h3>
              <ul className={styles['footer-list']}>
                <li>
                  <a href="/services/apartment-management" aria-label="Apartment building management">
                    Quản lý và vận hành tòa nhà chung cư
                  </a>
                </li>
                <li>
                  <a
                    href="/services/commercial-management"
                    aria-label="Office and commercial building management"
                  >
                    Quản lý vận hành toà nhà văn phòng/TTTM/Khu phức hợp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
       
      </div>
    </footer>
  );
};

export default Footer;