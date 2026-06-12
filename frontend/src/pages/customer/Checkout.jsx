import React, { useState } from "react";

export default function Checkout() {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng ông ơi!");
      return;
    }

    alert(
      `🎉 Đặt hàng thành công!\nXin chào ${customerInfo.name}, đơn hàng sẽ được giao tới địa chỉ: ${customerInfo.address}`,
    );
    localStorage.removeItem("cartItems"); // Đặt hàng xong xóa sạch giỏ hàng
    window.location.href = "/"; // Quay về trang chủ
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
      }}
    >
      <h2>📋 Thông Tin Đặt Hàng Nhanh</h2>
      <p style={{ color: "#64748b" }}>
        Không cần đăng nhập tài khoản phức tạp, nhập thông tin là shipper giao
        tận giường!
      </p>

      <form
        onSubmit={handleOrderSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <label>
          <b style={{ display: "block", marginBottom: "6px" }}>Họ và tên:</b>
          <input
            type="text"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            placeholder="Nhập tên của ông"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label>
          <b style={{ display: "block", marginBottom: "6px" }}>
            Số điện thoại:
          </b>
          <input
            type="text"
            name="phone"
            value={customerInfo.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label>
          <b style={{ display: "block", marginBottom: "6px" }}>
            Địa chỉ nhận hàng:
          </b>
          <textarea
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ nhận hàng cụ thể"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              height: "80px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            background: "#16a34a",
            color: "white",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          🚀 Xác Nhận Đặt Hàng Ngay
        </button>
      </form>
    </div>
  );
}
