import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import orderService from "../../services/orderService"; 

export default function Cart() {
  const navigate = useNavigate();

  // 1. Quản lý trạng thái Giỏ hàng lấy từ localStorage
  const [cartItems, setCartItems] = useState(() => {
    const rawCart = localStorage.getItem("cartItems");
    return rawCart ? JSON.parse(rawCart) : [];
  });

  // 2. Quản lý trạng thái User (Đã có sẵn phone và address từ AuthController mới)
  const [currentUser, setCurrentUser] = useState(() => {
    const rawUser = localStorage.getItem("currentUser") || localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  });

  // 3. Đồng bộ dữ liệu khi hệ thống có thay đổi cục bộ
  useEffect(() => {
    const syncData = () => {
      const rawUser = localStorage.getItem("currentUser") || localStorage.getItem("user");
      setCurrentUser(rawUser ? JSON.parse(rawUser) : null);
      
      const rawCart = localStorage.getItem("cartItems");
      if (rawCart) setCartItems(JSON.parse(rawCart));
    };

    window.addEventListener("cart_updated", syncData);
    return () => window.removeEventListener("cart_updated", syncData);
  }, []);

  // 4. Hàm tăng / giảm số lượng sản phẩm
  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          if (newQuantity < 1) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      localStorage.setItem("cartItems", JSON.stringify(newItems));
      setTimeout(() => {
        window.dispatchEvent(new Event("cart_updated"));
      }, 0);

      return newItems;
    });
  };

  // 5. Hàm xóa sản phẩm khỏi giỏ
  const removeItem = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      const filteredItems = cartItems.filter((item) => item.id !== id);
      setCartItems(filteredItems);
      localStorage.setItem("cartItems", JSON.stringify(filteredItems));
      
      setTimeout(() => {
        window.dispatchEvent(new Event("cart_updated"));
      }, 0);
    }
  };

  // 6. Tính tổng tiền giỏ hàng
  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 7. 🚀 HÀM ĐẶT HÀNG ĐỒNG BỘ DỮ LIỆU ĐỘNG TỪ BẢNG USER (AUTH)
  const handleCheckout = async () => {
    const checkUser = localStorage.getItem("currentUser") || localStorage.getItem("user");

    if (!checkUser) {
      alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiến hành đặt hàng.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(checkUser);
    console.log("Dữ liệu User hiện tại trong LocalStorage:", user);

    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    // Đọc chuẩn chữ viết thường (camelCase) từ Object AuthController mới trả ra
    const finalUserID = user.userID || user.UserID || user.id;
    const finalName = user.fullName || user.FullName || user.username || "Khách hàng";
    const finalPhone = user.phone || user.Phone || user.phoneNumber;
    const finalAddress = user.address || user.Address;

    // Chặn lại nếu dữ liệu thực sự bị trống trong database của tài khoản này
    if (!finalPhone || !finalAddress || finalPhone === "NULL" || finalAddress === "NULL") {
      alert(`⚠️ Lỗi hệ thống: Tài khoản của bạn (ID: ${finalUserID}) thực tế trong bảng Users đang để trống trường Số điện thoại hoặc Địa chỉ. Vui lòng cập nhật dữ liệu vào DB rồi thử lại!`);
      return;
    }

    const isConfirm = window.confirm("Bạn có chắc chắn muốn đặt mua đơn hàng này không?");
    if (!isConfirm) return;

    try {
      const orderData = {
        UserID: finalUserID,
        TotalPrice: totalCartPrice,
        Status: "Pending",
        ReceiverName: finalName,
        ReceiverPhone: finalPhone,
        ReceiverAddress: finalAddress,
        Items: cartItems.map((item) => ({
          ProductId: item.id,
          Quantity: item.quantity,
          Price: item.price
        }))
      };

      console.log("Dữ liệu đóng gói gửi lên API đặt hàng:", orderData);

      const token = localStorage.getItem("token");
      const response = await orderService.create(orderData, token);

      if (response.status === 200 || response.status === 201) {
        alert("🎉 Đặt hàng thành công! Đơn hàng đã được ghi nhận vào hệ thống.");
        setCartItems([]);
        localStorage.removeItem("cartItems");
        setTimeout(() => {
          window.dispatchEvent(new Event("cart_updated"));
        }, 0);
        navigate("/"); 
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert(error.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng. Vui lòng kiểm tra lại!");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "20px", borderBottom: "2px solid #edf2f7", paddingBottom: "10px" }}>
        🛒 Giỏ hàng của bạn
      </h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "#718096", fontSize: "18px" }}>Giỏ hàng đang trống.</p>
          <Link to="/" style={{ color: "#3182ce", textDecoration: "none", fontWeight: "600" }}>
            Quay lại mua sắm ngay
          </Link>
        </div>
      ) : (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f7fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px" }}>Sản phẩm</th>
                <th style={{ padding: "12px" }}>Giá tiền</th>
                <th style={{ padding: "12px" }}>Số lượng</th>
                <th style={{ padding: "12px" }}>Tổng cộng</th>
                <th style={{ padding: "12px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #edf2f7" }}>
                  <td style={{ padding: "12px", fontWeight: "600" }}>{item.name}</td>
                  <td style={{ padding: "12px" }}>{item.price.toLocaleString()}đ</td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={btnQtyStyle}>-</button>
                    <span style={{ margin: "0 12px", fontWeight: "600" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={btnQtyStyle}>+</button>
                  </td>
                  <td style={{ padding: "12px", color: "#e53e3e", fontWeight: "600" }}>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={() => removeItem(item.id)} style={btnDeleteStyle}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "15px" }}>
            <h3 style={{ fontSize: "20px" }}>
              Tổng tiền thanh toán:{" "}
              <span style={{ color: "#e53e3e", fontSize: "24px", fontWeight: "700" }}>
                {totalCartPrice.toLocaleString()}đ
              </span>
            </h3>

            <button onClick={handleCheckout} style={btnCheckoutStyle}>
              Tiến Hành Mua Hàng ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnQtyStyle = { padding: "3px 10px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "4px", cursor: "pointer" };
const btnDeleteStyle = { padding: "6px 12px", backgroundColor: "#fed7d7", color: "#9b2c2c", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" };
const btnCheckoutStyle = { padding: "14px 30px", backgroundColor: "#3182ce", color: "#fff", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "700", cursor: "pointer" };