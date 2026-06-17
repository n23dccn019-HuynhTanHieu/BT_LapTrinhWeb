import React, { useState } from "react";
import uploadService from "../services/uploadService";

const ImageUpload = () => {
  const [preview, setPreview] = useState(null); // Link tạm dưới máy để hiển thị xem trước
  const [loading, setLoading] = useState(false); // Trạng thái đợi server xử lý
  const [imageUrl, setImageUrl] = useState(""); // Đường link thật do Backend trả về để lưu DB

  // Hàm xử lý khi người dùng chọn file từ máy tính
  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Lấy file đầu tiên được chọn
    if (!file) return;

    // 1. Tạo link xem trước tạm thời để tối ưu trải nghiệm (Chưa tải lên server)
    setPreview(URL.createObjectURL(file));

    // 2. Tiến hành tải file lên Server Backend
    try {
      setLoading(true);
      
      const response = await uploadService.uploadImage(file);
      
      // Backend trả về dạng: { imageUrl: "http://localhost:5016/Uploads/xxx.jpg" }
      setImageUrl(response.data.imageUrl);
      alert("Tải ảnh lên hệ thống thành công!");
    } catch (error) {
      console.error("Lỗi upload file:", error);
      alert("Không thể upload ảnh. Hãy check lại Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#ffffff", borderRadius: "16px", border: "2px solid #cbd5e1", maxWidth: "400px", fontFamily: 'sans-serif' }}>
      <h3 style={{ margin: "0 0 16px 0", fontWeight: "900", color: "#000000" }}>Chọn ảnh sản phẩm</h3>
      
      {/* Input chọn file ảnh */}
      <input 
        type="file" 
        accept="image/*" // Chỉ cho phép chọn file ảnh (.png, .jpg, .webp...)
        onChange={handleFileChange} 
        disabled={loading}
        style={{ display: "block", marginBottom: "16px" }}
      />

      {/* 1. Hiển thị ảnh xem trước (Preview) */}
      {preview && (
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Ảnh xem trước:</span>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginTop: "6px", border: "1px solid #cbd5e1" }} 
          />
        </div>
      )}

      {/* 2. Trạng thái Loading */}
      {loading && <p style={{ color: "#2563eb", fontWeight: "700", fontSize: "14px" }}>⏳ Đang đẩy ảnh lên server của Hiếu...</p>}

      {/* 3. Hiển thị kết quả khi Backend trả về thành công */}
      {imageUrl && (
        <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
          <span style={{ fontSize: "13px", fontWeight: "800", color: "#166534" }}>Thành công! Đường link lưu Database:</span>
          <p style={{ fontSize: "11px", color: "#1e293b", wordBreak: "break-all", margin: "6px 0 0 0", background: "#ffffff", padding: "6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
            {imageUrl}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;