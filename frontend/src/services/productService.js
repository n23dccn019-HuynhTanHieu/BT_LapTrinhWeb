import axios from "axios";

const API_URL = "http://localhost:8080/api/product";
// đổi port theo backend của bạn

const productService = {
  getAll: (params) =>
    axios.get(API_URL, { params }),

  getById: (id) =>
    axios.get(`${API_URL}/${id}`),

  create: (data, token) =>
    axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),

  update: (id, data, token) =>
    axios.put(`${API_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),

  delete: (id, token) =>
    axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export default productService;