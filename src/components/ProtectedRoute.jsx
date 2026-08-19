import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }) => {
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userInfo.role !== requiredRole) {
    // Redirect authenticated users trying to access unauthorized routes to their respective dashboards
    if (userInfo.role === 'employer') {
      return <Navigate to="/employer/dashboard" replace />;
    } else if (userInfo.role === 'jobseeker') {
      return <Navigate to="/jobseeker/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
