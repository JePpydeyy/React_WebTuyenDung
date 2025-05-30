import React from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <main className={styles.mainContainer}>
      <section className={styles.contactSection}>
        <div className={styles.contactInfo}>
          <div className={styles.contactInfoBlock}>
            <h2>* Chúng tôi luôn lắng nghe bạn *</h2>
            <h2>* Hãy liên lạc với chúng tôi *</h2>
            <div className={styles.region}>
              <h3>Miền Nam</h3>
              <p>
                Hotline: <strong>091 803 7466</strong>
              </p>
              <p>
                Email: <strong>recruitment@acfc.com.vn</strong>
              </p>
            </div>
            <div className={styles.region}>
              <h3>Miền Bắc</h3>ca
              <p>
                Hotline: <strong>090 485 5042</strong>
              </p>
              <p>
                Email: <strong>recruitment.hn@acfc.com.vn</strong>
              </p>
            </div>
            <div className={styles.socialIcons}>
              <div className={styles.icon}>
                <i className="fa-brands fa-facebook-f"></i>
                <a href="#">ACFC Fanpage</a>
              </div>
              <div className={styles.icon}>
                <i className="fa-brands fa-linkedin-in"></i>
                <a href="#">ACFC Linkedin</a>
              </div>
              <div className={styles.icon}>
                <i className="fa-brands fa-tiktok"></i>
                <a href="#">ACFC Tiktok</a>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4376182930743!2d106.70175537502368!3d10.776889259203804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3dd6199055%3A0xe665fcfd9335e11b!2sSonatus%20Building!5e0!3m2!1sen!2s!4v1716614022359!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
};

export default Contact;