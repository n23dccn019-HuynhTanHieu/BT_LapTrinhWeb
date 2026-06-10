import axios from "axios";

const API_URL = "http://localhost:5016/api/order";

const orderService = {
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