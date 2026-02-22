import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('cv_token');
    const savedUser = localStorage.getItem('cv_user');
    if (token && savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('cv_token', token);
    localStorage.setItem('cv_user', JSON.stringify(user));
    setUser(user);
    return res.data;
  };
  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    const { token, user } = res.data;
    localStorage.setItem('cv_token', token);
    localStorage.setItem('cv_user', JSON.stringify(user));
    setUser(user);
    return res.data;
  };
  const logout = () => { localStorage.clear(); setUser(null); window.location.href = '/login'; };
  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
