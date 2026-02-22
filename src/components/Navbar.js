import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="nav-logo">OPEN<span>LABS</span></NavLink>
      <ul className="nav-links">
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/domains">Domains</NavLink></li>
        <li><NavLink to="/practice">Practice</NavLink></li>
        <li><NavLink to="/compete">Compete</NavLink></li>
        <li><NavLink to="/leaderboard">Leaderboard</NavLink></li>
        <li><NavLink to="/news">CTF News</NavLink></li>
      </ul>
      <div className="nav-right">
        <span className="nav-points">⚡ {user?.totalPoints || 0} pts</span>
        <span className="nav-user">[ {user?.username} ]</span>
        <button className="btn-logout" onClick={logout}>LOGOUT</button>
      </div>
    </nav>
  );
}
