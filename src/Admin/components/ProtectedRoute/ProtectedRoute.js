import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: chưa kiểm tra, true: hợp lệ, false: không hợp lệ
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.log('Không tìm thấy token trong localStorage, chuyển hướng về /admin/login');
      navigate('/admin/login', { state: { from: location }, replace: true });
      return;
    }

      try {
        console.log('Đang gọi API kiểm tra quyền:', token);
        const response = await fetch('https://api-tuyendung-cty.onrender.com/api/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.log('API trả về lỗi:', response.status, response.statusText);
          throw new Error('Không thể xác thực');
        }

        const data = await response.json();
        console.log('Dữ liệu từ API:', data);
        const admin = data.admin;

        if (admin && admin.role === 'admin') {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          setIsAuthenticated(true);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
      }
    };

    checkAuth();
    }, [navigate, location]);

  // Nếu chưa kiểm tra xong, hiển thị trạng thái tải
  if (isAuthenticated === null || isAdmin === null) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  // Nếu không đăng nhập hoặc không phải admin, chuyển hướng về trang login
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;