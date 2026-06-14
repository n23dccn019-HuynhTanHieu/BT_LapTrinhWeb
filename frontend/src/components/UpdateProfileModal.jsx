import React, { useState, useEffect } from "react";
import userService from "../services/userService";
import { User, X } from "lucide-react"; // Đồng bộ icon giống AdminList

export default function UpdateProfileModal({ isOpen, onClose, currentUser, token }) {
  const [profileData, setProfileData] = useState({ fullName: "", email: "", phone: "", address: "" });

  // Tìm ra ID chuẩn bất kể backend/localstorage đặt tên là gì
  const currentUserId = currentUser?.id || currentUser?.userID || currentUser?.userId;

  useEffect(() => {
    // Lấy token dự phòng từ localStorage nếu prop truyền vào bị chậm/rỗng
    const activeToken = token || localStorage.getItem("token");

    if (isOpen && activeToken && currentUserId) { 
      userService.getProfile(currentUserId, activeToken)
        .then((res) => {
          const data = res.data?.data || res.data;
          setProfileData({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin cá nhân từ API:", err);
          if (currentUser) {
            setProfileData({
              fullName: currentUser.fullName || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              address: currentUser.address || "",
            });
          }
        });
    }
  }, [isOpen, token, currentUserId, currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Lấy trực tiếp token chuẩn từ localStorage đề phòng prop truyền từ Navbar bị rỗng
    const activeToken = token || localStorage.getItem("token"); 

    if (!activeToken || activeToken === "undefined") {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      return;
    }

    try {
      // Gọi service cập nhật thông tin cá nhân lên Backend
      const res = await userService.updateProfile(profileData, activeToken);
      alert(res.data?.message || "Cập nhật thông tin thành công!");
      
      // Đồng bộ dữ liệu mới cập nhật vào LocalStorage để giao diện hiển thị tên mới lập tức
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      onClose();
      window.location.reload(); 
    } catch (err) {
      console.error("Lỗi khi update profile:", err);
      // Hiển thị thông báo chi tiết lỗi từ Backend trả về
      alert(err.response?.data?.message || err.response?.data || "Cập nhật thông tin thất bại!");
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
        backgroundColor: "rgba(15, 23, 42, 0.4)", // Overlay mờ của AdminList
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
          borderRadius: "16px", // Bo góc 16px đồng bộ
          width: "440px", // Độ rộng đồng bộ đổi mật khẩu
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", 
          position: "relative", 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", // Font chữ hệ thống chuyên nghiệp
          border: "2px solid #cbd5e1", // Khung viền xám đậm giống bài mẫu
          color: "#0f172a"
        }}
      >
        {/* Nút Đóng Nhanh (Góc phải) */}
        <button 
          type="button" 
          onClick={onClose} 
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

        {/* Tiêu đề Modal - Tone xanh nước biển */}
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
          <User style={{ color: "#2563eb" }} size={22} strokeWidth={2.5} /> 
          Hồ Sơ Cá Nhân
        </h3>
        
        {/* Form Nhập Dữ Liệu */}
        <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Họ và tên */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Họ và tên *
            </label>
            <input 
              type="text" 
              required 
              style={{ 
                width: "100%", 
                padding: "10px 14px", 
                backgroundColor: "#ffffff", // Ô điền màu trắng tinh
                border: "2px solid #cbd5e1", 
                borderRadius: "10px", // Bo góc ô nhập 10px giống AdminList
                fontSize: "14px", 
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "inherit",
                color: "#0f172a"
              }} 
              value={profileData.fullName} 
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} 
            />
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Email liên hệ *
            </label>
            <input 
              type="email" 
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
              value={profileData.email} 
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} 
            />
          </div>

          {/* Số điện thoại */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Số điện thoại
            </label>
            <input 
              type="text" 
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
              value={profileData.phone} 
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} 
            />
          </div>

          {/* Địa chỉ giao hàng */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
              Địa chỉ giao hàng
            </label>
            <textarea 
              rows="2" 
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
                color: "#0f172a",
                resize: "none"
              }} 
              value={profileData.address} 
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} 
            />
          </div>
          
          {/* Nhóm nút bấm thao tác */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <button 
              type="button" 
              onClick={onClose} 
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
                backgroundColor: "#2563eb", // Xanh nước biển (Blue) đồng bộ với nút Lưu Lại / Tìm Kiếm của AdminList
                color: "#ffffff", 
                border: "none", 
                borderRadius: "10px", 
                cursor: "pointer", 
                fontSize: "14px", 
                fontWeight: "600",
                fontFamily: "inherit"
              }}
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}