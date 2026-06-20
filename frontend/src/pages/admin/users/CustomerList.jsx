import React, { useEffect, useState, useRef } from "react";
import userService from "../../../services/userService";
import {
  Search,
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sử dụng useRef để đọc giá trị trực tiếp từ ô nhập liệu mà không cần bind cứng state value
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await userService.getAll("", 1, 100, token);
      setCustomers(res.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách khách hàng:", error);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    return (
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.userID.toString() === search.trim() ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortOrder === "name_asc") return a.fullName.localeCompare(b.fullName);
    if (sortOrder === "name_desc") return b.fullName.localeCompare(b.fullName);
    if (sortOrder === "id_desc") return b.userID - a.userID;
    return a.userID - b.userID;
  });

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const basePageButtonStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "2px solid #cbd5e1",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* 🌟 ĐÃ LOẠI BỎ THẺ <STYLE> NỘI BỘ ĐỂ TRÁNH TRÌNH DUYỆT BỊ CRASH RE-PAINT CHẶN FOCUS */}

      {/* Header Panel */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "16px",
          border: "2px solid #cbd5e1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "22px",
              fontWeight: "700",
              margin: 0,
              color: "#0f172a",
            }}
          >
            <Users style={{ color: "#2563eb" }} size={24} strokeWidth={2.5} />{" "}
            Danh Sách Khách Hàng Thành Viên
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              fontWeight: "500",
              marginTop: "6px",
              margin: 0,
            }}
          >
            Quản lý thông tin hồ sơ tài khoản người dùng, khách hàng mua sắm
            trên toàn hệ thống.
          </p>
        </div>
      </div>

      {/* Tools Panel */}
      <div
        style={{
          background: "#ffffff",
          padding: "18px",
          borderRadius: "16px",
          border: "2px solid #cbd5e1",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1",
            minWidth: "280px",
            maxWidth: "420px",
          }}
        >
          <Search
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
              pointerEvents: "none",
            }}
            size={18}
            strokeWidth={2}
          />

          {/* 🌟 CHUYỂN THÀNH INPUT NGUYÊN THỦY: KHÔNG CÓ VALUE RÀNG BUỘC STATE ĐỂ TRANH CHẤP CHUỘT */}
          <input
            id="admin-customer-search-input"
            name="adminCustomerSearchInput"
            type="text"
            ref={searchInputRef}
            autoComplete="off"
            placeholder="Tìm theo ID, Tên hoặc Số điện thoại..."
            // Đọc trực tiếp phím bấm từ bàn phím, kích hoạt tìm kiếm tự nhiên
            onInput={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px 10px 42px",
              border: "2px solid #cbd5e1",
              borderRadius: "12px",
              fontWeight: "500",
              color: "#0f172a",
              fontSize: "14px",
              height: "44px",
              outline: "none",
              background: "#ffffff",
              fontFamily: "inherit",
              cursor: "text",
            }}
          />
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
          <SlidersHorizontal
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
              pointerEvents: "none",
            }}
            size={18}
            strokeWidth={2}
          />
          <select
            id="admin-customer-sort-select"
            name="adminCustomerSortSelect"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px 10px 42px",
              background: "#ffffff",
              border: "2px solid #cbd5e1",
              borderRadius: "12px",
              color: "#0f172a",
              fontWeight: "600",
              fontSize: "14px",
              height: "44px",
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="">Sắp xếp: ID Tăng dần (Mặc định)</option>
            <option value="id_desc">Sắp xếp: ID Giảm dần</option>
            <option value="name_asc">Họ tên: A-Z</option>
            <option value="name_desc">Họ tên: Z-A</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "2px solid #cbd5e1",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          <thead
            style={{
              background: "#e2e8f0",
              borderBottom: "2px solid #cbd5e1",
            }}
          >
            <tr>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "80px",
                  textAlign: "center",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                <User
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Họ và tên
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Username
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                <Mail
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Email
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "150px",
                }}
              >
                <Phone
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Số điện thoại
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "25%",
                }}
              >
                <MapPin
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Địa chỉ
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "130px",
                  textAlign: "center",
                }}
              >
                <ShieldCheck
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Vai trò
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr
                key={user.userID}
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <td
                  style={{
                    padding: "16px",
                    fontWeight: "600",
                    color: "#2563eb",
                    textAlign: "center",
                  }}
                >
                  #{user.userID}
                </td>
                <td
                  style={{
                    padding: "16px",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  {user.fullName}
                </td>
                <td
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    color: "#475569",
                  }}
                >
                  {user.username}
                </td>
                <td
                  style={{
                    padding: "16px",
                    fontWeight: "500",
                    color: "#0f172a",
                  }}
                >
                  {user.email}
                </td>
                <td
                  style={{
                    padding: "16px",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  {user.phone || "—"}
                </td>
                <td
                  style={{
                    padding: "16px",
                    fontWeight: "400",
                    color: "#334155",
                    lineHeight: "1.4",
                  }}
                >
                  {user.address || "—"}
                </td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#eff6ff",
                      color: "#2563eb",
                      border: "1px solid #bfdbfe",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}

            {currentItems.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: "#64748b",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  Không tìm thấy thành viên khách hàng nào phù hợp với từ khóa
                  tìm kiếm.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "10px 0",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{
              ...basePageButtonStyle,
              background: currentPage === 1 ? "#f1f5f9" : "#ffffff",
              color: currentPage === 1 ? "#94a3b8" : "#0f172a",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Trước
          </button>

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
                  color: isPageActive ? "#ffffff" : "#0f172a",
                  borderColor: isPageActive ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={{
              ...basePageButtonStyle,
              background: currentPage === totalPages ? "#f1f5f9" : "#ffffff",
              color: currentPage === totalPages ? "#94a3b8" : "#0f172a",
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
