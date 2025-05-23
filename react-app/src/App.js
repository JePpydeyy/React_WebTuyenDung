import React from 'react';
import Header from './Header';
import Banner from './Banner';
import LatestPosts from './LatestPosts';
import FeaturedPosts from './FeaturedPosts';
import Footer from './Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Banner />
      <LatestPosts />
      <FeaturedPosts />
      <Footer />
    </div>
  );
}

export default App;