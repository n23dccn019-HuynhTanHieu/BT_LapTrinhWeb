import React, { useEffect, useState } from 'react';
import orderService from '../../services/orderService';
import { FiClock, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('token');

  const fetchOrderHistory = async () => {
    try {
      const res = await orderService.getCustomerHistory(token);
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử mua hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrderHistory();
  }, [token]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không?`)) return;

    try {
      const res = await orderService.cancelOrder(orderId, token);
      alert(res.data.message || "Đã hủy đơn hàng thành công!");
      fetchOrderHistory(); // Refresh lại danh sách
    } catch (err) {
      alert(err.response?.data || "Hủy đơn hàng thất bại!");
    }
  };

  // Ánh xạ trạng thái số nguyên (int) từ C# Backend sang Giao diện
  const renderStatusBadge = (statusNum) => {
    switch (statusNum) {
      case 1:
        return <span style={{ padding: "5px 12px", backgroundColor: "#fff3cd", color: "#856404", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}><FiClock /> Chờ duyệt</span>;
      case 2:
        return <span style={{ padding: "5px 12px", backgroundColor: "#cce5ff", color: "#004085", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}><FiPackage /> Đang xử lý</span>;
      case 3:
        return <span style={{ padding: "5px 12px", backgroundColor: "#e2e3e5", color: "#383d41", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}><FiTruck /> Đang giao hàng</span>;
      case 4:
        return <span style={{ padding: "5px 12px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}><FiCheckCircle /> Đã hoàn thành</span>;
      case 0:
        return <span style={{ padding: "5px 12px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}><FiXCircle /> Đã hủy</span>;
      default:
        return <span className="badge bg-secondary">Mã trạng thái: {statusNum}</span>;
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px", fontFamily: "sans-serif" }}>Đang tải lịch sử mua hàng...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", fontFamily: '"Segoe UI", sans-serif' }}>
      <h2 style={{ marginBottom: "24px", color: "#2d3748", fontWeight: "700" }}>🛍️ Lịch sử đơn hàng của bạn</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8f9fa", borderRadius: "10px", border: "1px dashed #dee2e6" }}>
          <p style={{ color: "#6c757d", margin: 0 }}>Bạn chưa thực hiện đơn hàng nào trên hệ thống.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div key={order.orderID} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
              
              {/* Thống tin chung của Đơn */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #edf2f7", paddingBottom: "12px", marginBottom: "14px" }}>
                <div>
                  <span style={{ fontWeight: "700", color: "#2d3748" }}>Mã đơn: #{order.orderID}</span>
                  <span style={{ color: "#a0aec0", fontSize: "13px", marginLeft: "15px" }}>Ngày đặt: {new Date(order.orderDate).toLocaleString("vi-VN")}</span>
                </div>
                <div>{renderStatusBadge(order.orderStatus)}</div>
              </div>

              {/* Danh sách sản phẩm trong đơn (Duyệt theo orderDetails từ Backend) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
                {order.orderDetails?.map((detail) => (
                  <div key={detail.orderDetailID} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#4a5568" }}>
                    <span>
                      {detail.product?.productName || "Sản phẩm không tên"} 
                      <strong style={{ color: "#718096", marginLeft: "8px" }}>x{detail.quantity}</strong>
                    </span>
                    <span style={{ fontWeight: "600" }}>{detail.price?.toLocaleString("vi-VN")} đ</span>
                  </div>
                ))}
              </div>

              {/* Footer đơn hàng: Người nhận & Tổng chi phí */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #edf2f7", paddingTop: "12px" }}>
                <div style={{ fontSize: "13px", color: "#718096", maxWidth: "60%" }}>
                  Giao tới: <span style={{ color: "#4a5568", fontWeight: "500" }}>{order.receiverName} ({order.receiverPhone}) - {order.receiverAddress}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#e53e3e" }}>
                    Tổng: {order.totalAmount?.toLocaleString("vi-VN")} đ
                  </div>

                  {/* CHỈ CHO PHÉP HỦY KHI ĐƠN Ở TRẠNG THÁI CHỜ DUYỆT (OrderStatus == 1) */}
                  {order.orderStatus === 1 && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order.orderID)}
                      style={{ padding: "6px 14px", backgroundColor: "#fff", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
