// src/pages/Home.js
import React from 'react';
import Header from '../components/Header/Header';
import JobShow from '../components/JobShow/JobShow';
import Footer from '../components/Footer/Footer';

const DetailJob = () => {
  return (
    <div>
      <Header />
      <JobShow/>
      <Footer />
    </div>
  );
};

export default DetailJob;