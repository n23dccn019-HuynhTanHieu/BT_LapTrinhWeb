import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";

export default function ProductList({ searchTerm, selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0); 

  const [maxPrice, setMaxPrice] = useState(999999999);
  const [sortBy, setSortBy] = useState("name_asc"); 
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 4; 

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchTerm, maxPrice, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, maxPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let parsedCategoryId = null;
      if (selectedCategory && selectedCategory !== "all") {
        parsedCategoryId = parseInt(selectedCategory, 10);
      }

      const params = {
        keyword: searchTerm && searchTerm.trim() !== "" ? searchTerm : null,
        categoryId: isNaN(parsedCategoryId) ? null : parsedCategoryId, 
        minPrice: null, 
        maxPrice: maxPrice !== 999999999 ? maxPrice : null,
        sortBy: sortBy, 
        page: currentPage,
        pageSize: ITEMS_PER_PAGE 
      };

      const response = await productService.getAll(params);

      setProducts(response.data.data || []);
      setTotalItems(response.data.totalItems || 0);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

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
              // 🌟 VỊ TRÍ GẮN: Thay đổi toàn bộ cấu trúc map ở đây
              products.map((product) => {
                const isOutOfStock = product.stockQuantity === 0;

                // 1. Style chung cho cả 2 loại Card
                const cardStyles = {
                  position: "relative",
                  opacity: isOutOfStock ? 0.75 : 1, // Hết hàng thì làm mờ đi một chút
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  cursor: isOutOfStock ? "not-allowed" : "pointer", // Đổi con trỏ chuột thành dấu cấm nếu hết hàng
                  background: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                };

                // 2. Giao diện hiển thị chung bên trong Card
                const cardContent = (
                  <>
                    <div style={{ height: "260px", overflow: "hidden", backgroundColor: "#f7fafc", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                      {product.promoPrice && !isOutOfStock && (
                        <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "#ef4444", color: "#fff", padding: "5px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", zIndex: 10 }}>
                          -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
                        </div>
                      )}
                      {isOutOfStock && (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 11 }}>
                          <span style={{ backgroundColor: "#334155", color: "#fff", padding: "6px 14px", borderRadius: "4px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase" }}>
                            Tạm hết hàng
                          </span>
                        </div>
                      )}
                      <img
                        src={product.thumbnail && product.thumbnail.trim() !== "" ? product.thumbnail : null}
                        alt={product.productName}
                        className="product-card-img"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400"; }}
                      />
                    </div>
                    <div style={{ padding: "0 14px", textAlign: "center" }}>
                      <h4 className="product-card-title" style={{ margin: "14px 0 8px 0", fontSize: "16px", fontWeight: "600" }}>{product.productName}</h4>
                      <div className="product-card-price" style={{ paddingBottom: "18px" }}>
                        {product.promoPrice ? (
                          <>
                            <span className="price-old" style={{ marginRight: "8px" }}>{product.price.toLocaleString()}đ</span>
                            <span className="price-new">{product.promoPrice.toLocaleString()}đ</span>
                          </>
                        ) : (
                          <span className="price-normal">{product.price.toLocaleString()}đ</span>
                        )}
                      </div>
                    </div>
                  </>
                );

                // 3. Khóa/Mở đường dẫn dựa trên trạng thái kho hàng
                return isOutOfStock ? (
                  <div key={product.productID} className="product-card" style={cardStyles}>
                    {cardContent}
                  </div>
                ) : (
                  <Link to={`/product/${product.productID}`} key={product.productID} className="product-card" style={cardStyles}>
                    {cardContent}
                  </Link>
                );
              })
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
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev - 1)}>Sau</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}