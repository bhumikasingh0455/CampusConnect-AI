import axios from 'axios';
import { getDemoResponse } from './demoData';

const defaultAdapter = axios.getAdapter(['xhr', 'http', 'fetch']);

// Instant Demo & Network Hybrid Adapter
// Eliminates all 8-second Render timeout lag by serving Live Demo data instantaneously (<1ms)
// while allowing real authenticated users and login requests to hit the live backend API.
const instantDemoAdapter = async (config) => {
  const isRealUser = localStorage.getItem('isRealUser') === 'true';
  const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

  // If user signed in with real credentials or is attempting authentication, use real network
  if (isRealUser || isAuthRequest) {
    try {
      return await defaultAdapter(config);
    } catch (error) {
      // Allow invalid password / bad request errors to propagate to the login UI
      if (isAuthRequest && error.response && (error.response.status === 400 || error.response.status === 401)) {
        throw error;
      }

      // If backend is asleep (Render free tier cold start) or network times out, fallback seamlessly
      console.warn('Backend server offline or timed out. Serving local fallback for:', config.url);
      const demoResult = getDemoResponse(config.url || '', config.method || 'get');
      return {
        data: demoResult,
        status: 200,
        statusText: 'OK (Demo Fallback)',
        headers: {},
        config
      };
    }
  }

  // Live Demo Mode (Default): Zero network wait time, 60fps instant UI response
  const demoResult = getDemoResponse(config.url || '', config.method || 'get');
  return {
    data: demoResult,
    status: 200,
    statusText: 'OK (Instant Demo)',
    headers: {},
    config
  };
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
  adapter: instantDemoAdapter
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

export default api;
