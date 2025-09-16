
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProtectedPage from './pages/ProtectedPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import InterviewPrep from './pages/InterviewPrep.jsx';
import CoverLetterPage from './pages/CoverLetterPage.jsx';
import JobApplicationPage from './pages/JobApplicationPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';


// Real ProtectedRoute: checks /api/auth/me before rendering
const ProtectedRoute = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const [checked, setChecked] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!cancelled) {
          setOk(res.ok);
        }
      } catch {
        if (!cancelled) setOk(false);
      } finally {
        if (!cancelled) setChecked(true);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [token]);
  if (!checked) return null;
  return ok ? children : <Navigate to="/login" replace />;
};

import React, { useEffect, useState } from 'react';

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  if (!authChecked) return null; // or a loading spinner

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/interview-prep" element={
        <ProtectedRoute>
          <InterviewPrep />
        </ProtectedRoute>
      } />
      <Route path="/cover-letter" element={
        <ProtectedRoute>
          <CoverLetterPage />
        </ProtectedRoute>
      } />
      <Route path="/job-application" element={
        <ProtectedRoute>
          <JobApplicationPage />
        </ProtectedRoute>
      } />
  <Route path="/roadmaps" element={<RoadmapPage />} />
  <Route path="/protected" element={<ProtectedPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

