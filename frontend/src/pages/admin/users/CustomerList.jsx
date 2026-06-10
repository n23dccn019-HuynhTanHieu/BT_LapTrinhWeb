import React, { useEffect, useState } from "react";
import userService from "../../../services/userService";
import { Search, Users, User, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      // Gọi API lấy tối đa 100 khách hàng (đã được backend sắp xếp tăng dần theo ID)
      const res = await userService.getAll("", 1, 100, token);
      setCustomers(res.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách khách hàng:", error);
    }
  };

  // Lọc dữ liệu kết hợp ép chặt thứ tự hiển thị tăng dần tại UI
  const filteredCustomers = customers
    .filter((c) => {
      if (!search.trim()) return true; // Nếu không gõ gì, giữ lại toàn bộ dữ liệu từ API
      
      return (
        c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search) ||
        c.userID.toString() === search.trim() // So sánh bằng tuyệt đối nếu gõ ID tại UI
      );
    })
    .sort((a, b) => a.userID - b.userID); // KHÓA CỨNG: ID nhỏ luôn đứng trước ID lớn

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", WebkitFontSmoothing: "subpixel-antialiased" }}>
      
      {/* Khối Tiêu Đề Chính */}
      <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", border: "2px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "22px", fontWeight: "900", margin: 0, color: "#000000" }}>
            <Users style={{ color: "#2563eb" }} size={24} strokeWidth={3} /> Danh Sách Khách Hàng Thành Viên
          </h2>
          <p style={{ fontSize: "14px", color: "#475569", fontWeight: "700", marginTop: "6px" }}>
            Quản lý thông tin hồ sơ tài khoản người dùng, khách hàng mua sắm trên toàn hệ thống.
          </p>
        </div>
      </div>

      {/* Bộ Lọc Tìm Kiếm Chuyên Sâu */}
      <div style={{ background: "#ffffff", padding: "18px", borderRadius: "16px", border: "2px solid #cbd5e1", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
          <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#000000" }} size={18} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Tìm theo ID, Tên hoặc Số điện thoại..."
            className="custom-customer-search"
            style={{ 
              width: "100%", 
              boxSizing: "border-box", 
              padding: "10px 12px 10px 42px", 
              border: "2px solid #cbd5e1", 
              borderRadius: "12px", 
              fontWeight: "700", 
              color: "#000000", 
              fontSize: "14px", 
              height: "44px", 
              outline: "none",
              background: "#ffffff" // Chuyển đổi nền đen sang nền trắng tinh
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Style nội tuyến để ép placeholder hiển thị màu đen */}
          <style>{`
            .custom-customer-search::placeholder {
              color: #000000 !important;
              opacity: 0.6 !important;
            }
          `}</style>
        </div>
      </div>

      {/* Bảng Dữ Liệu Khách Hàng */}
      <div style={{ background: "#ffffff", borderRadius: "16px", border: "2px solid #cbd5e1", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "15px" }}>
          <thead style={{ background: "#e2e8f0", borderBottom: "3px solid #cbd5e1", color: "#000000" }}>
            <tr>
              <th style={{ padding: "16px", fontWeight: "900", width: "80px", textAlign: "center" }}>ID</th>
              <th style={{ padding: "16px", fontWeight: "900" }}><User size={14} style={{ marginRight: 4, display: "inline" }} /> Họ và tên</th>
              <th style={{ padding: "16px", fontWeight: "900" }}>Username</th>
              <th style={{ padding: "16px", fontWeight: "900" }}><Mail size={14} style={{ marginRight: 4, display: "inline" }} /> Email</th>
              <th style={{ padding: "16px", fontWeight: "900", width: "150px" }}><Phone size={14} style={{ marginRight: 4, display: "inline" }} /> Số điện thoại</th>
              <th style={{ padding: "16px", fontWeight: "900", width: "25%" }}><MapPin size={14} style={{ marginRight: 4, display: "inline" }} /> Địa chỉ</th>
              <th style={{ padding: "16px", fontWeight: "900", width: "130px", textAlign: "center" }}><ShieldCheck size={14} style={{ marginRight: 4, display: "inline" }} /> Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((user) => (
              <tr key={user.userID} style={{ borderBottom: "1px solid #cbd5e1", background: "#ffffff", transition: "background 0.15s ease" }}>
                
                {/* Cột ID tăng dần nổi bật */}
                <td style={{ padding: "16px", fontWeight: "900", color: "#2563eb", textAlign: "center", background: "#f8fafc" }}>
                  #{user.userID}
                </td>

                {/* Tên khách hàng */}
                <td style={{ padding: "16px", fontWeight: "800", color: "#000000" }}>
                  {user.fullName}
                </td>

                {/* Tài khoản đăng nhập */}
                <td style={{ padding: "16px", fontWeight: "700", color: "#475569" }}>
                  {user.username}
                </td>

                {/* Hòm thư điện tử */}
                <td style={{ padding: "16px", fontWeight: "600", color: "#0f172a" }}>
                  {user.email}
                </td>

                {/* Số điện thoại */}
                <td style={{ padding: "16px", fontWeight: "700", color: "#000000" }}>
                  {user.phone || "—"}
                </td>

                {/* Địa chỉ giao hàng */}
                <td style={{ padding: "16px", fontWeight: "600", color: "#334155", lineHeight: "1.4" }}>
                  {user.address || "—"}
                </td>

                {/* Badge phân quyền vai trò người dùng */}
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <span style={{ display: "inline-block", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "4px 10px", borderRadius: "8px", fontSize: "13px", fontWeight: "900" }}>
                    {user.role}
                  </span>
                </td>

              </tr>
            ))}

            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "#475569", fontWeight: "800", fontSize: "15px" }}>
                  Không tìm thấy thành viên khách hàng nào phù hợp với từ khóa tìm kiếm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CustomerList;