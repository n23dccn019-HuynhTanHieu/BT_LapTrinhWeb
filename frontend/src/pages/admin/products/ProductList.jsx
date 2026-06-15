import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  ShoppingBag,
} from "lucide-react";

const API_URL = "http://localhost:5016/api/product";
const CATEGORY_API_URL = "http://localhost:5016/api/categories";

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

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
          categoryId: categoryFilter || null,
          sortBy: sortOrder,
          page: currentPage,
          pageSize: itemsPerPage,
        },
      });

      setProducts(response.data.data || []);

      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      } else if (response.data.totalRecords) {
        setTotalPages(Math.ceil(response.data.totalRecords / itemsPerPage));
      } else {
        setTotalPages(
          response.data.data?.length < itemsPerPage
            ? currentPage
            : currentPage + 1,
        );
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

  const basePageButtonStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "2px solid #cbd5e1",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.15s ease",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <style>{`
        .custom-search-input::placeholder {
          color: #64748b !important;
          opacity: 1;
        }
        .table-row-hover {
          transition: background-color 0.15s ease;
        }
        .table-row-hover:hover {
          background-color: #f8fafc !important;
        }
      `}</style>

      {/* Header Panel */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "16px",
          border: "2px solid #cbd5e1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "22px",
              fontWeight: "700",
              margin: 0,
              color: "#0f172a",
            }}
          >
            <ShoppingBag
              style={{ color: "#2563eb" }}
              size={24}
              strokeWidth={2.5}
            />{" "}
            Quản Lý Sản Phẩm
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              fontWeight: "500",
              marginTop: "6px",
              margin: 0,
            }}
          >
            Hệ thống kho vận, quản lý giá bán lẻ và thông tin sản phẩm toàn sàn.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="btn-auth-submit"
          style={{
            width: "auto",
            margin: 0,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "600",
            fontFamily: "inherit",
          }}
        >
          <Plus size={18} strokeWidth={2.5} /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Bộ Lọc Tìm Kiếm */}
      <div
        style={{
          background: "#ffffff",
          padding: "18px",
          borderRadius: "16px",
          border: "2px solid #cbd5e1",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <Search
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
            size={18}
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            className="custom-search-input"
            style={{
              width: "100%",
              boxSizing: "border-box",
              paddingLeft: "42px",
              background: "#ffffff",
              border: "2px solid #cbd5e1",
              borderRadius: "12px",
              color: "#0f172a",
              fontWeight: "500",
              fontSize: "14px",
              height: "44px",
              outline: "none",
              fontFamily: "inherit",
            }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div style={{ position: "relative", width: "100%" }}>
          <Filter
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
            size={18}
            strokeWidth={2}
          />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px 10px 42px",
              background: "#ffffff",
              border: "2px solid #cbd5e1",
              borderRadius: "12px",
              color: "#0f172a",
              fontWeight: "600",
              fontSize: "14px",
              height: "44px",
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option
              value=""
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Lọc theo: Tất cả danh mục
            </option>
            {categories.map((c) => (
              <option
                key={c.categoryID}
                value={c.categoryID}
                style={{ background: "#ffffff", color: "#0f172a" }}
              >
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ position: "relative", width: "100%" }}>
          <SlidersHorizontal
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
            size={18}
            strokeWidth={2}
          />
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px 10px 42px",
              background: "#ffffff",
              border: "2px solid #cbd5e1",
              borderRadius: "12px",
              color: "#0f172a",
              fontWeight: "600",
              fontSize: "14px",
              height: "44px",
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option
              value=""
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Sắp xếp: Mặc định
            </option>
            <option
              value="price_asc"
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Giá tăng dần ↑
            </option>
            <option
              value="price_desc"
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Giá giảm dần ↓
            </option>
            <option
              value="name_asc"
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Tên sản phẩm: A-Z
            </option>
            <option
              value="name_desc"
              style={{ background: "#ffffff", color: "#0f172a" }}
            >
              Tên sản phẩm: Z-A
            </option>
          </select>
        </div>
      </div>

      {/* Bảng Hiển Thị Dữ Liệu */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "2px solid #cbd5e1",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          <thead
            style={{ background: "#e2e8f0", borderBottom: "2px solid #cbd5e1" }}
          >
            <tr>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "80px",
                  textAlign: "center",
                }}
              >
                Ảnh
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "30%",
                }}
              >
                Tên sản phẩm
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  width: "150px",
                }}
              >
                Danh mục
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  textAlign: "right",
                }}
              >
                Giá bán
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  textAlign: "right",
                }}
              >
                Khuyến mãi
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  textAlign: "center",
                  width: "100px",
                }}
              >
                Kho
              </th>
              <th
                style={{
                  padding: "14px 16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  textAlign: "right",
                  width: "120px",
                }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr
                key={item.productID}
                className="table-row-hover"
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.productName}
                      style={{
                        width: "44px",
                        height: "44px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        display: "inline-block",
                        verticalAlign: "middle",
                        background: "#f8fafc",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "8px",
                        background: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        color: "#64748b",
                        fontWeight: "600",
                      }}
                    >
                      No Img
                    </div>
                  )}
                </td>

                <td
                  style={{
                    padding: "16px",
                    fontWeight: "600",
                    color: "#0f172a",
                    lineHeight: "1.4",
                  }}
                >
                  {item.productName}
                </td>

                <td style={{ padding: "16px" }}>
                  <span
                    style={{
                      background: "#f1f5f9",
                      color: "#334155",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {item.category?.categoryName || `Mã: ${item.categoryID}`}
                  </span>
                </td>

                <td
                  style={{
                    padding: "16px",
                    fontWeight: "600",
                    color: "#334155",
                    textAlign: "right",
                  }}
                >
                  {Number(item.price).toLocaleString("vi-VN")} đ
                </td>

                <td
                  style={{
                    padding: "16px",
                    fontWeight: "600",
                    color: "#dc2626",
                    textAlign: "right",
                  }}
                >
                  {item.promoPrice
                    ? `${Number(item.promoPrice).toLocaleString("vi-VN")} đ`
                    : "—"}
                </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    {item.stockQuantity === 0 ? (
                      <span
                        style={{
                          background: "#fee2e2", // Nền đỏ nhạt
                          color: "#dc2626",      // Chữ đỏ đậm
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Hết hàng
                      </span>
                    ) : (
                      <span
                        style={{
                          fontWeight: "600",
                          // Giữ logic cũ: < 5 thì hiện màu cam cảnh báo
                          color: item.stockQuantity > 5 ? "#0f172a" : "#d97706",
                        }}
                      >
                        {item.stockQuantity}
                      </span>
                    )}
                  </td>

                <td style={{ padding: "16px", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "20px",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${item.productID}`)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      title="Sửa sản phẩm"
                    >
                      <Edit2 size={18} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.productID)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textTransform: "none",
                    textAlign: "center",
                    padding: "48px",
                    color: "#64748b",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
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
            padding: "10px 20px",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{
              ...basePageButtonStyle,
              background: currentPage === 1 ? "#f1f5f9" : "#ffffff",
              color: currentPage === 1 ? "#94a3b8" : "#0f172a",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Trước
          </button>

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
                  color: isPageActive ? "#ffffff" : "#0f172a",
                  borderColor: isPageActive ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={{
              ...basePageButtonStyle,
              background: currentPage === totalPages ? "#f1f5f9" : "#ffffff",
              color: currentPage === totalPages ? "#94a3b8" : "#0f172a",
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
