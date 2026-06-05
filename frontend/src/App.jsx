import React, { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Layout
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';

// Customer
import ProductListCustomer from './pages/customer/ProductList';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';

// Admin
import Dashboard from './pages/admin/Dashboard';
import CategoryList from './pages/admin/categories/CategoryList';
import ProductListAdmin from './pages/admin/products/ProductList';
import ProductForm from './pages/admin/products/ProductForm';
import OrderList from './pages/admin/orders/OrderList';
import CustomerList from './pages/admin/users/CustomerList';
import AdminList from './pages/admin/users/AdminList';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const currentUser = JSON.parse(
    localStorage.getItem('currentUser')
  );

  // Check admin
  const isAdmin =
    currentUser?.role === 'Admin';

  return (
    <Routes>

      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          isAdmin ? (
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/categories"
        element={
          isAdmin ? (
            <AdminLayout>
              <CategoryList />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/products"
        element={
          isAdmin ? (
            <AdminLayout>
              <ProductListAdmin />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/products/add"
        element={
          isAdmin ? (
            <AdminLayout>
              <ProductForm />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/products/edit/:id"
        element={
          isAdmin ? (
            <AdminLayout>
              <ProductForm />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/orders"
        element={
          isAdmin ? (
            <AdminLayout>
              <OrderList />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/customers"
        element={
          isAdmin ? (
            <AdminLayout>
              <CustomerList />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/accounts"
        element={
          isAdmin ? (
            <AdminLayout>
              <AdminList />
            </AdminLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* ================= CUSTOMER ================= */}

      <Route
        path="/"
        element={
          <>
            <Navbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={
                setSelectedCategory
              }
            />

            <ProductListCustomer
              searchTerm={searchTerm}
              selectedCategory={
                selectedCategory
              }
            />
          </>
        }
      />

      <Route
        path="/product/:id"
        element={
          <>
            <Navbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={
                setSelectedCategory
              }
            />

            <ProductDetail />
          </>
        }
      />

      <Route
        path="/cart"
        element={
          <>
            <Navbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={
                setSelectedCategory
              }
            />

            <Cart />
          </>
        }
      />

      <Route
        path="/checkout"
        element={
          <>
            <Navbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={
                setSelectedCategory
              }
            />

            <Checkout />
          </>
        }
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div
            className="list-container"
            style={{
              textAlign: 'center',
              padding: '100px 0',
            }}
          >
            <h2>
              404 - Không tìm thấy trang
            </h2>
          </div>
        }
      />
    </Routes>
  );
}

export default App;