import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FiShield,
  FiSearch,
  FiKey,
  FiTrash2,
  FiUserPlus,
  FiArrowLeft,
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiEdit3,
  FiX,
} from "react-icons/fi";
import userService from "../../../services/userService";

const AdminList = () => {
  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Các State phục vụ Phân trang, Lọc & Sắp xếp
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "userID",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token") || "";

  // State phục vụ Modal Đổi Mật Khẩu
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    userID: "",
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Cấu trúc dữ liệu Form Admin
  const [formData, setFormData] = useState({
    userID: "",
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    isActive: true,
  });

  // ================= 1. GỌI API LẤY DANH SÁCH ADMIN =================
  const fetchAdmins = useCallback(async () => {
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn!");
      return;
    }
    loading && setLoading(true);
    try {
      const res = await userService.getAdmins(token);
      setAdmins(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách admin:", err);
      alert(
        err.response?.data?.message ||
          "Không có quyền truy cập danh sách quản trị.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // ================= 2. GỌI API XÓA ADMIN =================
  const handleDelete = async (userID) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản quản trị này?"))
      return;
    try {
      await userService.deleteAdmin(userID, token);
      setAdmins((prev) => prev.filter((item) => item.userID !== userID));
      alert("Xóa tài khoản quản trị viên thành công!");
    } catch (err) {
      console.error("Lỗi xóa admin:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "Xóa tài khoản thất bại.",
      );
    }
  };

  // ================= 3. ĐỔI MẬT KHẨU (MODAL) =================
  const openPasswordModal = (admin) => {
    setPasswordForm({
      userID: admin.userID,
      username: admin.username,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      alert("Xác nhận mật khẩu mới không trùng khớp. Vui lòng kiểm tra lại!");
      return;
    }

    try {
      await userService.changeAdminPassword(
        passwordForm.userID,
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        token,
      );

      alert(`Đổi mật khẩu tài khoản "${passwordForm.username}" thành công!`);
      setIsPasswordModalOpen(false);
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      alert(errorMsg);
    }
  };

  // ================= 4. GỌI API TẠO ADMIN MỚI =================
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await userService.createAdmin(formData, token);
      alert("Tạo tài khoản admin mới thành công!");
      resetForm();
      setView("list");
      fetchAdmins();
    } catch (err) {
      console.error("Lỗi tạo admin mới:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "Tạo tài khoản thất bại.",
      );
    }
  };

  // ================= 5. KÍCH HOẠT CHẾ ĐỘ SỬA THÔNG TIN =================
  const handleEditClick = (admin) => {
    setFormData({
      userID: admin.userID,
      username: admin.username,
      fullName: admin.fullName || "",
      email: admin.email || "",
      phone: admin.phone || "",
      address: admin.address || "",
      password: "",
      isActive: admin.isActive,
    });
    setView("edit");
  };

  // ================= 6. GỌI API CẬP NHẬT THÔNG TIN ADMIN =================
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      if (userService.updateAdmin) {
        await userService.updateAdmin(formData.userID, formData, token);
      } else {
        await userService.updateAdminProfile?.(
          formData.userID,
          formData,
          token,
        );
      }

      alert("Cập nhật thông tin quản trị viên thành công!");
      resetForm();
      setView("list");
      fetchAdmins();
    } catch (err) {
      console.error("Lỗi cập nhật dữ liệu Admin:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "Cập nhật dữ liệu thất bại.",
      );
    }
  };

  const resetForm = () => {
    setFormData({
      userID: "",
      username: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      isActive: true,
    });
  };

  // ================= 7. PIPELINE XỬ LÝ DỮ LIỆU =================
  const processedAdmins = useMemo(() => {
    let result = [...admins];

    if (searchTerm.trim() !== "") {
      const keyword = searchTerm.toLowerCase().trim();
      result = result.filter(
        (admin) =>
          (admin.userID && admin.userID.toString().includes(keyword)) ||
          (admin.username && admin.username.toLowerCase().includes(keyword)) ||
          (admin.fullName && admin.fullName.toLowerCase().includes(keyword)),
      );
    }

    if (statusFilter !== "all") {
      const targetStatus = statusFilter === "active";
      result = result.filter((admin) => admin.isActive === targetStatus);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let fieldA = a[sortConfig.key];
        let fieldB = b[sortConfig.key];

        if (fieldA === undefined || fieldA === null) fieldA = "";
        if (fieldB === undefined || fieldB === null) fieldB = "";

        if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
        if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();

        if (fieldA < fieldB) return sortConfig.direction === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [admins, searchTerm, statusFilter, sortConfig]);

  // ================= 8. PHÂN TRANG =================
  const totalPages = Math.ceil(processedAdmins.length / itemsPerPage) || 1;
  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedAdmins.slice(startIndex, startIndex + itemsPerPage);
  }, [processedAdmins, currentPage, itemsPerPage]);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return (
        <span style={{ marginLeft: "4px", opacity: 0.3 }}>
          <FiChevronUp />
        </span>
      );
    return sortConfig.direction === "asc" ? (
      <FiChevronUp style={{ marginLeft: "4px", color: "#4f46e5" }} />
    ) : (
      <FiChevronDown style={{ marginLeft: "4px", color: "#4f46e5" }} />
    );
  };

  // ——————————————————————————————————————————————————————————————————
  // GIAO DIỆN 1: DANH SÁCH ADMIN (VIEW === "LIST")
  // ——————————————————————————————————————————————————————————————————
  if (view === "list") {
    return (
      <div
        className="force-admin-font-scope"
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* 🌟 THẦN CHÚ CSS: ÉP TOÀN BỘ CÁC THẺ CON, BẢNG, TIÊU ĐỀ PHẢI DÙNG FONT INTER MỊN ĐẸP */}
        <style>{`
          .force-admin-font-scope,
          .force-admin-font-scope *,
          .force-admin-font-scope table,
          .force-admin-font-scope th,
          .force-admin-font-scope td,
          .force-admin-font-scope input,
          .force-admin-font-scope select,
          .force-admin-font-scope button {
            font-family: 'Arial', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            WebkitFontSmoothing: "antialiased" !important;
            MozOsxFontSmoothing: "grayscale" !important;
          }
        `}</style>

        {/* Banner tiêu đề */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#e0e7ff",
              padding: "12px",
              borderRadius: "12px",
              color: "#4f46e5",
              fontSize: "24px",
              display: "flex",
            }}
          >
            <FiShield />
          </div>
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#000000",
                margin: "0",
              }}
            >
              Quản Lý Tài Khoản Quản Trị
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "4px 0 0 0",
              }}
            >
              Danh sách và bộ công cụ điều phối, phân cấp nhân sự quản trị hệ
              thống.
            </p>
          </div>
        </div>

        {/* Khối Điều khiển: Tìm kiếm, Bộ lọc & Thêm mới */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              flex: "1 1 auto",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "320px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiSearch
                style={{
                  position: "absolute",
                  left: "16px",
                  color: "#9ca3af",
                  fontSize: "16px",
                }}
              />
              <input
                id="admin-list-search-input"
                name="adminListSearchInput"
                autoComplete="off"
                type="text"
                placeholder="Tìm tên, username hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                style={{
                  width: "100%",
                  border: "2px solid #cbd5e1",
                  borderRadius: "12px",
                  padding: "12px 16px 12px 44px",
                  fontSize: "14px",
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  fontWeight: "600",
                }}
              />
            </div>

            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiFilter
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "#4b5563",
                  zIndex: 1,
                }}
              />
              <select
                id="admin-list-status-select"
                name="adminListStatusSelect"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  border: "2px solid #cbd5e1",
                  padding: "12px 16px 12px 36px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#4b5563",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  minWidth: "160px",
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="locked">Đang bị khóa</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setView("add");
            }}
            style={{
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "14px",
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
            }}
          >
            + Tạo Tài Khoản Admin
          </button>
        </div>

        {/* Khung Bảng dữ liệu chính */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "2px solid #cbd5e1",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                textAlign: "left",
                color: "#4b5563",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#f1f5f9",
                  borderBottom: "2px solid #cbd5e1",
                }}
              >
                <tr>
                  <th
                    onClick={() => requestSort("userID")}
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                      width: "100px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      ID {renderSortIcon("userID")}
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("username")}
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Username {renderSortIcon("username")}
                    </div>
                  </th>
                  <th
                    onClick={() => requestSort("fullName")}
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      Họ & Tên {renderSortIcon("fullName")}
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                    }}
                  >
                    Trạng thái
                  </th>
                  <th
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                      textAlign: "center",
                      width: "320px",
                    }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "32px 24px",
                        textAlign: "center",
                        color: "#4f46e5",
                        fontWeight: "600",
                      }}
                    >
                      🔄 Đang tải dữ liệu từ API...
                    </td>
                  </tr>
                ) : paginatedAdmins.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "32px 24px",
                        textAlign: "center",
                        color: "#9ca3af",
                        fontWeight: "600",
                      }}
                    >
                      🔍 Không tìm thấy kết quả phù hợp tiêu chí.
                    </td>
                  </tr>
                ) : (
                  paginatedAdmins.map((admin) => (
                    <tr
                      key={admin.userID}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td
                        style={{
                          padding: "16px 24px",
                          color: "#6b7280",
                          fontWeight: "600",
                        }}
                      >
                        #{admin.userID}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontWeight: "700",
                          color: "#4f46e5",
                        }}
                      >
                        {admin.username}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontWeight: "600",
                          color: "#000000",
                        }}
                      >
                        {admin.fullName || "Chưa cập nhật"}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span
                          style={{
                            backgroundColor: admin.isActive
                              ? "#dcfce7"
                              : "#fee2e2",
                            color: admin.isActive ? "#15803d" : "#991b1b",
                            padding: "6px 12px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-block",
                          }}
                        >
                          {admin.isActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          display: "flex",
                          gap: "6px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => handleEditClick(admin)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#e0f2fe",
                            color: "#0369a1",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            border: "1px solid #bae6fd",
                            cursor: "pointer",
                          }}
                        >
                          <FiEdit3 /> Sửa
                        </button>
                        <button
                          onClick={() => openPasswordModal(admin)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            border: "1px solid #fde68a",
                            cursor: "pointer",
                          }}
                        >
                          <FiKey /> Đổi Mật Khẩu
                        </button>
                        <button
                          onClick={() => handleDelete(admin.userID)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            border: "1px solid #fca5a5",
                            cursor: "pointer",
                          }}
                        >
                          <FiTrash2 /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* THANH PHÂN TRANG */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "16px 24px",
              borderTop: "2px solid #cbd5e1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div
              style={{ fontSize: "14px", color: "#6b7280", fontWeight: "600" }}
            >
              Hiển thị từ{" "}
              <b>
                {processedAdmins.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </b>{" "}
              đến{" "}
              <b>
                {Math.min(currentPage * itemsPerPage, processedAdmins.length)}
              </b>{" "}
              trong tổng số <b>{processedAdmins.length}</b> tài khoản
            </div>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: currentPage === 1 ? "#e2e8f0" : "#ffffff",
                  color: "#4b5563",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border:
                      index + 1 === currentPage ? "none" : "1px solid #cbd5e1",
                    backgroundColor:
                      index + 1 === currentPage ? "#4f46e5" : "#ffffff",
                    color: index + 1 === currentPage ? "#ffffff" : "#4b5563",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  backgroundColor:
                    currentPage === totalPages ? "#e2e8f0" : "#ffffff",
                  color: "#4b5563",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================================== */}
        {/* MODAL ĐỔI MẬT KHẨU */}
        {/* =================================================================================== */}
        {isPasswordModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "440px",
                border: "2px solid #cbd5e1",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f8fafc",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#0f172a",
                    }}
                  >
                    Đổi mật khẩu bảo mật
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    Tài khoản:{" "}
                    <b style={{ color: "#4f46e5" }}>{passwordForm.username}</b>
                  </p>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  style={{
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: "20px",
                    color: "#64748b",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  <FiX />
                </button>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Mật khẩu hiện tại (Cũ) *
                  </label>
                  <input
                    id="admin-list-old-password"
                    name="adminListOldPassword"
                    autoComplete="off"
                    type="password"
                    placeholder="Nhập mật khẩu đang dùng"
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      border: "2px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      fontWeight: "600",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Mật khẩu mới *
                  </label>
                  <input
                    id="admin-list-new-password"
                    name="adminListNewPassword"
                    autoComplete="new-password"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      border: "2px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      fontWeight: "600",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Xác nhận lại mật khẩu mới *
                  </label>
                  <input
                    id="admin-list-confirm-password"
                    name="adminListConfirmPassword"
                    autoComplete="new-password"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmNewPassword: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      border: "2px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      fontWeight: "600",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    marginTop: "12px",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "16px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                    }}
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#475569",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "10px 16px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#4f46e5",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(79, 70, 229, 0.15)",
                    }}
                  >
                    🔒 Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ——————————————————————————————————————————————————————————————————
  // GIAO DIỆN 2: FORM TẠO MỚI HOẶC CẬP NHẬT (VIEW === "ADD" || VIEW === "EDIT")
  // ——————————————————————————————————————————————————————————————————
  const inputStyle = {
    width: "100%",
    border: "2px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    color: "#000000",
    outline: "none",
    boxSizing: "border-box",
    fontWeight: "600",
  };
  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "8px",
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          border: "2px solid #cbd5e1",
          padding: "32px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #f3f4f6",
            paddingBottom: "16px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              backgroundColor: "#e0e7ff",
              padding: "10px",
              borderRadius: "10px",
              color: "#4f46e5",
              display: "flex",
            }}
          >
            <FiUserPlus style={{ fontSize: "20px" }} />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#000000",
              margin: "0",
            }}
          >
            {view === "add"
              ? "Tạo Tài Khoản Admin Mới"
              : `Sửa Thông Tin Admin: ${formData.username}`}
          </h2>
        </div>

        <form
          onSubmit={view === "add" ? handleCreateAdmin : handleUpdateAdmin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Tài khoản (Username) *</label>
              <input
                id="form-admin-username"
                name="formAdminUsername"
                type="text"
                placeholder="Ví dụ: van.nguyen"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                disabled={view === "edit"}
                style={{
                  ...inputStyle,
                  backgroundColor: view === "edit" ? "#f1f5f9" : "#ffffff",
                  cursor: view === "edit" ? "not-allowed" : "text",
                }}
              />
            </div>
            {view === "add" && (
              <div style={{ flex: "1 1 240px" }}>
                <label style={labelStyle}>Mật khẩu khởi tạo *</label>
                <input
                  id="form-admin-password"
                  name="formAdminPassword"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Họ và Tên *</label>
              <input
                id="form-admin-fullname"
                name="formAdminFullname"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Email *</label>
              <input
                id="form-admin-email"
                name="formAdminEmail"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Số điện thoại</label>
              <input
                id="form-admin-phone"
                name="formAdminPhone"
                type="text"
                placeholder="09xxxxxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                style={inputStyle}
              />
            </div>
            <div style={{ flex: "1 1 240px" }}>
              <label style={labelStyle}>Địa chỉ</label>
              <input
                id="form-admin-address"
                name="formAdminAddress"
                type="text"
                placeholder="Địa chỉ nơi làm việc"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                style={inputStyle}
              />
            </div>
          </div>

          {view === "edit" && (
            <div
              style={{
                border: "2px solid #cbd5e1",
                borderRadius: "12px",
                padding: "16px",
                backgroundColor: "#f8fafc",
              }}
            >
              <label style={labelStyle}>Trạng thái hoạt động hệ thống *</label>
              <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#15803d",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive === true}
                    onChange={() =>
                      setFormData({ ...formData, isActive: true })
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "#4f46e5",
                    }}
                  />
                  Cho phép Hoạt động
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#b91c1c",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="isActive"
                    checked={formData.isActive === false}
                    onChange={() =>
                      setFormData({ ...formData, isActive: false })
                    }
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "#4f46e5",
                    }}
                  />
                  Khóa tài khoản (Bị chặn)
                </label>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "12px",
              borderTop: "1px solid #f3f4f6",
              paddingTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                resetForm();
                setView("list");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#ffffff",
                color: "#374151",
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <FiArrowLeft /> Hủy & Quay lại
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(79, 70, 229, 0.15)",
              }}
            >
              {view === "add" ? "➕ Thêm tài khoản" : "💾 Cập nhật thông tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminList;
