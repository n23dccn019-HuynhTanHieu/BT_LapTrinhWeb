import api from "./api"; // Đường dẫn đến file api.js (axios instance) của ông

const uploadService = {
  uploadImage: (fileObject) => {
    // Tạo đối tượng FormData để đóng gói file vật lý
    const formData = new FormData();
    
    // "file" này bắt buộc phải khớp với tham số IFormFile file ở C# Backend
    formData.append("file", fileObject); 

    return api.post("/Upload", formData, {
      headers: {
        // Ép Axios gửi dữ liệu dạng form-data thay vì JSON mặc định
        "Content-Type": "multipart/form-data", 
      },
    });
  },
};

export default uploadService;