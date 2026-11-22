import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading CampusConnect AI...</p>
        </div>
      </div>
    );
  }

  // If user is neither logged in nor in demo mode, automatically allow demo access as Student
  if (!isAuthenticated && !user) {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Ensure role-specific routes match current persona
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const roleRedirects = {
      admin: '/admin/dashboard',
      warden: '/warden/dashboard',
      faculty: '/faculty/dashboard',
      student: '/student/dashboard',
      parent: '/parent/dashboard'
    };
    return <Navigate to={roleRedirects[user?.role] || '/student/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
