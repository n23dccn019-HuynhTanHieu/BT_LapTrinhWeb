import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import productService from "../../services/productService"; 

export default function ProductDetail() {
  const { id } = useParams(); // Lấy productID từ URL

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Quản lý số lượng chọn mua

  // 🌟 ĐÃ ĐỔI: Gọi trực tiếp API getById để lấy dữ liệu chính xác và nhanh nhất
  useEffect(() => {
    const fetchProductById = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(id);
        
        // ASP.NET Core khi trả về JSON thường tự động biến chữ cái đầu thành chữ thường (camelCase)
        // Nên ta sẽ lấy response.data trực tiếp
        setProduct(response.data || null);
      } catch (error) {
        console.error("Lỗi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductById();
  }, [id]);

  // Hàm xử lý Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!product) return;

    // 🌟 ĐÃ SỬA: Lấy đúng trường dữ liệu từ Backend gửi về (Thử cả chữ hoa lẫn chữ thường để an toàn)
    const stockAvailable = parseInt(product.stockQuantity ?? product.StockQuantity, 10) || 0; 
    const chosenQuantity = parseInt(quantity, 10) || 1;

    // 1. Kiểm tra nếu kho bằng 0
    if (stockAvailable <= 0) {
      alert(`⚠️ Rất tiếc, sản phẩm "${product.productName}" hiện tại đã hết hàng!`);
      return;
    }

    // 2. Kiểm tra nếu số lượng đặt vượt quá kho
    if (chosenQuantity > stockAvailable) {
      alert(
        `⚠️ Không đủ hàng tồn kho!\nSản phẩm này hiện tại chỉ còn lại ${stockAvailable} sản phẩm. Bạn không thể thêm ${chosenQuantity} sản phẩm vào giỏ.`
      );
      return;
    }

    const rawCart = localStorage.getItem("cartItems") || "[]";
    let cartItems = JSON.parse(rawCart);

    // Tìm kiếm sản phẩm trùng trong giỏ (ép kiểu String để tránh lệch kiểu dữ liệu)
    const existingItem = cartItems.find((item) => String(item.id) === String(product.productID));
    const finalPrice = product.promoPrice || product.price;

    if (existingItem) {
      const totalRequestedQuantity = parseInt(existingItem.quantity, 10) + chosenQuantity;

      // 3. Kiểm tra tổng số lượng sau khi cộng dồn với giỏ cũ xem có vượt kho không
      if (totalRequestedQuantity > stockAvailable) {
        alert(
          `⚠️ Không thể thêm số lượng đã chọn!\nTrong giỏ hàng của bạn đã có sẵn ${existingItem.quantity} sản phẩm. Kho hàng hiện tại chỉ còn lại tối đa ${stockAvailable} máy.`
        );
        return;
      }

      // Giới hạn mua tối đa 10 sản phẩm theo logic cũ
      if (totalRequestedQuantity > 10) {
        alert(`Bạn chỉ có thể mua tối đa 10 sản phẩm "${product.productName}"! Hiện tại giỏ hàng đã có ${existingItem.quantity} sản phẩm.`);
        return;
      }

      existingItem.quantity = totalRequestedQuantity;
    } else {
      cartItems.push({
        id: product.productID,
        name: product.productName,
        price: finalPrice,
        image: product.thumbnail,
        quantity: chosenQuantity,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart_updated"));
    alert(`🎉 Đã thêm thành công ${chosenQuantity} sản phẩm vào giỏ hàng!`);
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
  
  // 🌟 ĐÃ SỬA: Lấy số lượng kho để hiển thị giao diện diện (Phòng hờ camelCase hoặc PascalCase)
  const stockCount = parseInt(product.stockQuantity ?? product.StockQuantity, 10) || 0;

  return (
    <div className="detail-container">
      <style>{`
        .detail-container { max-width: 1200px; margin: 40px auto; padding: 0 32px; box-sizing: border-box; }
        .link-back { display: inline-flex; align-items: center; text-decoration: none; color: var(--text, #4b5563); font-weight: 600; font-size: 14px; margin-bottom: 24px; transition: color 0.2s ease; }
        .link-back:hover { color: #2563eb; }
        .detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; background: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid var(--border, #e5e4e7); box-shadow: var(--shadow); margin-bottom: 32px; }
        .detail-image-box { display: flex; align-items: center; justify-content: center; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid var(--border, #e5e4e7); padding: 24px; min-height: 400px; }
        .detail-img { max-width: 100%; max-height: 400px; object-fit: contain; transition: transform 0.3s ease; }
        .detail-image-box:hover .detail-img { transform: scale(1.04); }
        .detail-info-box { display: flex; flex-direction: column; justify-content: center; }
        .detail-info-box h1 { font-size: 28px; font-weight: 800; color: #1e293b; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.5px; line-height: 1.3; }
        
        .stock-badge { display: inline-block; font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 6px; margin-bottom: 12px; width: fit-content; }
        .stock-badge.in-stock { background-color: #e8f5e9; color: #16a34a; }
        .stock-badge.out-stock { background-color: #ffebee; color: #ef4444; }

        .detail-info-box hr { border: 0; height: 1px; background: var(--border, #e5e4e7); margin: 20px 0; }
        .detail-pricing { background: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 24px; }
        .detail-pricing p { margin: 6px 0; font-size: 14px; color: var(--text, #4b5563); font-weight: 600; }
        .original-price { text-decoration: line-through; color: #94a3b8; margin-left: 6px; }
        .sale-price { font-size: 26px; font-weight: 800; color: #ef4444; margin-left: 6px; }
        .normal-price { font-size: 26px; font-weight: 800; color: #2563eb; margin-left: 6px; }
        .detail-quantity { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .detail-quantity label { font-size: 14px; color: #334155; }
        .quantity-input { width: 72px; height: 40px; border: 1px solid var(--border, #e5e4e7); background: #ffffff; color: #1e293b; border-radius: 10px; text-align: center; font-size: 15px; font-weight: 700; outline: none; transition: all 0.2s; }
        .quantity-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
        .btn-add-to-cart { width: 100%; padding: 14px; font-size: 15px; font-weight: 700; color: #ffffff; background: #2563eb; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); transition: all 0.2s ease; }
        .btn-add-to-cart:hover { background: #1d4ed8; box-shadow: 0 10px 15px -3px rgba(29, 78, 216, 0.3); transform: translateY(-2px); }
        .btn-add-to-cart:active { transform: translateY(0); }
        .detail-desc-section { background: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid var(--border, #e5e4e7); box-shadow: var(--shadow); }
        .detail-desc-section h3 { font-size: 18px; font-weight: 800; color: #1e293b; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.5px; position: relative; padding-bottom: 8px; }
        .detail-desc-section h3::after { content: ''; position: absolute; bottom: 0; left: 0; width: 40px; height: 3px; background-color: #2563eb; border-radius: 2px; }
        .desc-text { font-size: 15px; line-height: 1.6; color: var(--text, #6b6375); }
        @media (max-width: 768px) { .detail-container { padding: 0 16px; } .detail-layout { grid-template-columns: 1fr; gap: 24px; padding: 20px; } .detail-image-box { min-height: 300px; padding: 16px; } .detail-info-box h1 { font-size: 22px; } }
      `}</style>

      <Link to="/" className="link-back">← Quay lại danh sách</Link>

      <div className="detail-layout">
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

        <div className="detail-info-box">
          <h1>{displayName}</h1>
          
          {/* Badge hiển thị trạng thái kho */}
          <div className={`stock-badge ${stockCount > 0 ? "in-stock" : "out-stock"}`}>
            {stockCount > 0 ? `✓ Còn lại: ${stockCount} sản phẩm` : "✕ Tạm thời hết hàng"}
          </div>

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
            <label><b>Số lượng mua:</b></label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val >= 1) setQuantity(val);
              }}
              className="quantity-input"
            />
          </div>

          <button className="btn-add-to-cart" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <div className="detail-desc-section">
        <h3>Mô tả chi tiết sản phẩm</h3>
        <p className="desc-text" style={{ whiteSpace: "pre-line" }}>{displayDesc}</p>
      </div>
    </div>
  );
}