import React, { useEffect, useState } from "react";
import userService from "../../../services/userService";
import AdminFormModal from "./AdminFormModal";
import ChangePasswordModal from "./ChangePasswordModal";
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Key,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AdminList = () => {

  const ITEMS_PER_PAGE = 5;
  const [admins, setAdmins] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // --- TRẠNG THÁI MODALS ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null); 

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortOrder]);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await userService.getAdmins(token);
      const resData = response.data;
      setAdmins(resData.data || resData || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách tài khoản quản trị:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa vĩnh viễn tài khoản này?")) return;
    try {
      const token = localStorage.getItem("token");
      await userService.deleteAdmin(id, token);
      alert("Xóa tài khoản thành công!");
      fetchAdmins();
    } catch (error) {
      console.error(error);
      alert("Xóa tài khoản thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
    }
  };

  // --- Lọc và Sắp xếp dữ liệu ---
  const filteredAndSortedAdmins = admins
    .filter((user) => {
      const matchesSearch =
        (user.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.username || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(search.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = user.isActive === true;
      } else if (statusFilter === "locked") {
        matchesStatus = user.isActive === false;
      }
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "name_asc") {
        return (a.fullName || "").localeCompare(b.fullName || "", "vi");
      }
      if (sortOrder === "name_desc") {
        return (b.fullName || "").localeCompare(a.fullName || "", "vi");
      }
      return 0;
    });

    // Tính tổng số trang dựa trên danh sách đã lọc/sắp xếp
    const totalPages = Math.ceil(filteredAndSortedAdmins.length / ITEMS_PER_PAGE);

    // Cắt mảng để lấy đúng 5 phần tử của trang hiện tại
    const displayedAdmins = filteredAndSortedAdmins.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <style>{`
        .custom-search-input::placeholder { color: #64748b !important; opacity: 1; }
        .table-row-hover { transition: background-color 0.15s ease; }
        .table-row-hover:hover { background-color: #f8fafc !important; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.4); display: flex; align-items: center; justify-content: center; z-index: 99999; backdrop-filter: blur(4px); }
        .modal-content { background: white; padding: 28px; border-radius: 16px; width: 440px; border: 2px solid #cbd5e1; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; color: #0f172a; box-sizing: border-box; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 14px; font-weight: 600; color: #334155; }
        .form-group input, .form-group select { width: 100%; box-sizing: border-box; padding: 10px 14px; background-color: #ffffff; border: 2px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none; fontFamily: inherit; color: #0f172a; }
        .form-group input:focus, .form-group select:focus { border-color: #2563eb; }
        .pagination-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; border: 2px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.15s ease; outline: none; }
        .pagination-btn:hover:not(:disabled) { border-color: #2563eb; color: #2563eb; }
        .pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #f1f5f9; }
        .pagination-btn.active { background: #2563eb; border-color: #2563eb; color: #ffffff; }
      `}</style>

      {/* Header Panel */}
      <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", border: "2px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "22px", fontWeight: "700", margin: 0, color: "#0f172a" }}>
            <ShieldAlert style={{ color: "#2563eb" }} size={24} strokeWidth={2.5} /> Quản Lý Tài Khoản Quản Trị
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", fontWeight: "500", marginTop: "6px", margin: 0 }}>
            Hệ thống phân quyền và danh sách các quản trị viên hệ thống.
          </p>
        </div>
        <button
          onClick={() => { setSelectedAdmin(null); setIsFormModalOpen(true); }}
          style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", fontFamily: "inherit", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "12px", cursor: "pointer" }}
        >
          <Plus size={18} strokeWidth={2.5} /> Thêm Tài Khoản
        </button>
      </div>

      {/* Bộ Lọc Tìm Kiếm */}
      <div style={{ background: "#ffffff", padding: "18px", borderRadius: "16px", border: "2px solid #cbd5e1", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "center" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} size={18} strokeWidth={2} />
          <input
            type="text"
            placeholder="Tìm theo tên, username, email..."
            className="custom-search-input"
            style={{ width: "100%", boxSizing: "border-box", paddingLeft: "42px", background: "#ffffff", border: "2px solid #cbd5e1", borderRadius: "12px", color: "#0f172a", fontWeight: "500", fontSize: "14px", height: "44px", outline: "none", fontFamily: "inherit" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ position: "relative", width: "100%" }}>
          <Filter style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} size={18} strokeWidth={2} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px 10px 42px", background: "#ffffff", border: "2px solid #cbd5e1", borderRadius: "12px", color: "#0f172a", fontWeight: "600", fontSize: "14px", height: "44px", outline: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Bị khóa / Ngừng hoạt động</option>
          </select>
        </div>

        <div style={{ position: "relative", width: "100%" }}>
          <SlidersHorizontal style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} size={18} strokeWidth={2} />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px 10px 42px", background: "#ffffff", border: "2px solid #cbd5e1", borderRadius: "12px", color: "#0f172a", fontWeight: "600", fontSize: "14px", height: "44px", outline: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            <option value="">Sắp xếp: Mặc định</option>
            <option value="name_asc">Họ tên: A-Z</option>
            <option value="name_desc">Họ tên: Z-A</option>
          </select>
        </div>
      </div>

      {/* Bảng Hiển Thị Dữ Liệu */}
      <div style={{ background: "#ffffff", borderRadius: "16px", border: "2px solid #cbd5e1", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead style={{ background: "#e2e8f0", borderBottom: "2px solid #cbd5e1" }}>
            <tr>
              <th style={thStyle}>Họ và tên</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Số điện thoại</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Trạng thái hoạt động</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Vai trò</th>
              <th style={{ ...thStyle, textAlign: "right", width: "160px" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {displayedAdmins.map((user) => {
              const userId = user.userID || user.id;
              const roleName = user.role || "Admin";
              const isActive = user.isActive;

              return (
                <tr key={userId} className="table-row-hover" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px", fontWeight: "600", color: "#0f172a", lineHeight: "1.4" }}>{user.fullName || "—"}</td>
                  <td style={{ padding: "16px", color: "#334155", fontWeight: "500" }}>{user.username || "—"}</td>
                  <td style={{ padding: "16px", color: "#334155" }}>{user.email || "—"}</td>
                  <td style={{ padding: "16px", color: "#334155" }}>{user.phone || user.phoneNumber || "—"}</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <span style={{ background: isActive ? "#f0fdf4" : "#fef2f2", color: isActive ? "#166534" : "#991b1b", padding: "4px 12px", borderRadius: "20px", border: `1px solid ${isActive ? "#bbf7d0" : "#fca5a5"}`, fontSize: "12px", fontWeight: "700" }}>
                      {isActive ? "Đang hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <span style={{ background: "#eff6ff", color: "#1e40af", padding: "4px 12px", borderRadius: "20px", border: "1px solid #bfdbfe", fontSize: "12px", fontWeight: "700" }}>
                      {roleName}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
                      <button onClick={() => { setSelectedAdmin(user); setIsFormModalOpen(true); }} style={actionButtonStyle} title="Sửa thông tin">
                        <Edit2 size={18} strokeWidth={2} />
                      </button>
                      <button onClick={() => { setSelectedAdmin(user); setIsPasswordModalOpen(true); }} style={{ ...actionButtonStyle, color: "#059669" }} title="Đổi mật khẩu">
                        <Key size={18} strokeWidth={2} />
                      </button>
                      <button onClick={() => handleDelete(userId)} style={{ ...actionButtonStyle, color: "#dc2626" }} title="Xóa tài khoản">
                        <Trash2 size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredAndSortedAdmins.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "#64748b", fontWeight: "600", fontSize: "15px" }}>
                  Không tìm thấy tài khoản quản trị nào khớp với bộ lọc!
                </td>
              </tr>
            )}
          </tbody>
        </table>
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: "#f8fafc", borderTop: "2px solid #cbd5e1" }}>
              <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                Hiển thị <b style={{ color: "#0f172a" }}>{displayedAdmins.length}</b> trên <b style={{ color: "#0f172a" }}>{filteredAndSortedAdmins.length}</b> tài khoản
              </span>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button 
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
      </div>

      {/* --- Nhúng các Modals --- */}
      <AdminFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setSelectedAdmin(null); }}
        adminData={selectedAdmin}
        onSaveSuccess={fetchAdmins}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => { setIsPasswordModalOpen(false); setSelectedAdmin(null); }}
        adminData={selectedAdmin}
      />
    </div>
  );
};

const thStyle = { padding: "14px 16px", fontWeight: "700", color: "#1e293b", textTransform: "uppercase", fontSize: "12px" };
const actionButtonStyle = { background: "none", border: "none", color: "#2563eb", cursor: "pointer", padding: 0 };

export default AdminList;