import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo.png';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img
          src={logo}
          alt="HomeFil Logo"
          style={{
            height: '36px',
            width: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '8px',
            verticalAlign: 'middle'
          }}
        />
        <span style={{ verticalAlign: 'middle' }}>HomeFil</span>
      </Link>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin">🛡️ Admin</Link>
            )}
            {user.role === 'supplier' && (
              <Link to="/dashboard">Dashboard</Link>
            )}
            {user.role !== 'admin' && (
              <Link to="/requests">Requests</Link>
            )}
            <span style={{ color: 'white', fontSize: 13 }}>
              Hi, {user.name.split(' ')[0]}
            </span>
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white',
                       border: 'none', padding: '6px 12px', borderRadius: 6,
                       cursor: 'pointer', fontSize: 13 }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;