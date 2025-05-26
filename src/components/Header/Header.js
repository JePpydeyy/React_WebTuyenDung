
import { Link } from 'react-router-dom';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  return (
    <header>
      <img className="logo" src="/assets/images/Logo.svg" alt="Logo" />
      <nav>
        <ul>
          <li>
            <Link to="/">
              <i className="fas fa-home"></i> Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/about">
              <i className="fas fa-info-circle"></i> Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/news">
              <i className="fas fa-newspaper"></i> Nhịp sống ACFC
            </Link>
          </li>
          <li>
            <Link to="/co-hoi-nghe-nghiep">
              <i className="fas fa-briefcase"></i> Cơ hội nghề nghiệp
            </Link>
          </li>
          <li>
            <Link to="/lien-he">
              <i className="fas fa-envelope"></i> Liên hệ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
