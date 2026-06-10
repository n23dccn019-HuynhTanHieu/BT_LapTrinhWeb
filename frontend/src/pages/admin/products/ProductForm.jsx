import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../../services/productService";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    categoryID: "",
    price: "",
    promoPrice: "",
    thumbnail: "",
    description: "",
    stockQuantity: 0,
    isActive: true,
  });

  useEffect(() => {
    loadCategories();

    if (isEditMode) {
      loadProduct();
    }
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:5016/api/categories"
      );

      const data = await res.json();

      setCategories(data.data || data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProduct = async () => {
    try {
      const res = await productService.getById(id);

      const product = res.data;

      setFormData({
        productName: product.productName,
        categoryID: product.categoryID,
        price: product.price,
        promoPrice: product.promoPrice || "",
        thumbnail: product.thumbnail || "",
        description: product.description || "",
        stockQuantity: product.stockQuantity,
        isActive: product.isActive,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      if (isEditMode) {
        await productService.update(
          id,
          {
            ProductName: formData.productName,
            CategoryID: Number(formData.categoryID),
            Price: Number(formData.price),
            PromoPrice: formData.promoPrice
              ? Number(formData.promoPrice)
              : null,
            Thumbnail: formData.thumbnail,
            Description: formData.description,
            StockQuantity: Number(formData.stockQuantity),
            IsActive: formData.isActive,
          },
          token
        );

        alert("Cập nhật thành công");
      } else {
        await productService.create(
          {
            ProductName: formData.productName,
            CategoryID: Number(formData.categoryID),
            Price: Number(formData.price),
            PromoPrice: formData.promoPrice
              ? Number(formData.promoPrice)
              : null,
            Thumbnail: formData.thumbnail,
            Description: formData.description,
            StockQuantity: Number(formData.stockQuantity),
            IsActive: true,
          },
          token
        );

        alert("Thêm sản phẩm thành công");
      }

      navigate("/admin/products");
    } catch (err) {
      console.log(err);

      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">
        {isEditMode
          ? "Cập Nhật Sản Phẩm"
          : "Thêm Sản Phẩm"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Tên sản phẩm"
          className="w-full border p-3 rounded"
          value={formData.productName}
          onChange={(e) =>
            setFormData({
              ...formData,
              productName: e.target.value,
            })
          }
          required
        />

        <select
          className="w-full border p-3 rounded"
          value={formData.categoryID}
          onChange={(e) =>
            setFormData({
              ...formData,
              categoryID: e.target.value,
            })
          }
          required
        >
          <option value="">
            Chọn danh mục
          </option>

          {categories.map((c) => (
            <option
              key={c.categoryID}
              value={c.categoryID}
            >
              {c.categoryName}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Giá"
          className="w-full border p-3 rounded"
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Giá khuyến mãi"
          className="w-full border p-3 rounded"
          value={formData.promoPrice}
          onChange={(e) =>
            setFormData({
              ...formData,
              promoPrice: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Thumbnail URL"
          className="w-full border p-3 rounded"
          value={formData.thumbnail}
          onChange={(e) =>
            setFormData({
              ...formData,
              thumbnail: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Số lượng tồn kho"
          className="w-full border p-3 rounded"
          value={formData.stockQuantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              stockQuantity: e.target.value,
            })
          }
        />

        <textarea
          rows="4"
          placeholder="Mô tả"
          className="w-full border p-3 rounded"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="px-4 py-2 border rounded"
          >
            Quay lại
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {isEditMode
              ? "Cập nhật"
              : "Thêm sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;