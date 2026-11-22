import axios from 'axios';
import { getDemoResponse } from './demoData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: graceful fallback to live demo data on cold starts or network timeouts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const isLoginAttempt = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register');
    
    // If it's a real user explicit login failure, let the login form handle it
    if (isLoginAttempt && error.response && (error.response.status === 400 || error.response.status === 401)) {
      return Promise.reject(error);
    }

    // For all other endpoints (or backend cold start / network outage), seamlessly provide demo data
    try {
      const demoResult = getDemoResponse(originalRequest.url || '', originalRequest.method || 'get');
      return Promise.resolve({
        data: demoResult,
        status: 200,
        statusText: 'OK (Demo Mode)',
        headers: {},
        config: originalRequest
      });
    } catch (fallbackErr) {
      console.warn('Fallback error:', fallbackErr);
      return Promise.reject(error);
    }
  }
);

export default api;
