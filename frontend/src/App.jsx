
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProtectedPage from './pages/ProtectedPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import InterviewPrep from './pages/InterviewPrep.jsx';
import CoverLetterPage from './pages/CoverLetterPage.jsx';
import JobApplicationPage from './pages/JobApplicationPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';


// Simple wrapper for protected route
const ProtectedRoute = ({ children }) => {
  // This will be checked inside HomePage itself, so just render children
  return children;
};

import React, { useEffect, useState } from 'react';

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          credentials: 'include',
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
  <Route path="/interview-prep" element={<InterviewPrep />} />
  <Route path="/cover-letter" element={<CoverLetterPage />} />
  <Route path="/job-application" element={<JobApplicationPage />} />
  <Route path="/roadmaps" element={<RoadmapPage />} />
  <Route path="/protected" element={<ProtectedPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

