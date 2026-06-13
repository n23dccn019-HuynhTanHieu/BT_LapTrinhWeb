import axios from "axios";

const API_URL = "http://localhost:5016/api/user";

const userService = {
  // ==========================================
  // CHỨC NĂNG DÀNH CHO USER TỰ QUẢN LÝ
  // ==========================================
  
  // 1. Lấy thông tin cá nhân (Cần truyền ID vào URL theo: profile/{id})
  getProfile: (id, token) => 
    axios.get(`${API_URL}/profile/${id}`, { 
      headers: { Authorization: `Bearer ${token}` }
    }),

  // 2. Tự cập nhật thông tin cá nhân (KHÔNG truyền ID vào URL theo: profile)
  updateProfile: (data, token) =>
    axios.put(`${API_URL}/profile`, data, { 
      headers: { Authorization: `Bearer ${token}` }
    }),

  // 3. Tự đổi mật khẩu của chính mình
  changePassword: (passwordData, token) =>
    axios.put(`${API_URL}/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  // ==========================================
  // CÁC CHỨC NĂNG ADMIN QUẢN LÝ
  // ==========================================
  getAll: (keyword = "", page = 1, pageSize = 10, token) =>
    axios.get(API_URL, {
      params: { keyword, page, pageSize },
      headers: { Authorization: `Bearer ${token}` },
    }),

  getAdmins: (token) =>
    axios.get(`${API_URL}/admins`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createAdmin: (data, token) =>
    axios.post(`${API_URL}/admins`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateAdmin: (id, data, token) =>
    axios.put(`${API_URL}/admins/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  changeAdminPassword: (id, passwordData, token) =>
    axios.put(`${API_URL}/admins/${id}/password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteAdmin: (id, token) =>
    axios.delete(`${API_URL}/admins/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default userService;