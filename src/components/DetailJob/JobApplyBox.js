import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import styles from "./JobApplyBox.module.css";

const JobApplyModal = ({ job, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    workplace: "",
    fullName: "",
    phone: "",
    gender: "",
    dob: "",
    email: "",
    note: "",
    resume: null,
  });
  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  const parseWorkplaces = (workplaceString) => {
    if (!workplaceString) return [];
    return workplaceString.split("-")[0].split(",").map((p) => p.trim()).filter((p) => p !== "");
  };
  const workplaceOptions = parseWorkplaces(job?.Workplace);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, resume: "File CV không được vượt quá 5MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, resume: file }));
      setFormErrors((prev) => ({ ...prev, resume: null }));
    } else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.workplace) errors.workplace = "Chọn địa điểm làm việc";
    if (!formData.fullName.trim()) errors.fullName = "Nhập họ tên";
    if (!formData.phone.trim()) errors.phone = "Nhập số điện thoại";
    else if (!/^\d{10,11}$/.test(formData.phone.trim())) errors.phone = "Số điện thoại không hợp lệ";
    if (!formData.gender) errors.gender = "Chọn giới tính";
    if (!formData.dob) errors.dob = "Chọn ngày sinh";
    else if (new Date(formData.dob) > new Date()) errors.dob = "Ngày sinh không thể là tương lai";
    if (!formData.email.trim()) errors.email = "Nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.email = "Email không hợp lệ";
    if (!formData.resume) errors.resume = "Chọn file CV";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Vui lòng điền đầy đủ thông tin hợp lệ.");
      return;
    }

    const dobISO = formData.dob ? new Date(formData.dob).toISOString() : "";

    const form = {
      desiredWorkplace: formData.workplace,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      dob: dobISO,
      email: formData.email.trim(),
      note: formData.note.trim(),
    };

    const applicationData = new FormData();
    applicationData.append("jobId", job._id || "");
    applicationData.append("jobName", job?.Name || "");
    applicationData.append("jobWorkplace", job?.Workplace || "");
    applicationData.append("form", JSON.stringify(form));
    applicationData.append("status", "pending");
    if (formData.resume) applicationData.append("resume", formData.resume);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "POST",
        body: applicationData,
      });
      if (!res.ok) throw new Error("Không thể gửi ứng tuyển");
      alert("Ứng tuyển thành công! Chúng tôi sẽ liên hệ sớm.");
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Ứng tuyển ngay</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>Vị trí:</strong> {job.Name}</p>
          <p><strong>Nơi làm việc:</strong> {job.Workplace}</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Địa điểm làm việc<span>*</span></label>
              <select name="workplace" value={formData.workplace} onChange={handleChange}>
                <option value="">- Chọn địa điểm -</option>
                {workplaceOptions.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
              </select>
              {formErrors.workplace && <span className={styles.error}>{formErrors.workplace}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Họ và tên<span>*</span></label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                {formErrors.fullName && <span className={styles.error}>{formErrors.fullName}</span>}
              </div>
              <div className={styles.formGroup}>
                <label>Điện thoại<span>*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                {formErrors.phone && <span className={styles.error}>{formErrors.phone}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Giới tính<span>*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">- Chọn -</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                {formErrors.gender && <span className={styles.error}>{formErrors.gender}</span>}
              </div>
              <div className={styles.formGroup}>
                <label>Ngày sinh<span>*</span></label>
                <input type="date" name="dob" value={formData.dob} max={new Date().toISOString().split('T')[0]} onChange={handleChange} />
                {formErrors.dob && <span className={styles.error}>{formErrors.dob}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email<span>*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {formErrors.email && <span className={styles.error}>{formErrors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Ghi chú</label>
              <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
            </div>

            <div className={styles.formGroup}>
              <label>CV (PDF/DOC/DOCX, max 5MB)<span>*</span></label>
              <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} />
              {formErrors.resume && <span className={styles.error}>{formErrors.resume}</span>}
            </div>

            <div className={styles.modalFooter}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>Đóng</button>
              <button type="submit" className={styles.submitBtn}>Ứng tuyển</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplyModal;
