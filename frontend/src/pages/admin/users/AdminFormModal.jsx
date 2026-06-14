import React, { useState, useEffect } from "react";
import userService from "../../../services/userService";
import { X, UserPlus } from "lucide-react";

const AdminFormModal = ({ isOpen, onClose, adminData, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
  });

  // Đồng bộ hóa dữ liệu từ Component cha khi mở form cập nhật hoặc tạo mới
  useEffect(() => {
    if (isOpen) {
      if (adminData) {
        setFormData({
          username: adminData.username || "",
          password: "", 
          fullName: adminData.fullName || "",
          email: adminData.email || "",
          phone: adminData.phone || adminData.phoneNumber || "",
          address: adminData.address || "",
          isActive: adminData.isActive ?? true,
        });
      } else {
        setFormData({
          username: "",
          password: "",
          fullName: "",
          email: "",
          phone: "",
          address: "",
          isActive: true,
        });
      }
    }
  }, [isOpen, adminData]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (adminData) {
        const userId = adminData.userID || adminData.id;
        await userService.updateAdmin(userId, formData, token);
        alert("Cập nhật thông tin admin thành công!");
      } else {
        await userService.createAdmin(formData, token);
        alert("Thêm tài khoản quản trị mới thành công!");
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      alert("Thao tác thất bại: " + (error.response?.data?.message || "Trùng tên đăng nhập hoặc lỗi dữ liệu"));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button 
          type="button" 
          onClick={onClose} 
          style={{ position: "absolute", right: "20px", top: "20px", background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={20} />
        </button>
        
        <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
          <UserPlus style={{ color: "#2563eb" }} size={22} strokeWidth={2.5} />
          {adminData ? "Cập Nhật Tài Khoản Quản Trị" : "Thêm Tài Khoản Quản Trị Mới"}
        </h3>
        
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label>Tên đăng nhập (Username) *</label>
            <input 
              type="text" 
              disabled={!!adminData}
              style={adminData ? { backgroundColor: "#f1f5f9", color: "#64748b", cursor: "not-allowed" } : {}}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required 
            />
          </div>

          {!adminData && (
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required 
              />
            </div>
          )}

          <div className="form-group">
            <label>Họ và tên</label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input 
              type="text" 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {adminData && (
            <div className="form-group">
              <label>Trạng thái hoạt động</label>
              <select 
                value={formData.isActive ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                style={{ cursor: "pointer" }}
              >
                <option value="true">Đang hoạt động</option>
                <option value="false">Bị khóa</option>
              </select>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: "10px 16px", background: "#f1f5f9", border: "none", borderRadius: "10px", fontWeight: "600", color: "#475569", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              style={{ padding: "10px 20px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}
            >
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormModal;