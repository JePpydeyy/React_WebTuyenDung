
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState({});
  const [answerHeights, setAnswerHeights] = useState({});
  const answerRefs = useRef([]);

  const faqData = [
    {
      question: '1. Làm thế nào để nộp hồ sơ ứng tuyển?',
      answer: 'Để nộp hồ sơ ứng tuyển, bạn cần chuẩn bị đầy đủ các tài liệu như CV, bản sao bằng cấp, giấy tờ chứng nhận kinh nghiệm làm việc, và một bức thư giới thiệu nếu có. Sau khi hoàn tất, bạn có thể gửi qua email tại địa chỉ vanhanhsaigon@ppmvn.vn hoặc nộp trực tiếp tại văn phòng công ty ở 110 Cao Thắng, Phường 4, Quận 3, TP. Hồ Chí Minh. Hãy đảm bảo rằng hồ sơ được sắp xếp gọn gàng và nộp trước thời hạn quy định để được xem xét kỹ lưỡng.',
    },
    {
      question: '2. Thời gian xử lý hồ sơ ứng tuyển là bao lâu?',
      answer: (
        <>
          Thời gian xử lý hồ sơ ứng tuyển thường kéo dài từ 5 đến 7 ngày làm việc, tùy thuộc vào số lượng ứng viên và sự phức tạp của vị trí bạn ứng tuyển. Sau khi nộp hồ sơ, ban tuyển dụng sẽ tiến hành sàng lọc và liên hệ với bạn qua email hoặc điện thoại nếu hồ sơ đạt yêu cầu. Trong trường hợp cần thêm thông tin, chúng tôi sẽ thông báo để bạn bổ sung trong vòng 3 ngày.
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Giai đoạn</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Sàng lọc hồ sơ</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>2-3 ngày</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Phỏng vấn</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>1-2 ngày</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Thông báo kết quả</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>1 ngày</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
    },
    {
      question: '3. Yêu cầu cơ bản để trở thành ứng viên phù hợp là gì?',
      answer: 'Để trở thành ứng viên phù hợp, bạn cần có bằng cấp liên quan đến vị trí ứng tuyển, tối thiểu 1 năm kinh nghiệm làm việc trong lĩnh vực tương tự, và kỹ năng giao tiếp tốt. Ngoài ra, sự nhiệt huyết, tinh thần trách nhiệm và khả năng làm việc nhóm là những yếu tố quan trọng mà chúng tôi đánh giá cao. Nếu bạn có chứng chỉ bổ sung hoặc kinh nghiệm quốc tế, điều này sẽ là một lợi thế lớn.',
    },
    {
      question: '4. Điều gì xảy ra sau khi được chấp thuận ứng tuyển?',
      answer: 'Sau khi được chấp thuận, bạn sẽ nhận được thông báo chính thức qua email hoặc điện thoại trong vòng 3 ngày làm việc. Tiếp theo, chúng tôi sẽ gửi hợp đồng làm việc và thông tin về ngày bắt đầu cũng như các thủ tục cần hoàn tất như khám sức khỏe định kỳ và ký kết giấy tờ. Bạn cũng sẽ được hướng dẫn tham gia chương trình đào tạo nội bộ để làm quen với quy trình làm việc tại công ty.',
    },
  ];

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.color = '#fff';
    notification.style.backgroundColor = type === 'success' ? '#4caf50' : '#f44336';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            createdAt: new Date().toISOString(),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Không thể gửi liên hệ');
        }

        showNotification('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        fetchContacts();
      } catch (err) {
        console.error('Lỗi khi gửi liên hệ:', err);
        showNotification(err.message || 'Đã có lỗi khi gửi liên hệ. Vui lòng thử lại sau.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contact`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      const sortedContacts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setContacts(sortedContacts);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách liên hệ:', error);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/new?category=interview_tip`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      console.log('API Response:', data); // Debugging: Log raw API response

      // Handle different response structures
      const articles = Array.isArray(data) ? data : data.news || data.data || [];
      if (!Array.isArray(articles)) {
        console.error('API response is not an array:', data);
        throw new Error('Dữ liệu bài viết không hợp lệ');
      }

      // Filter and sort news
      const sortedData = articles
        .filter(item => item && item.status === 'show' && item.category === 'interview_tip')
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      console.log('Filtered Articles:', sortedData); // Debugging: Log filtered articles

      setNewsData(sortedData);
      if (sortedData.length === 0) {
        showNotification('Không tìm thấy bài viết Tip phỏng vấn', 'info');
      }
    } catch (error) {
      console.error('Lỗi khi lấy tin tức:', error);
      setNewsData([]);
      showNotification(`Lỗi khi lấy tin tức: ${error.message}`, 'error');
    } finally {
      setNewsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '');
    return `${baseUrl}/${url.replace(/^\/+/, '')}`;
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ((prev) => ({
      [index]: !prev[index]
    }));
  };

  useLayoutEffect(() => {
    faqData.forEach((_, index) => {
      if (answerRefs.current[index]) {
        const height = answerRefs.current[index].scrollHeight + 32;
        setAnswerHeights((prev) => ({
          ...prev,
          [index]: height,
        }));
      }
    });
  }, [expandedFAQ]);

  useEffect(() => {
    fetchContacts();
    fetchNews();
  }, []);

  return (
    <div className={styles.container}>
      {/* Contact Section */}
      <h1 className={styles.titlecontact}>Liên hệ với chúng tôi</h1>
      <div className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <div className={styles.contactGrid}>
            {/* Company Info */}
            <div className={styles.companyInfo}>
              <div className={styles.companyHeader}>
                <h2 className={styles.companyTitle}>
                  CÔNG TY TNHH QUẢN LÝ TÀI SẢN PREMIER VIỆT NAM (PPM.VN)
                </h2>
                <p className={styles.companySubtitle}>
                  Premier Property Management Viet Nam Company Limited.
                </p>
              </div>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <div className={`${styles.contactIcon} ${styles.locationIcon}`}>
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <span className={styles.contactText}>
                    110 Cao Thắng, Phường 4, Quận 3, Tp. Hồ Chí Minh, Việt Nam
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <div className={`${styles.contactIcon} ${styles.phoneIcon}`}>
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <span className={styles.contactText}>0935 514 239</span>
                </div>
                <div className={styles.contactItem}>
                  <div className={`${styles.contactIcon} ${styles.emailIcon}`}>
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <span className={styles.contactText}>vanhanhsaigon@ppmvn.vn</span>
                </div>
                <div className={styles.contactItem}>
                  <div className={`${styles.contactIcon} ${styles.socialIcon}`}>
                    <i className="fa-brands fa-facebook"></i>
                  </div>
                  <span className={styles.socialLinks}>
                    <a
                      href="https://www.facebook.com/PPM.VN.Ltd"
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.contactForm}>
              <h3 className={styles.formTitle}>Chúng tôi có thể giúp gì cho bạn?</h3>
              <p className={styles.formSubtitle}>
                Vui lòng để lại thông tin, chúng tôi sẽ liên lạc trong thời gian sớm nhất.
              </p>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                  {formErrors.name && <p className={styles.errorText}>{formErrors.name}</p>}
                </div>
                <div className={styles.formRow}>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                    {formErrors.email && <p className={styles.errorText}>{formErrors.email}</p>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Điện thoại *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                    {formErrors.phone && <p className={styles.errorText}>{formErrors.phone}</p>}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <textarea
                    name="message"
                    placeholder="Nội dung"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`${styles.formInput} ${styles.formTextarea}`}
                  />
                </div>
                <div className={styles.formSubmit}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang gửi...' : 'GỬI YÊU CẦU'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <div className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <div className={styles.mapWrapper}>
            <iframe
              title="Google Map - PPM Việt Nam"
              src="https://www.google.com/maps?q=110%20Cao%20Th%E1%BA%AFng%2C%20Ph%C6%B0%E1%BB%9Dng%204%2C%20Qu%E1%BA%ADn%203%2C%20TP.HCM&z=16&output=embed"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className={styles.newsSection}>
        <div className={styles.newsContainer}>
          <h1 className={styles.newsTitle}>Tips Phỏng Vấn</h1>
          {newsLoading ? (
            <div className={styles.newsLoading}>
              <div className={styles.spinner}></div>
              Đang tải tin tức...
            </div>
          ) : newsData.length > 0 ? (
            <div className={styles.newsGrid}>
              {newsData.map((post) => (
                <div className={styles.newsItem} key={post._id || post.id}>
                  <div className={styles.newsImageContainer}>
                    <img
                      src={getImageUrl(post.thumbnailUrl)}
                      alt={post.title}
                      className={styles.newsImage}
                    />
                    <div className={styles.newsOverlay}>
                      <h3 className={styles.newsItemTitle}>{post.title}</h3>
                    </div>
                    <div className={styles.newsHoverInfo}>
                      <h3 className={styles.newsItemTitle}>{post.title}</h3>
                      <p className={styles.newsDate}>
                        Ngày đăng: {formatDate(post.publishedAt)}
                      </p>
                      <p className={styles.newsExcerpt}>
                        {post.contentBlocks &&
                        post.contentBlocks[0] &&
                        post.contentBlocks[0].content
                          ? post.contentBlocks[0].content.slice(0, 80) + '...'
                          : ''}
                      </p>
                      <Link to={`/news/${post.slug}`} className={styles.newsViewMore}>
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noNews}>Không có bài viết nào.</div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <div className={styles.faqContainer}>
          <h1 className={styles.faqTitle}>Câu hỏi thường gặp</h1>
          <div className={styles.faqList}>
            {faqData.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <div
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(index)}
                >
                  {item.question}
                </div>
                <div
                  ref={(el) => (answerRefs.current[index] = el)}
                  className={`${styles.faqAnswer} ${expandedFAQ[index] ? styles.expanded : ''}`}
                  style={{
                    height: expandedFAQ[index] ? `${answerHeights[index] || 0}px` : '0',
                  }}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
