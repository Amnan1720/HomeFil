import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/login', { email, password });

      // Check if the logged in user is actually an admin
      if (res.data.user.role !== 'admin') {
        setError('Access denied. This login is for admins only.');
        setLoading(false);
        return;
      }

      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Send admin to admin panel
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Logo and title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 70,
            height: 70,
            background: '#1a1a2e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 32
          }}>
            🛡️
          </div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: 4
          }}>
            Admin Portal
          </h1>
          <p style={{ color: '#888', fontSize: 14 }}>
            HomeFil Administration Panel
          </p>
        </div>

        {/* Warning badge */}
        <div style={{
          background: '#fff3e0',
          border: '1px solid #ffb74d',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 24,
          textAlign: 'center'
        }}>
          <p style={{ color: '#e65100', fontSize: 13, fontWeight: 600 }}>
            🔒 Restricted Access — Authorized Personnel Only
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: '#ffebee',
            border: '1px solid #ef9a9a',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 16
          }}>
            <p style={{ color: '#c62828', fontSize: 14 }}>❌ {error}</p>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <label style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#333',
            display: 'block',
            marginBottom: 6
          }}>
            Admin Email
          </label>
          <input
            type="email"
            placeholder="admin@homefil.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: 8,
              fontSize: 15,
              marginBottom: 16,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          <label style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#333',
            display: 'block',
            marginBottom: 6
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: 8,
              fontSize: 15,
              marginBottom: 24,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#999' : '#1a1a2e',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'Logging in...' : '🔐 Login as Admin'}
          </button>
        </form>

        {/* Back to app link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/"
            style={{
              color: '#1a73e8',
              fontSize: 13,
              textDecoration: 'none',
              fontWeight: 600
            }}>
            ← Back to HomeFil App
          </a>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 32,
          paddingTop: 16,
          borderTop: '1px solid #f0f0f0'
        }}>
          <p style={{ color: '#bbb', fontSize: 12 }}>
            HomeFil Admin Portal v1.0
          </p>
          <p style={{ color: '#bbb', fontSize: 12 }}>
            © 2024 HomeFil. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;