import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, AlertCircle, User } from 'lucide-react';
import { colors, font, weight } from '../theme/tokens';

export default function CustomerNav() {
  var loc  = useLocation();
  var path = loc.pathname;

  var tabs = [
    { link: '/customer/home',     icon: Home,        label: 'Home' },
    { link: '/customer/requests', icon: AlertCircle, label: 'Requests' },
    { link: '/customer/profile',  icon: User,        label: 'Profile' }
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%', maxWidth: '480px',
      background: colors.white,
      borderTop: '1px solid ' + colors.border,
      display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
      padding: '10px 0 14px', zIndex: 100,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.06)'
    }}>
      {tabs.map(function(item) {
        var active = path === item.link;
        var Icon = item.icon;
        return (
          <Link key={item.link} to={item.link}
            style={{ display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '4px',
                      textDecoration: 'none' }}>
            <div style={{
              width: '40px', height: '40px',
              background: active ? colors.primaryLight : 'transparent',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s'
            }}>
              <Icon size={20} color={active ? colors.primary : colors.textLight}
                strokeWidth={active ? 2.5 : 1.8} />
            </div>
            <span style={{
              fontSize: font.xs,
              color: active ? colors.primary : colors.textLight,
              fontWeight: active ? weight.bold : weight.normal
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}