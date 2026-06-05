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

      // Lưu token
      localStorage.setItem('token', data.token);

      // Lưu user
      localStorage.setItem(
        'currentUser',
        JSON.stringify(response.data.user)
      );

      localStorage.setItem(
        'token',
        response.data.token
      );

      alert('Đăng nhập thành công');

      // Điều hướng
      if (data.user.role === 'Admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        'Đăng nhập thất bại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2 className="auth-title">
          Chào mừng trở lại
        </h2>

        <p className="auth-subtitle">
          Vui lòng đăng nhập tài khoản
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
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
          Chưa có tài khoản?

          <Link
            to="/register"
            className="auth-link"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}