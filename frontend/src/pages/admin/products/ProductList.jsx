import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Search, Filter, SlidersHorizontal, Edit2, Trash2, ShoppingBag } from "lucide-react";

const API_URL = "http://localhost:5016/api/product";
const CATEGORY_API_URL = "http://localhost:5016/api/categories";

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  
  // Quản lý Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Lấy danh sách danh mục khi trang được tải lần đầu
  useEffect(() => {
    loadCategories();
  }, []);

  // Gọi lại API sản phẩm khi bất kỳ bộ lọc hoặc trang thay đổi
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
          categoryId: categoryFilter || null,
          sortBy: sortOrder,
          page: currentPage,
          pageSize: itemsPerPage,
        },
      });
      
      // Đổ dữ liệu sản phẩm
      setProducts(response.data.data || []);
      
      // Tính toán tổng số trang dựa trên phản hồi của API backend 
      // Giả định backend trả về tổng số bản ghi trong response.data.totalRecords hoặc số trang response.data.totalPages
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      } else if (response.data.totalRecords) {
        setTotalPages(Math.ceil(response.data.totalRecords / itemsPerPage));
      } else {
        // Dự phòng nếu API không trả về tổng số lượng: tính dựa trên độ dài mảng hiện tại
        setTotalPages(response.data.data?.length < itemsPerPage ? currentPage : currentPage + 1);
      }
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

  // Kiểu dáng cơ bản cho các nút bấm phân trang
  const basePageButtonStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "2px solid #cbd5e1",
    fontWeight: "700",
    fontSize: "14px",
    transition: "all 0.15s ease",
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
            className="custom-search-input"
            style={{ 
              width: '100%', 
              boxSizing: 'border-box', 
              paddingLeft: '42px', 
              background: '#ffffff', 
              border: '2px solid #cbd5e1', 
              borderRadius: '12px',
              color: '#000000', 
              fontWeight: '700', 
              fontSize: '14px', 
              height: '44px',
              outline: 'none'
            }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Lọc theo Tên Danh mục */}
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
            <option value="" style={{ background: "#ffffff", color: "#000000" }}>Lọc theo: Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.categoryID} value={c.categoryID} style={{ background: "#ffffff", color: "#000000" }}>
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
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 42px', background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '12px', color: '#000000', fontWeight: '700', fontSize: '14px', height: '44px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="" style={{ background: "#ffffff", color: "#000000" }}>Sắp xếp: Mặc định</option>
            <option value="price_asc" style={{ background: "#ffffff", color: "#000000" }}>Giá tăng dần ↑</option>
            <option value="price_desc" style={{ background: "#ffffff", color: "#000000" }}>Giá giảm dần ↓</option>
            <option value="name_asc" style={{ background: "#ffffff", color: "#000000" }}>Tên sản phẩm: A-Z</option>
            <option value="name_desc" style={{ background: "#ffffff", color: "#000000" }}>Tên sản phẩm: Z-A</option>
          </select>
        </div>

        {/* CSS nhúng phụ trợ để đảm bảo màu chữ hiển thị đúng */}
        <style>{`
          .custom-search-input::placeholder {
            color: #64748b !important;
            opacity: 1;
          }
        `}</style>

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

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <div 
          className="pagination" 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: "8px", 
            padding: "10px 20px" 
          }}
        >
          {/* Nút Trước */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{
              ...basePageButtonStyle,
              background: currentPage === 1 ? "#f1f5f9" : "#ffffff",
              color: currentPage === 1 ? "#94a3b8" : "#000000",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Trước
          </button>

          {/* Danh sách lặp số trang */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isPageActive = currentPage === pageNumber;
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                style={{
                  ...basePageButtonStyle,
                  background: isPageActive ? "#2563eb" : "#ffffff",
                  color: isPageActive ? "#ffffff" : "#000000",
                  borderColor: isPageActive ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Nút Sau */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={{
              ...basePageButtonStyle,
              background: currentPage === totalPages ? "#f1f5f9" : "#ffffff",
              color: currentPage === totalPages ? "#94a3b8" : "#000000",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;