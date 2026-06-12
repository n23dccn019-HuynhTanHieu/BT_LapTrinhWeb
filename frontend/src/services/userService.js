import axios from "axios";

const API_URL = "http://localhost:5016/api/user";

const userService = {
  // Customer
  getAll: (keyword = "", page = 1, pageSize = 10, token) =>
    axios.get(API_URL, {
      params: { keyword, page, pageSize },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Admin
  getAdmins: (token) =>
    axios.get(`${API_URL}/admins`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  createAdmin: (data, token) =>
    axios.post(`${API_URL}/admins`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  updateAdmin: (id, data, token) =>
    axios.put(`${API_URL}/admins/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  changeAdminPassword: (id, passwordData, token) =>
    axios.put(
      `${API_URL}/admins/${id}/password`,
      passwordData, // Truyền trực tiếp Object này lên Body của Request
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  deleteAdmin: (id, token) =>
    axios.delete(`${API_URL}/admins/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default userService;