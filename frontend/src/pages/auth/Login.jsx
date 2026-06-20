import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        username: formData.username,
        password: formData.password,
      });

      const data = response.data;

      // 1. Lưu token xác thực
      sessionStorage.setItem('token', data.token);
      // 2. Lưu thông tin user đầy đủ
      sessionStorage.setItem('currentUser', JSON.stringify(data.user));
      alert('Đăng nhập thành công');

      // 3. Kích hoạt Navbar và Giỏ hàng cập nhật dữ liệu
      window.dispatchEvent(new Event('cart_updated'));

      // 4. Kiểm tra phân quyền dựa theo RoleID của Database (1 là Admin, 2 là User)
      const userRole = data.user.RoleID || data.user.roleID || data.user.Role || data.user.role;
      
      if (userRole === 1 || userRole === '1' || userRole === 'Admin' || userRole === 'admin') {
        // Nếu là Admin, dùng window.location.href để load lại giao diện Admin chỉn chu
        window.location.href = '/admin';
      } else {
        // Nếu là khách, dùng navigate về trang chủ mượt mà
        navigate('/');
      }

    } catch (error) {
      console.error("Chi tiết lỗi đăng nhập:", error);
      
      // Khai báo biến hứng thông báo lỗi từ server trả về
      let errorMsg = 'Đăng nhập thất bại';

      if (error.response) {
        // Vì Backend C# của bạn trả về chuỗi text thuần túy (string), 
        // nên ta ưu tiên đọc trực tiếp error.response.data trước. 
        // Nếu data là Object phức tạp thì mới tìm đến trường .message
        errorMsg = typeof error.response.data === 'string' 
          ? error.response.data 
          : (error.response.data?.message || errorMsg);
          
        // Bắt riêng mã lỗi 403 (Tài khoản bị khóa) để có thể log log hoặc phân tích riêng nếu cần
        if (error.response.status === 403) {
          console.warn("Cảnh báo: Tài khoản này đã bị vô hiệu hóa trên hệ thống.");
        }
      } else {
        errorMsg = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng!';
      }

      // Hiển thị thông báo lỗi trực quan cho người dùng bằng alert đúng cấu trúc của bạn
      alert(errorMsg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Chào mừng trở lại</h2>
        <p className="auth-subtitle">Vui lòng đăng nhập tài khoản</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tài khoản</label>
            <input
              type="text"
              name="username"
              className="auth-input"
              placeholder="Nhập username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="auth-footer">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="auth-link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}