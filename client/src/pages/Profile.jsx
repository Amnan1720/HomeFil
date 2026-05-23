import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  }

  function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div style={{ padding: 0, margin: '-16px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a73e8, #f57c00)',
        padding: '40px 20px 60px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 16, left: 16,
            background: 'rgba(255,255,255,0.2)',
            border: 'none', color: 'white',
            width: 36, height: 36, borderRadius: '50%',
            cursor: 'pointer', fontSize: 18
          }}>
          ←
        </button>

        <div style={{
          width: 80, height: 80,
          background: 'white', borderRadius: '50%',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 12px',
          fontSize: 28, fontWeight: 700,
          color: '#1a73e8',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          {getInitials(user.name)}
        </div>

        <h2 style={{ color: 'white', fontSize: 20,
                     fontWeight: 700, margin: '0 0 4px' }}>
          {user.name}
        </h2>

        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.2)',
          color: 'white', fontSize: 12,
          fontWeight: 600, padding: '4px 14px',
          borderRadius: 20, marginTop: 4
        }}>
          {user.role === 'supplier' ? '🏪 Supplier' :
           user.role === 'admin'    ? '🛡️ Admin' : '👤 Customer'}
        </div>
      </div>

      <div style={{ padding: 16, marginTop: -24 }}>

        {/* Info card */}
        <div style={{
          background: 'white', borderRadius: 16,
          padding: 20, marginBottom: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700,
                       color: '#1a1a2e', marginBottom: 16 }}>
            Account Details
          </h3>

          {[
            { icon: '👤', label: 'Full Name', value: user.name },
            { icon: '📧', label: 'Email', value: user.email || 'Not provided' },
            { icon: '📞', label: 'Phone', value: user.phone || 'Not provided' },
            { icon: '📍', label: 'Location', value: user.location || 'Not provided' },
            { icon: '🏷️', label: 'Account Type', value: user.role }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              gap: 12, paddingBottom: 12,
              borderBottom: i < 4 ? '0.5px solid #f0f0f0' : 'none',
              marginBottom: i < 4 ? 12 : 0
            }}>
              <div style={{
                width: 38, height: 38,
                background: '#f5f7fa', borderRadius: 10,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18,
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#999',
                            margin: '0 0 2px' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500,
                            color: '#1a1a2e', margin: 0,
                            textTransform: item.label === 'Account Type'
                              ? 'capitalize' : 'none' }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{
          background: 'white', borderRadius: 16,
          padding: 4, marginBottom: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {[
            user.role === 'supplier' && {
              icon: '📋', label: 'My Listings',
              sub: 'Manage your listings', link: '/dashboard',
              color: '#1a73e8'
            },
            user.role === 'customer' && {
              icon: '🚨', label: 'My Requests',
              sub: 'View your urgent requests', link: '/requests',
              color: '#f57c00'
            },
            user.role === 'admin' && {
              icon: '🛡️', label: 'Admin Panel',
              sub: 'Manage users and listings', link: '/admin',
              color: '#1a73e8'
            },
            {
              icon: '📋', label: 'Terms & Conditions',
              sub: 'Read our terms', link: '/terms',
              color: '#555'
            },
            {
              icon: '🔒', label: 'Privacy Policy',
              sub: 'How we protect your data', link: '/privacy',
              color: '#555'
            }
          ].filter(Boolean).map((item, i, arr) => (
            <Link key={i} to={item.link}
              style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: 12, padding: '14px 16px',
                borderBottom: i < arr.length - 1
                  ? '0.5px solid #f0f0f0' : 'none'
              }}>
                <div style={{
                  width: 38, height: 38,
                  background: item.color + '15',
                  borderRadius: 10, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500,
                              color: '#1a1a2e', margin: 0 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
                    {item.sub}
                  </p>
                </div>
                <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* App info */}
        <div style={{
          background: 'white', borderRadius: 16,
          padding: 16, marginBottom: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 24, margin: '0 0 4px' }}>🏠</p>
          <p style={{ fontSize: 16, fontWeight: 700,
                      color: '#1a1a2e', margin: '0 0 2px' }}>
            Home<span style={{ color: '#f57c00' }}>Fil</span>
          </p>
          <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px' }}>
            Water & Gas, Delivered
          </p>
          <p style={{ fontSize: 11, color: '#ccc', margin: 0 }}>
            Version 1.0.0
          </p>
        </div>

        {/* Logout button */}
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              width: '100%', padding: 15,
              background: '#ffebee', color: '#c62828',
              border: '1px solid #ef9a9a', borderRadius: 12,
              fontSize: 15, fontWeight: 600, cursor: 'pointer'
            }}>
            🚪 Logout
          </button>
        ) : (
          <div style={{
            background: 'white', borderRadius: 16,
            padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: 15, fontWeight: 600,
                        color: '#1a1a2e', marginBottom: 6 }}>
              Are you sure?
            </p>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
              You will need to login again to use HomeFil
            </p>
            <div style={{ display: 'grid',
                          gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: 12, background: '#f5f7fa',
                  color: '#555', border: 'none',
                  borderRadius: 10, fontSize: 14,
                  fontWeight: 600, cursor: 'pointer'
                }}>
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: 12, background: '#c62828',
                  color: 'white', border: 'none',
                  borderRadius: 10, fontSize: 14,
                  fontWeight: 600, cursor: 'pointer'
                }}>
                Yes, Logout
              </button>
            </div>
          </div>
        )}

        <div style={{ height: 30 }} />
      </div>
    </div>
  );
}

export default Profile;