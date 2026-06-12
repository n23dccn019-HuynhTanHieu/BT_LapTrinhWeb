import React, { useState, useEffect, useCallback } from "react";
import {
  FiShield,
  FiSearch,
  FiKey,
  FiTrash2,
  FiUserPlus,
  FiArrowLeft,
} from "react-icons/fi";
import userService from "../../../services/userService";

const AdminList = () => {
  const [view, setView] = useState("list");
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Đảm bảo lấy đúng token của tài khoản ADMIN đã đăng nhập thành công
  const token = localStorage.getItem("token") || ""; 

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  // ================= 1. GỌI API LẤY DANH SÁCH ADMIN =================
  const fetchAdmins = useCallback(async () => {
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn!");
      return;
    }
    setLoading(true);
    try {
      const res = await userService.getAdmins(token);
      // Backend của bạn trả trực tiếp về mảng (Ok(admins)), axios bọc nó trong res.data
      setAdmins(res.data || []); 
    } catch (err) {
      console.error("Lỗi khi lấy danh sách admin:", err);
      alert(err.response?.data?.message || "Không có quyền truy cập danh sách quản trị (Yêu cầu quyền Admin).");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Tự động chạy khi component được render
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);


  // ================= 2. GỌI API XÓA ADMIN =================
  const handleDelete = async (userID) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản quản trị này?")) return;

    try {
      await userService.deleteAdmin(userID, token);
      // Xóa thành công trên DB -> Cập nhật lại state tại chỗ bằng thuộc tính userID
      setAdmins((prev) => prev.filter((item) => item.userID !== userID));
      alert("Xóa tài khoản thành công");
    } catch (err) {
      console.error("Lỗi xóa admin:", err);
      alert(err.response?.data || "Xóa thất bại");
    }
  };


  // ================= 3. GỌI API ĐỔI MẬT KHẨU =================
  const handleChangePassword = async (userID, username) => {
    const newPassword = prompt(`Nhập mật khẩu mới cho tài khoản "${username}":`);
    if (!newPassword) return; 

    try {
      // Khớp cấu trúc ChangePasswordDto gửi lên backend { newPassword: ... }
      await userService.changeAdminPassword(userID, newPassword, token);
      alert("Đổi mật khẩu thành công!");
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      alert(err.response?.data || "Đổi mật khẩu thất bại");
    }
  };


  // ================= 4. GỌI API TẠO ADMIN MỚI =================
  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    try {
      // Gửi toàn bộ dữ liệu formData (Khớp CreateAdminDto ở Backend)
      await userService.createAdmin(formData, token);

      alert("Cấp tài khoản admin mới thành công!");
      
      setFormData({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });
      
      setView("list");
      fetchAdmins(); 
    } catch (err) {
      console.error("Lỗi tạo admin mới:", err);
      alert(err.response?.data || "Tạo tài khoản thất bại (Username có thể đã tồn tại)");
    }
  };

  // ================= 5. BỘ LỌC TÌM KIẾM (Đã đồng bộ trường userID) =================
  const filteredAdmins = admins.filter((admin) => {
    const keyword = searchTerm.toLowerCase().trim();
    return (
      (admin.userID && admin.userID.toString().includes(keyword)) ||
      (admin.username && admin.username.toLowerCase().includes(keyword)) ||
      (admin.fullName && admin.fullName.toLowerCase().includes(keyword))
    );
  });

  // ——————————————————————————————————————————————————————————————————
  // GIAO DIỆN 1: DANH SÁCH ADMIN (VIEW === "LIST")
  // ——————————————————————————————————————————————————————————————————
  if (view === "list") {
    return (
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Tiêu đề */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div style={{ backgroundColor: "#e0e7ff", padding: "12px", borderRadius: "12px", color: "#4f46e5", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiShield />
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#000000", margin: "0" }}>
              Quản Lý Tài Khoản Quản Trị
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
              Danh sách các tài khoản có quyền truy cập và điều hành hệ thống nội bộ.
            </p>
          </div>
        </div>

        {/* Thanh tìm kiếm & Nút thêm mới */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: "384px", display: "flex", alignItems: "center" }}>
            <FiSearch style={{ position: "absolute", left: "16px", color: "#9ca3af", fontSize: "16px" }} />
            <input
              type="text"
              placeholder="Tìm theo ID, Username hoặc Tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                border: "2px solid #cbd5e1",
                borderRadius: "12px",
                padding: "12px 16px 12px 44px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
                color: "#000000",
                outline: "none",
                boxSizing: "border-box",
                fontWeight: "600",
              }}
            />
          </div>

          <button
            onClick={() => setView("add")}
            style={{
              marginLeft: "auto",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "14px",
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
            }}
          >
            + Cấp Tài Khoản Admin
          </button>
        </div>

        {/* Bảng hiển thị thông tin */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left", color: "#4b5563" }}>
              <thead style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
                <tr>
                  <th style={{ padding: "18px 24px", fontWeight: "800", color: "#000000", fontSize: "15px", width: "80px" }}>ID</th>
                  <th style={{ padding: "18px 24px", fontWeight: "800", color: "#000000", fontSize: "15px" }}>Username</th>
                  <th style={{ padding: "18px 24px", fontWeight: "800", color: "#000000", fontSize: "15px" }}>Họ & Tên</th>
                  <th style={{ padding: "18px 24px", fontWeight: "800", color: "#000000", fontSize: "15px" }}>Trạng thái</th>
                  <th style={{ padding: "18px 24px", fontWeight: "800", color: "#000000", fontSize: "15px", textAlign: "center", width: "280px" }}>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "32px 24px", textAlign: "center", color: "#4f46e5", fontWeight: "600" }}>
                      🔄 Đang tải dữ liệu từ hệ thống API...
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "32px 24px", textAlign: "center", color: "#9ca3af", fontWeight: "600" }}>
                      🔍 Không tìm thấy tài khoản quản trị nào.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.userID} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "16px 24px", color: "#6b7280", fontWeight: "600" }}>#{admin.userID}</td>
                      <td style={{ padding: "16px 24px", fontWeight: "700", color: "#4f46e5" }}>{admin.username}</td>
                      <td style={{ padding: "16px 24px", fontWeight: "600" }}>{admin.fullName || "Chưa cập nhật"}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span
                          style={{
                            backgroundColor: admin.isActive ? "#dcfce7" : "#fee2e2",
                            color: admin.isActive ? "#15803d" : "#991b1b",
                            padding: "6px 12px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-block",
                          }}
                        >
                          {admin.isActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                        <button
                          onClick={() => handleChangePassword(admin.userID, admin.username)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            border: "1px solid #fde68a",
                            cursor: "pointer",
                          }}
                        >
                          <FiKey /> Khởi tạo lại Pass
                        </button>
                        <button
                          onClick={() => handleDelete(admin.userID)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            border: "1px solid #fca5a5",
                            cursor: "pointer",
                          }}
                        >
                          <FiTrash2 /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ——————————————————————————————————————————————————————————————————
  // GIAO DIỆN 2: FORM THÊM MỚI ADMIN (VIEW === "ADD")
  // ——————————————————————————————————————————————————————————————————
  const inputStyle = {
    width: "100%",
    border: "2px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    color: "#000000",
    outline: "none",
    boxSizing: "border-box",
    fontWeight: "600",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "8px",
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          border: "2px solid #cbd5e1",
          padding: "32px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {/* Header Form */}
        <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: "#e0e7ff", padding: "10px", borderRadius: "10px", color: "#4f46e5", display: "flex", alignItems: "center" }}>
            <FiUserPlus style={{ fontSize: "20px" }} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#000000", margin: "0" }}>
            Cấp Tài Khoản Admin Mới
          </h2>
        </div>

        <form onSubmit={handleCreateAdmin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Hàng 1: Username & Mật khẩu */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Tài khoản (Username) *</label>
              <input
                type="text"
                placeholder="Ví dụ: thuong.nguyen"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Mật khẩu khởi tạo *</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Hàng 2: Họ Tên & Email */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Họ và Tên *</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Hàng 3: Số điện thoại & Địa chỉ */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Số điện thoại</label>
              <input
                type="text"
                placeholder="09xxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Địa chỉ</label>
              <input
                type="text"
                placeholder="Địa chỉ nơi làm việc"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Thanh hành động */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "12px",
              borderTop: "1px solid #f3f4f6",
              paddingTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => setView("list")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#ffffff",
                color: "#374151",
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <FiArrowLeft /> Hủy & Quay lại
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(79, 70, 229, 0.15)",
              }}
            >
              💾 Cấp tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminList;