import React, { useEffect, useState } from "react";
import "./JobRouter.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from 'react-router-dom';

export default function MainRouter() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/job`);
        const data = await res.json();
        const jobData = Array.isArray(data) ? data : [data];
        setJobs(jobData);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Gom nhóm theo JobType
  const groupedJobs = jobs.reduce((acc, job) => {
    if (!acc[job.JobType]) acc[job.JobType] = [];
    acc[job.JobType].push(job);
    return acc;
  }, {});

  return (
    <div className="main-container">
      <nav className="career-nav">
        <ul className="career-nav-list">
          <li>
            <a href="#" className="career-nav-link">
              <i className="fas fa-star career-nav-icon"></i> Admin - Leasing
            </a>
          </li>
          <li>
            <a href="#" className="career-nav-link">
              <i className="fas fa-star career-nav-icon"></i> Admin Dự Án
            </a>
          </li>
          <li>
            <a href="#" className="career-nav-link">
              <i className="fas fa-star career-nav-icon"></i> Quản lí Dự án
            </a>
          </li>
          <li>
            <a href="#" className="career-nav-link">
              <i className="fas fa-star career-nav-icon"></i> Vận Hành
            </a>
          </li>
        </ul>
      </nav>

      <div className="career-container">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          Object.keys(groupedJobs).map((jobType) => (
            <div className="career-card" key={jobType}>
              <div className="career-img-container">
                <img
                  src="https://imgt.taimienphi.vn/cf/Images/np/2022/8/16/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg"
                  alt={jobType}
                  className="career-image"
                />
              </div>
              <div className="career-content">
                <h3 className="career-title">{jobType}</h3>
                <ul className="career-list">
                  {groupedJobs[jobType].slice(0, 3).map((job) => (
                    <li key={job._id} className="career-list-item">
                      {job.Name}
                    </li>
                  ))}
                </ul>
                  <Link to={`/jobshow/${jobType}`} className="career-button">
                    XEM THÊM
                  </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
