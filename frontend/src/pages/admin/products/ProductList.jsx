import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5016/api/product";

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          keyword: search,
          categoryId: categoryFilter || null,
          sortBy: sortOrder,
          page: currentPage,
          pageSize: itemsPerPage,
        },
      });

      setProducts(response.data.data);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, sortOrder, currentPage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">
          Quản Lý Sản Phẩm
        </h2>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white p-4 rounded border grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Category ID"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Mặc định</option>
          <option value="price_asc">
            Giá tăng dần
          </option>
          <option value="price_desc">
            Giá giảm dần
          </option>
          <option value="name_asc">
            Tên A-Z
          </option>
          <option value="name_desc">
            Tên Z-A
          </option>
        </select>
      </div>

      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Ảnh</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Giá</th>
              <th className="p-3">KM</th>
              <th className="p-3">Kho</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => (
              <tr
                key={item.productID}
                className="border-t"
              >
                <td className="p-3">
                  <img
                    src={item.thumbnail}
                    alt={item.productName}
                    className="w-14 h-14 object-cover"
                  />
                </td>

                <td className="p-3">
                  {item.productName}
                </td>

                <td className="p-3">
                  {item.category?.categoryName}
                </td>

                <td className="p-3">
                  {Number(item.price).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </td>

                <td className="p-3 text-red-600">
                  {item.promoPrice
                    ? Number(
                        item.promoPrice
                      ).toLocaleString("vi-VN") + "đ"
                    : "---"}
                </td>

                <td className="p-3">
                  {item.stockQuantity}
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/products/edit/${item.productID}`
                      )
                    }
                    className="text-blue-600 mr-3"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item.productID)
                    }
                    className="text-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center p-5"
                >
                  Không có sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;