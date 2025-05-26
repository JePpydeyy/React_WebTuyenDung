// src/pages/Home.js
import React from 'react';
import Header from '../components/Header/Header';
import JobDetail from '../components/DetailJob/JobDetail';
import Footer from '../components/Footer/Footer';

const DetailJob = () => {
  return (
    <div>
      <Header />
      <JobDetail/>
      <Footer />
    </div>
  );
};

export default DetailJob;