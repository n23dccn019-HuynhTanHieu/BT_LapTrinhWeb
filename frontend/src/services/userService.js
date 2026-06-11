// src/services/userService.js

import axios from "axios";

const API_URL = "http://localhost:5016/api/user";

const userService = {
  getAll: (keyword = "", page = 1, pageSize = 10, token) =>
    axios.get(API_URL, {
      params: {
        keyword,
        page,
        pageSize
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};

export default userService;