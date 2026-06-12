import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // Lấy dữ liệu giỏ hàng từ máy lên hiển thị
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(data);
  }, []);

  // Hàm thay đổi số lượng sản phẩm
  const updateQuantity = (id, newQty) => {
    if (newQty < 1 || newQty > 10) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item,
    );
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  // Hàm xóa sản phẩm khỏi giỏ
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart_updated")); // báo cho Navbar biết để cập nhật số lượng hiển thị
  };

  // Tính tổng tiền của toàn bộ giỏ hàng
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>🛒 Giỏ hàng của bạn đang trống trơn!</h2>
        <Link to="/" style={{ color: "#2563eb", 尊weight: "bold" }}>
          Quay lại mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <h2>🛒 Giỏ Hàng Của Bạn</h2>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
            <th style={{ padding: "12px" }}>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td
                style={{
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                  }}
                />
                <span>{item.name}</span>
              </td>
              <td>{item.price?.toLocaleString()} đ</td>
              <td>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ padding: "2px 8px" }}
                >
                  -
                </button>
                <span style={{ margin: "0 10px", fontWeight: "bold" }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ padding: "2px 8px" }}
                >
                  +
                </button>
              </td>
              <td>{(item.price * item.quantity)?.toLocaleString()} đ</td>
              <td>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    color: "red",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "30px",
          textAlign: "right",
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>
          Tổng tiền thanh toán:{" "}
          <span style={{ color: "red", fontSize: "24px" }}>
            {totalPrice.toLocaleString()} đ
          </span>
        </h3>
        <Link to="/checkout">
          <button
            style={{
              background: "#2563eb",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Tiến hành thanh toán →
          </button>
        </Link>
      </div>
    </div>
  );
}
