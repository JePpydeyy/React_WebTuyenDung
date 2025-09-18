import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./JobDetail.module.css";
import JobApplyBox from "./JobApplyBox";

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/job/${jobId}`);
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu job");
        const data = await res.json();
        setJob(data);

        // Lấy công việc liên quan dựa trên Brand
        const relatedRes = await fetch(`${process.env.REACT_APP_API_URL}/job`);
        const allJobs = await relatedRes.json();
        const related = allJobs.filter(
          (item) => item._id !== data._id && item.Brands.some(b => data.Brands.includes(b))
        );
        setRelatedJobs(related);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJob();
  }, [jobId]);

  if (!job) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className={styles.container}>
      {/* Left Box */}
      <div className={styles.leftBox}>
        <Link to={`/jobshow/${job.JobType}`} className={styles.backLink}>
          Quay lại
        </Link>

        <div className={styles.header}>
          <h2>{job.Name}</h2>
        </div>

        <div className={styles.info}>
          <h3><i className="fas fa-tasks"></i> Mô tả công việc:</h3>
          <ul>
            {job["Job Description"].map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>

          <h3><i className="fas fa-clipboard-check"></i> Yêu cầu:</h3>
          <ul>
            {job["Job Requirements"].map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>

          <h3><i className="fas fa-gift"></i> Quyền lợi:</h3>
          <ul>
            {job.Welfare.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>

        {/* Nút mở modal ứng tuyển */}
        <button
          className={styles.applyBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-paper-plane"></i> Ứng tuyển ngay
        </button>

        {/* Modal ứng tuyển */}
        <JobApplyBox
          job={job}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>

      {/* Right Box */}
   <div className={styles.rightBox}>
  <div className={styles.details}>
    <div>
      <div>
        <i className="fas fa-money-bill-wave"></i>
        <span>Mức lương:</span>
      </div>
      <p>{job.Salary}</p>
    </div>
    <div>
      <div>
        <i className="fas fa-map-marker-alt"></i>
        <span>Địa điểm:</span>
      </div>
      <p>{job.Workplace}</p>
    </div>
    <div>
      <div>
        <i className="fas fa-graduation-cap"></i>
        <span>Bằng cấp:</span>
      </div>
      <p>{job.Degree}</p>
    </div>
    <div>
      <div>
        <i className="fas fa-users"></i>
        <span>Số lượng:</span>
      </div>
      <p>{job.Slot}</p>
    </div>
    <div>
      <div>
        <i className="fas fa-briefcase"></i>
        <span>Kinh nghiệm:</span>
      </div>
      <p>{job["Work Experience"]}</p>
    </div>
    <div>
      <div>
        <i className="far fa-calendar-alt"></i>
        <span>Hạn nộp:</span>
      </div>
      <p>{new Date(job["Due date"]).toLocaleDateString()}</p>
    </div>
  </div>

  {relatedJobs.length > 0 && (
    <>
      <div className={styles.sectionTitle}>
        <i className="fas fa-briefcase"></i> Công việc liên quan
      </div>

      {relatedJobs.map((item) => (
        <div key={item._id} className={styles.jobList}>
          <h4>{item.Name}</h4>
          <div>
            <i className="fas fa-map-marker-alt"></i> {item.Workplace} |{" "}
            <i className="fas fa-graduation-cap"></i> {item.Degree} |{" "}
            <i className="far fa-calendar-alt"></i>{" "}
            {new Date(item["Due date"]).toLocaleDateString()}
          </div>
          <Link to={`/Detailjob/${item._id}`} className={styles.viewBtn}>
            Xem ngay
          </Link>
        </div>
      ))}

      <Link to={`/jobshow/${job.JobType}`} className={styles.moreBtn}>
        Xem thêm
      </Link>
    </>
  )}
      </div>
    </div>
  );
};

export default JobDetail;
