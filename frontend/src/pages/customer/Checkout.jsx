import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🌟 Import useNavigate
import orderService from "../../services/orderService";

export default function Checkout() {
  const navigate = useNavigate(); // 🌟 Khởi tạo hook useNavigate để điều hướng
  
  const [customerInfo, setCustomerInfo] = useState({
    userID: null,
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    note: "",
  });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(cartData);

    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

    if (loggedInUser) {
      setCustomerInfo({
        userID: loggedInUser.userID || loggedInUser.id || null,
        receiverName: loggedInUser.fullName || loggedInUser.name || "",
        receiverPhone: loggedInUser.phone || "",
        receiverAddress: loggedInUser.address || "",
        note: "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const totalOrderPrice = cart.reduce((sum, item) => {
    const price = item.promoPrice || item.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (
      !customerInfo.receiverName ||
      !customerInfo.receiverPhone ||
      !customerInfo.receiverAddress
    ) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    const orderData = {
      userID: customerInfo.userID,
      receiverName: customerInfo.receiverName,
      receiverPhone: customerInfo.receiverPhone,
      receiverAddress: customerInfo.receiverAddress,
      note: customerInfo.note || "",
      items: cart.map((item) => ({
        productID: item.productID || item.id,
        quantity: item.quantity,
      })),
    };

    const token = localStorage.getItem("token");

    try {
      const response = await orderService.create(orderData, token);

      if (response.status === 200 || response.data) {
        alert(
          `Đặt hàng thành công!\nMã đơn hàng của Quý khách là: #${response.data.orderId || response.data}`
        );
        localStorage.removeItem("cartItems");
        window.dispatchEvent(new Event("cart_updated"));
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      if (error.response && error.response.data) {
        alert(`Thất bại: ${error.response.data}`);
      } else {
        alert("Lỗi kết nối hệ thống, không thể đặt hàng!");
      }
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "all 0.2s ease-in-out",
    outline: "none",
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        width: "95%",
        margin: "40px auto",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* 🌟 NÚT QUAY LẠI TOÀN CỤC (Nằm phía trên cùng của giao diện Checkout) */}
      <button
        onClick={() => navigate(-1)} // -1 có nghĩa là quay lại trang vừa xem trước đó (ví dụ: Trang giỏ hàng)
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          color: "#475569",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "20px",
          padding: "6px 12px",
          borderRadius: "6px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.target.style.color = "#0f172a"; e.target.style.backgroundColor = "#f1f5f9"; }}
        onMouseLeave={(e) => { e.target.style.color = "#475569"; e.target.style.backgroundColor = "transparent"; }}
      >
        ← Quay lại
      </button>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* KHỐI 1: FORM THÔNG TIN NHẬN HÀNG */}
        <div 
          style={{ 
            flex: "1 1 600px", 
            border: "1px solid #e2e8f0",
            padding: "35px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            background: "#ffffff"
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#111827",
              margin: "0 0 25px 0",
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "15px",
            }}
          >
            📋 Thông Tin Nhận Hàng
          </h2>

          <form onSubmit={handleOrderSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <label>
              <b style={{ display: "block", marginBottom: "8px", color: "#475569", fontSize: "15px" }}>
                Họ và tên người nhận:
              </b>
              <input
                type="text"
                name="receiverName"
                value={customerInfo.receiverName}
                onChange={handleInputChange}
                placeholder="Nhập tên người nhận"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#16a34a"; e.target.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.backgroundColor = "#f8fafc"; }}
              />
            </label>

            <label>
              <b style={{ display: "block", marginBottom: "8px", color: "#475569", fontSize: "15px" }}>
                Số điện thoại:
              </b>
              <input
                type="text"
                name="receiverPhone"
                value={customerInfo.receiverPhone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#16a34a"; e.target.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.backgroundColor = "#f8fafc"; }}
              />
            </label>

            <label>
              <b style={{ display: "block", marginBottom: "8px", color: "#475569", fontSize: "15px" }}>
                Địa chỉ nhận hàng:
              </b>
              <textarea
                name="receiverAddress"
                value={customerInfo.receiverAddress}
                onChange={handleInputChange}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                style={{ ...inputStyle, height: "100px", fontFamily: "inherit" }}
                onFocus={(e) => { e.target.style.borderColor = "#16a34a"; e.target.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.backgroundColor = "#f8fafc"; }}
              />
            </label>

            <label>
              <b style={{ display: "block", marginBottom: "8px", color: "#475569", fontSize: "15px" }}>
                Ghi chú đơn hàng (Nếu có):
              </b>
              <input
                type="text"
                name="note"
                value={customerInfo.note}
                onChange={handleInputChange}
                placeholder="Ví dụ: Giao giờ hành chính..."
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#16a34a"; e.target.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.backgroundColor = "#f8fafc"; }}
              />
            </label>

            <button
              type="submit"
              style={{
                background: "#16a34a",
                color: "white",
                padding: "15px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "17px",
                marginTop: "10px",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
              }}
            >
              Xác Nhận Đặt Hàng Ngay
            </button>
          </form>
        </div>

        {/* KHỐI 2: ĐƠN HÀNG CỦA BẠN */}
        <div 
          style={{ 
            flex: "1 1 350px", 
            border: "1px solid #e2e8f0",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
            background: "#f8fafc",
            alignSelf: "flex-start"
          }}
        >
          <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", margin: "0 0 20px 0", borderBottom: "2px solid #e2e8f0", paddingBottom: "12px" }}>
            🛍️ Đơn Hàng ({cart.length} sản phẩm)
          </h3>

          <div style={{ maxHeight: "320px", overflowY: "auto", marginBottom: "20px", paddingRight: "5px" }}>
            {cart.map((item, idx) => {
              const currentPrice = item.promoPrice || item.price || 0;
              return (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px dashed #e2e8f0" }}>
                  <div style={{ flex: "1", paddingRight: "15px" }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "14.5px", fontWeight: "600", color: "#111827" }}>{item.productName || item.name}</p>
                    <p style={{ margin: "0", fontSize: "13px", color: "#64748b" }}>Số lượng: {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: "right", fontWeight: "600", color: "#334155", fontSize: "14.5px" }}>
                    {((currentPrice) * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "15px", color: "#475569" }}>
              <span>Tạm tính:</span>
              <span>{totalOrderPrice.toLocaleString()}đ</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "15px", color: "#475569" }}>
              <span>Phí vận chuyển:</span>
              <span style={{ color: "#16a34a", fontWeight: "600" }}>Miễn phí</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "17px", fontWeight: "bold", color: "#111827" }}>Tổng cộng:</span>
              <span style={{ fontSize: "22px", fontWeight: "800", color: "#ef4444" }}>{totalOrderPrice.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}