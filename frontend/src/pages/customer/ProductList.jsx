import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Điện thoại iPhone 15 Pro', category: 'Mobile', price: 28000000, salePrice: 25990000, image: 'https://via.placeholder.com/200' },
  { id: 2, name: 'Laptop Asus Zenbook', category: 'Laptop', price: 22000000, salePrice: null, image: 'https://via.placeholder.com/200' },
  { id: 3, name: 'Tai nghe Bluetooth Sony', category: 'Accessory', price: 3500000, salePrice: 2990000, image: 'https://via.placeholder.com/200' },
  { id: 4, name: 'Sạc dự phòng Anker 20000mAh', category: 'Accessory', price: 1200000, salePrice: 990000, image: 'https://via.placeholder.com/200' },
];

export default function ProductList({ searchTerm, selectedCategory }) {
  const [maxPrice, setMaxPrice] = useState(999999999); // Mặc định không giới hạn giá
  const [sortBy, setSortBy] = useState('name-asc');

  // Lọc dữ liệu dựa trên các props nhận được từ Navbar và state chọn giá tại chỗ
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    // Thêm (searchTerm || '') để nếu bị undefined thì nó sẽ tự hiểu là chuỗi rỗng ""
    const currentSearchTerm = searchTerm || ''; 
    
    const matchesSearch = product.name.toLowerCase().includes(currentSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const currentPrice = product.salePrice || product.price;
    const matchesPrice = currentPrice <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      {/* KHỐI CHỌN MỨC GIÁ BẰNG BUTTONS */}
      <div className="price-filter-container">
        <span><b>Chọn mức giá:</b></span>
        <div className="price-btn-group">
          <button 
            className={`price-filter-btn ${maxPrice === 999999999 ? 'active' : ''}`}
            onClick={() => setMaxPrice(999999999)}
          >
            Tất cả giá
          </button>
          <button 
            className={`price-filter-btn ${maxPrice === 2000000 ? 'active' : ''}`}
            onClick={() => setMaxPrice(2000000)}
          >
            Dưới 2.000.000đ
          </button>
          <button 
            className={`price-filter-btn ${maxPrice === 5000000 ? 'active' : ''}`}
            onClick={() => setMaxPrice(5000000)}
          >
            Dưới 5.000.000đ
          </button>
          <button 
            className={`price-filter-btn ${maxPrice === 15000000 ? 'active' : ''}`}
            onClick={() => setMaxPrice(15000000)}
          >
            Dưới 15.000.000đ
          </button>
          <button 
            className={`price-filter-btn ${maxPrice === 30000000 ? 'active' : ''}`}
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
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="name-asc">Tên: A - Z</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

          {/* Lưới sản phẩm (Bây giờ hiển thị được 4 sản phẩm/hàng cực rộng rãi) */}
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} className="product-card-img" />
                <h4 className="product-card-title">{product.name}</h4>
                
                <div className="product-card-price">
                  {product.salePrice ? (
                    <>
                      <span className="price-old">{product.price.toLocaleString()}đ</span>
                      <span className="price-new">{product.salePrice.toLocaleString()}đ</span>
                    </>
                  ) : (
                    <span className="price-normal">{product.price.toLocaleString()}đ</span>
                  )}
                </div>

                <div className="product-card-actions">
                  <Link to={`/product/${product.id}`} className="btn-view-detail">
                    Chi tiết
                  </Link>
                  <button className="btn-add-cart-fast">
                    + Giỏ hàng
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mock Phân trang */}
          <div className="pagination">
            <button disabled>Trước</button>
            <button className="page-active">1</button>
            <button>Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}