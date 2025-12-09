import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="brand-icon">📊</span>
          <span>Construction ERP</span>
        </div>

        <ul className="navbar-menu">
          <li>
            <a onClick={() => navigate('/dashboard')}>Dashboard</a>
          </li>
          <li>
            <a onClick={() => navigate('/projects')}>Projects</a>
          </li>
          <li>
            <a onClick={() => navigate('/finance')}>Finance</a>
          </li>
        </ul>

        <div className="navbar-user">
          {user && <span className="user-name">Welcome, {user.username}</span>}
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
