import React, { useState } from 'react';

export default function Checkout() {
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đặt hàng thành công!\nXin chào: ${customerInfo.fullName}\nChúng tôi sẽ liên hệ qua SĐT: ${customerInfo.phoneNumber}`);
  };

  return (
    <div className="checkout-container">
      <h2>Đặt hàng nhanh (Không cần đăng nhập)</h2>
      <p className="checkout-subtext">Vui lòng điền thông tin chính xác để bộ phận giao hàng liên hệ với bạn.</p>
      
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label><b>Họ và tên người nhận *</b></label>
          <input 
            type="text" 
            required 
            placeholder="Ví dụ: Nguyễn Văn A"
            value={customerInfo.fullName}
            onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label><b>Số điện thoại *</b></label>
          <input 
            type="tel" 
            required 
            placeholder="Ví dụ: 0912345678"
            value={customerInfo.phoneNumber}
            onChange={(e) => setCustomerInfo({...customerInfo, phoneNumber: e.target.value})}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label><b>Địa chỉ nhận hàng *</b></label>
          <textarea 
            required 
            rows="3"
            placeholder="Số nhà, tên đường, xã/phường, quận/huyện, tỉnh thành..."
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
            className="form-textarea"
          />
        </div>

        <button type="submit" className="btn-submit-order">
          Xác nhận đặt mua
        </button>
      </form>
    </div>
  );
}