import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";

export default function ProductList({ searchTerm, selectedCategory }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [maxPrice, setMaxPrice] = useState(999999999);
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, maxPrice]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();

      // Backend trả về { totalItems, page, pageSize, data }
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const rawCart = localStorage.getItem("cartItems") || "[]";
    let cartItems = JSON.parse(rawCart);

    const existingItem = cartItems.find(
      (item) => item.id === product.productID
    );

    const finalPrice =
      product.promoPrice || product.price;

    if (existingItem) {
      if (existingItem.quantity >= 10) {
        alert(
          `Sản phẩm "${product.name}" đã đạt số lượng mua tối đa (10 cái)!`,
        );
        return;
      }
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: product.productID,
        name: product.productName,
        price: finalPrice,
        image: product.thumbnail,
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart_updated"));
    alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
  };

  // 🌟 ĐÃ VÁ LỖI ÉP KIỂU VÀ ĐỒNG BỘ LOGIC LOC DANH MỤC AN TOÀN
  const filteredProducts = products
    .filter((product) => {
      const currentSearchTerm = searchTerm || "";

      // 1. Lọc theo từ khóa tìm kiếm
      const matchesSearch = (product.productName || "")
        .toLowerCase()
        .includes(currentSearchTerm.toLowerCase());

      // 2. Ép kiểu dữ liệu danh mục về chuỗi viết thường để so sánh tuyệt đối an toàn
      const safeSelectedCategory = selectedCategory ? String(selectedCategory).trim().toLowerCase() : "all";
      const safeProductCategoryID = product.categoryID ? String(product.categoryID).trim().toLowerCase() : "";

      // Điều kiện lọc danh mục: nếu là 'all' thì luôn đúng, ngược lại thì khớp ID
      const matchesCategory =
        safeSelectedCategory === "all" ||
        safeProductCategoryID === safeSelectedCategory;

      // 3. Lọc theo giá tiền
      const currentPrice = product.promoPrice || product.price;

      return (
        matchesSearch &&
        matchesCategory &&
        currentPrice <= maxPrice
      );
    })
    .sort((a, b) => {
      const priceA = a.promoPrice || a.price;
      const priceB = b.promoPrice || b.price;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;

      return (a.productName || "").localeCompare(
        b.productName || ""
      );
    });

  // Tính toán cắt mảng hiển thị theo trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (loading) {
    return <h2>Đang tải sản phẩm...</h2>;
  }

  return (
    <div>
      <div
        style={{
          maxWidth: "1200px",
          margin: "20px auto",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200"
          alt="TechShop Banner"
          style={{
            width: "100%",
            height: "320px",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      {/* KHỐI CHỌN MỨC GIÁ BẰNG BUTTONS */}
      <div className="price-filter-container">
        <span>
          <b>Chọn mức giá:</b>
        </span>
        <div className="price-btn-group">
          <button
            className={`price-filter-btn ${maxPrice === 999999999 ? "active" : ""}`}
            onClick={() => setMaxPrice(999999999)}
          >
            Tất cả giá
          </button>
          <button
            className={`price-filter-btn ${maxPrice === 2000000 ? "active" : ""}`}
            onClick={() => setMaxPrice(2000000)}
          >
            Dưới 2.000.000đ
          </button>
          <button
            className={`price-filter-btn ${maxPrice === 5000000 ? "active" : ""}`}
            onClick={() => setMaxPrice(5000000)}
          >
            Dưới 5.000.000đ
          </button>
          <button
            className={`price-filter-btn ${maxPrice === 15000000 ? "active" : ""}`}
            onClick={() => setMaxPrice(15000000)}
          >
            Dưới 15.000.000đ
          </button>
          <button
            className={`price-filter-btn ${maxPrice === 30000000 ? "active" : ""}`}
            onClick={() => setMaxPrice(30000000)}
          >
            Dưới 30.000.000đ
          </button>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="list-container">
        <div className="main-products">
          <div className="products-header">
            <h2>Danh sách sản phẩm ({filteredProducts.length})</h2>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name-asc">Tên: A - Z</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  textTransform: "none",
                  textAlign: "center",
                  gridColumn: "1/-1",
                  padding: "40px",
                  color: "#718096",
                  fontWeight: "600",
                }}
              >
                ❌ Không tìm thấy sản phẩm nào phù hợp với bộ lọc danh mục này!
              </div>
            ) : (
              displayedProducts.map((product) => (
                <div key={product.productID} className="product-card">
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      backgroundColor: "#f7fafc",
                      borderRadius: "8px 8px 0 0",
                      position: "relative",
                    }}
                  >
                    {product.promoPrice && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          zIndex: 10,
                        }}
                      >
                        -
                        {Math.round(
                          ((product.price - product.promoPrice) /
                            product.price) *
                            100
                        )}
                        %
                      </div>
                    )}

                    <img
                      src={product.thumbnail}
                      alt={product.productName}
                      className="product-card-img"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400";
                      }}
                    />
                  </div>
                  <h4 className="product-card-title">{product.productName}</h4>

                  <div className="product-card-price">
                    {product.promoPrice ? (
                      <>
                        <span className="price-old">
                          {product.price.toLocaleString()}đ
                        </span>
                        <span className="price-new">
                          {product.promoPrice.toLocaleString()}đ
                        </span>
                      </>
                    ) : (
                      <span className="price-normal">
                        {product.price.toLocaleString()}đ
                      </span>
                    )}
                  </div>

                  <div className="product-card-actions">
                    <Link
                      to={`/product/${product.productID}`}
                      className="btn-view-detail"
                    >
                      Chi tiết
                    </Link>
                    <button
                      className="btn-add-cart-fast"
                      onClick={() => addToCart(product)}
                    >
                      + Giỏ hàng
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "page-active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{ cursor: "pointer" }}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                style={{
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
