import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  }

  function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span style={{ fontSize: 20 }}>🏠</span>
        Home<span style={{ color: '#ffa726' }}>Fil</span>
      </Link>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin"
                style={{ color: 'white', fontSize: 12,
                         background: 'rgba(255,255,255,0.2)',
                         padding: '4px 10px', borderRadius: 20 }}>
                🛡️ Admin
              </Link>
            )}
            {user.role === 'supplier' && (
              <Link to="/dashboard"
                style={{ color: 'white', fontSize: 12,
                         background: 'rgba(255,255,255,0.2)',
                         padding: '4px 10px', borderRadius: 20 }}>
                📋 Dashboard
              </Link>
            )}
            {user.role !== 'admin' && (
              <Link to="/requests"
                style={{ color: 'white', fontSize: 12 }}>
                🚨
              </Link>
            )}
            <div
              onClick={handleLogout}
              style={{
                width: 32, height: 32,
                background: '#ffa726',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                color: 'white', fontWeight: 700,
                fontSize: 12, cursor: 'pointer'
              }}>
              {getInitials(user.name)}
            </div>
          </>
        ) : (
          <Link to="/auth"
            style={{ color: 'white', fontSize: 13,
                     background: 'rgba(255,255,255,0.2)',
                     padding: '6px 14px', borderRadius: 20 }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;