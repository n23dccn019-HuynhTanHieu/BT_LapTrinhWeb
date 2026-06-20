import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../../services/productService";
import api from "../../../services/api"; // Import instance api để gọi upload file
import { ArrowLeft, Save, ShoppingBag, Upload, ImageIcon } from "lucide-react";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Trạng thái đợi upload ảnh
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
      const res = await fetch("http://localhost:8080/api/categories");
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

  // ============================================================================
  // 🛠️ HÀM XỬ LÝ UPLOAD ẢNH VẬT LÝ LÊN SERVER CỦA HIẾU
  // ============================================================================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const dataForm = new FormData();
    dataForm.append("file", file); // Tên "file" trùng với IFormFile file bên C#

    try {
      setIsUploading(true);
      // Gọi trực tiếp đến API Upload của Hiếu
      const res = await api.post("/Upload", dataForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Nhận link ảnh tuyệt đối từ Backend trả về (Ví dụ: http://localhost:5016/Uploads/xxx.png)
      const backendImageUrl = res.data.imageUrl;

      // Cập nhật link này thẳng vào ô dữ liệu thumbnail của form
      setFormData((prev) => ({
        ...prev,
        thumbnail: backendImageUrl,
      }));

      alert("Tải hình ảnh lên máy chủ thành công!");
    } catch (err) {
      console.error("Lỗi khi tải ảnh lên:", err);
      alert("Tải ảnh thất bại! Hãy kiểm tra xem Hiếu đã cập nhật file Program.cs chưa.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const payload = {
        ProductName: formData.productName,
        CategoryID: Number(formData.categoryID),
        Price: Number(formData.price),
        PromoPrice: formData.promoPrice ? Number(formData.promoPrice) : null,
        Thumbnail: formData.thumbnail, // Link ảnh vật lý đã được lưu ở đây
        Description: formData.description,
        StockQuantity: Number(formData.stockQuantity),
        IsActive: formData.isActive,
      };

      if (isEditMode) {
        await productService.update(id, payload, token);
        alert("Cập nhật thành công");
      } else {
        await productService.create({ ...payload, IsActive: true }, token);
        alert("Thêm sản phẩm thành công");
      }
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', WebkitFontSmoothing: 'subpixel-antialiased', MozOsxFontSmoothing: 'auto' }}>
      
      {/* Header Panel */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '2px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '900', margin: 0, color: '#000000' }}>
            <ShoppingBag style={{ color: '#2563eb' }} size={24} strokeWidth={3} />
            {isEditMode ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </h2>
          <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', marginTop: '6px' }}>
            Điền đầy đủ thông tin để lưu trữ vào cơ sở dữ liệu hệ thống.
          </p>
        </div>
      </div>

      {/* Form Body Container */}
      <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '2px solid #cbd5e1', boxShadow: 'var(--shadow)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tên sản phẩm */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'block', fontWeight: '800', color: '#000000', marginBottom: '8px', fontSize: '14px' }}>Tên sản phẩm *</label>
            <input
              type="text"
              placeholder="Nhập tên sản phẩm..."
              style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #cbd5e1', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', color: '#000000', fontSize: '15px', outline: 'none', background: '#ffffff' }}
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
            />
          </div>

          {/* Danh mục sản phẩm */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'block', fontWeight: '800', color: '#000000', marginBottom: '8px', fontSize: '14px' }}>Danh mục sản phẩm *</label>
            <select
              style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #cbd5e1', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', color: '#000000', fontSize: '15px', background: '#ffffff', outline: 'none' }}
              value={formData.categoryID}
              onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
              required
            >
              <option value="" style={{ background: '#ffffff' }}>-- Chọn danh mục liên kết --</option>
              {categories.map((c) => (
                <option key={c.categoryID} value={c.categoryID} style={{ background: '#ffffff' }}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Hàng chứa Giá và Giá KM */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', fontWeight: '800', color: '#000000', marginBottom: '8px', fontSize: '14px' }}>Giá gốc (đ) *</label>
              <input
                type="number"
                placeholder="Ví dụ: 150000"
                style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #cbd5e1', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', color: '#000000', fontSize: '15px', outline: 'none', background: '#ffffff' }}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', fontWeight: '800', color: '#000000', marginBottom: '8px', fontSize: '14px' }}>Giá khuyến mãi (đ)</label>
              <input
                type="number"
                placeholder="Để trống nếu không có"
                style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #cbd5e1', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', color: '#000000', fontSize: '15px', outline: 'none', background: '#ffffff' }}
                value={formData.promoPrice}
                onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Hàng chứa Số lượng */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', fontWeight: '800', color: '#000000', marginBottom: '8px', fontSize: '14px' }}>Số lượng tồn kho *</label>
              <input
                type="number"
                placeholder="0"
                style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #cbd5e1', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', color: '#000000', fontSize: '15px', outline: 'none', background: '#ffffff' }}
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
            </div>

            {/* Ô chọn tải ảnh lên hệ thống */}
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'block', fontWeight: '800', color: '#000000', marginBottom: '8px', fontSize: '14px' }}>Tải ảnh sản phẩm lên máy chủ</label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                width: '100%', 
                boxSizing: 'border-box', 
                border: '2px dashed #cbd5e1', 
                padding: '11px 16px', 
                borderRadius: '12px', 
                fontWeight: '700', 
                color: isUploading ? '#64748b' : '#2563eb', 
                fontSize: '14px', 
                background: '#f8fafc',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                textAlign: 'center'
              }}>
                <Upload size={16} strokeWidth={2.5} />
                {isUploading ? "Đang tải ảnh lên..." : "Bấm để chọn file ảnh"}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  disabled={isUploading} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
          </div>

          {/* Phần quản lý link ảnh sản phẩm (Hiển thị preview nếu có link) */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'block', fontWeight: '800', color: '#000000', marginBottom: '8px', fontSize: '14px' }}>Đường dẫn Thumbnail URL (Tự động điền sau khi chọn file)</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <input
                type="text"
                placeholder="https://example.com/image.jpg hoặc chọn file ở trên"
                style={{ flex: 1, boxSizing: 'border-box', border: '2px solid #cbd5e1', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', color: '#000000', fontSize: '15px', outline: 'none', background: '#f1f5f9' }}
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              />
              
              {/* Box hiển thị ảnh nhỏ (Preview) nếu ô nhập có link ảnh */}
              {formData.thumbnail && (
                <div style={{ width: '50px', height: '50px', border: '2px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={formData.thumbnail} 
                    alt="Product preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none'; // Ẩn ảnh nếu link lỗi
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mô tả chi tiết */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'block', fontWeight: '800', color: '#000000', marginBottom: '8px', fontSize: '14px' }}>Mô tả chi tiết sản phẩm</label>
            <textarea
              rows="4"
              placeholder="Nhập thông số, đặc điểm nổi bật..."
              style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #cbd5e1', padding: '14px 16px', borderRadius: '12px', fontWeight: '700', color: '#000000', fontSize: '15px', outline: 'none', resize: 'vertical', background: '#ffffff' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {isEditMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
              <input
                type="checkbox"
                id="isActive"
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="isActive" style={{ fontWeight: '800', color: '#000000', fontSize: '15px', cursor: 'pointer' }}>
                Kích hoạt hiển thị trên sàn kinh doanh
              </label>
            </div>
          )}

          {/* Thanh tác vụ chân Form */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '16px', borderTop: '2px solid #cbd5e1', paddingTop: '20px' }}>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              style={{ background: '#e2e8f0', border: '2px solid #cbd5e1', padding: '12px 24px', borderRadius: '12px', fontWeight: '900', color: '#000000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
            >
              <ArrowLeft size={16} strokeWidth={2.5} /> Quay lại
            </button>
            <button
              type="submit"
              className="btn-auth-submit"
              style={{ width: 'auto', margin: 0, padding: '12px 28px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
            >
              <Save size={16} strokeWidth={2.5} /> {isEditMode ? "Cập nhật dữ liệu" : "Lưu sản phẩm"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductForm;