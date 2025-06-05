import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const token = sessionStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/login" replace />;
  }
};