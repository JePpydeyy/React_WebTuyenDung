import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

// Hàm ánh xạ trạng thái từ tiếng Anh sang tiếng Việt và gán class CSS
const getStatusInfo = (status) => {
  switch (status) {
    case 'new':
      return { text: 'Đang chờ xét duyệt', class: styles.statusDangChoXetDuyet };
    case 'interview':
      return { text: 'Đã phỏng vấn', class: styles.statusDaPhongVan };
    case 'recruitment':
      return { text: 'Đã tuyển dụng', class: styles.statusDaTuyenDung };
    case 'refuse':
      return { text: 'Đã từ chối', class: styles.statusTuChoi };
    case 'Đang chờ xét duyệt':
      return { text: status, class: styles.statusDangChoXetDuyet };
    case 'Đã phỏng vấn':
      return { text: status, class: styles.statusDaPhongVan };
    case 'Đã tuyển dụng':
      return { text: status, class: styles.statusDaTuyenDung };
    case 'Đã từ chối':
      return { text: status, class: styles.statusTuChoi };
    default:
      return { text: status, class: '' };
  }
};

// Component cho biểu đồ cột (Column Chart)
const ColumnChart = ({ allProfiles }) => {
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    const loadGoogleCharts = () => {
      if (window.google && window.google.charts) {
        drawChart();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
          window.google.charts.load('current', { packages: ['corechart'] });
          window.google.charts.setOnLoadCallback(drawChart);
        };
        script.onerror = () => setChartError('Không thể tải Google Charts');
        document.body.appendChild(script);
      }
    };

    const drawChart = () => {
      try {
        const data = new window.google.visualization.DataTable();
        data.addColumn('string', 'Trạng Thái');
        data.addColumn('number', 'Tỷ lệ (%)');

        const statusCounts = {
          'Đang chờ xét duyệt': 0,
          'Đã phỏng vấn': 0,
          'Đã tuyển dụng': 0,
          'Đã từ chối': 0,
        };

        allProfiles.forEach(profile => {
          const status = getStatusInfo(profile.status).text;
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const totalProfiles = allProfiles.length;
        const chartData = Object.entries(statusCounts).map(([key, value]) => [
          key,
          (value / totalProfiles) * 100,
        ]);
        data.addRows(chartData);

        const options = {
          title: 'Tỷ lệ trạng thái hồ sơ (%)',
          colors: ['#4A90E2', '#F5A623', '#50C878', '#E94E77'], // Màu đậm hơn
          chartArea: { width: '80%', height: '70%' },
          legend: { position: 'bottom' },
          vAxis: { 
            title: 'Tỷ lệ (%)',
            minValue: 0,
            maxValue: 100,
            format: '#.##%'
          },
          hAxis: { title: 'Trạng Thái' },
        };

        const chartElement = document.getElementById('columnchart');
        if (!chartElement) {
          setChartError('Không tìm thấy phần tử để hiển thị biểu đồ cột');
          return;
        }

        const chart = new window.google.visualization.ColumnChart(chartElement);
        chart.draw(data, options);
      } catch (err) {
        setChartError(`Lỗi khi vẽ biểu đồ cột: ${err.message}`);
      }
    };

    if (allProfiles.length > 0) {
      loadGoogleCharts();
    }
  }, [allProfiles]);

  return (
    <div>
      {chartError ? (
        <div style={{ color: 'red', marginTop: '20px' }}>{chartError}</div>
      ) : (
        <div id="columnchart" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
      )}
    </div>
  );
};

// Component cho biểu đồ tròn (Pie Chart)
const StatusChart = ({ allProfiles }) => {
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    const loadGoogleCharts = () => {
      if (window.google && window.google.charts) {
        drawChart();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
          window.google.charts.load('current', { packages: ['corechart'] });
          window.google.charts.setOnLoadCallback(drawChart);
        };
        script.onerror = () => setChartError('Không thể tải Google Charts');
        document.body.appendChild(script);
      }
    };

    const drawChart = () => {
      try {
        const data = new window.google.visualization.DataTable();
        data.addColumn('string', 'Trạng Thái');
        data.addColumn('number', 'Số Lượng');

        const statusCounts = {
          'Đang chờ xét duyệt': 0,
          'Đã phỏng vấn': 0,
          'Đã tuyển dụng': 0,
          'Đã từ chối': 0,
        };

        allProfiles.forEach(profile => {
          const status = getStatusInfo(profile.status).text;
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const chartData = Object.entries(statusCounts).map(([key, value]) => [key, value]);
        data.addRows(chartData);

        const options = {
          title: 'Thống kê trạng thái hồ sơ',
          pieHole: 0,
          colors: ['#4A90E2', '#F5A623', '#50C878', '#E94E77'], // Màu đậm hơn
          chartArea: { width: '80%', height: '80%' },
          legend: { position: 'bottom' },
        };

        const chartElement = document.getElementById('piechart');
        if (!chartElement) {
          setChartError('Không tìm thấy phần tử để hiển thị biểu đồ');
          return;
        }

        const chart = new window.google.visualization.PieChart(chartElement);
        chart.draw(data, options);
      } catch (err) {
        setChartError(`Lỗi khi vẽ biểu đồ: ${err.message}`);
      }
    };

    if (allProfiles.length > 0) {
      loadGoogleCharts();
    }
  }, [allProfiles]);

  return (
    <div>
      {chartError ? (
        <div style={{ color: 'red', marginTop: '20px' }}>{chartError}</div>
      ) : (
        <div id="piechart" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
      )}
    </div>
  );
};

const MainContent = () => {
  const [allProfiles, setAllProfiles] = useState([]); // Lưu toàn bộ hồ sơ từ API
  const [displayProfiles, setDisplayProfiles] = useState([]); // Lưu 4 hồ sơ mới nhất để hiển thị
  const [allJobs, setAllJobs] = useState([]); // Lưu toàn bộ bài đăng từ API job
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dữ liệu hồ sơ
        const profileResponse = await fetch('https://api-tuyendung-cty.onrender.com/api/profile');
        if (!profileResponse.ok) {
          throw new Error('Không thể lấy dữ liệu hồ sơ từ API');
        }
        const profileData = await profileResponse.json();
        setAllProfiles(profileData);
        const sortedProfiles = profileData.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
        setDisplayProfiles(sortedProfiles);

        // Fetch dữ liệu bài đăng
        const jobResponse = await fetch('https://api-tuyendung-cty.onrender.com/api/job');
        if (!jobResponse.ok) {
          throw new Error('Không thể lấy dữ liệu bài đăng từ API');
        }
        const jobData = await jobResponse.json();
        setAllJobs(jobData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.mainContent}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.mainContent}>Lỗi: {error}</div>;
  }

  return (
    
    <div className={styles.mainContent}>
      <h1 className={styles.heading}>
        Chào mừng quản trị viên<br />
      </h1>

      <div className={styles.metrics}>
        <div className={styles.card}>
          <h3>Tổng bài đăng tin tức</h3>
          <div className={styles.value}>{allJobs.length}</div>
        </div>
        <div className={styles.card}>
          <h3>Tổng hồ sơ ứng tuyển</h3>
          <div className={styles.value}>{allProfiles.length}</div>
        </div>
        <div className={styles.card}>
          <h3>Tổng hồ sơ tiếp nhận</h3>
          <div className={styles.value}>
            {allProfiles.filter(p => getStatusInfo(p.status).text === 'Đã tuyển dụng').length}
          </div>
        </div>
      </div>
      <div className={styles.recentOrders}>
        <h3>Hồ sơ ứng tuyển gần đây</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ Và Tên</th>
              <th>Email</th>
              <th>Số Điện Thoại</th>
              <th>Vị Trí Ứng Tuyển</th>
              <th>Ngày Nộp</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {displayProfiles.map((profile, index) => {
              const statusInfo = getStatusInfo(profile.status);
              return (
                <tr key={profile._id}>
                  <td>{index + 1}</td>
                  <td>{profile.name}</td>
                  <td>{profile.email}</td>
                  <td>{profile.phone}</td>
                  <td>{profile.position}</td>
                  <td>
                    {new Date(profile.date).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>
                    <span className={`${styles.status} ${statusInfo.class}`}>
                      {statusInfo.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Hiển thị hai biểu đồ cạnh nhau */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div style={{ width: '48%' }}>
            <ColumnChart allProfiles={allProfiles} />
          </div>
          <div style={{ width: '48%' }}>
            <StatusChart allProfiles={allProfiles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;