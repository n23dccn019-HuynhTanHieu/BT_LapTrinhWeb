import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MOCK_PRODUCTS = [
  // TRANG 1
  {
    id: 1,
    name: "Điện thoại iPhone 15 Pro",
    category: "Điện thoại",
    price: 28000000,
    salePrice: 25990000,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "Laptop Asus Zenbook",
    category: "Laptop",
    price: 15500000,
    salePrice: 13900000,
    image:
      "https://images.unsplash.com/photo-1496181130204-755241544e35?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    name: "Tai nghe Bluetooth Sony",
    category: "Phụ kiện",
    price: 3500000,
    salePrice: 2990000,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    name: "Sạc dự phòng Anker 20000mAh",
    category: "Phụ kiện",
    price: 1200000,
    salePrice: 990000,
    image:
      "https://images.unsplash.com/photo-1644571669401-9ab344866592?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dw=400&auto=format&fit=crop&q=60",
  },

  // TRANG 2
  {
    id: 5,
    name: "Chuột không dây Logitech G304",
    category: "Phụ kiện",
    price: 600000,
    salePrice: 499000,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 6,
    name: "Bàn phím cơ AKKO 3075",
    category: "Phụ kiện",
    price: 1650000,
    salePrice: 1390000,
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 7,
    name: "Laptop Gaming MSI Cyborg",
    category: "Laptop",
    price: 24000000,
    salePrice: 21490000,
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 8,
    name: "Balo Laptop chống nước Tech",
    category: "Phụ kiện",
    price: 450000,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=60",
  },

  // TRANG 3
  {
    id: 9,
    name: "Bàn phím Logitech Pop Keys",
    category: "Phụ kiện",
    price: 2200000,
    salePrice: 1890000,
    image:
      "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 10,
    name: "Tai nghe chụp tai JBL Tune",
    category: "Phụ kiện",
    price: 1500000,
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 11,
    name: "Samsung Galaxy S24 Ultra",
    category: "Điện thoại",
    price: 31990000,
    salePrice: 28990000,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 12,
    name: "Cáp sạc nhanh Baseus 100W",
    category: "Phụ kiện",
    price: 250000,
    salePrice: 199000,
    image:
      "https://images.unsplash.com/photo-1725304382197-663ae3864750?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&auto=format&fit=crop&q=60",
  },
];

export default function ProductList({ searchTerm, selectedCategory }) {
  const [maxPrice, setMaxPrice] = useState(999999999);
  const [sortBy, setSortBy] = useState("name-asc");

  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  // Reset về trang 1 khi bộ lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, maxPrice, sortBy]);

  const addToCart = (product) => {
    const rawCart = localStorage.getItem("cartItems") || "[]";
    let cartItems = JSON.parse(rawCart);

    const existingItem = cartItems.find((item) => item.id === product.id);
    const finalPrice = product.salePrice || product.price;

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
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart_updated"));
    alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
  };

  // 🌟 ĐÃ VÁ LỖI CÚ PHÁP HOÀN CHỈNH CHO ĐOẠN LỌC VÀ SẮP XẾP DỮ LIỆU
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const currentSearchTerm = searchTerm || "";

    const matchesSearch = product.name
      .toLowerCase()
      .includes(currentSearchTerm.toLowerCase());

    const filterCat = selectedCategory
      ? selectedCategory.trim().toLowerCase().normalize("NFC")
      : "all";
    const prodCat = product.category
      ? product.category.trim().toLowerCase().normalize("NFC")
      : "";

    // Cầu nối logic so khớp danh mục thông minh chống Unicode lỗi gõ chữ
    const matchesCategory =
      filterCat === "all" ||
      filterCat === "tất cả danh mục" ||
      prodCat === filterCat ||
      ((filterCat.includes("điện") || filterCat.includes("mobile")) &&
        (prodCat.includes("điện") || prodCat.includes("mobile"))) ||
      ((filterCat.includes("phụ") || filterCat.includes("accessory")) &&
        (prodCat.includes("phụ") || prodCat.includes("accessory"))) ||
      (filterCat.includes("laptop") && prodCat.includes("laptop"));

    const currentPrice = product.salePrice || product.price;
    const matchesPrice = currentPrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    return a.name.localeCompare(b.name);
  });

  // Tính toán cắt mảng hiển thị theo trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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
                <div key={product.id} className="product-card">
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      backgroundColor: "#f7fafc",
                      borderRadius: "8px 8px 0 0",
                      position: "relative",
                    }}
                  >
                    {product.salePrice && (
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
                          ((product.price - product.salePrice) /
                            product.price) *
                            100
                        )}
                        %
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
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
                  <h4 className="product-card-title">{product.name}</h4>

                  <div className="product-card-price">
                    {product.salePrice ? (
                      <>
                        <span className="price-old">
                          {product.price.toLocaleString()}đ
                        </span>
                        <span className="price-new">
                          {product.salePrice.toLocaleString()}đ
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
                      to={`/product/${product.id}`}
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
