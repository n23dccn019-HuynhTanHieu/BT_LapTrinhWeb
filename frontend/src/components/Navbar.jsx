import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  FiUser,
  FiLock,
  FiLogOut,
  FiUserCheck,
  FiCreditCard,
} from "react-icons/fi";

import { getCategories } from "../services/categoryService";

// Import 2 Component đã được tách biệt
import UpdateProfileModal from "./UpdateProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function Navbar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) {

  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Quản lý trạng thái đóng mở của 2 Modal mới
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [cartCount, setCartCount] = useState(2);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");

  const currentUser = useMemo(() => {
    const rawUser = localStorage.getItem("currentUser") || localStorage.getItem("user");
    if (!rawUser) return null;
    try { return JSON.parse(rawUser); } catch { return null; }
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  };

  useEffect(() => {
    const updateCount = () => {
      const rawCart = localStorage.getItem("cartItems");
      if (rawCart) {
        const items = JSON.parse(rawCart);
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("cart_updated", updateCount);
    return () => window.removeEventListener("cart_updated", updateCount);
  }, []);

  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getAvatarText = (fullName) => {
    if (!fullName) return "U";
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-top">
        <div className="navbar-logo-search">
          <div className="navbar-logo">
            <Link to="/" className="logo-link">TechShop 🛒</Link>
          </div>
          <div className="search-box-wrap">
            <input type="text" placeholder="Nhập tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="nav-search-input" />
          </div>
        </div>

        <div className="navbar-menu">
          <Link to="/" className="menu-link">Trang chủ</Link>
          <button type="button" onClick={() => setIsInfoModalOpen(true)} className="menu-link" style={{ background: "none", border: "none", cursor: "pointer" }}>Giới thiệu</button>
          <button type="button" onClick={() => setIsContactModalOpen(true)} className="menu-link" style={{ background: "none", border: "none", cursor: "pointer" }}>Liên hệ</button>
          <Link to="/cart" className="menu-link cart-link">Giỏ hàng <span className="cart-badge">{cartCount}</span></Link>

          {/* CHƯA LOGIN */}
          {!currentUser && (
            <div className="admin-user-profile" ref={userMenuRef}>
              <button type="button" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="admin-avatar-btn">
                <div className="admin-user-info"><p className="user-name-txt">Tài khoản</p><p className="user-role-txt">Khách</p></div>
                <div className="user-avatar-circle">U</div>
                <span className={`arrow-down-icon ${isUserMenuOpen ? "arrow-rotate" : ""}`}>▼</span>
              </button>
              {isUserMenuOpen && (
                <div className="admin-dropdown-menu">
                  <div className="dropdown-padding">
                    <button type="button" onClick={() => navigate("/login")} className="dropdown-action-btn"><FiUser /> <span>Đăng nhập</span></button>
                    <button type="button" onClick={() => navigate("/register")} className="dropdown-action-btn"><FiLock /> <span>Đăng ký</span></button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ĐÃ LOGIN */}
          {currentUser && (
            <div className="admin-user-profile" ref={userMenuRef}>
              <button type="button" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="admin-avatar-btn">
                <div className="admin-user-info"><p className="user-name-txt">{currentUser.fullName}</p><p className="user-role-txt">{currentUser.username}</p></div>
                <div className="user-avatar-circle">{getAvatarText(currentUser.fullName)}</div>
                <span className={`arrow-down-icon ${isUserMenuOpen ? "arrow-rotate" : ""}`}>▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="admin-dropdown-menu">
                  <div className="dropdown-padding">
                    <div className="dropdown-info-row"><FiUserCheck /><p>Họ tên: <b>{currentUser.fullName}</b></p></div>
                    <div className="dropdown-info-row"><FiCreditCard /><p>Tài khoản: <b>{currentUser.username}</b></p></div>
                    <div className="dropdown-divider-line" />

                    {currentUser.role === "Admin" && (
                      <button type="button" onClick={() => { navigate("/admin"); setIsUserMenuOpen(false); }} className="dropdown-action-btn"><FiUser /> <span>Trang quản trị</span></button>
                    )}

                    <button type="button" onClick={() => { setIsProfileModalOpen(true); setIsUserMenuOpen(false); }} className="dropdown-action-btn"><FiUser /> <span>Thông tin cá nhân</span></button>
                    <button type="button" onClick={() => { setIsPasswordModalOpen(true); setIsUserMenuOpen(false); }} className="dropdown-action-btn"><FiLock /> <span>Đổi mật khẩu</span></button>
                    
                    {/* KHU VỰC LỊCH SỬ ĐƠN HÀNG (ĐÃ SỬA LỖI ĐÓNG MỞ THẺ) */}
                    <button type="button" onClick={() => { navigate("/order-history"); setIsUserMenuOpen(false); }} className="dropdown-action-btn">
                      <span>🛍️ Lịch sử đơn hàng</span>
                    </button>
                    
                    <div className="dropdown-divider-line" />
                    <button type="button" onClick={handleLogout} className="dropdown-action-btn text-danger"><FiLogOut /> <b>Đăng xuất</b></button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-categories">
        <button className={`category-tab ${selectedCategory === "All" ? "active" : ""}`} onClick={() => setSelectedCategory("All")}>Tất cả danh mục</button>
        {categories.map((category) => (
          <button key={category.categoryID} className={`category-tab ${selectedCategory === category.categoryID ? "active" : ""}`} onClick={() => setSelectedCategory(category.categoryID)}>{category.categoryName}</button>
        ))}
      </div>

      {/* POPUP 1: GIỚI THIỆU ĐỀ TÀI */}
      {isInfoModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, backdropFilter: "blur(5px)" }}>
          <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "16px", width: "460px", boxShadow: "0 20px 40px rgba(0,0,0,0.25)", position: "relative", fontFamily: '"Segoe UI", Roboto, sans-serif', color: "#2d3748" }}>
            <button onClick={() => setIsInfoModalOpen(false)} style={{ position: "absolute", top: "15px", right: "18px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#a0aec0" }}>✕</button>
            <h3 style={{ margin: "0 0 22px 0", color: "#3182ce", textAlign: "center", fontSize: "20px", fontWeight: "700", borderBottom: "2px solid #ebf8ff", paddingBottom: "12px" }}>📋 THÔNG TIN BÀI TẬP LỚN</h3>
            <div style={{ marginBottom: "18px", fontSize: "15px", lineHeight: "1.5" }}><span style={{ fontWeight: "600", color: "#4a5568" }}>Đề tài:</span><div style={{ marginTop: "4px", padding: "10px", backgroundColor: "#f7fafc", borderRadius: "8px", fontWeight: "600", color: "#2b6cb0" }}>Website Quản Lý Bán Hàng Máy Tính TechShop</div></div>
            <div style={{ marginBottom: "18px" }}><span style={{ fontWeight: "600", color: "#4a5568", fontSize: "15px" }}>Sinh viên thực hiện:</span><div style={{ marginTop: "6px", padding: "12px", backgroundColor: "#f7fafc", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: "14.5px" }}><span>1. <b>Huỳnh Tấn Hiếu</b></span><span style={{ color: "#718096", fontFamily: "monospace" }}>N23DCCN025</span></div><div style={{ display: "flex", justifyContent: "space-between", fontSize: "14.5px", borderTop: "1px solid #edf2f7", paddingTop: "8px" }}><span>2. <b>Nguyễn Văn Khởi</b></span><span style={{ color: "#718096", fontFamily: "monospace" }}>N23DCCN032</span></div></div></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "15px", padding: "0 4px" }}><span style={{ fontWeight: "600", color: "#4a5568" }}>Lớp:</span><span style={{ backgroundColor: "#e2e8f0", padding: "4px 10px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", color: "#4a5568" }}>D23CQCN01-N</span></div>
            <button onClick={() => setIsInfoModalOpen(false)} style={{ width: "100%", padding: "11px", backgroundColor: "#3182ce", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "24px", fontWeight: "600", fontSize: "15px" }}>Xác nhận Đóng</button>
          </div>
        </div>
      )}

      {/* POPUP 2: LIÊN HỆ */}
      {isContactModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, backdropFilter: "blur(5px)" }}>
          <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "16px", width: "460px", boxShadow: "0 20px 40px rgba(0,0,0,0.25)", position: "relative", fontFamily: '"Segoe UI", Roboto, sans-serif', color: "#2d3748" }}>
            <button onClick={() => setIsContactModalOpen(false)} style={{ position: "absolute", top: "15px", right: "18px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#a0aec0" }}>✕</button>
            <h3 style={{ margin: "0 0 16px 0", color: "#38a169", textAlign: "center", fontSize: "20px", fontWeight: "700", borderBottom: "2px solid #f0fff4", paddingBottom: "12px" }}>📞 ĐỘI NGŨ PHÁT TRIỂN</h3>
            <p style={{ fontSize: "14px", color: "#718096", textAlign: "center", marginBottom: "20px", lineHeight: "1.5" }}>Mọi thắc mắc hoặc yêu cầu hỗ trợ kỹ thuật về hệ thống <b>TechShop</b>, vui lòng liên hệ qua email quản trị viên:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}><div style={{ padding: "12px", backgroundColor: "#f7fafc", borderRadius: "8px", borderLeft: "4px solid #48bb78" }}><div style={{ fontWeight: "600", color: "#2d3748" }}>Huỳnh Tấn Hiếu</div><div style={{ fontSize: "13.5px", color: "#4a5568", marginTop: "4px", fontFamily: "monospace" }}>✉️ n23dccn025@student.ptithcm.edu.vn</div></div><div style={{ padding: "12px", backgroundColor: "#f7fafc", borderRadius: "8px", borderLeft: "4px solid #48bb78" }}><div style={{ fontWeight: "600", color: "#2d3748" }}>Nguyễn Văn Khởi</div><div style={{ fontSize: "13.5px", color: "#4a5568", marginTop: "4px", fontFamily: "monospace" }}>✉️ n23dccn032@student.ptithcm.edu.vn</div></div></div>
            <button onClick={() => setIsContactModalOpen(false)} style={{ width: "100%", padding: "11px", backgroundColor: "#38a169", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "24px", fontWeight: "600", fontSize: "15px" }}>Đóng cửa sổ</button>
          </div>
        </div>
      )}

      {/* KẾT NỐI VỚI 2 MODAL ĐÃ TÁCH FILE */}
      <UpdateProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentUser={currentUser} 
        token={token} 
      />

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        token={token} 
      />
    </nav>
  );
}