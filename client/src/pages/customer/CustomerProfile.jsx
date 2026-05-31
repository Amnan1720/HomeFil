import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Tag, FileText,
         Lock, LogOut, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CustomerNav from '../../components/CustomerNav';
import { colors, radius, shadow, font, weight } from '../../theme/tokens';

export default function CustomerProfile() {
  const [showLogout, setShowLogout] = useState(false);
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  function init(name) {
    if (!name) return 'U';
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  }

  function logout() {
    auth.logout();
    navigate('/auth');
  }

  if (!user) return null;

  const details = [
    { icon: <Mail size={18} />, label: 'Email',    value: user.email    || 'Not provided' },
    { icon: <Phone size={18} />, label: 'Phone',   value: user.phone    || 'Not provided' },
    { icon: <MapPin size={18} />, label: 'Location', value: user.location || 'Not provided' },
    { icon: <Tag size={18} />, label: 'Account Type', value: 'Customer' }
  ];

  const links = [
    { icon: <AlertCircle size={18} />, label: 'My Requests', link: '/customer/requests', color: colors.secondary },
    { icon: <FileText size={18} />, label: 'Terms & Conditions', link: '/terms', color: colors.primary },
    { icon: <Lock size={18} />, label: 'Privacy Policy', link: '/privacy', color: colors.primary }
  ];

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', paddingBottom: '90px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,' + colors.primary + ',' + colors.primaryDark + ')',
        padding: '40px 20px 70px', textAlign: 'center', position: 'relative'
      }}>
        <div style={{
          width: '80px', height: '80px',
          background: 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.4)',
          borderRadius: radius.full, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', color: colors.white,
          fontSize: '28px', fontWeight: weight.bold
        }}>
          {init(user.name)}
        </div>
        <h2 style={{ color: colors.white, fontSize: '20px',
                      fontWeight: weight.bold, margin: '0 0 8px' }}>
          {user.name}
        </h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px',
                       background: 'rgba(255,255,255,0.2)',
                       borderRadius: radius.full, padding: '5px 14px' }}>
          <User size={14} color="white" />
          <span style={{ fontSize: font.sm, fontWeight: weight.semibold, color: 'white' }}>
            Customer
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px', marginTop: '-40px' }}>

        {/* Details card */}
        <div style={{ background: colors.white, borderRadius: radius.xl,
                       boxShadow: shadow.lg, overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ padding: '16px 16px 8px' }}>
            <p style={{ fontSize: font.sm, fontWeight: weight.bold,
                         color: colors.textLight, textTransform: 'uppercase',
                         letterSpacing: '0.5px', margin: 0 }}>
              Account Details
            </p>
          </div>
          {details.map(function(item, i) {
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px',
                borderBottom: i < details.length - 1 ? '1px solid ' + colors.border : 'none'
              }}>
                <div style={{ width: '38px', height: '38px',
                               background: colors.primaryLight,
                               borderRadius: radius.md, display: 'flex',
                               alignItems: 'center', justifyContent: 'center',
                               color: colors.primary, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: colors.textLight,
                               fontWeight: weight.medium, margin: '0 0 2px',
                               textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: font.base, fontWeight: weight.medium,
                               color: colors.text, margin: 0 }}>
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Links card */}
        <div style={{ background: colors.white, borderRadius: radius.xl,
                       boxShadow: shadow.md, overflow: 'hidden', marginBottom: '16px' }}>
          {links.map(function(item, i) {
            return (
              <Link key={i} to={item.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px',
                  borderBottom: i < links.length - 1 ? '1px solid ' + colors.border : 'none',
                  background: 'transparent'
                }}>
                  <div style={{ width: '38px', height: '38px',
                                 background: item.color + '15',
                                 borderRadius: radius.md, display: 'flex',
                                 alignItems: 'center', justifyContent: 'center',
                                 color: item.color, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <p style={{ fontSize: font.base, fontWeight: weight.medium,
                               color: colors.text, margin: 0, flex: 1 }}>
                    {item.label}
                  </p>
                  <ChevronRight size={18} color={colors.textLight} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* App info */}
        <div style={{ background: colors.white, borderRadius: radius.xl,
                       boxShadow: shadow.sm, padding: '16px',
                       textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ fontSize: '24px', fontWeight: weight.bold,
                       color: colors.text, margin: '0 0 2px' }}>
            Home<span style={{ color: colors.secondary }}>Fil</span>
          </p>
          <p style={{ fontSize: '12px', color: colors.textMuted, margin: '0 0 2px' }}>
            Water & Gas, Delivered
          </p>
          <p style={{ fontSize: '11px', color: colors.textLight, margin: 0 }}>
            Version 1.0.0
          </p>
        </div>

        {/* Logout */}
        {!showLogout ? (
          <button onClick={() => setShowLogout(true)}
            style={{ width: '100%', padding: '15px',
                      background: colors.dangerLight, color: colors.danger,
                      border: '1.5px solid #ef9a9a', borderRadius: radius.lg,
                      fontSize: font.base, fontWeight: weight.bold,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px' }}>
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <div style={{ background: colors.white, borderRadius: radius.xl,
                         boxShadow: shadow.md, padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: font.base, fontWeight: weight.bold,
                         color: colors.text, margin: '0 0 6px' }}>
              Are you sure?
            </p>
            <p style={{ fontSize: font.sm, color: colors.textMuted, margin: '0 0 16px' }}>
              You will need to sign in again
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => setShowLogout(false)}
                style={{ padding: '12px', background: colors.bg, color: colors.textMuted,
                          border: 'none', borderRadius: radius.md, fontSize: font.sm,
                          fontWeight: weight.bold, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={logout}
                style={{ padding: '12px', background: colors.danger, color: colors.white,
                          border: 'none', borderRadius: radius.md, fontSize: font.sm,
                          fontWeight: weight.bold, cursor: 'pointer', fontFamily: 'inherit' }}>
                Yes, Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <CustomerNav />
    </div>
  );
}