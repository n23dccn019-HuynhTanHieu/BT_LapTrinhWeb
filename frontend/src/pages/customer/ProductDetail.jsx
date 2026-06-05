import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();

  const product = {
    id: id,
    name: 'Điện thoại iPhone 15 Pro (Mẫu thử)',
    price: 28000000,
    salePrice: 25990000,
    image: 'https://via.placeholder.com/400',
    description: 'Đây là phần mô tả chi tiết của sản phẩm. Sản phẩm có cấu hình mạnh mẽ, camera sắc nét, dung lượng pin trâu dùng cả ngày dài không lo hết pin. Hàng chính hãng bảo hành 12 tháng.'
  };

  return (
    <div className="detail-container">
      <Link to="/" className="link-back">← Quay lại danh sách</Link>
      
      <div className="detail-layout">
        <div className="detail-image-box">
          <img src={product.image} alt={product.name} className="detail-img" />
        </div>

        <div className="detail-info-box">
          <h1>{product.name}</h1>
          <hr />
          
          <div className="detail-pricing">
            {product.salePrice ? (
              <>
                <p>Giá gốc: <span className="original-price">{product.price.toLocaleString()} đ</span></p>
                <p>Giá khuyến mãi: <span className="sale-price">{product.salePrice.toLocaleString()} đ</span></p>
              </>
            ) : (
              <p>Giá bán: <span className="normal-price">{product.price.toLocaleString()} đ</span></p>
            )}
          </div>

          <div className="detail-quantity">
            <label><b>Số lượng:</b></label>
            <input type="number" defaultValue={1} min={1} className="quantity-input" />
          </div>

          <button className="btn-add-to-cart">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <div className="detail-desc-section">
        <h3>Mô tả chi tiết sản phẩm</h3>
        <p className="desc-text">{product.description}</p>
      </div>
    </div>
  );
}