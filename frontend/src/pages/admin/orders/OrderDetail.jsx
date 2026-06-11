import React from "react";
import { X, User, Phone, MapPin, FileText, ShoppingBag } from "lucide-react";

const statusText = {
  0: { label: "Hủy bỏ đơn", color: "#dc2626" },
  1: { label: "Chờ xử lý hệ thống", color: "#d97706" },
  2: { label: "Đang đóng gói chuẩn bị", color: "#16a34a" },
  3: { label: "Đang giao dịch vận chuyển", color: "#2563eb" },
  4: { label: "Đã giao hàng thành công", color: "#7c3aed" },
  5: { label: "Đơn hàng hoàn thành", color: "#db2777" },
};

const OrderDetail = ({ order, onClose }) => {
  const currentStatus = statusText[order.orderStatus] || { label: "Không rõ", color: "#000" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 1000, WebkitFontSmoothing: "subpixel-antialiased" }}>
      <div style={{ background: "#ffffff", borderRadius: "16px", width: "100%", maxWidth: "760px", border: "3px solid #000000", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        
        {/* Header Modal */}
        <div style={{ padding: "20px 24px", borderBottom: "2px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0, color: "#000000" }}>
            Chi Tiết Đơn Hàng <span style={{ color: "#2563eb" }}>#{order.orderID}</span>
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#000000", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Nội dung hóa đơn cuộn dọc */}
        <div style={{ overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Khối thông tin giao nhận hàng */}
          <div style={{ background: "#f1f5f9", padding: "18px", borderRadius: "12px", border: "2px solid #cbd5e1" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
              📋 THÔNG TIN ĐỊA CHỈ NHẬN HÀNG
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#000000", fontWeight: "700" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><User size={15} /> Người nhận: <span style={{ fontWeight: "800" }}>{order.receiverName}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Phone size={15} /> Số điện thoại: <span style={{ fontWeight: "800" }}>{order.receiverPhone}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><MapPin size={15} /> Địa chỉ nơi giao: <span style={{ fontWeight: "800" }}>{order.receiverAddress}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FileText size={15} /> Nội dung ghi chú: <span style={{ fontWeight: "800", color: "#475569" }}>{order.note || "Không ghi chú"}</span></div>
            </div>
          </div>

          {/* Bảng danh sách giỏ hàng */}
          <div>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShoppingBag size={16} /> DANH SÁCH MẶT HÀNG ĐÃ ĐẶT
            </h4>
            <div style={{ border: "2px solid #cbd5e1", borderRadius: "12px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#e2e8f0", color: "#000000", borderBottom: "2px solid #cbd5e1" }}>
                    <th style={{ padding: "10px 12px", fontWeight: "900", textAlign: "left" }}>Tên sản phẩm</th>
                    <th style={{ padding: "10px 12px", fontWeight: "900", textAlign: "center", width: "60px" }}>SL</th>
                    <th style={{ padding: "10px 12px", fontWeight: "900", textAlign: "right", width: "120px" }}>Đơn giá</th>
                    <th style={{ padding: "10px 12px", fontWeight: "900", textAlign: "right", width: "130px" }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderDetails?.map((item) => (
                    <tr key={item.orderDetailID} style={{ borderBottom: "1px solid #cbd5e1", background: "#ffffff" }}>
                      <td style={{ padding: "12px", fontWeight: "800", color: "#000000" }}>
                        {item.product?.productName || "Sản phẩm đã xóa"}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center", fontWeight: "900" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: "700" }}>
                        {Number(item.price).toLocaleString("vi-VN")}đ
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontWeight: "900", color: "#000000" }}>
                        {(item.quantity * item.price).toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Chân Modal chứa thông tin tổng kết thanh toán */}
        <div style={{ padding: "20px 24px", borderTop: "2px solid #cbd5e1", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "0 0 16px 16px" }}>
          <div>
            <span style={{ fontSize: "14px", fontWeight: "800", color: "#475569" }}>Trạng thái vận chuyển:</span>
            <div style={{ fontSize: "16px", fontWeight: "900", color: currentStatus.color, marginTop: "2px" }}>
              ● {currentStatus.label}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "14px", fontWeight: "800", color: "#475569" }}>Tổng giá trị hóa đơn:</span>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#dc2626", marginTop: "2px" }}>
              {Number(order.totalAmount).toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;