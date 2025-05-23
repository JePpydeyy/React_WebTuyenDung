// src/pages/Home.js
import React from 'react';
import Header from '../components/Header/Header';
import NewsDetail from '../components/Newdetail/NewsDetail';
import Footer from '../components/Footer/Footer';


const News = () => {
  return (
    <div>
    <Header />
    <NewsDetail />
    <Footer />
    </div>
  );
};

export default News;