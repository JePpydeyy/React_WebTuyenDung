import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import News from './pages/News'; // Trang tin tức cho người dùng
import About from './pages/About';
import Contact from './pages/Contact';
import NewsDetail from './pages/NewsDetail';
import Jobcontent from './pages/Job';
import JobDetail  from './pages/JobDetail'
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/News" element={<News />} />
          <Route path="/News/:id" element={<NewsDetail />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact/>} />
          <Route path ="/Job" element={<Jobcontent />} />
          <Route path="/DetailJob/:jobId" element={<JobDetail/>} />
          {/* Thêm các route khác nếu cần, ví dụ: */}
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;