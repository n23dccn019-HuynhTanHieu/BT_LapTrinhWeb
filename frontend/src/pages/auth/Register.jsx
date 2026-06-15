import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      // Ép đổi username và email thành chữ thường trước khi gửi để đồng bộ DB
      const cleanUsername = formData.username.trim().toLowerCase();
      const cleanEmail = formData.email.trim().toLowerCase();

      // Ép dữ liệu trống thành chuỗi rỗng để đồng bộ theo logic mới của Hiếu
      const cleanPhone = formData.phone ? formData.phone.trim() : "";
      const cleanAddress = formData.address ? formData.address.trim() : "";

      setLoading(true);

      await api.post("/auth/register", {
        fullName: formData.fullName.trim(),
        username: cleanUsername,
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddress,
        password: formData.password,
      });

      alert("Đăng ký thành công 🎉");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      document.activeElement?.blur(); // Tự động nhả focus sau khi submit xong
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* 🌟 THẦN CHÚ CSS: ÉP CHỮ GÕ ĐEN ĐẬM, CHỮ GỢI Ý MỜ NHẠT RÕ RỆT */}
      <style>{`
        .auth-input {
          color: #0f172a !important; /* Màu đen đậm cho chữ gõ thật */
          font-weight: 600 !important; /* Cho chữ dày dặn, dễ nhìn */
          background-color: #ffffff !important;
        }
        .auth-input::placeholder {
          color: #94a3b8 !important; /* Màu xám tro nhạt hẳn cho chữ gợi ý mờ tự hiện */
          font-weight: 400 !important;
          opacity: 0.8 !important;
        }
      `}</style>

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
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="auth-input"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
            />
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
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản?
          <Link to="/login" className="auth-link">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
