import React, { useState, useEffect } from "react";
import userService from "../services/userService";

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
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, backdropFilter: "blur(5px)" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "25px", borderRadius: "14px", width: "420px", boxShadow: "0 20px 40px rgba(0,0,0,0.25)", position: "relative", fontFamily: '"Segoe UI", sans-serif', color: "#2d3748" }}>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: "15px", right: "18px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#a0aec0" }}>✕</button>
        <h3 style={{ margin: "0 0 20px 0", color: "#2b6cb0", fontSize: "18px", fontWeight: "700", borderBottom: "2px solid #edf2f7", paddingBottom: "10px" }}>👤 Hồ sơ cá nhân</h3>
        
        <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "4px" }}>Họ và tên</label>
            <input type="text" required style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e0", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "4px" }}>Email liên hệ</label>
            <input type="email" required style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e0", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "4px" }}>Số điện thoại</label>
            <input type="text" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e0", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }} value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4a5568", marginBottom: "4px" }}>Địa chỉ giao hàng</label>
            <textarea rows="2" style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e0", borderRadius: "6px", fontSize: "14px", resize: "none", boxSizing: "border-box" }} value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
          </div>
          
          <div style={{ display: "flex", justifyContent: "end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 16px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Hủy</button>
            <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#2b6cb0", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
}