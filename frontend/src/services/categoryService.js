import axios from 'axios';

const API_URL =
  'http://localhost:5016/api/categories';

const getAuthHeader = () => {
  const token =
    localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET ALL
export const getCategories = () =>
  axios.get(API_URL);

// GET BY ID
export const getCategoryById = (id) =>
  axios.get(`${API_URL}/${id}`);

// POST
export const createCategory = (data) =>
  axios.post(
    API_URL,
    data,
    getAuthHeader()
  );

// PUT
export const updateCategory = (
  id,
  data
) =>
  axios.put(
    `${API_URL}/${id}`,
    data,
    getAuthHeader()
  );

// DELETE
export const deleteCategory = (id) =>
  axios.delete(
    `${API_URL}/${id}`,
    getAuthHeader()
  );