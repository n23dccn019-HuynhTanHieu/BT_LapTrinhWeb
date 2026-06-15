import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  // Thêm state để lưu thông báo lỗi riêng cho username nếu muốn hiển thị trên giao diện
  const [usernameError, setUsernameError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại username
    if (e.target.name === 'username') {
      setUsernameError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra đầy đủ thông tin
    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.password
    ) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Kiểm tra khớp mật khẩu
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    try {
      setLoading(true);
      setUsernameError('');

      await api.post('/auth/register', {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
      });

      alert('Đăng ký thành công');
      navigate('/login');

    } catch (error) {
      console.error(error);

      // Lấy thông báo lỗi từ phía Backend trả về
      const backendMessage = error.response?.data?.message;

      // Kiểm tra xem Backend có phản hồi lỗi trùng username hay không
      // (Bạn hãy check xem Backend của bạn trả về string cụ thể là gì, ví dụ: 'Username already exists' hoặc 'Tên tài khoản đã tồn tại')
      if (
        backendMessage?.toLowerCase().includes('username') || 
        backendMessage?.toLowerCase().includes('tài khoản đã tồn tại')
      ) {
        setUsernameError('Tên đăng nhập này đã có người sử dụng!');
        alert('Tên đăng nhập này đã có người sử dụng!');
      } else {
        // Các lỗi hệ thống khác
        alert(backendMessage || 'Đăng ký thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Tạo tài khoản</h2>
        <p className="auth-subtitle">Đăng ký thành viên mới</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              className="auth-input"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              className={`auth-input ${usernameError ? 'input-error' : ''}`}
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {/* Hiển thị dòng thông báo lỗi màu đỏ ngay dưới ô nhập Username */}
            {usernameError && (
              <span style={{ color: 'red', fontSize: '13px', marginTop: '5px', display: 'block' }}>
                {usernameError}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="email@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              className="auth-input"
              placeholder="0901234567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              className="auth-input"
              placeholder="TP. Hồ Chí Minh"
              value={formData.address}
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

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              className="auth-input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-link">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}