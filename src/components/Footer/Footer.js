import React from 'react';
import styles from './Footer.module.css'; // Import CSS Module
import { Link} from 'react-router-dom';

const Footer = () => {

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
       
        <div className={styles['footer-columns']}>
          <div className={styles['footer-column']}>
            <h5>Thông tin liên lạc</h5>
            <div className={styles['footer-info']}>
               <p>
                <strong>Công ty TNHH Quản lý tài sản Premier Việt Nam (PPM.VN) </strong>
              </p>
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
               <Link
        to="/"
       
        aria-label="Go to Home page"
      >
        <img className={styles.logo} src="/assets/images/logofooter.png" alt="Logo" loading="lazy" />
              </Link>
            </div>
          </div>
          <div className={styles['footer-column']}>
            <h5>Về chúng tôi</h5>
            <div className={styles['footer-info']}>
              <ul className={styles['footer-list']}>
                <li>
                  <a href="/" aria-label="Learn about us">Trang chủ</a>
                </li>
                <li>
                  <a href="/about" aria-label="View our projects"> Về PPMVN</a>
                </li>
                
                <li>
                  <a href="/news" aria-label="Explore our products and services">
                    Life at PPMVN
                  </a>
                </li>
                 <li>
                  <a href="/JobContent" aria-label="View our projects"> Cơ hội nghề nghiệp</a>
                </li>
                <li>
                  <a href="/contact" aria-label="View career opportunities">Thông tin liên hệ</a>
                </li>
                
              </ul>
            </div>
          </div>
          <div className={styles['footer-column']}>
            <div className={styles['social-links']}>
              <h3>Liên kết mạng xã hội</h3>
              <div className={styles['social-icons']}>
                <a
                  href="https://www.facebook.com/PPM.VN.Ltd"
                  className={styles['social-icon']}
                  aria-label="Visit our Facebook page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/quanlitaisanpremiervn/"
                  className={styles['social-icon']}
                  aria-label="Visit our LinkedIn page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="https://ppmvn.vn/"
                  className={styles['social-icon']}
                  aria-label="Linkwebsite"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="fa-solid fa-link"></i>
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
        <hr></hr>
        <p>© 2025 PPMVN. All Rights Reserved</p>
       
      </div>
    </footer>
  );
};

export default Footer;