import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu có id trên URL => Trang Sửa, ngược lại => Trang Thêm
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    promoPrice: '',
    description: '',
    image: null
  });

  useEffect(() => {
    if (isEditMode) {
      // Giả lập lấy thông tin sản phẩm cũ từ hệ thống đổ vào Form khi bấm Sửa
      setFormData({
        name: 'iPhone 15 Pro Max 256GB',
        category: 'Điện thoại',
        price: '34990000',
        promoPrice: '31990000',
        description: 'Mô tả cấu hình chi tiết của iPhone 15 Pro Max...',
        image: null
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isEditMode ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!');
    navigate('/admin/products');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
        {isEditMode ? '📝 Cập Nhật Thông Tin Sản Phẩm' : '🚀 Thêm Sản Phẩm Mới'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
          <input
            type="text"
            required
            className="w-full border p-2.5 rounded-lg focus:outline-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
            <select
              required
              className="w-full border p-2.5 rounded-lg focus:outline-indigo-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Chọn danh mục</option>
              <option value="Điện thoại">Điện thoại</option>
              <option value="Laptop">Laptop</option>
              <option value="Phụ kiện">Phụ kiện</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán gốc (đ) *</label>
            <input
              type="number"
              required
              className="w-full border p-2.5 rounded-lg focus:outline-indigo-500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá khuyến mãi (đ)</label>
            <input
              type="number"
              className="w-full border p-2.5 rounded-lg focus:outline-indigo-500"
              value={formData.promoPrice}
              onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
          <textarea
            rows="4"
            className="w-full border p-2.5 rounded-lg focus:outline-indigo-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium text-sm"
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-sm"
          >
            {isEditMode ? 'Lưu cập nhật' : 'Đăng sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;