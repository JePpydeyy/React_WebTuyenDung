import React from 'react';
import { Link } from 'react-router-dom';
import styles from './New.module.css';

const newsData = [
  {
    id: 1,
    title: 'ACFC Tuyển Dụng Nhân Sự Mới',
    date: '27-08-2024 12:12',
    status: 'Đang hiển thị',
    statusClass: 'statusDanghienthi',
  },
  {
    id: 2,
    title: 'Chương Trình Đào Tạo Mới Tại ACFC',
    date: '26-08-2024 09:30',
    status: 'Đang ẩn',
    statusClass: 'statusDangcho',
  },
  {
    id: 3,
    title: 'ACFC Kỷ Niệm 10 Năm Thành Lập',
    date: '25-08-2024 15:45',
    status: 'Đang hiển thị',
    statusClass: 'statusDanghienthi',
  },
];

const NewsList = () => (
  <div className={styles.container}>
    <h3 className={styles.newsListTitle}>Danh Sách Tin Tức</h3>
    <Link to="/admin/themtintuc" className={styles.addNewsBtn}>Thêm Tin Tức</Link>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tiêu Đề</th>
          <th>Ngày Đăng</th>
          <th>Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        {newsData.map(news => (
          <tr key={news.id}>
            <td>{news.id}</td>
            <td>{news.title}</td>
            <td>{news.date}</td>
            <td>
              <span className={`${styles.status} ${styles[news.statusClass]}`}>{news.status}</span>
            </td>
            <td>
              <Link
                to={`/admin/edittintuc/${news.id}`}
                className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
              >
                Chỉnh Sửa
              </Link>
              <button
                className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default NewsList;