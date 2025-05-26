import React from 'react';
import styles from './dashboard.module.css';

const MainContent = () => (
  <div className={styles.mainContent}>
    <div className={styles.metrics}>
      <div className={styles.card}>
        <h3>Tổng bài đăng tin tức</h3>
        <div className={styles.value}>20</div>
      </div>
      <div className={styles.card}>
        <h3>Tổng hồ sơ ứng tuyển</h3>
        <div className={styles.value}>12</div>
      </div>
      <div className={styles.card}>
        <h3>Tổng hồ sơ tiếp nhận</h3>
        <div className={styles.value}>10</div>
      </div>
    </div>
    <div className={styles.recentOrders}>
      <h3>Hồ sơ ứng tuyển gần đây</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ Và Tên</th>
            <th>Email</th>
            <th>Số Điện Thoại</th>
            <th>Vị Trí Ứng Tuyển</th>
            <th>Ngày Nộp</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Đinh Thế Nhân</td>
            <td>nhandtps40210@gmail.com</td>
            <td>0342031354</td>
            <td>Senior Training Executive</td>
            <td>27-08-2024 12:12</td>
            <td><span className={`${styles.status} ${styles.statusDangChoXetDuyet}`}>Đang chờ xét duyệt</span></td>
          </tr>
          <tr>
            <td>2</td>
            <td>Đinh Thế Nhân</td>
            <td>nhandtps40210@gmail.com</td>
            <td>0342031354</td>
            <td>Customer Service Executive</td>
            <td>27-08-2024 12:12</td>
            <td><span className={`${styles.status} ${styles.statusDaDuyet}`}>Đã duyệt</span></td>
          </tr>
          <tr>
            <td>3</td>
            <td>Đinh Thế Nhân</td>
            <td>nhandtps40210@gmail.com</td>
            <td>0342031354</td>
            <td>Content Marketing Intern</td>
            <td>27-08-2024 12:12</td>
            <td><span className={`${styles.status} ${styles.statusDaDuyet}`}>Đã duyệt</span></td>
          </tr>
          <tr>
            <td>4</td>
            <td>Đinh Thế Nhân</td>
            <td>nhandtps40210@gmail.com</td>
            <td>0342031354</td>
            <td>Operations Manager (E-commerce)</td>
            <td>27-08-2024 12:12</td>
            <td><span className={`${styles.status} ${styles.statusDangChoXetDuyet}`}>Đang chờ xét duyệt</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default MainContent; // Sửa từ Metrics thành MainContent để khớp với tên thành phần