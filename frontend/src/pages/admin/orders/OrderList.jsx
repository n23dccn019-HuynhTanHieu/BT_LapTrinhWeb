import React, { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import orderService from "../../../services/orderService";
import { ClipboardList, Eye, Calendar, DollarSign, Layers } from "lucide-react";

// Định nghĩa màu sắc tương phản cao cho từng trạng thái đơn hàng
const statusStyles = {
  0: { text: "Hủy", bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
  1: { text: "Chờ xử lý", bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  2: { text: "Đang chuẩn bị", bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  3: { text: "Đang giao", bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  4: { text: "Đã giao", bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
  5: { text: "Hoàn thành", bg: "#fdf2f8", color: "#db2777", border: "#fbcfe8" },
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState(""); // Lưu tháng dạng YYYY-MM
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Gọi lại API khi thay đổi bộ lọc trạng thái
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, monthFilter, searchTerm, sortBy]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      
      let statusCode = null;
      if (statusFilter !== "All") {
        statusCode = Object.keys(statusStyles).find(
          (key) => statusStyles[key].text === statusFilter
        );
      }

      const res = await orderService.getAll(
        statusCode ? Number(statusCode) : null,
        1,
        100,
        token
      );

      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await orderService.updateStatus(orderId, Number(newStatus), token);
      fetchOrders(); 
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đơn:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await orderService.getById(id, token);
      setSelectedOrder(res.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    }
  };

  // LỌC CLIENT THEO THÁNG - NĂM VÀ TÌM KIẾM
  const filteredOrders = orders
    .filter((order) => {
      // Filter tháng
      if (monthFilter) {
        const orderMonthFormatted = order.orderDate.substring(0, 7);
        if (orderMonthFormatted !== monthFilter) {
          return false;
        }
      }

      // Search
      if (searchTerm.trim()) {
        const keyword = searchTerm.toLowerCase();
        const orderIdMatch = order.orderID?.toString().includes(keyword);
        const customerMatch = order.user?.fullName?.toLowerCase().includes(keyword);

        if (!orderIdMatch && !customerMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.orderDate) - new Date(a.orderDate);
        case "date_asc":
          return new Date(a.orderDate) - new Date(b.orderDate);
        case "amount_desc":
          return b.totalAmount - a.totalAmount;
        case "amount_asc":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Style chung cho các nút phân trang
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
      
      {/* Header chính */}
      <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", border: "2px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "22px", fontWeight: "900", margin: 0, color: "#000000" }}>
            <ClipboardList style={{ color: "#2563eb" }} size={24} strokeWidth={3} /> Quản Lý Đơn Hàng
          </h2>
          <p style={{ fontSize: "14px", color: "#0f172a", fontWeight: "700", marginTop: "6px" }}>
            Tra cứu hệ thống hóa đơn bán hàng, lọc theo mốc thời gian và trạng thái giao nhận.
          </p>
        </div>
      </div>

      {/* Vùng bộ lọc tích hợp */}
      <div style={{ background: "#ffffff", padding: "18px", borderRadius: "16px", border: "2px solid #cbd5e1", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* Bộ lọc theo Tháng - Năm */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "800", color: "#000000" }}>Lọc theo tháng/năm đặt:</span>
            
            <input
              type={monthFilter ? "month" : "text"} 
              placeholder="mm / yyyy"
              onFocus={(e) => (e.target.type = "month")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              className="custom-month-input"
              style={{
                boxSizing: "border-box",
                padding: "8px 12px",
                border: "2px solid #cbd5e1",
                borderRadius: "12px",
                fontWeight: "700",
                color: "#000000",
                fontSize: "14px",
                height: "44px",
                outline: "none",
                cursor: "pointer",
                background: "#ffffff",
                width: "150px",
                textAlign: "center"
              }}
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            />
            
            {/* CSS bổ trợ cho placeholder và icon lịch */}
            <style>{`
              .custom-month-input::-webkit-calendar-picker-indicator {
                cursor: pointer;
                filter: invert(0%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%) !important;
              }
              .custom-month-input::placeholder {
                color: #000000 !important;
                opacity: 0.7;
              }
              .custom-search-input::placeholder {
                color: #64748b !important;
              }
            `}</style>

            {monthFilter && (
              <button 
                onClick={() => setMonthFilter("")}
                style={{ background: "#ef4444", color: "#ffffff", border: "none", padding: "8px 12px", borderRadius: "8px", fontWeight: "800", cursor: "pointer", height: "40px" }}
              >
                Xóa lọc tháng
              </button>
            )}
          </div>
        </div>

        {/* Ô Tìm Kiếm và Bộ lọc Sắp xếp */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Tìm mã đơn hoặc khách hàng..."
            className="custom-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "2px solid #cbd5e1",
              minWidth: "250px",
              fontWeight: "700",
              background: "#ffffff",
              color: "#000000",
              outline: "none"
            }}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "2px solid #cbd5e1",
              fontWeight: "700",
              background: "#ffffff",
              color: "#000000",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="" style={{ background: "#ffffff", color: "#000000" }}>Sắp xếp mặc định</option>
            <option value="date_desc" style={{ background: "#ffffff", color: "#000000" }}>Ngày mới nhất</option>
            <option value="date_asc" style={{ background: "#ffffff", color: "#000000" }}>Ngày cũ nhất</option>
            <option value="amount_desc" style={{ background: "#ffffff", color: "#000000" }}>Tổng tiền giảm dần</option>
            <option value="amount_asc" style={{ background: "#ffffff", color: "#000000" }}>Tổng tiền tăng dần</option>
          </select>
        </div>

        {/* Hệ thống Tab lọc trạng thái đơn hàng */}
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", overflowX: "auto", paddingBottom: "4px", gap: "6px" }}>
          {["All", "Chờ xử lý", "Đang chuẩn bị", "Đang giao", "Đã giao", "Hoàn thành", "Hủy"].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "10px 16px",
                  fontWeight: "900",
                  fontSize: "14px",
                  background: isActive ? "#2563eb" : "transparent",
                  color: isActive ? "#ffffff" : "#475569",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {status === "All" ? "Tất cả đơn" : status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bảng dữ liệu hiển thị */}
      <div style={{ background: "#ffffff", borderRadius: "16px", border: "2px solid #cbd5e1", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "15px" }}>
          <thead style={{ background: "#e2e8f0", borderBottom: "3px solid #cbd5e1", color: "#000000" }}>
            <tr>
              <th style={{ padding: "16px", fontWeight: "900", width: "110px" }}>Mã đơn</th>
              <th style={{ padding: "16px", fontWeight: "900" }}>Khách hàng</th>
              <th style={{ padding: "16px", fontWeight: "900", width: "140px" }}><Calendar size={14} style={{ marginRight: 4, display: "inline" }} /> Ngày đặt</th>
              <th style={{ padding: "16px", fontWeight: "900", width: "150px" }}><DollarSign size={14} style={{ marginRight: 4, display: "inline" }} /> Tổng tiền</th>
              <th style={{ padding: "16px", fontWeight: "900", width: "180px" }}><Layers size={14} style={{ marginRight: 4, display: "inline" }} /> Cập nhật trạng thái</th>
              <th style={{ padding: "16px", fontWeight: "900", textAlign: "right", width: "130px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              const currentStyle = statusStyles[order.orderStatus] || { text: "Không rõ", bg: "#f1f5f9", color: "#0f172a", border: "#cbd5e1" };
              return (
                <tr key={order.orderID} style={{ borderBottom: "1px solid #cbd5e1", background: "#ffffff" }}>
                  <td style={{ padding: "16px", fontWeight: "900", color: "#2563eb" }}>
                    #{order.orderID}
                  </td>
                  <td style={{ padding: "16px", fontWeight: "800", color: "#000000" }}>
                    {order.user?.fullName ?? "Khách vãng lai"}
                  </td>
                  <td style={{ padding: "16px", fontWeight: "700", color: "#334155" }}>
                    {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ padding: "16px", fontWeight: "900", color: "#000000" }}>
                    {Number(order.totalAmount).toLocaleString("vi-VN")} đ
                  </td>
                  <td style={{ padding: "16px" }}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(order.orderID, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: `2px solid ${currentStyle.color}`,
                        background: currentStyle.bg,
                        color: currentStyle.color,
                        fontWeight: "900",
                        fontSize: "13px",
                        cursor: "pointer",
                        outline: "none",
                        width: "100%"
                      }}
                    >
                      <option value={1} style={{ background: "#ffffff", color: "#000000" }}>Chờ xử lý</option>
                      <option value={2} style={{ background: "#ffffff", color: "#000000" }}>Đang chuẩn bị</option>
                      <option value={3} style={{ background: "#ffffff", color: "#000000" }}>Đang giao</option>
                      <option value={4} style={{ background: "#ffffff", color: "#000000" }}>Đã giao</option>
                      <option value={5} style={{ background: "#ffffff", color: "#000000" }}>Hoàn thành</option>
                      <option value={0} style={{ background: "#ffffff", color: "#000000" }}>Hủy đơn hàng</option>
                    </select>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button
                      onClick={() => handleViewDetail(order.orderID)}
                      style={{ background: "#000000", border: "none", color: "#ffffff", padding: "8px 14px", borderRadius: "8px", fontWeight: "900", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <Eye size={14} strokeWidth={3} /> Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "48px", color: "#475569", fontWeight: "800", fontSize: "15px" }}>
                  Không tìm thấy dữ liệu hóa đơn thỏa mãn điều kiện lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VÙNG PHÂN TRANG THEO THIẾT KẾ MỚI */}
      {totalPages > 1 && (
        <div 
          className="pagination" 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: "8px", 
            padding: "10px 20px" 
          }}
        >
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

          {/* Danh sách các ô số trang */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isPageActive = currentPage === pageNumber;
            return (
              <button
                key={pageNumber}
                className={isPageActive ? "page-active" : ""}
                onClick={() => setCurrentPage(pageNumber)}
                style={{
                  ...basePageButtonStyle,
                  background: isPageActive ? "#2563eb" : "#ffffff",
                  color: isPageActive ? "#ffffff" : "#000000",
                  borderColor: isPageActive ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Nút Sau */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
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

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default OrderList;