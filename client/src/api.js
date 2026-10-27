import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // Render's free tier can take ~50s to wake up
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired/invalid token on a protected call: clear the session and send the user to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthCall = ['/auth/login', '/auth/register', '/auth/me'].some((p) => url.includes(p));
    if (error.response?.status === 401 && !isAuthCall && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default api;