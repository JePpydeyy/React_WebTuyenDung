import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import News from './pages/News';
import About from './pages/About';
import UserContact from './pages/Contact'; // Đổi tên import cho trang người dùng
import Jobcontent from './pages/Job';
import JobDetail from './pages/JobDetail';
import NewsDetail from './pages/NewsDetail';
import Dashboard from './Admin/pages/Dashboard';
import SubmitProfile from './Admin/pages/SubmitProfile';
import Job from './Admin/pages/Job';
import AdminNews from './Admin/pages/News';
import AdminContact from './Admin/pages/Contact'; // Đổi tên import cho trang admin
// import Banner from './Admin/pages/Banner'; // Thêm import cho Banner
import Login from './Admin/pages/Login';
import ProtectedRoute from './Admin/components/ProtectedRoute/ProtectedRoute';
import './App.css';
import { AuthProvider } from './Admin/components/AuthContext/AuthContext';
import JobShow from './pages/JobShow';

function App() {
  return (
    <AuthProvider>
      <Router>  
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<UserContact />} /> {/* Sử dụng UserContact */}
            <Route path="/JobContent" element={<Jobcontent />} />
            <Route path="/DetailJob/:jobId" element={<JobDetail />} />
            <Route path="/jobshow/:jobType" element={<JobShow />} />

            {/* Admin login route */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin protected routes */}
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
              path="/admin/jobs"
              element={
                <ProtectedRoute>
                  <Job />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/news"
              element={
                <ProtectedRoute>
                  <AdminNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contact"
              element={
                <ProtectedRoute>
                  <AdminContact /> {/* Sử dụng AdminContact */}
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;