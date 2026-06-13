import axios from "axios";

const API_URL = "http://localhost:5016/api/order";

const orderService = {

  getCustomerHistory: (token) =>
    axios.get(`${API_URL}/customer-history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
    
  // 🚀 CẬP NHẬT HÀM NÀY: Linh hoạt xử lý khi có hoặc không có Token
  create: (orderData, token) => {
    const config = {};
    
    // Nếu có token (User đã đăng nhập) thì mới thêm Header Authorization
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }
    
    return axios.post(API_URL, orderData, config);
  },

  getAll: (status, page = 1, pageSize = 10, token) =>
    axios.get(API_URL, {
      params: { status, page, pageSize },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),

  getById: (id, token) =>
    axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),

  updateStatus: (id, status, token) =>
    axios.put(
      `${API_URL}/${id}/status?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ),

  cancelOrder: (id, token) =>
    axios.put(
      `${API_URL}/${id}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
};

export default orderService;