import React, { useState, useEffect } from "react";
import orderService from "../../services/orderService";

export default function Checkout() {
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
        productID: item.id,
        quantity: item.quantity,
      })),
    };

    const token = localStorage.getItem("token");

    try {
      const response = await orderService.create(orderData, token);

      if (response.status === 200 || response.data) {
        alert(
          `🎉 Đặt hàng thành công!\nMã đơn hàng của Quý khách là: #${response.data.orderId}`,
        );
        localStorage.removeItem("cartItems");
        window.dispatchEvent(new Event("cart_updated"));
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      if (error.response && error.response.data) {
        alert(` Thất bại: ${error.response.data}`);
      } else {
        alert(" Lỗi kết nối hệ thống, không thể đặt hàng!");
      }
    }
  };

  return (
    /* 🚀 SỬA TẠI ĐÂY: Tăng maxWidth lên 1000px và padding lên 40px để form bung rộng ra hai bên */
    <div
      style={{
        maxWidth: "1000px",
        width: "95%",
        margin: "40px auto",
        padding: "40px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        boxSizing: "border-box",
      }}
    >
      {/* Tiêu đề đen nét, căn lề trái cho rộng rãi đồng bộ với form */}
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#111827",
          margin: "0 0 30px 0",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "15px",
        }}
      >
        📋 Thông Tin Nhận Hàng
      </h2>

      <form
        onSubmit={handleOrderSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <label>
          <b
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#111827",
              fontSize: "16px",
            }}
          >
            Họ và tên người nhận:
          </b>
          <input
            type="text"
            name="receiverName"
            value={customerInfo.receiverName}
            onChange={handleInputChange}
            placeholder="Nhập tên người nhận"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#111827",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
        </label>

        <label>
          <b
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#111827",
              fontSize: "16px",
            }}
          >
            Số điện thoại:
          </b>
          <input
            type="text"
            name="receiverPhone"
            value={customerInfo.receiverPhone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#111827",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
        </label>

        <label>
          <b
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#111827",
              fontSize: "16px",
            }}
          >
            Địa chỉ nhận hàng:
          </b>
          <textarea
            name="receiverAddress"
            value={customerInfo.receiverAddress}
            onChange={handleInputChange}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#111827",
              height: "120px",
              boxSizing: "border-box",
              fontSize: "16px",
              fontFamily: "sans-serif",
            }}
          />
        </label>

        <label>
          <b
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#111827",
              fontSize: "16px",
            }}
          >
            Ghi chú đơn hàng (Nếu có):
          </b>
          <input
            type="text"
            name="note"
            value={customerInfo.note}
            onChange={handleInputChange}
            placeholder="Ví dụ: Giao giờ hành chính..."
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#111827",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            background: "#16a34a",
            color: "white",
            padding: "16px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "18px",
            marginTop: "15px",
            boxShadow: "0 4px 10px rgba(22, 163, 74, 0.2)",
          }}
        >
          Xác Nhận Đặt Hàng Ngay
        </button>
      </form>
    </div>
  );
}
