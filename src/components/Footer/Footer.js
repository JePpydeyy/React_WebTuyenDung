import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/assets/images/logo_w.png" alt="ACFC Logo" />
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h5>Miền Nam</h5>
            <div className="footer-info">
              <p><strong>Địa chỉ trụ sở một:</strong> 15B/B Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
              <p><strong>Địa chỉ giao dịch:</strong> Lầu 12, Tòa nhà Sonatus Building, 15 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
              <div className="footer-contact">
                <p><strong>Hotline:</strong> 091 803 7466</p>
                <p><strong>Email:</strong> recruitment@acfc.com.vn</p>
              </div>
            </div>
          </div>
          <div className="footer-column">
            <h5>Miền Bắc</h5>
            <div className="footer-info">
              <p><strong>Văn phòng Hà Nội:</strong> Tầng 2, 16 Phan Chu Trinh, Q. Hoàn Kiếm, Hà Nội</p>
              <div className="footer-contact">
                <p><strong>Hotline:</strong> 024 73000535</p>
                <p><strong>Email:</strong> recruitment.hn@acfc.com.vn</p>
              </div>
            </div>
          </div>
          <div className="footer-column">
            <div className="social-links">
              <h3>Liên kết mạng xã hội</h3>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
            <div className="ippg-section">
              <h3>Thành viên thuộc tập đoàn IPPG</h3>
              <div className="ippg-logo">IPPG</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;