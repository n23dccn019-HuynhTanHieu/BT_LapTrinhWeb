import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Điện thoại iPhone 15 Pro",
      price: 25990000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=150&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: "Tai nghe Bluetooth Sony",
      price: 2990000,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60",
    },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;

          // 1. Chặn giới hạn dưới (Không cho nhỏ hơn 1)
          if (newQuantity < 1) return item;

          // 2. Chặn giới hạn trên (Ví dụ: Tối đa chỉ cho mua 10 cái)
          if (newQuantity > 10) {
            alert(
              "Số lượng sản phẩm trong giỏ hàng đã đạt giới hạn tối đa (tối đa 10 cái)!",
            );
            return item;
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  React.useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    // Bắn tín hiệu thông báo cho Navbar biết giỏ hàng đã thay đổi
    window.dispatchEvent(new Event("cart_updated"));
  }, [cartItems]);
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#2d3748",
      }}
    >
      <h2
        style={{
          fontSize: "26px",
          fontWeight: "700",
          marginBottom: "24px",
          color: "#1a202c",
        }}
      >
        🛒 Giỏ hàng của bạn
      </h2>

      {cartItems.length === 0 ? (
        <p
          style={{
            padding: "30px",
            backgroundColor: "#f7fafc",
            borderRadius: "12px",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          Giỏ hàng đang trống.{" "}
          <Link
            to="/"
            style={{
              color: "#3182ce",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Mua sắm ngay
          </Link>
        </p>
      ) : (
        <div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#ffffff",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "30px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f7fafc",
                  borderBottom: "2px solid #edf2f7",
                }}
              >
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#4a5568",
                  }}
                >
                  Sản phẩm
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#4a5568",
                    width: "140px",
                  }}
                >
                  Giá
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#4a5568",
                    width: "150px",
                  }}
                >
                  Số lượng
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#4a5568",
                    width: "150px",
                  }}
                >
                  Tổng cộng
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#4a5568",
                    width: "100px",
                  }}
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #edf2f7",
                    transition: "background 0.2s",
                  }}
                >
                  {/* Cột sản phẩm dùng Flexbox xử lý dính chữ */}
                  <td
                    style={{
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        minWidth: "64px",
                        backgroundColor: "#edf2f7",
                        borderRadius: "8px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={item.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#2d3748",
                        fontSize: "15px",
                      }}
                    >
                      {item.name}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontWeight: "500",
                      color: "#4a5568",
                    }}
                  >
                    {item.price.toLocaleString()}đ
                  </td>

                  {/* Cột số lượng căn đều nút bấm */}
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid #cbd5e0",
                        borderRadius: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "none",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "16px",
                          color: "#4a5568",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#f7fafc")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#ffffff")
                        }
                      >
                        -
                      </button>
                      <span
                        style={{
                          width: "40px",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "#2d3748",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "none",
                          backgroundColor: "#ffffff",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "16px",
                          color: "#4a5568",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#f7fafc")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#ffffff")
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#2b6cb0",
                    }}
                  >
                    {(item.price * item.quantity).toLocaleString()}đ
                  </td>

                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#fed7d7",
                        color: "#c53030",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#feb2b2")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#fed7d7")
                      }
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hộp tổng kết thiết kế tinh tế bên phải */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                margin: "0 0 20px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#4a5568",
              }}
            >
              Tổng tiền thanh toán:{" "}
              <span
                style={{
                  color: "#e53e3e",
                  fontSize: "24px",
                  fontWeight: "700",
                  marginLeft: "10px",
                }}
              >
                {totalPrice.toLocaleString()} đ
              </span>
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Link
                to="/"
                style={{
                  color: "#718096",
                  fontWeight: "600",
                  textDecoration: "none",
                  fontSize: "15px",
                }}
              >
                ← Tiếp tục mua hàng
              </Link>
              <Link
                to="/checkout"
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#3182ce",
                  color: "#ffffff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "700",
                  fontSize: "15px",
                  boxShadow: "0 4px 6px -1px rgba(49, 130, 206, 0.4)",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2b6cb0")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#3182ce")}
              >
                Đặt hàng nhanh →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
