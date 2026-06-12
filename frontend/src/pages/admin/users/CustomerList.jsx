import React, { useEffect, useState } from "react";
import userService from "../../../services/userService";
import { Search, Users, User, Phone, Mail, MapPin, ShieldCheck, SlidersHorizontal } from "lucide-react";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // State lưu trữ tiêu chí sắp xếp

  // States quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Giới hạn hiển thị 10 khách hàng trên một trang

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      // Gọi API lấy tối đa 100 khách hàng
      const res = await userService.getAll("", 1, 100, token);
      setCustomers(res.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách khách hàng:", error);
    }
  };

  // 1. XỬ LÝ LỌC DỮ LIỆU (FILTER)
  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    return (
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.userID.toString() === search.trim()
    );
  });

  // 2. XỬ LÝ SẮP XẾP DỮ LIỆU (SORTING)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortOrder === "name_asc") {
      return a.fullName.localeCompare(b.fullName);
    }
    if (sortOrder === "name_desc") {
      return b.fullName.localeCompare(a.fullName);
    }
    if (sortOrder === "id_desc") {
      return b.userID - a.userID; // ID lớn hơn lên trước (Mới nhất)
    }
    // Mặc định hoặc "id_asc": KHÓA CỨNG ID nhỏ luôn đứng trước ID lớn
    return a.userID - b.userID; 
  });

  // 3. XỬ LÝ PHÂN TRANG (PAGINATION)
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const basePageButtonStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "2px solid #cbd5e1",
    fontWeight: "700",
    fontSize: "14px",
    transition: "all 0.15s ease",
  };

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
      <div style={{ background: "#ffffff", padding: "18px", borderRadius: "16px", border: "2px solid #cbd5e1", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
        
        {/* Ô tìm kiếm */}
        <div style={{ position: "relative", flex: "1", minWidth: "280px", maxWidth: "420px" }}>
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
              background: "#ffffff"
            }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
            }}
          />
          <style>{`
            .custom-customer-search::placeholder {
              color: #000000 !important;
              opacity: 0.6 !important;
            }
          `}</style>
        </div>

        {/* Thanh chọn sắp xếp */}
        <div style={{ position: "relative", width: "100%", maxWidth: "240px" }}>
          <SlidersHorizontal style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#000000" }} size={18} strokeWidth={2.5} />
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi đổi kiểu xếp
            }}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px 10px 42px", background: "#ffffff", border: "2px solid #cbd5e1", borderRadius: "12px", color: "#000000", fontWeight: "700", fontSize: "14px", height: "44px", outline: "none", cursor: "pointer" }}
          >
            <option value="">Sắp xếp: ID Tăng dần (Mặc định)</option>
            <option value="id_desc">Sắp xếp: ID Giảm dần</option>
            <option value="name_asc">Họ tên: A-Z</option>
            <option value="name_desc">Họ tên: Z-A</option>
          </select>
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
            {currentItems.map((user) => (
              <tr key={user.userID} style={{ borderBottom: "1px solid #cbd5e1", background: "#ffffff", transition: "background 0.15s ease" }}>
                
                {/* Cột ID */}
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

                {/* Badge phân quyền */}
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <span style={{ display: "inline-block", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "4px 10px", borderRadius: "8px", fontSize: "13px", fontWeight: "900" }}>
                    {user.role}
                  </span>
                </td>

              </tr>
            ))}

            {currentItems.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "#475569", fontWeight: "800", fontSize: "15px" }}>
                  Không tìm thấy thành viên khách hàng nào phù hợp với từ khóa tìm kiếm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* THANH PHÂN TRANG (PAGINATION) */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "10px 0" }}>
          {/* Nút Trước */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{
              ...basePageButtonStyle,
              background: currentPage === 1 ? "#f1f5f9" : "#ffffff",
              color: currentPage === 1 ? "#94a3b8" : "#000000",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Trước
          </button>

          {/* Vòng lặp kết xuất số trang */}
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            const isPageActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  ...basePageButtonStyle,
                  background: isPageActive ? "#2563eb" : "#ffffff",
                  color: isPageActive ? "#ffffff" : "#000000",
                  borderColor: isPageActive ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Nút Sau */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{
              ...basePageButtonStyle,
              background: currentPage === totalPages ? "#f1f5f9" : "#ffffff",
              color: currentPage === totalPages ? "#94a3b8" : "#000000",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Sau
          </button>
        </div>
      )}

    </div>
  );
};

export default CustomerList;