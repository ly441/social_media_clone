import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5173/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Post API
export const postAPI = {
  getAll: (page = 1) => api.get(`/posts?page=${page}`),
  getById: (id) => api.get(`/posts/${id}`),
  create: (postData) => api.post("/posts", postData),
  update: (id, postData) => api.put(`/posts/${id}`, postData),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.post(`/posts/${id}/like`),
};

// User API
export const userAPI = {
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  getPosts: (id, page = 1) => api.get(`/users/${id}/posts?page=${page}`),
  search: (query) => api.get(`/users?q=${query}`),
};

// Comment API
export const commentAPI = {
  getByPost: (postId, page = 1) =>
    api.get(`/comments/post/${postId}?page=${page}`),
  create: (postId, content) =>
    api.post(`/comments/post/${postId}`, { content }),
  update: (id, content) => api.put(`/comments/${id}`, { content }),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Follow API
export const followAPI = {
  follow: (userId) => api.post(`/follow/user/${userId}`),
  getFollowers: (userId, page = 1) =>
    api.get(`/follow/${userId}/followers?page=${page}`),
  getFollowing: (userId, page = 1) =>
    api.get(`/follow/${userId}/following?page=${page}`),
};

export default api;
