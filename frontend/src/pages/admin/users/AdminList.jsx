import React, { useState } from "react";
import {
  FiShield,
  FiSearch,
  FiKey,
  FiTrash2,
  FiUserPlus,
  FiArrowLeft,
} from "react-icons/fi";

const AdminList = () => {
  const [view, setView] = useState("list");

  const [admins, setAdmins] = useState(() => {
    const savedAdmins = localStorage.getItem("techshop_mock_admins");
    return savedAdmins
      ? JSON.parse(savedAdmins)
      : [
          { id: 1, username: "admin_king", role: "Super Admin" },
          { id: 2, username: "admin_sales", role: "Staff Đơn Hàng" },
        ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    role: "Staff Đơn Hàng",
  });

  const handleDelete = (id) => {
    if (
      window.confirm("Ông có chắc muốn xóa tài khoản quản trị này không? 🗑️")
    ) {
      const updatedAdmins = admins.filter((item) => item.id !== id);
      setAdmins(updatedAdmins);
      localStorage.setItem(
        "techshop_mock_admins",
        JSON.stringify(updatedAdmins),
      );
      alert("Xóa tài khoản thành công!");
    }
  };

  const handleChangePassword = (id, username) => {
    const newPassword = prompt(
      `Nhập mật khẩu mới cho tài khoản "${username}":`,
    );
    if (newPassword === null) return;

    if (!newPassword.trim()) {
      alert("Mật khẩu không được để trống ông ơi!");
      return;
    }

    alert(`Đã đổi mật khẩu cho tài khoản "${username}" thành công! 🔑`);
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      alert("Ông ơi, nhập username vào đã nhé!");
      return;
    }

    const nextId =
      admins.length > 0 ? Math.max(...admins.map((a) => a.id)) + 1 : 1;
    const newAccount = {
      id: nextId,
      username: formData.username.trim(),
      role: formData.role,
    };

    const updatedAdmins = [...admins, newAccount];
    setAdmins(updatedAdmins);
    localStorage.setItem("techshop_mock_admins", JSON.stringify(updatedAdmins));

    alert("Cấp tài khoản Admin mới thành công! 🚀");
    setFormData({ username: "", role: "Staff Đơn Hàng" });
    setView("list");
  };

  const filteredAdmins = admins.filter((admin) => {
    const keyword = searchTerm.toLowerCase().trim();
    return (
      admin.id.toString().includes(keyword) ||
      admin.username.toLowerCase().includes(keyword) ||
      admin.role.toLowerCase().includes(keyword)
    );
  });

  if (view === "list") {
    return (
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
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
              alignItems: "center",
              justifyContent: "center",
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
              Danh sách các tài khoản có quyền truy cập và điều hành hệ thống
              nội bộ TechShop.
            </p>
          </div>
        </div>

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
              position: "relative",
              width: "100%",
              maxWidth: "384px",
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
              type="text"
              placeholder="Tìm theo ID, Username hoặc Vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                border: "2px solid #cbd5e1",
                borderRadius: "12px",
                padding: "12px 16px 12px 44px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
                color: "#000000",
                outline: "none",
                boxSizing: "border-box",
                fontWeight: "600",
              }}
            />
          </div>

          <button
            onClick={() => setView("add")}
            style={{
              marginLeft: "auto",
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
            + Cấp Tài Khoản Admin
          </button>
        </div>

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
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                      width: "80px",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                    }}
                  >
                    Username
                  </th>
                  <th
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                    }}
                  >
                    Vai trò
                  </th>
                  <th
                    style={{
                      padding: "18px 24px",
                      fontWeight: "800",
                      color: "#000000",
                      fontSize: "15px",
                      textAlign: "center",
                      width: "280px",
                    }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        padding: "32px 24px",
                        textAlign: "center",
                        color: "#9ca3af",
                        fontWeight: "600",
                      }}
                    >
                      🔍 Không tìm thấy tài khoản quản trị nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr
                      key={admin.id}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td
                        style={{
                          padding: "16px 24px",
                          color: "#6b7280",
                          fontWeight: "600",
                        }}
                      >
                        #{admin.id}
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
                      <td style={{ padding: "16px 24px" }}>
                        <span
                          style={{
                            backgroundColor:
                              admin.role === "Super Admin"
                                ? "#f3e8ff"
                                : "#dbeafe",
                            color:
                              admin.role === "Super Admin"
                                ? "#6b21a8"
                                : "#1e40af",
                            padding: "6px 12px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: "700",
                            border:
                              admin.role === "Super Admin"
                                ? "1px solid #e9d5ff"
                                : "1px solid #bfdbfe",
                            display: "inline-block",
                          }}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleChangePassword(admin.id, admin.username)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            border: "1px solid #fde68a",
                            cursor: "pointer",
                          }}
                        >
                          <FiKey /> Đổi mật khẩu
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "8px 14px",
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
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
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
              alignItems: "center",
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
            Cấp Tài Khoản Admin Mới
          </h2>
        </div>

        <form
          onSubmit={handleCreateAdmin}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "8px",
              }}
            >
              Tài khoản (Username) *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: admin_moderator, admin_audit..."
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              style={{
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
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "8px",
              }}
            >
              Vai trò quyền hạn *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              style={{
                width: "100%",
                border: "2px solid #cbd5e1",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                backgroundColor: "#ffffff",
                color: "#000000",
                outline: "none",
                cursor: "pointer",
                boxSizing: "border-box",
                fontWeight: "600",
              }}
            >
              <option value="Super Admin">Super Admin (Toàn quyền)</option>
              <option value="Staff Đơn Hàng">
                Staff Đơn Hàng (Quản lý đơn)
              </option>
              <option value="Staff Kho">
                Staff Kho (Linh kiện & Sản phẩm)
              </option>
              <option value="Chăm Sóc Khách Hàng">
                Chăm Sóc Khách Hàng (Support)
              </option>
            </select>
          </div>

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
              onClick={() => setView("list")}
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
              💾 Cấp tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminList;
