import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();

  // Dữ liệu mẫu sản phẩm
  const [products, setProducts] = useState([
    { id: 1, name: 'iPhone 15 Pro Max 256GB', category: 'Điện thoại', price: 34990000, promoPrice: 31990000, image: 'https://via.placeholder.com/50' },
    { id: 2, name: 'MacBook Air M2 8GB/256GB', category: 'Laptop', price: 28990000, promoPrice: null, image: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Sạc Dự Phòng Anker 20000mAh', category: 'Phụ kiện', price: 1200000, promoPrice: 890000, image: 'https://via.placeholder.com/50' },
    { id: 4, name: 'Samsung Galaxy S24 Ultra', category: 'Điện thoại', price: 31990000, promoPrice: 29990000, image: 'https://via.placeholder.com/50' },
  ]);

  // Các state điều khiển bộ lọc
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); // none, asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Xóa sản phẩm
  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // --- LOGIC XỬ LÝ DỮ LIỆU PHÍA FRONTEND (SEARCH, FILTER, SORT, PAGINATION) ---
  let filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (categoryFilter !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
  }

  if (sortOrder === 'asc') {
    filteredProducts.sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price));
  } else if (sortOrder === 'desc') {
    filteredProducts.sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price));
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📦 Quản Lý Sản Phẩm</h2>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Thêm Sản Phẩm
        </button>
      </div>

      {/* Thanh Công Cụ: Tìm kiếm, Lọc, Sắp xếp */}
      <div className="bg-white p-4 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          className="border p-2 rounded-lg focus:outline-indigo-500 text-sm"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        
        <select
          className="border p-2 rounded-lg focus:outline-indigo-500 text-sm"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="All">Tất cả danh mục</option>
          <option value="Điện thoại">Điện thoại</option>
          <option value="Laptop">Laptop</option>
          <option value="Phụ kiện">Phụ kiện</option>
        </select>

        <select
          className="border p-2 rounded-lg focus:outline-indigo-500 text-sm"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="none">Sắp xếp: Mặc định</option>
          <option value="asc">Giá thấp đến cao</option>
          <option value="desc">Giá cao đến thấp</option>
        </select>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Hình ảnh</th>
              <th className="p-4 font-semibold text-gray-600">Tên sản phẩm</th>
              <th className="p-4 font-semibold text-gray-600">Danh mục</th>
              <th className="p-4 font-semibold text-gray-600">Giá gốc</th>
              <th className="p-4 font-semibold text-gray-600">Giá khuyến mãi</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentItems.length > 0 ? (
              currentItems.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded border" />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{prod.name}</td>
                  <td className="p-4 text-gray-500">{prod.category}</td>
                  <td className="p-4 text-gray-700">{prod.price.toLocaleString('vi-VN')}đ</td>
                  <td className="p-4 text-red-600 font-medium">
                    {prod.promoPrice ? `${prod.promoPrice.toLocaleString('vi-VN')}đ` : '---'}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${prod.id}`)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">Không tìm thấy sản phẩm nào phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Thanh Phân Trang */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <span className="text-sm text-gray-500">Hiển thị trang {currentPage} / {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
            >
              Trước
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;