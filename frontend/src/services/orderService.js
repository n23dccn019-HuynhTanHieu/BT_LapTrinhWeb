import api from "./api"; // Import instance 'api' thay vì 'axios' gốc

const orderService = {
  // 1. Xem lịch sử mua hàng của Customer (Tự động đính kèm token)
  getCustomerHistory: () => api.get("/order/customer-history"),
    
  // 2. Tạo đơn hàng mới (Nếu có token trong sessionStorage thì tự gắn, không có vẫn chạy dạng khách vãng lai)
  create: (orderData) => api.post("/order", orderData),

  // 3. Admin lấy toàn bộ đơn hàng (Có phân trang và lọc trạng thái)
  getAll: (status, page = 1, pageSize = 50) =>
    api.get("/order", {
      params: { status, page, pageSize }
    }),

  // 4. Xem chi tiết một đơn hàng theo ID
  getById: (id) => api.get(`/order/${id}`),

  // 5. Admin cập nhật trạng thái đơn hàng (Dùng Query String như Backend yêu cầu)
  updateStatus: (id, status) => 
    api.put(`/order/${id}/status`, {}, {
      params: { status } // Chuyển thành params cho chuẩn cấu trúc Axios
    }),

  // 6. Khách hàng hoặc Admin hủy đơn hàng
  cancelOrder: (id) => api.put(`/order/${id}/cancel`)
};

export default orderService;