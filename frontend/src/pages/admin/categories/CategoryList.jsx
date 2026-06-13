import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error("Load categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentCategory.name.trim()) return;

    try {
      const payload = {
        categoryName: currentCategory.name,
        description: currentCategory.description,
      };
      if (currentCategory.id) {
        await updateCategory(currentCategory.id, payload);
      } else {
        await createCategory(payload);
      }
      await loadCategories();
      setModalOpen(false);
      setCurrentCategory({ id: null, name: "", description: "" });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategory(id);
        await loadCategories();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortOrder === "name_asc")
      return a.categoryName.localeCompare(b.categoryName);
    if (sortOrder === "name_desc")
      return b.categoryName.localeCompare(a.categoryName);
    if (sortOrder === "id_desc") return b.categoryID - a.categoryID;
    if (sortOrder === "id_asc") return a.categoryID - b.categoryID;
    return 0;
  });

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCategories.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

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
        gap: "20px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <style>{`
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
            <Tag style={{ color: "#2563eb" }} size={24} strokeWidth={2.5} />{" "}
            Quản Lý Danh Mục
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
            Cơ cấu và quản lý nhóm phân loại danh mục sản phẩm hệ thống.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentCategory({ id: null, name: "", description: "" });
            setModalOpen(true);
          }}
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
          <Plus size={18} strokeWidth={2.5} /> Thêm Danh Mục
        </button>
      </div>

      {/* Thanh công cụ tìm kiếm và sắp xếp */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: "360px" }}>
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
            placeholder="Tìm kiếm danh mục..."
            className="nav-search-input"
            style={{
              width: "100%",
              boxSizing: "border-box",
              paddingLeft: "40px",
              background: "#ffffff",
              border: "2px solid #cbd5e1",
              borderRadius: "12px",
              color: "#0f172a",
              fontWeight: "500",
              fontSize: "14px",
              height: "44px",
              fontFamily: "inherit",
            }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "240px" }}>
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
            <option value="">Sắp xếp: Mặc định</option>
            <option value="name_asc">Tên danh mục: A-Z</option>
            <option value="name_desc">Tên danh mục: Z-A</option>
            <option value="id_desc">Thời gian: Mới nhất</option>
            <option value="id_asc">Thời gian: Cũ nhất</option>
          </select>
        </div>
      </div>

      {/* Bảng Dữ Liệu */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "2px solid #cbd5e1",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "#0f172a",
              fontWeight: "600",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Loader2
              className="animate-spin"
              style={{ color: "#2563eb" }}
              size={28}
            />
            Đang đồng bộ dữ liệu...
          </div>
        ) : currentItems.length === 0 ? (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              color: "#64748b",
              fontWeight: "600",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle style={{ color: "#dc2626" }} size={28} />
            Không tìm thấy danh mục nào phù hợp.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead
              style={{
                background: "#e2e8f0",
                borderBottom: "2px solid #cbd5e1",
              }}
            >
              <tr>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: "700",
                    color: "#1e293b",
                    textTransform: "uppercase",
                    fontSize: "12px",
                    textAlign: "left",
                    width: "100px",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: "700",
                    color: "#1e293b",
                    textTransform: "uppercase",
                    fontSize: "12px",
                    textAlign: "left",
                    width: "25%",
                  }}
                >
                  Tên danh mục
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    fontWeight: "700",
                    color: "#1e293b",
                    textTransform: "uppercase",
                    fontSize: "12px",
                    textAlign: "left",
                  }}
                >
                  Mô tả ngắn
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
              {currentItems.map((cat) => (
                <tr
                  key={cat.categoryID}
                  className="table-row-hover"
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                >
                  <td
                    style={{
                      padding: "16px",
                      color: "#64748b",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {cat.categoryID}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "600",
                      color: "#0f172a",
                    }}
                  >
                    {cat.categoryName}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#334155",
                      fontWeight: "400",
                      maxWidth: "400px",
                      wordBreak: "break-word",
                    }}
                  >
                    {cat.description || "—"}
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
                        onClick={() => {
                          setCurrentCategory({
                            id: cat.categoryID,
                            name: cat.categoryName,
                            description: cat.description,
                          });
                          setModalOpen(true);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title="Sửa"
                      >
                        <Edit2 size={18} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.categoryID)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        title="Xóa"
                      >
                        <Trash2 size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Thanh phân trang */}
      {!loading && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "10px 0",
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

          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            const isPageActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  ...basePageButtonStyle,
                  background: isPageActive ? "#2563eb" : "#ffffff",
                  color: isPageActive ? "#ffffff" : "#0f172a",
                  borderColor: isPageActive ? "#2563eb" : "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {pageNum}
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

      {/* Modal Form */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.3)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "32px",
              borderRadius: "16px",
              border: "2px solid #cbd5e1",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h3
              style={{
                margin: "0 0 24px 0",
                fontSize: "20px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              {currentCategory.id ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
            </h3>
            <form onSubmit={handleSave} className="auth-form">
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    fontWeight: "600",
                    color: "#334155",
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  style={{
                    border: "2px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "10px",
                    fontWeight: "500",
                    color: "#0f172a",
                    fontSize: "15px",
                    width: "100%",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                  className="auth-input"
                  value={currentCategory.name}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    fontWeight: "600",
                    color: "#334155",
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Mô tả
                </label>
                <textarea
                  rows="3"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "2px solid #cbd5e1",
                    color: "#0f172a",
                    fontWeight: "500",
                    fontSize: "15px",
                    padding: "12px",
                    borderRadius: "12px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  value={currentCategory.description}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "2px solid #e2e8f0",
                    padding: "10px 20px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-auth-submit"
                  style={{
                    width: "auto",
                    margin: 0,
                    padding: "10px 24px",
                    fontWeight: "600",
                    fontFamily: "inherit",
                  }}
                >
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
