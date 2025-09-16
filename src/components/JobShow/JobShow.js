import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./JobShow.module.css";
import { Link } from 'react-router-dom';

const JobShow = () => {
  const { jobType } = useParams();
  const jobsPerPage = 6;

  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [workplaces, setWorkplaces] = useState([]); // lưu danh sách nơi làm việc
  const [selectedWorkplace, setSelectedWorkplace] = useState(""); // lọc theo nơi làm việc

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/job`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const filteredJobs = jobType
            ? data.filter((job) => job.JobType === jobType)
            : data;

          setJobs(filteredJobs);

          // Lấy tất cả workplaces rồi tách thành mảng duy nhất
          const allWorkplaces = filteredJobs.flatMap((job) =>
            job.Workplace ? job.Workplace.split(",").map((w) => w.trim()) : []
          );
          const uniqueWorkplaces = [...new Set(allWorkplaces)];
          setWorkplaces(uniqueWorkplaces);
        } else {
          setJobs([]);
          setWorkplaces([]);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setJobs([]);
        setWorkplaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobType]);

  // Lọc job theo workplace được chọn
  const filteredJobs = selectedWorkplace
    ? jobs.filter((job) =>
        job.Workplace?.toLowerCase().includes(selectedWorkplace.toLowerCase())
      )
    : jobs;

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const showJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className={styles.jobshowBody}>
      {/* Header */}
      <div className={styles.jobshowHeader}>
        <div className={styles.jobshowHeaderContent}>
          <h1>
            {jobType ? `Công việc: ${jobType}` : "Tất cả công việc"}
          </h1>
          <p>
            {jobType
              ? `Danh sách công việc thuộc nhóm ${jobType}.`
              : "Khám phá các cơ hội việc làm hấp dẫn tại PPM."}
          </p>
        </div>
      </div>

      <div className={styles.jobshowContainer}>
        {/* Sidebar */}
        <div className={styles.jobshowSearchFilters}>
          <h3>Tìm kiếm việc làm</h3>
          <div className={styles.jobshowSearchBox}>
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Tìm kiếm việc làm, công ty..." />
          </div>

          {workplaces.length > 0 && (
            <>
              <h3>Nơi làm việc</h3>
              <div className={styles.jobshowSearchButon}>
                {workplaces.map((place, idx) => (
                  <a
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedWorkplace(place === selectedWorkplace ? "" : place);
                      setCurrentPage(1);
                    }}
                    className={
                      place === selectedWorkplace ? styles.activeFilter : ""
                    }
                  >
                    {place}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Job Listings */}
        <div className={styles.jobshowJobListings}>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : filteredJobs.length === 0 ? (
            <p>
              {jobType
                ? `Không tìm thấy công việc nào thuộc nhóm ${jobType}.`
                : "Hiện tại chưa có công việc nào."}
            </p>
          ) : (
            <div className={styles.jobshowJobCards}>
              {showJobs.map((job) => (
                <div className={styles.jobshowJobCard} key={job._id}>
                  <div className={styles.jobshowJobInfo}>
                    <div className={styles.jobshowJobTitle}>{job.Name}</div>
                    <div className={styles.jobshowCompanyInfo}>
                      <span className={styles.jobshowCompanyName}>
                        {job.Brands?.join(", ")}
                      </span>
                      <span className={styles.jobshowDivider}>|</span>
                      <span>{job.Workplace}</span>
                      <span className={styles.jobshowDivider}>|</span>
                      <span>{job.Position}</span>
                      <span className={styles.jobshowDivider}>|</span>
                      <span>
                        {new Date(job["Post-date"]).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className={styles.jobshowJobMeta}>
                        <Link to={`/DetailJob/${job._id}`} className={styles.jobshowViewBtn}>
                            Xem chi tiết
                        </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredJobs.length > 0 && (
            <div className={styles.jobshowPagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? styles.active : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobShow;
