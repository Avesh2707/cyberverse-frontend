import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Domains from './pages/Domains';
import DomainDetail from './pages/DomainDetail';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Compete from './pages/Compete';
import Leaderboard from './pages/Leaderboard';
import News from './pages/News';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="scanline" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/domains" element={<ProtectedRoute><Domains /></ProtectedRoute>} />
          <Route path="/domains/:slug" element={<ProtectedRoute><DomainDetail /></ProtectedRoute>} />
          <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
          <Route path="/compete" element={<ProtectedRoute><Compete /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
