import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on initial load
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          const fetchedUser = response.data.data.user;
          setUser(fetchedUser);
          localStorage.setItem('user', JSON.stringify(fetchedUser));
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data.data;
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        toast.success(`Welcome back, ${receivedUser.name}!`);
        return { success: true, user: receivedUser };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 
        (error.message?.includes('Network') ? 'Unable to reach backend server. Please verify API is running on port 5000.' : 'Login failed. Please check credentials.');
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data.data;
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        toast.success(`Registration successful! Welcome to CampusConnect AI.`);
        return { success: true, user: receivedUser };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const updated = response.data.data.user;
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        role: user?.role,
        login,
        register,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
