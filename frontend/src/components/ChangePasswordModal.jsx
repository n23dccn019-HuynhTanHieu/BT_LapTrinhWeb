import React, { useState } from "react";
import userService from "../services/userService";
import { Key, X } from "lucide-react"; 

export default function ChangePasswordModal({ isOpen, onClose, token }) {
  const [passwordData, setPasswordData] = useState({ 
    oldPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });

  // Hàm xử lý reset sạch các ô điền dữ liệu và đóng modal
  const handleCloseAndReset = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    onClose();
  };

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
      handleCloseAndReset(); // Reset và đóng khi thành công
    } catch (err) {
      alert(err.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: "rgba(15, 23, 42, 0.4)", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        zIndex: 99999, 
        backdropFilter: "blur(4px)" 
      }}
    >
      <div 
        style={{ 
          backgroundColor: "#ffffff", 
          padding: "28px", 
          borderRadius: "16px", 
          width: "440px", 
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", 
          position: "relative", 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", 
          border: "2px solid #cbd5e1", 
          color: "#0f172a"
        }}
      >
        {/* Nút Đóng Nhanh (X) - Đã đổi sang hàm reset */}
        <button 
          type="button" 
          onClick={handleCloseAndReset} 
          style={{ 
            position: "absolute", 
            top: "20px", 
            right: "20px", 
            background: "none", 
            border: "none", 
            cursor: "pointer", 
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <X size={20} />
        </button>

        {/* Tiêu đề Modal */}
        <h3 
          style={{ 
            margin: "0 0 24px 0", 
            fontSize: "18px", 
            fontWeight: "700", 
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <Key style={{ color: "#2563eb" }} size={22} strokeWidth={2.5} /> 
          Đổi Mật Khẩu Tài Khoản
        </h3>
        
        {/* Form Nhập Dữ Liệu */}
        <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Mật khẩu cũ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Mật khẩu hiện tại *
            </label>
            <input 
              type="password" 
              required 
              style={{ 
                width: "100%", 
                padding: "10px 14px", 
                backgroundColor: "#ffffff", 
                border: "2px solid #cbd5e1", 
                borderRadius: "10px", 
                fontSize: "14px", 
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "inherit",
                color: "#0f172a"
              }} 
              value={passwordData.oldPassword} 
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} 
            />
          </div>

          {/* Mật khẩu mới */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Mật khẩu mới *
            </label>
            <input 
              type="password" 
              required 
              style={{ 
                width: "100%", 
                padding: "10px 14px", 
                backgroundColor: "#ffffff", 
                border: "2px solid #cbd5e1", 
                borderRadius: "10px", 
                fontSize: "14px", 
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "inherit",
                color: "#0f172a"
              }} 
              value={passwordData.newPassword} 
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
            />
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Xác nhận mật khẩu mới *
            </label>
            <input 
              type="password" 
              required 
              style={{ 
                width: "100%", 
                padding: "10px 14px", 
                backgroundColor: "#ffffff", 
                border: "2px solid #cbd5e1", 
                borderRadius: "10px", 
                fontSize: "14px", 
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "inherit",
                color: "#0f172a"
              }} 
              value={passwordData.confirmPassword} 
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
            />
          </div>
          
          {/* Nhóm nút bấm thao tác */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <button 
              type="button" 
              onClick={handleCloseAndReset} // Nhấn Hủy sẽ dọn dẹp sạch ô điền và đóng
              style={{ 
                padding: "10px 16px", 
                backgroundColor: "#f1f5f9", 
                border: "none", 
                borderRadius: "10px", 
                cursor: "pointer", 
                fontSize: "14px", 
                fontWeight: "600",
                color: "#475569",
                fontFamily: "inherit"
              }}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#2563eb", 
                color: "#ffffff", 
                border: "none", 
                borderRadius: "10px", 
                cursor: "pointer", 
                fontSize: "14px", 
                fontWeight: "600",
                fontFamily: "inherit"
              }}
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}