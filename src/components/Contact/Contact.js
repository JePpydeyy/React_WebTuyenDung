import React, { useState } from 'react';
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

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`; // Sử dụng class CSS động
    notification.textContent = message;
    document.body.appendChild(notification);

    // Đặt vị trí thông báo nổi
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

    // Tự động xóa sau 3 giây
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

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    // Validate Vietnamese phone
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
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Không thể gửi liên hệ');
        }

        // Gửi thành công
        showNotification('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.', 'success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } catch (err) {
        console.error('Lỗi khi gửi liên hệ:', err);
        showNotification(err.message || 'Đã có lỗi khi gửi liên hệ. Vui lòng thử lại sau.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Contact Section */}
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
    </div>
  );
};

export default Contact;