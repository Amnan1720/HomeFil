import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Flame, Shield, LayoutDashboard, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors, font, weight } from '../theme/tokens';

export default function Navbar() {
  var auth = useAuth();
  var user = auth.user;
  var navigate = useNavigate();

  function init(name) {
    if (!name) return 'U';
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  }

  function handleLogout() {
    auth.logout();
    navigate('/auth');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.2)',
                       borderRadius: '8px', display: 'flex', alignItems: 'center',
                       justifyContent: 'center' }}>
          <Droplets size={16} color="white" />
        </div>
        <span>Home<span style={{ color: '#ffa726' }}>Fil</span></span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin"
                style={{ display: 'flex', alignItems: 'center', gap: '4px',
                          color: 'white', fontSize: font.sm, fontWeight: weight.medium }}>
                <Shield size={15} />
                Admin
              </Link>
            )}
            {user.role === 'supplier' && (
              <Link to="/supplier/dashboard"
                style={{ display: 'flex', alignItems: 'center', gap: '4px',
                          color: 'white', fontSize: font.sm, fontWeight: weight.medium }}>
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}
            {user.role === 'customer' && (
              <Link to="/customer/requests"
                style={{ color: 'white' }}>
                <AlertCircle size={18} />
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 32, height: 32,
                             background: 'rgba(255,255,255,0.2)',
                             borderRadius: '50%', display: 'flex',
                             alignItems: 'center', justifyContent: 'center',
                             color: 'white', fontWeight: weight.bold,
                             fontSize: '12px' }}>
                {init(user.name)}
              </div>
              <button onClick={handleLogout}
                style={{ background: 'none', border: 'none',
                          cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
                          display: 'flex', alignItems: 'center' }}>
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <Link to="/auth"
            style={{ background: 'rgba(255,255,255,0.2)',
                      color: 'white', padding: '6px 14px',
                      borderRadius: '20px', fontSize: font.sm,
                      fontWeight: weight.medium }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}