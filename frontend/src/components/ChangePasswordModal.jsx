import React, { useState } from "react";
import userService from "../services/userService";

export default function ChangePasswordModal({ isOpen, onClose, token }) {
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Xác nhận mật khẩu mới không khớp!");
      return;
    }

    try {
      const res = await userService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }, token);

      alert(res.data.message || "Thay đổi mật khẩu thành công!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, backdropFilter: "blur(5px)" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "25px", borderRadius: "14px", width: "420px", boxShadow: "0 20px 40px rgba(0,0,0,0.25)", position: "relative", fontFamily: '"Segoe UI", sans-serif', color: "#2d3748" }}>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: "15px", right: "18px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#a0aec0" }}>✕</button>
        <h3 style={{ margin: "0 0 20px 0", color: "#c53030", fontSize: "18px", fontWeight: "700", borderBottom: "2px solid #edf2f7", paddingBottom: "10px" }}>🔒 Đổi mật khẩu tài khoản</h3>
        
        <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "4px" }}>Mật khẩu hiện tại</label>
            <input type="password" required style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e0", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "4px" }}>Mật khẩu mới</label>
            <input type="password" required style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e0", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "4px" }}>Xác nhận mật khẩu mới</label>
            <input type="password" required style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e0", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
          </div>
          
          <div style={{ display: "flex", justifyContent: "end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 16px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Hủy</button>
            <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#c53030", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Xác nhận đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
}