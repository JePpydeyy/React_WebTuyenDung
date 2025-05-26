import React from 'react';
import styles from './LoginForm.module.css';

const LoginForm = () => (
  <div className={styles.loginContainer}>
    <form className={styles.loginForm}>
      <div className={styles.formGroup}>
        <label htmlFor="username">
          <i className="fa-solid fa-user"></i> Tên Đăng Nhập
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Nhập tên đăng nhập"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">
          <i className="fa-solid fa-lock"></i> Mật Khẩu
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Nhập mật khẩu"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <button type="submit">
          <i className="fa-solid fa-right-to-bracket"></i> Đăng Nhập
        </button>
      </div>
    </form>
  </div>
);

export default LoginForm;