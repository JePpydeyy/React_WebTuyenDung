import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import News from './pages/News'; // Trang tin tức cho người dùng
import About from './pages/About';
import Contact from './pages/Contact';
import Jobcontent from './pages/Job';
import JobDetail  from './pages/JobDetail'
import NewsDetail from './pages/NewsDetail';
import Dashboard from './Admin/pages/Dashboard';
import SubmitProfile from './Admin/pages/SubmitProfile';
import Job from './Admin/pages/Job';
import AdminNews from './Admin/pages/News'; // Đổi tên import này
import Login from './Admin/pages/Login';
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
          <Route path="/Job" element={<Jobcontent />} />
          <Route path="/DetailJob/:jobId" element={<JobDetail/>}/>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/submit-profile" element={<SubmitProfile />} />
          <Route path="/admin/Job" element={<Job />} />
          <Route path="/admin/News" element={<AdminNews />} /> 

        </Routes>
      </div>
    </Router>
  );
}

export default App;