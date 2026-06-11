import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Search, Filter, SlidersHorizontal, Edit2, Trash2, ShoppingBag } from "lucide-react";

const API_URL = "http://localhost:5016/api/product";
const CATEGORY_API_URL = "http://localhost:5016/api/categories";

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Lưu danh sách danh mục để đổ vào thẻ select
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Lấy danh sách danh mục khi cấu hình trang đầu tiên
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, sortOrder, currentPage]);

  const loadCategories = async () => {
    try {
      const res = await fetch(CATEGORY_API_URL);
      const data = await res.json();
      setCategories(data.data || data);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          keyword: search,
          categoryId: categoryFilter || null, // Truyền trực tiếp ID của danh mục được chọn
          sortBy: sortOrder,
          page: currentPage,
          pageSize: itemsPerPage,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', WebkitFontSmoothing: 'subpixel-antialiased', MozOsxFontSmoothing: 'auto' }}>
      
      {/* Header Panel */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '2px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '900', margin: 0, color: '#000000' }}>
            <ShoppingBag style={{ color: '#2563eb' }} size={24} strokeWidth={3} /> Quản Lý Sản Phẩm
          </h2>
          <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', marginTop: '6px' }}>Hệ thống kho vận, quản lý giá bán lẻ và thông tin sản phẩm toàn sàn.</p>
        </div>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="btn-auth-submit"
          style={{ width: 'auto', margin: 0, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '900' }}
        >
          <Plus size={18} strokeWidth={3} /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Bộ Lọc Tìm Kiếm Chuyên Sâu */}
      <div style={{ background: '#ffffff', padding: '18px', borderRadius: '16px', border: '2px solid #cbd5e1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
        
        {/* Thanh tìm kiếm */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#000000' }} size={18} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            className="nav-search-input"
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '42px', background: '#ffffff', border: '2px solid #000000', color: '#000000', fontWeight: '700', fontSize: '14px', height: '44px' }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Lọc theo Tên Danh mục (Thay thế ô nhập ID cũ) */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Filter style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#000000' }} size={18} strokeWidth={2.5} />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 42px', background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '12px', color: '#000000', fontWeight: '700', fontSize: '14px', height: '44px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Lọc theo: Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.categoryID} value={c.categoryID}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Sắp xếp cấu trúc */}
        <div style={{ position: 'relative', width: '100%' }}>
          <SlidersHorizontal style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#000000' }} size={18} strokeWidth={2.5} />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 42px', background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '12px', color: '#000000', fontWeight: '700', fontSize: '14px', height: '44px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">Sắp xếp: Mặc định</option>
            <option value="price_asc">Giá tăng dần ↑</option>
            <option value="price_desc">Giá giảm dần ↓</option>
            <option value="name_asc">Tên sản phẩm: A-Z</option>
            <option value="name_desc">Tên sản phẩm: Z-A</option>
          </select>
        </div>

      </div>

      {/* Bảng Hiển Thị Dữ Liệu Sản Phẩm */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid #cbd5e1', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
          <thead style={{ background: '#e2e8f0', borderBottom: '3px solid #cbd5e1', color: '#000000' }}>
            <tr>
              <th style={{ padding: '16px', fontWeight: '900', width: '80px', textAlign: 'center' }}>Ảnh</th>
              <th style={{ padding: '16px', fontWeight: '900', width: '30%' }}>Tên sản phẩm</th>
              <th style={{ padding: '16px', fontWeight: '900' }}>Danh mục</th>
              <th style={{ padding: '16px', fontWeight: '900' }}>Giá bán</th>
              <th style={{ padding: '16px', fontWeight: '900' }}>Khuyến mãi</th>
              <th style={{ padding: '16px', fontWeight: '900', textAlign: 'center' }}>Kho</th>
              <th style={{ padding: '16px', fontWeight: '900', textAlign: 'right', width: '120px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.productID} style={{ borderBottom: '1px solid #cbd5e1' }}>
                
                {/* Cột ảnh */}
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.productName}
                      style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'inline-block', verticalAlign: 'middle' }}
                    />
                  ) : (
                    <div style={{ width: '52px', height: '52px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#64748b', fontWeight: '700' }}>No IMg</div>
                  )}
                </td>

                {/* Tên sản phẩm */}
                <td style={{ padding: '16px', fontWeight: '800', color: '#000000', lineHeight: '1.4' }}>
                  {item.productName}
                </td>

                {/* Danh mục */}
                <td style={{ padding: '16px', color: '#0f172a', fontWeight: '700' }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}>
                    {item.category?.categoryName || `Mã: ${item.categoryID}`}
                  </span>
                </td>

                {/* Giá gốc */}
                <td style={{ padding: '16px', fontWeight: '800', color: '#000000' }}>
                  {Number(item.price).toLocaleString("vi-VN")} đ
                </td>

                {/* Giá khuyến mãi */}
                <td style={{ padding: '16px', fontWeight: '800', color: '#dc2626' }}>
                  {item.promoPrice ? `${Number(item.promoPrice).toLocaleString("vi-VN")} đ` : '—'}
                </td>

                {/* Tồn kho */}
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: '800', color: item.stockQuantity > 5 ? '#000000' : '#d97706' }}>
                  {item.stockQuantity}
                </td>

                {/* Thao tác */}
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '18px' }}>
                    <button
                      onClick={() => navigate(`/admin/products/edit/${item.productID}`)}
                      style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0 }}
                      title="Sửa sản phẩm"
                    >
                      <Edit2 size={18} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.productID)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0 }}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textTransform: 'none', textAlign: 'center', padding: '48px', color: '#475569', fontWeight: '700', fontSize: '15px' }}>
                  Hệ thống trống. Không tìm thấy sản phẩm nào phù hợp!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;