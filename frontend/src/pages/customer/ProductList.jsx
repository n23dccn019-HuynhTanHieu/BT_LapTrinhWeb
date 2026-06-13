import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";

export default function ProductList({ searchTerm, selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0); 

  const [maxPrice, setMaxPrice] = useState(999999999);
  // Đã sửa: Đổi mặc định thành "name_asc" để khớp switch-case Backend
  const [sortBy, setSortBy] = useState("name_asc"); 
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 4; // Cấu hình hiển thị 4 sản phẩm 1 trang ở Frontend

  // Theo dõi tất cả thay đổi từ các nút bấm bộ lọc để gọi lại API
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchTerm, maxPrice, sortBy]);

  // Reset về trang 1 khi người dùng đổi danh mục, tìm kiếm hoặc giá tiền
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, maxPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Ép kiểu an toàn: Chuyển category về dạng số nguyên (int) nếu hợp lệ
      let parsedCategoryId = null;
      if (selectedCategory && selectedCategory !== "all") {
        parsedCategoryId = parseInt(selectedCategory, 10);
      }

      // 🚀 ĐỒNG BỘ HOÀN TOÀN THAM SỐ GỬI LÊN BACKEND CONTROLLER
      const params = {
        keyword: searchTerm && searchTerm.trim() !== "" ? searchTerm : null,
        categoryId: isNaN(parsedCategoryId) ? null : parsedCategoryId, // Gửi int? hoặc null
        minPrice: null, // Có thể bổ sung nếu ông làm slider sau này
        maxPrice: maxPrice !== 999999999 ? maxPrice : null,
        sortBy: sortBy, // "price_asc" | "price_desc" | "name_asc" | "name_desc"
        page: currentPage,
        pageSize: ITEMS_PER_PAGE // Gửi 4 để Backend cắt Skip/Take đúng 4 sản phẩm
      };

      const response = await productService.getAll(params);

      // Map đúng cấu trúc đối tượng Anonymous Object trả về từ ASP.NET
      setProducts(response.data.data || []);
      setTotalItems(response.data.totalItems || 0);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const rawCart = localStorage.getItem("cartItems") || "[]";
    let cartItems = JSON.parse(rawCart);

    const existingItem = cartItems.find((item) => item.id === product.productID);
    const finalPrice = product.promoPrice || product.price;

    if (existingItem) {
      if (existingItem.quantity >= 10) {
        alert(`Sản phẩm "${product.productName}" đã đạt số lượng mua tối đa (10 cái)!`);
        return;
      }
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: product.productID,
        name: product.productName,
        price: finalPrice,
        image: product.thumbnail && product.thumbnail.trim() !== "" ? product.thumbnail : null,
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart_updated"));
    alert(`Đã thêm "${product.productName}" vào giỏ hàng!`);
  };

  // Tính tổng số trang thật dựa trên tổng số sản phẩm trong Database
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (loading && products.length === 0) {
    return <h2>Đang tải sản phẩm...</h2>;
  }

  return (
    <div>
      {/* BANNER */}
      <div style={{ maxWidth: "1200px", margin: "20px auto", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200"
          alt="TechShop Banner"
          style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* BỘ LỌC GIÁ TIỀN */}
      <div className="price-filter-container">
        <span><b>Chọn mức giá:</b></span>
        <div className="price-btn-group">
          <button className={`price-filter-btn ${maxPrice === 999999999 ? "active" : ""}`} onClick={() => setMaxPrice(999999999)}>Tất cả giá</button>
          <button className={`price-filter-btn ${maxPrice === 2000000 ? "active" : ""}`} onClick={() => setMaxPrice(2000000)}>Dưới 2.000.000đ</button>
          <button className={`price-filter-btn ${maxPrice === 5000000 ? "active" : ""}`} onClick={() => setMaxPrice(5000000)}>Dưới 5.000.000đ</button>
          <button className={`price-filter-btn ${maxPrice === 15000000 ? "active" : ""}`} onClick={() => setMaxPrice(15000000)}>Dưới 15.000.000đ</button>
          <button className={`price-filter-btn ${maxPrice === 30000000 ? "active" : ""}`} onClick={() => setMaxPrice(30000000)}>Dưới 30.000.000đ</button>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="list-container">
        <div className="main-products">
          <div className="products-header">
            <h2>Danh sách sản phẩm (Tổng số: {totalItems})</h2>
            
            {/* ĐÃ ĐỔI: Khớp trị value của option theo switch-case Backend */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="name_asc">Tên: A - Z</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

          <div className="products-grid" style={{ opacity: loading ? 0.6 : 1, transition: "0.2s" }}>
            {products.length === 0 ? (
              <div style={{ textAlign: "center", gridColumn: "1/-1", padding: "40px", color: "#718096", fontWeight: "600" }}>
                ❌ Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại!
              </div>
            ) : (
              products.map((product) => (
                <div key={product.productID} className="product-card">
                  <div style={{ height: "200px", overflow: "hidden", backgroundColor: "#f7fafc", borderRadius: "8px 8px 0 0", position: "relative" }}>
                    {product.promoPrice && (
                      <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#ef4444", color: "#fff", padding: "5px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", zIndex: 10 }}>
                        -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
                      </div>
                    )}
                    <img
                      src={product.thumbnail && product.thumbnail.trim() !== "" ? product.thumbnail : null}
                      alt={product.productName}
                      className="product-card-img"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400";
                      }}
                    />
                  </div>
                  <h4 className="product-card-title">{product.productName}</h4>
                  
                  <div className="product-card-price">
                    {product.promoPrice ? (
                      <>
                        <span className="price-old">{product.price.toLocaleString()}đ</span>
                        <span className="price-new">{product.promoPrice.toLocaleString()}đ</span>
                      </>
                    ) : (
                      <span className="price-normal">{product.price.toLocaleString()}đ</span>
                    )}
                  </div>
                  
                  <div className="product-card-actions">
                    <Link to={`/product/${product.productID}`} className="btn-view-detail">Chi tiết</Link>
                    <button className="btn-add-cart-fast" onClick={() => addToCart(product)}>+ Giỏ hàng</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* THANH PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Trước</button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index + 1} className={currentPage === index + 1 ? "page-active" : ""} onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Sau</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}