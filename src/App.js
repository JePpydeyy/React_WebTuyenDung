import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import News from './pages/News';
import About from './pages/About';
import Contact from './pages/Contact';
import Jobcontent from './pages/Job';
import JobDetail  from './pages/JobDetail'
import NewsDetail from './pages/NewsDetail';
import Dashboard from './Admin/pages/Dashboard';
import SubmitProfile from './Admin/pages/SubmitProfile';
import Job from './Admin/pages/Job';
import AdminNews from './Admin/pages/News';
import Login from './Admin/pages/Login';
import ProtectedRoute from './Admin/components/ProtectedRoute/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Các route công khai */}
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

          {/* Route đăng nhập admin */}
          <Route path="/admin/login" element={<Login />} />

          {/* Các route được bảo vệ cho admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submit-profile"
            element={
              <ProtectedRoute>
                <SubmitProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/Job"
            element={
              <ProtectedRoute>
                <Job />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/News"
            element={
              <ProtectedRoute>
                <AdminNews />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;