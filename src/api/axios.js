import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
console.log(
  "🔥 VITE API:",
  import.meta.env.VITE_API_BASE_URL
);
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cv_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

export default API;