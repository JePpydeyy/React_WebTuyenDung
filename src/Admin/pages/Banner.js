import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Banner from '../components/Banner/Banner'; // Import Banner component
import styles from '../components/Banner/Banner.module.css';

const BannerPage = () => (
  <>
    <Sidebar />
    <div className={styles.mainContent}>
      <div className={styles.header}>
      </div>
      <Banner />
    </div>
  </>
);

export default BannerPage;