import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderDetail from "./OrderDetail";
import orderService from "../../../services/orderService";
import { ClipboardList, Eye, Calendar, DollarSign, Layers } from "lucide-react";

const statusStyles = {
  0: { text: "Hủy", bg: "#fef2f2", color: "#dc2626", border: "#fca5a5" },
  1: { text: "Chờ xử lý", bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  2: {
    text: "Đang chuẩn bị",
    bg: "#f0fdf4",
    color: "#16a34a",
    border: "#bbf7d0",
  },
  3: { text: "Đang giao", bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  4: { text: "Đã giao", bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
  5: { text: "Hoàn thành", bg: "#fdf2f8", color: "#db2777", border: "#fbcfe8" },
};

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, monthFilter, searchTerm, sortBy]);

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem("token");

      let statusCode = null;
      if (statusFilter !== "All") {
        statusCode = Object.keys(statusStyles).find(
          (key) => statusStyles[key].text === statusFilter,
        );
      }

      const res = await orderService.getAll(
        statusCode ? Number(statusCode) : null,
        1,
        100,
        token,
      );

      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = sessionStorage.getItem("token");
      await orderService.updateStatus(orderId, Number(newStatus), token);
      fetchOrders();
      alert("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đơn:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await orderService.getById(id, token);
      setSelectedOrder(res.data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      if (monthFilter) {
        const orderMonthFormatted = order.orderDate.substring(0, 7);
        if (orderMonthFormatted !== monthFilter) {
          return false;
        }
      }

      if (searchTerm.trim()) {
        const keyword = searchTerm.toLowerCase();
        const orderIdMatch = order.orderID?.toString().includes(keyword);
        const customerMatch = order.user?.fullName
          ?.toLowerCase()
          .includes(keyword);

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
    currentPage * pageSize,
  );

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
      {/* KHU VỰC HIỆU ỨNG RÊ CHUỘT (HOVER) CHO DANH MỤC VÀ TAB TRẠNG THÁI */}
      <style>{`
        .custom-month-input::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(0%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%) !important;
        }
        .custom-month-input::placeholder {
          color: #64748b !important;
          opacity: 1;
        }
        .custom-search-input::placeholder {
          color: #64748b !important;
        }
        .table-row-hover {
          transition: background-color 0.15s ease;
        }
        .table-row-hover:hover {
          background-color: #f8fafc !important;
        }
        .btn-detail-outline {
          background-color: transparent !important;
          border: 2px solid #cbd5e1 !important;
          color: #2563eb !important;
          transition: all 0.15s ease-in-out !important;
        }
        .btn-detail-outline:hover {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
          color: #ffffff !important;
        }
        .status-tab-item {
          transition: all 0.2s ease-in-out !important;
        }
        .status-tab-item:not(.active-tab):hover {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
        }
      `}</style>

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
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
            <ClipboardList
              style={{ color: "#2563eb" }}
              size={24}
              strokeWidth={2.5}
            />{" "}
            Quản Lý Đơn Hàng
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
            Tra cứu hệ thống hóa đơn bán hàng, lọc theo mốc thời gian và trạng
            thái giao nhận.
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
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}
            >
              Lọc theo tháng/năm đặt:
            </span>

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
                fontWeight: "600",
                color: "#0f172a",
                fontSize: "14px",
                height: "44px",
                outline: "none",
                cursor: "pointer",
                background: "#ffffff",
                width: "150px",
                textAlign: "center",
                fontFamily: "inherit",
              }}
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            />

            {monthFilter && (
              <button
                onClick={() => setMonthFilter("")}
                style={{
                  background: "#ef4444",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  height: "44px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              >
                Xóa lọc tháng
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Tìm mã đơn hoặc khách hàng..."
            className="custom-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              minWidth: "250px",
              fontWeight: "500",
              background: "#ffffff",
              color: "#0f172a",
              outline: "none",
              height: "44px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "12px",
              border: "2px solid #cbd5e1",
              fontWeight: "600",
              background: "#ffffff",
              color: "#0f172a",
              outline: "none",
              cursor: "pointer",
              height: "44px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          >
            <option
              value=""
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Sắp xếp mặc định
            </option>
            <option
              value="date_desc"
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Ngày mới nhất
            </option>
            <option
              value="date_asc"
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Ngày cũ nhất
            </option>
            <option
              value="amount_desc"
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Tổng tiền giảm dần
            </option>
            <option
              value="amount_asc"
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Tổng tiền tăng dần
            </option>
          </select>
        </div>

        {/* Status Tabs (ĐÃ BỔ SUNG HOVER ĐỔI MÀU Ô) */}
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #e2e8f0",
            overflowX: "auto",
            paddingBottom: "4px",
            gap: "6px",
          }}
        >
          {[
            "All",
            "Chờ xử lý",
            "Đang chuẩn bị",
            "Đang giao",
            "Đã giao",
            "Hoàn thành",
            "Hủy",
          ].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`status-tab-item ${isActive ? "active-tab" : ""}`}
                style={{
                  padding: "10px 16px",
                  fontWeight: "600",
                  fontSize: "14px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                  background: isActive ? "#2563eb" : "transparent",
                  color: isActive ? "#ffffff" : "#475569",
                }}
              >
                {status === "All" ? "Tất cả đơn" : status}
              </button>
            );
          })}
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
            style={{ background: "#e2e8f0", borderBottom: "2px solid #cbd5e1" }}
          >
            <tr>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "110px",
                }}
              >
                Mã đơn
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
                Khách hàng
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "140px",
                }}
              >
                <Calendar
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Ngày đặt
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "150px",
                  textAlign: "right",
                }}
              >
                <DollarSign
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Tổng tiền
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "180px",
                }}
              >
                <Layers
                  size={12}
                  style={{
                    marginRight: 4,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Trạng thái
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  textAlign: "right",
                  width: "130px",
                }}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              const currentStyle = statusStyles[order.orderStatus] || {
                text: "Không rõ",
                bg: "#f1f5f9",
                color: "#0f172a",
                border: "#cbd5e1",
              };
              return (
                <tr
                  key={order.orderID}
                  className="table-row-hover"
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                >
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "600",
                      color: "#2563eb",
                    }}
                  >
                    #{order.orderID}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "600",
                      color: "#0f172a",
                    }}
                  >
                    {order.user?.fullName ?? "Khách vãng lai"}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "500",
                      color: "#475569",
                    }}
                  >
                    {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "600",
                      color: "#0f172a",
                      textAlign: "right",
                    }}
                  >
                    {Number(order.totalAmount).toLocaleString("vi-VN")} đ
                  </td>
                  <td style={{ padding: "16px" }}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleUpdateStatus(order.orderID, e.target.value)
                      }
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: `2px solid ${currentStyle.color}`,
                        background: currentStyle.bg,
                        color: currentStyle.color,
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                        outline: "none",
                        width: "100%",
                        fontFamily: "inherit",
                      }}
                    >
                      <option
                        value={1}
                        style={{ background: "#ffffff", color: "#0f172a" }}
                      >
                        Chờ xử lý
                      </option>
                      <option
                        value={2}
                        style={{ background: "#ffffff", color: "#0f172a" }}
                      >
                        Đang chuẩn bị
                      </option>
                      <option
                        value={3}
                        style={{ background: "#ffffff", color: "#0f172a" }}
                      >
                        Đang giao
                      </option>
                      <option
                        value={4}
                        style={{ background: "#ffffff", color: "#0f172a" }}
                      >
                        Đã giao
                      </option>
                      <option
                        value={5}
                        style={{ background: "#ffffff", color: "#0f172a" }}
                      >
                        Hoàn thành
                      </option>
                      <option
                        value={0}
                        style={{ background: "#ffffff", color: "#0f172a" }}
                      >
                        Hủy đơn hàng
                      </option>
                    </select>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button
                      onClick={() => handleViewDetail(order.orderID)}
                      className="btn-detail-outline"
                      style={{
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "inherit",
                      }}
                    >
                      <Eye size={14} strokeWidth={2} /> Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: "#64748b",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  Không tìm thấy dữ liệu hóa đơn thỏa mãn điều kiện lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="pagination"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
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

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isPageActive = currentPage === pageNumber;
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                style={{
                  ...basePageButtonStyle,
                  background: isPageActive ? "#2563eb" : "#ffffff",
                  color: isPageActive ? "#ffffff" : "#0f172a",
                  borderColor: isPageActive ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {pageNumber}
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

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderList;
