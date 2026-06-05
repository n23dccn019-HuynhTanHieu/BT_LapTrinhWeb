import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Điện thoại iPhone 15 Pro', price: 25990000, quantity: 1, image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Tai nghe Bluetooth Sony', price: 2990000, quantity: 2, image: 'https://via.placeholder.com/80' }
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>
      
      {cartItems.length === 0 ? (
        <p>Giỏ hàng đang trống. <Link to="/">Mua sắm ngay</Link></p>
      ) : (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng cộng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td className="product-info-cell">
                    <img src={item.image} alt={item.name} className="product-thumb" />
                    <span>{item.name}</span>
                  </td>
                  <td>{item.price.toLocaleString()}đ</td>
                  <td>
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                  <td>
                    <button onClick={() => removeItem(item.id)} className="btn-delete">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3>Tổng tiền thanh toán: <span className="total-price">{totalPrice.toLocaleString()} đ</span></h3>
            <div className="cart-actions">
              <Link to="/" className="link-continue">Tiếp tục mua hàng</Link>
              <Link to="/checkout" className="btn-checkout">
                Đặt hàng nhanh →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}