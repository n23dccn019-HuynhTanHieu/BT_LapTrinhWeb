import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";

import ProductListCustomer from "./pages/customer/ProductList";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import OrderHistory from "./pages/customer/OrderHistory";

import Dashboard from "./pages/admin/dashboard/Dashboard";
import CategoryList from "./pages/admin/categories/CategoryList";
import ProductListAdmin from "./pages/admin/products/ProductList";
import ProductForm from "./pages/admin/products/ProductForm";
import OrderList from "./pages/admin/orders/OrderList";
import CustomerList from "./pages/admin/users/CustomerList";
import AdminList from "./pages/admin/users/AdminList";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  const isAdmin = currentUser?.role === "Admin";

  return (
    <Routes>
      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN (MÔ HÌNH NESTED ROUTES CHUẨN ĐÉTT) ================= */}
      <Route
        path="/admin"
        element={isAdmin ? <AdminLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="products" element={<ProductListAdmin />} />
        <Route path="products/add" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="accounts" element={<AdminList />} />
      </Route>

      {/* ================= CUSTOMER ================= */}
      <Route
        path="/"
        element={
          <>
            <Navbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <ProductListCustomer
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
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
              setSelectedCategory={setSelectedCategory}
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
              setSelectedCategory={setSelectedCategory}
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
              setSelectedCategory={setSelectedCategory}
            />
            <Checkout />
          </>
        }
      />

      <Route
        path="/order-history"
        element={
          <>
            <Navbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <OrderHistory />
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
              textAlign: "center",
              padding: "100px 0",
            }}
          >
            <h2>404 - Không tìm thấy trang</h2>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
