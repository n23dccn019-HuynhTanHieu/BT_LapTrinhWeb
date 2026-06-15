import React, { useState, useEffect } from "react";
import userService from "../../../services/userService";
import { X, Key } from "lucide-react";

const ChangePasswordModal = ({ isOpen, onClose, adminData }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Tự động clear dữ liệu form cũ mỗi khi đóng/mở modal
  useEffect(() => {
    if (isOpen) {
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = adminData?.userID || adminData?.id;

    if (!userId) {
      alert("Không tìm thấy thông tin quản trị viên!");
      return;
    }

    try {
      await userService.changeAdminPassword(userId, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }, token);
      alert("Đổi mật khẩu thành công!");
      onClose();
    } catch (error) {
      alert("Đổi mật khẩu thất bại: " + (error.response?.data?.message || "Mật khẩu cũ không đúng"));
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
        
        <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
          <Key style={{ color: "#2563eb" }} size={22} strokeWidth={2.5} /> 
          Đổi Mật Khẩu Admin
        </h3>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b" }}>
          Tài khoản: <strong style={{ color: "#2563eb" }}>{adminData?.username || "—"}</strong>
        </p>

        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label>Mật khẩu hiện tại (Cũ) *</label>
            <input 
              type="password" 
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              required 
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu mới *</label>
            <input 
              type="password" 
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required 
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu mới *</label>
            <input 
              type="password" 
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required 
            />
          </div>

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
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;