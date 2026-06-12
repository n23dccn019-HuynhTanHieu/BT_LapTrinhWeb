import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import productService from "../../services/productService"; // Đảm bảo đúng đường dẫn service của hai bạn

export default function ProductDetail() {
  const { id } = useParams(); // Lấy productID từ URL

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Quản lý số lượng chọn mua

  // Gọi API lấy chi tiết sản phẩm theo ID
  useEffect(() => {
    const fetchProductById = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        const allProducts = response.data.data || [];
        
        // Tìm sản phẩm trùng ID trong mảng
        const foundProduct = allProducts.find(
          (p) => String(p.productID) === String(id)
        );

        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Lỗi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [id]);

  // Hàm xử lý Thêm vào giỏ hàng thực tế
  const handleAddToCart = () => {
    if (!product) return;

    const rawCart = localStorage.getItem("cartItems") || "[]";
    let cartItems = JSON.parse(rawCart);

    const existingItem = cartItems.find((item) => item.id === product.productID);
    const finalPrice = product.promoPrice || product.price;

    if (existingItem) {
      if (existingItem.quantity + quantity > 10) {
        alert(`Bạn chỉ có thể mua tối đa 10 sản phẩm "${product.productName}"! Hiện tại giỏ hàng đã có ${existingItem.quantity} sản phẩm.`);
        return;
      }
      existingItem.quantity += quantity;
    } else {
      cartItems.push({
        id: product.productID,
        name: product.productName,
        price: finalPrice,
        image: product.thumbnail,
        quantity: quantity,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart_updated"));
    alert(`Đã thêm thành công ${quantity} sản phẩm vào giỏ hàng!`);
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "50px", color: "var(--text)" }}>Đang tải thông tin sản phẩm...</h2>;
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 style={{ color: "#ef4444" }}>❌ Không tìm thấy sản phẩm yêu cầu!</h2>
        <Link to="/" className="link-back" style={{ marginTop: "16px" }}>Quay lại trang chủ</Link>
      </div>
    );
  }

  // Chuẩn bị dữ liệu hiển thị từ API
  const displayPrice = product.price;
  const displayPromoPrice = product.promoPrice;
  const displayName = product.productName;
  const displayImage = product.thumbnail;
  const displayDesc = product.description || "Chưa có mô tả chi tiết cho sản phẩm này.";

  return (
    <div className="detail-container">
      {/* 🌟 NHÚNG BỘ STYLE TRỰC TIẾP VÀO COMPONENT (ĐÃ KHỬ MÀU ĐEN) */}
      <style>{`
        .detail-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 32px;
          box-sizing: border-box;
        }

        .link-back {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          color: var(--text, #4b5563);
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 24px;
          transition: color 0.2s ease;
        }

        .link-back:hover {
          color: #2563eb;
        }

        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          background: #ffffff; /* Ép nền trắng tinh khôi ăn khớp trang chủ */
          padding: 32px;
          border-radius: 16px;
          border: 1px solid var(--border, #e5e4e7);
          box-shadow: var(--shadow);
          margin-bottom: 32px;
        }

        .detail-image-box {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc; /* Nền xám trắng siêu nhẹ tôn dáng sản phẩm */
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border, #e5e4e7);
          padding: 24px;
          min-height: 400px;
        }

        .detail-img {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .detail-image-box:hover .detail-img {
          transform: scale(1.04);
        }

        .detail-info-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .detail-info-box h1 {
          font-size: 28px;
          font-weight: 800;
          color: #1e293b; /* Thay màu đen bằng màu xanh Slate sẫm cao cấp */
          margin-top: 0;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
          line-height: 1.3;
        }

        .detail-info-box hr {
          border: 0;
          height: 1px;
          background: var(--border, #e5e4e7);
          margin: 20px 0;
        }

        .detail-pricing {
          background: #f1f5f9; /* Hộp giá màu xám Slate dịu mắt */
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .detail-pricing p {
          margin: 6px 0;
          font-size: 14px;
          color: var(--text, #4b5563);
          font-weight: 600;
        }

        .original-price {
          text-decoration: line-through;
          color: #94a3b8;
          margin-left: 6px;
        }

        .sale-price {
          font-size: 26px;
          font-weight: 800;
          color: #ef4444; /* Màu đỏ đô nổi bật cho giá giảm */
          margin-left: 6px;
        }

        .normal-price {
          font-size: 26px;
          font-weight: 800;
          color: #2563eb; /* Màu xanh Blue chủ đạo phối rất hợp nền trắng */
          margin-left: 6px;
        }

        .detail-quantity {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .detail-quantity label {
          font-size: 14px;
          color: #334155; /* Chữ xám đậm thay cho màu đen */
        }

        .quantity-input {
          width: 72px;
          height: 40px;
          border: 1px solid var(--border, #e5e4e7);
          background: #ffffff;
          color: #1e293b;
          border-radius: 10px;
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          outline: none;
          transition: all 0.2s;
        }

        .quantity-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .btn-add-to-cart {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          background: #2563eb; /* Tone xanh blue của nút bấm nhanh trang chủ */
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
          transition: all 0.2s ease;
        }

        .btn-add-to-cart:hover {
          background: #1d4ed8;
          box-shadow: 0 10px 15px -3px rgba(29, 78, 216, 0.3);
          transform: translateY(-2px);
        }

        .btn-add-to-cart:active {
          transform: translateY(0);
        }

        .detail-desc-section {
          background: #ffffff; /* Nền trắng đồng bộ */
          padding: 32px;
          border-radius: 16px;
          border: 1px solid var(--border, #e5e4e7);
          box-shadow: var(--shadow);
        }

        .detail-desc-section h3 {
          font-size: 18px;
          font-weight: 800;
          color: #1e293b; /* Màu tiêu đề xanh đen sang trọng */
          margin-top: 0;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
          position: relative;
          padding-bottom: 8px;
        }

        .detail-desc-section h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background-color: #2563eb;
          border-radius: 2px;
        }

        .desc-text {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text, #6b6375);
        }

        @media (max-width: 768px) {
          .detail-container { padding: 0 16px; }
          .detail-layout { grid-template-columns: 1fr; gap: 24px; padding: 20px; }
          .detail-image-box { min-height: 300px; padding: 16px; }
          .detail-info-box h1 { font-size: 22px; }
        }
      `}</style>

      {/* GIAO DIỆN HTML CỦA TRANG CHI TIẾT */}
      <Link to="/" className="link-back">← Quay lại danh sách</Link>

      <div className="detail-layout">
        {/* KHỐI ẢNH SẢN PHẨM */}
        <div className="detail-image-box">
          <img 
            src={displayImage} 
            alt={displayName} 
            className="detail-img" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400";
            }}
          />
        </div>

        {/* KHỐI THÔNG TIN SẢN PHẨM */}
        <div className="detail-info-box">
          <h1>{displayName}</h1>
          <hr />

          <div className="detail-pricing">
            {displayPromoPrice ? (
              <>
                <p>Giá gốc: <span className="original-price">{displayPrice?.toLocaleString()} đ</span></p>
                <p>Giá khuyến mãi: <span className="sale-price">{displayPromoPrice?.toLocaleString()} đ</span></p>
              </>
            ) : (
              <p>Giá bán: <span className="normal-price">{displayPrice?.toLocaleString()} đ</span></p>
            )}
          </div>

          {/* KHỐI SỐ LƯỢNG */}
          <div className="detail-quantity">
            <label><b>Số lượng:</b></label>
            <input
              type="number"
              value={quantity}
              min={1}
              max={10}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= 10) setQuantity(val);
              }}
              className="quantity-input"
            />
          </div>

          <button className="btn-add-to-cart" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* KHỐI MÔ TẢ CHI TIẾT */}
      <div className="detail-desc-section">
        <h3>Mô tả chi tiết sản phẩm</h3>
        <p className="desc-text" style={{ whiteSpace: "pre-line" }}>{displayDesc}</p>
      </div>
    </div>
  );
}