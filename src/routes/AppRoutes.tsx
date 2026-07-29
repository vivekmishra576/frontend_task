import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import authService from '../services/auth';

import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import CreateTest from '../pages/CreateTest/CreateTest';
import Questions from '../pages/Questions/Questions';
import Preview from '../pages/Preview/Preview';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = authService.isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Flow Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tests/create"
        element={
          <ProtectedRoute>
            <CreateTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tests/:id/edit"
        element={
          <ProtectedRoute>
            <CreateTest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tests/:id/questions"
        element={
          <ProtectedRoute>
            <Questions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tests/:id/preview"
        element={
          <ProtectedRoute>
            <Preview />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          authService.isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
