import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    username,
    password
  });
  if (response.data.access_token) {
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('username', response.data.username);
    localStorage.removeItem('guest_mode');
  }
  return response.data;
};

export const registerUser = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    password
  });
  return response.data;
};

export const loginAsGuest = () => {
    localStorage.setItem('guest_mode', 'true');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('username');
  localStorage.removeItem('guest_mode');
  window.location.href = '/login';
};

export const getToken = () => localStorage.getItem('auth_token');
export const isGuest = () => localStorage.getItem('guest_mode') === 'true';
export const isAuthenticated = () => !!getToken() || isGuest();
export const getUsername = () => localStorage.getItem('username');

export const fetchHistory = async () => {
    if (isGuest()) return [];
    try {
        const response = await axios.get(`${API_BASE_URL}/user/history`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data;
    } catch (e) {
        console.error("Failed to fetch history", e);
        return [];
    }
};
