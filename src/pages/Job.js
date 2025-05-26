// src/pages/Home.js
import React from 'react';
import Header from '../components/Header/Header';
import Jobcontent from '../components/Job/Job';
import Footer from '../components/Footer/Footer';

const Job = () => {
  return (
    <div>
      <Header />
      <Jobcontent />
      <Footer />
    </div>
  );
};

export default Job;