import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { DEMO_USERS } from '../api/demoData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // If user has saved session, load it; otherwise default to Demo Student so the app opens instantly without sign-in
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // Ignore parse error
      }
    }
    localStorage.setItem('user', JSON.stringify(DEMO_USERS.student));
    localStorage.setItem('token', 'demo-jwt-alex-rivera');
    return DEMO_USERS.student;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || 'demo-jwt-alex-rivera';
  });

  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('isRealUser') !== 'true';
  });

  const [loading, setLoading] = useState(false);

  // Validate session on initial load if marked as a real authenticated user
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('token');
      const isRealUser = localStorage.getItem('isRealUser') === 'true';

      if (!storedToken || !isRealUser) {
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
        console.warn('Session verification failed, falling back to demo mode:', err.message);
        setUser(DEMO_USERS.student);
        setToken('demo-jwt-alex-rivera');
        localStorage.setItem('user', JSON.stringify(DEMO_USERS.student));
        localStorage.setItem('token', 'demo-jwt-alex-rivera');
        localStorage.removeItem('isRealUser');
        setIsDemoMode(true);
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  // One-click Persona Switcher (Student, Warden, Faculty, Admin, Parent)
  const switchDemoRole = (targetRole) => {
    const persona = DEMO_USERS[targetRole] || DEMO_USERS.student;
    setUser(persona);
    const personaToken = `demo-jwt-${targetRole}`;
    setToken(personaToken);
    setIsDemoMode(true);
    localStorage.setItem('user', JSON.stringify(persona));
    localStorage.setItem('token', personaToken);
    localStorage.removeItem('isRealUser');
    toast.success(`✨ Switched to ${persona.name} (${persona.role.toUpperCase()}) persona`);

    const redirects = {
      student: '/student/dashboard',
      warden: '/warden/dashboard',
      faculty: '/faculty/dashboard',
      admin: '/admin/dashboard',
      parent: '/parent/dashboard'
    };
    return redirects[targetRole] || '/student/dashboard';
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data.data;
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
        localStorage.setItem('isRealUser', 'true');
        setToken(receivedToken);
        setUser(receivedUser);
        setIsDemoMode(false);
        toast.success(`Welcome back, ${receivedUser.name}!`);
        return { success: true, user: receivedUser };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 
        (error.message?.includes('Network') ? 'Unable to reach backend server. Please verify API is running.' : 'Login failed. Please check credentials.');
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
        localStorage.setItem('isRealUser', 'true');
        setToken(receivedToken);
        setUser(receivedUser);
        setIsDemoMode(false);
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
    // Reset to public demo student view without locking user out
    localStorage.removeItem('isRealUser');
    const defaultStudent = DEMO_USERS.student;
    setUser(defaultStudent);
    setToken('demo-jwt-alex-rivera');
    setIsDemoMode(true);
    localStorage.setItem('user', JSON.stringify(defaultStudent));
    localStorage.setItem('token', 'demo-jwt-alex-rivera');
    toast.success('Signed out. Reset to Live Demo Mode.');
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
        isDemoMode,
        role: user?.role,
        switchDemoRole,
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
