import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  FiUser,
  FiLock,
  FiLogOut,
  FiUserCheck,
  FiCreditCard,
} from 'react-icons/fi';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) {
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] =
    useState(false);

  const userMenuRef = useRef(null);

  const currentUser = useMemo(() => {
    const rawUser =
      localStorage.getItem('currentUser') ||
      localStorage.getItem('user');

    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getAvatarText = (fullName) => {
    if (!fullName) return 'U';

    const words = fullName.trim().split(/\s+/);

    if (words.length >= 2) {
      return `${words[0][0]}${
        words[words.length - 1][0]
      }`.toUpperCase();
    }

    return fullName.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar-container">

      {/* TOP NAVBAR */}
      <div className="navbar-top">

        {/* LOGO + SEARCH */}
        <div className="navbar-logo-search">

          <div className="navbar-logo">
            <Link
              to="/"
              className="logo-link"
            >
              TechShop 🛒
            </Link>
          </div>

          <div className="search-box-wrap">
            <input
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="nav-search-input"
            />
          </div>
        </div>

        {/* MENU */}
        <div className="navbar-menu">

          <Link
            to="/"
            className="menu-link"
          >
            Trang chủ
          </Link>

          <Link
            to="/cart"
            className="menu-link cart-link"
          >
            Giỏ hàng
            <span className="cart-badge">
              2
            </span>
          </Link>

          {/* CHƯA LOGIN */}
          {!currentUser && (
            <div
              className="admin-user-profile"
              ref={userMenuRef}
            >

              <button
                type="button"
                onClick={() =>
                  setIsUserMenuOpen(
                    !isUserMenuOpen
                  )
                }
                className="admin-avatar-btn"
              >
                <div className="admin-user-info">
                  <p className="user-name-txt">
                    Tài khoản
                  </p>

                  <p className="user-role-txt">
                    Khách
                  </p>
                </div>

                <div className="user-avatar-circle">
                  U
                </div>

                <span
                  className={`arrow-down-icon ${
                    isUserMenuOpen
                      ? 'arrow-rotate'
                      : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="admin-dropdown-menu">

                  <div className="dropdown-padding">

                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="dropdown-action-btn"
                    >
                      <FiUser />
                      <span>Đăng nhập</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="dropdown-action-btn"
                    >
                      <FiLock />
                      <span>Đăng ký</span>
                    </button>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ĐÃ LOGIN */}
          {currentUser && (
            <div
              className="admin-user-profile"
              ref={userMenuRef}
            >

              <button
                type="button"
                onClick={() =>
                  setIsUserMenuOpen(
                    !isUserMenuOpen
                  )
                }
                className="admin-avatar-btn"
              >

                <div className="admin-user-info">
                  <p className="user-name-txt">
                    {currentUser.fullName}
                  </p>

                  <p className="user-role-txt">
                    {currentUser.username}
                  </p>
                </div>

                <div className="user-avatar-circle">
                  {getAvatarText(
                    currentUser.fullName
                  )}
                </div>

                <span
                  className={`arrow-down-icon ${
                    isUserMenuOpen
                      ? 'arrow-rotate'
                      : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="admin-dropdown-menu">

                  <div className="dropdown-padding">

                    <div className="dropdown-info-row">
                      <FiUserCheck />

                      <p>
                        Họ tên:{' '}
                        <b>
                          {
                            currentUser.fullName
                          }
                        </b>
                      </p>
                    </div>

                    <div className="dropdown-info-row">
                      <FiCreditCard />

                      <p>
                        Tài khoản:{' '}
                        <b>
                          {
                            currentUser.username
                          }
                        </b>
                      </p>
                    </div>

                    <div className="dropdown-divider-line" />

                    {/* ADMIN */}
                    {currentUser.role ===
                      'Admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/admin');
                          setIsUserMenuOpen(
                            false
                          );
                        }}
                        className="dropdown-action-btn"
                      >
                        <FiUser />

                        <span>
                          Trang quản trị
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Đang phát triển...'
                        )
                      }
                      className="dropdown-action-btn"
                    >
                      <FiUser />

                      <span>
                        Thông tin cá nhân
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Đang phát triển...'
                        )
                      }
                      className="dropdown-action-btn"
                    >
                      <FiLock />

                      <span>
                        Đổi mật khẩu
                      </span>
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
          )}
        </div>
      </div>

      {/* CATEGORY */}
      <div className="navbar-categories">

        <button
          className={`category-tab ${
            selectedCategory === 'All'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setSelectedCategory('All')
          }
        >
          Tất cả danh mục
        </button>

        <button
          className={`category-tab ${
            selectedCategory === 'Mobile'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setSelectedCategory('Mobile')
          }
        >
          Điện thoại
        </button>

        <button
          className={`category-tab ${
            selectedCategory === 'Laptop'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setSelectedCategory('Laptop')
          }
        >
          Laptop
        </button>

        <button
          className={`category-tab ${
            selectedCategory === 'Accessory'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setSelectedCategory(
              'Accessory'
            )
          }
        >
          Phụ kiện
        </button>
      </div>
    </nav>
  );
}