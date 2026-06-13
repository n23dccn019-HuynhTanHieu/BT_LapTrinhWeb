import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCart(data);
  }, []);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1 || newQty > 10) return;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart_updated")); 
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart_updated")); 
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price) * item.quantity, 0);

  // 🚀 ĐÃ SỬA: Khối hiển thị khi Giỏ hàng trống - Chữ đen rõ ràng, nút bấm nổi bật
  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "sans-serif" }}>
        <h2 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", marginBottom: "15px" }}>
          🛒 Giỏ hàng của bạn đang trống trơn!
        </h2>
        <p style={{ color: "#475569", fontSize: "16px", marginBottom: "30px" }}>
          Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng của mình.
        </p>
        <Link to="/" style={{ textDecoration: "none" }}>
          <button style={{ background: "#2563eb", color: "white", padding: "14px 28px", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)" }}>
            Quay lại mua sắm ngay
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      
      <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#111827", marginBottom: "25px", borderBottom: "2px solid #e5e7eb", paddingBottom: "12px" }}>
        🛒 Giỏ Hàng Của Bạn
      </h2>
      
      {/* Khung cuộn chống tràn cho bảng */}
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", minWidth: "800px" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left", color: "#475569" }}>
              <th style={{ padding: "16px", fontWeight: "600", width: "40%" }}>Sản phẩm</th>
              <th style={{ padding: "16px", fontWeight: "600" }}>Giá</th>
              <th style={{ padding: "16px", fontWeight: "600", textAlign: "center" }}>Số lượng</th>
              <th style={{ padding: "16px", fontWeight: "600" }}>Tổng</th>
              <th style={{ padding: "16px", fontWeight: "600", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              const currentPrice = item.price;
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0", color: "#334155" }}>
                  <td style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: "16px" }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", border: "1px solid #f1f5f9" }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100";
                      }}
                    />
                    <span style={{ color: "#1f2937", fontWeight: "500" }}>{item.name}</span>
                  </td>
                  <td style={{ padding: "20px 16px" }}>{currentPrice?.toLocaleString()} đ</td>
                  <td style={{ padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px", overflow: "hidden" }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        style={{ padding: "6px 12px", background: "#f8fafc", border: "none", cursor: "pointer", fontWeight: "bold", color: "#000000" }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: "30px", textAlign: "center", fontWeight: "bold", color: "#111827" }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        style={{ padding: "6px 12px", background: "#f8fafc", border: "none", cursor: "pointer", fontWeight: "bold", color: "#000000" }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: "20px 16px", fontWeight: "600", color: "#111827" }}>{(currentPrice * item.quantity)?.toLocaleString()} đ</td>
                  <td style={{ padding: "20px 16px", textAlign: "center" }}>
                    <button onClick={() => removeItem(item.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontWeight: "500" }}>Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Khối tổng tiền nằm độc lập bên dưới bảng */}
      <div style={{ marginTop: "30px", background: "#f8fafc", padding: "20px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
        <h3 style={{ textAlign: "right", color: "#334155", fontWeight: "normal", margin: "0 0 20px 0" }}>
          Tổng tiền thanh toán: <span style={{ color: "#dc2626", fontSize: "24px", fontWeight: "bold", marginLeft: "10px" }}>{totalPrice.toLocaleString()} đ</span>
        </h3>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>
            ← Tiếp tục mua hàng
          </Link>

          <Link to="/checkout">
            <button style={{ background: "#2563eb", color: "white", padding: "12px 24px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Tiến hành thanh toán →
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}