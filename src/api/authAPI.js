import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance dengan config default
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambahkan interceptor untuk request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor untuk response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Login
  login: async (username, password) => {
    try {
      const response = await api.post('/login', {
        username,
        password
      });
      
      // Simpan token dan user data ke localStorage
      if (response.data) {
        localStorage.setItem('authToken', response.data.token || 'dummy-token');
        localStorage.setItem('userData', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // Get active users (jika diperlukan)
  getActiveUsers: async () => {
    try {
      const response = await api.get('/pengguna/aktif');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch active users');
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default api;