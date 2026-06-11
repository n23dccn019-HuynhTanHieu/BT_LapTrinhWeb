import axios from "axios";

const API_URL = "http://localhost:5016/api/dashboard";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const dashboardService = {
  getOverview: () =>
    axios.get(
      `${API_URL}/overview`,
      getAuthHeader()
    ),

  getRevenueByDay: () =>
    axios.get(
      `${API_URL}/revenue-by-day`,
      getAuthHeader()
    ),

  getRevenueByMonth: () =>
    axios.get(
      `${API_URL}/revenue-by-month`,
      getAuthHeader()
    ),
};

export default dashboardService;