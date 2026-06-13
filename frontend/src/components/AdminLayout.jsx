import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom"; // <-- ĐÃ IMPORT THÊM OUTLET
import {
  FiBell,
  FiCreditCard,
  FiLock,
  FiLogOut,
  FiSearch,
  FiUser,
  FiUserCheck,
  FiPieChart,
  FiFolder,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiHome,
  FiShield,
} from "react-icons/fi";
import UpdateProfileModal from "./UpdateProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const adminMenuItems = [
  { label: "Thống kê doanh thu", icon: <FiPieChart />, path: "/admin" },
  { label: "Quản lý danh mục", icon: <FiFolder />, path: "/admin/categories" },
  { label: "Quản lý sản phẩm", icon: <FiBox />, path: "/admin/products" },
  {
    label: "Quản lý đơn hàng",
    icon: <FiShoppingCart />,
    path: "/admin/orders",
  },
  {
    label: "Danh sách khách hàng",
    icon: <FiUsers />,
    path: "/admin/customers",
  },
  { label: "Tài khoản quản trị", icon: <FiShield />, path: "/admin/accounts" },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const userMenuRef = useRef(null);
  const token = localStorage.getItem("token");

  const currentUser = useMemo(() => {
    const rawUser =
      localStorage.getItem("currentUser") || localStorage.getItem("user");
    if (!rawUser) {
      return { fullName: "Admin King", username: "admin" };
    }
    try {
      return JSON.parse(rawUser);
    } catch {
      return { fullName: "Admin King", username: "admin" };
    }
  }, []);

  const getAvatarText = (fullName) => {
    if (!fullName) return "AD";
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (keyword) => {
    if (!keyword.trim()) return;
    navigate(`/admin/products?search=${encodeURIComponent(keyword.trim())}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <div
      className="admin-layout-container"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-logo-zone">
          <h1 className="admin-logo-text" style={{ fontWeight: "700" }}>
            <span className="brand-blue">TechShop</span>
            <span className="brand-dark">.admin</span>
          </h1>
        </Link>

        <nav className="admin-nav-menu">
          <p className="admin-menu-heading" style={{ fontWeight: "600" }}>
            Menu quản trị viên
          </p>
          <div className="admin-nav-links">
            {adminMenuItems.map((item) => (
              <aside key={item.label}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `admin-nav-item ${isActive ? "item-active" : ""}`
                  }
                  style={{ fontWeight: "600" }}
                >
                  <span className="admin-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </aside>
            ))}
          </div>
        </nav>
      </aside>

      {/* KHỐI NỘI DUNG BÊN PHẢI */}
      <div className="admin-main-content">
        {/* HEADER PHÍA TRÊN */}
        <header className="admin-header">
          <div
            className="admin-search-wrapper"
            style={{ position: "relative" }}
          >
            <FiSearch
              className="icon-search-left"
              style={{ pointerEvents: "none" }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, đơn hàng..."
              className="admin-header-search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(
                    `/admin/products?search=${encodeURIComponent(searchKeyword.trim())}`,
                  );
                }
              }}
              style={{ fontWeight: "500" }}
            />
          </div>

          <div className="admin-header-right">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="btn-bell-notify"
              title="Thông báo"
            >
              <FiBell />
            </button>

            <div className="admin-divider" />

            {/* AVATAR DROPDOWN */}
            <div className="admin-user-profile" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="admin-avatar-btn"
              >
                <div className="admin-user-info">
                  <p className="user-name-txt" style={{ fontWeight: "600" }}>
                    {currentUser?.fullName || "Admin King"}
                  </p>
                  <p className="user-role-txt" style={{ fontWeight: "500" }}>
                    {currentUser?.username || "admin"}
                  </p>
                </div>
                <div
                  className="user-avatar-circle"
                  style={{ fontWeight: "700" }}
                >
                  {getAvatarText(currentUser?.fullName || "Admin King")}
                </div>
                <span
                  className={`arrow-down-icon ${isUserMenuOpen ? "arrow-rotate" : ""}`}
                  style={{ fontSize: "10px" }}
                >
                  ▼
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="admin-dropdown-menu">
                  <div
                    className="dropdown-padding"
                    style={{ fontSize: "14px" }}
                  >
                    <div className="dropdown-info-row">
                      <FiUserCheck />
                      <p>
                        Họ tên:{" "}
                        <b style={{ fontWeight: "600" }}>
                          {currentUser?.fullName || "Admin King"}
                        </b>
                      </p>
                    </div>

                    <div className="dropdown-info-row">
                      <FiCreditCard />
                      <p>
                        Tài khoản:{" "}
                        <b style={{ fontWeight: "600" }}>
                          {currentUser?.username || "admin"}
                        </b>
                      </p>
                    </div>

                    <div className="dropdown-divider-line" />

                    <button
                      type="button"
                      onClick={() => {
                        navigate("/");
                        setIsUserMenuOpen(false);
                      }}
                      className="dropdown-action-btn"
                      style={{ fontWeight: "600" }}
                    >
                      <FiHome />
                      <span>Trang web bán hàng</span>
                    </button>

                    <div className="dropdown-divider-line" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="dropdown-action-btn"
                      style={{ fontWeight: "600" }}
                    >
                      <FiUser />
                      <span>Thông tin cá nhân</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPasswordOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="dropdown-action-btn"
                      style={{ fontWeight: "600" }}
                    >
                      <FiLock />
                      <span>Đổi mật khẩu</span>
                    </button>

                    <div className="dropdown-divider-line" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-action-btn text-danger"
                      style={{ fontWeight: "700" }}
                    >
                      <FiLogOut />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 🌟 ĐÃ THAY THẾ CHILDREN THÀNH OUTLET THEO CHUẨN CỦA V6 */}
        <main className="admin-page-body">
          <Outlet />
        </main>
      </div>

      {isProfileOpen === true && (
        <UpdateProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          token={token}
        />
      )}

      {isPasswordOpen === true && (
        <ChangePasswordModal
          isOpen={isPasswordOpen}
          onClose={() => setIsPasswordOpen(false)}
          token={token}
        />
      )}
    </div>
  );
};

export default AdminLayout;
