import api from "./api";

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Login failed";
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Registration failed";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data.user;
    } catch (error) {
      throw error.response?.data?.error || "Failed to get user";
    }
  },

  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      const updatedUser = response.data.user;

      // Update stored user data
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserData = { ...storedUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUserData));

      return updatedUser;
    } catch (error) {
      throw error.response?.data?.error || "Failed to update profile";
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
