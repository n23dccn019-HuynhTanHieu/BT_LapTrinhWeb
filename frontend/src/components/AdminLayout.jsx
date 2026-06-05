import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
  FiKey,
  FiHome,
} from 'react-icons/fi';

const adminMenuItems = [
  { label: 'Thống kê doanh thu', icon: <FiPieChart />, path: '/admin' },
  { label: 'Quản lý danh mục', icon: <FiFolder />, path: '/admin/categories' },
  { label: 'Quản lý sản phẩm', icon: <FiBox />, path: '/admin/products' },
  { label: 'Quản lý đơn hàng', icon: <FiShoppingCart />, path: '/admin/orders' },
  { label: 'Danh sách khách hàng', icon: <FiUsers />, path: '/admin/customers' },
  { label: 'Tài khoản quản trị', icon: <FiKey />, path: '/admin/accounts' },
];

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const currentUser = useMemo(() => {
    const rawUser = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (!rawUser) {
      return { fullName: 'Admin King', username: 'admin' };
    }
    try {
      const user = JSON.parse(rawUser);
      return {
        fullName: user.fullName || user.name || 'Admin King',
        username: user.username || user.email || 'admin',
      };
    } catch {
      return { fullName: 'Admin King', username: 'admin' };
    }
  }, []);

  const getAvatarText = (fullName) => {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (keyword) => {
    if (!keyword.trim()) return;
    navigate(`/admin/products?search=${encodeURIComponent(keyword.trim())}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="admin-layout-container">
      
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-logo-zone">
          <h1 className="admin-logo-text">
            <span className="brand-blue">TechShop</span>
            <span className="brand-dark">.admin</span>
          </h1>
        </Link>

        <nav className="admin-nav-menu">
          <p className="admin-menu-heading">Menu quản trị viên</p>
          <div className="admin-nav-links">
            {adminMenuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? 'item-active' : ''}`
                }
              >
                <span className="admin-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      {/* KHỐI NỘI DUNG BÊN PHẢI */}
      <div className="admin-main-content">
        
        {/* HEADER PHÍA TRÊN */}
        <header className="admin-header">
          <div className="admin-search-wrapper">
            <FiSearch className="icon-search-left" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, đơn hàng..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(e.currentTarget.value);
              }}
              className="admin-header-search"
            />
          </div>

          <div className="admin-header-right">
            <button type="button" onClick={() => navigate('/admin')} className="btn-bell-notify" title="Thông báo">
              <FiBell />
            </button>

            <div className="admin-divider" />

            {/* AVATAR DROPDOWN */}
            <div className="admin-user-profile" ref={userMenuRef}>
              <button type="button" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="admin-avatar-btn">
                <div className="admin-user-info">
                  <p className="user-name-txt">{currentUser.fullName}</p>
                  <p className="user-role-txt">{currentUser.username}</p>
                </div>
                <div className="user-avatar-circle">
                  {getAvatarText(currentUser.fullName)}
                </div>
                <span className={`arrow-down-icon ${isUserMenuOpen ? 'arrow-rotate' : ''}`}>▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="admin-dropdown-menu">
                  <div className="dropdown-padding">

                    <div className="dropdown-info-row">
                      <FiUserCheck />
                      <p>
                        Họ tên: <b>{currentUser.fullName}</b>
                      </p>
                    </div>

                    <div className="dropdown-info-row">
                      <FiCreditCard />
                      <p>
                        Tài khoản: <b>{currentUser.username}</b>
                      </p>
                    </div>

                    <div className="dropdown-divider-line" />

                    <button
                      type="button"
                      onClick={() => {
                        navigate('/');
                        setIsUserMenuOpen(false);
                      }}
                      className="dropdown-action-btn"
                    >
                      <FiHome />
                      <span>Trang web bán hàng</span>
                    </button>

                    <div className="dropdown-divider-line" />

                    <button
                      type="button"
                      onClick={() => alert('Đang phát triển...')}
                      className="dropdown-action-btn"
                    >
                      <FiUser />
                      <span>Thông tin cá nhân</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert('Đang phát triển...')}
                      className="dropdown-action-btn"
                    >
                      <FiLock />
                      <span>Đổi mật khẩu</span>
                    </button>

                    <div className="dropdown-divider-line" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-action-btn text-danger"
                    >
                      <FiLogOut />
                      <b>Đăng xuất</b>
                    </button>

                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* TRANG CON CHẠY Ở ĐÂY */}
        <main className="admin-page-body">{children}</main>
      </div>

    </div>
  );
};

export default AdminLayout;