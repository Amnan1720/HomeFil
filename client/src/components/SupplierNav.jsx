import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, AlertCircle, User } from 'lucide-react';
import { colors, font, weight } from '../theme/tokens';

export default function SupplierNav(props) {
  var supplierType = props.supplierType || 'water';
  var isGas  = supplierType === 'gas';
  var active = isGas ? colors.secondary : colors.primary;
  var activeBg = isGas ? colors.secondaryLight : colors.primaryLight;
  var loc  = useLocation();
  var path = loc.pathname;

  var tabs = [
    { link: '/supplier/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { link: '/supplier/listings',  icon: ListOrdered,     label: 'Listings' },
    { link: '/supplier/requests',  icon: AlertCircle,     label: 'Requests' },
    { link: '/supplier/profile',   icon: User,            label: 'Profile' }
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%', maxWidth: '480px',
      background: colors.white,
      borderTop: '1px solid ' + colors.border,
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
      padding: '10px 0 14px', zIndex: 100,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.06)'
    }}>
      {tabs.map(function(item) {
        var isActive = path === item.link;
        var Icon = item.icon;
        return (
          <Link key={item.link} to={item.link}
            style={{ display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '4px',
                      textDecoration: 'none' }}>
            <div style={{
              width: '40px', height: '40px',
              background: isActive ? activeBg : 'transparent',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s'
            }}>
              <Icon size={20} color={isActive ? active : colors.textLight}
                strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span style={{
              fontSize: font.xs,
              color: isActive ? active : colors.textLight,
              fontWeight: isActive ? weight.bold : weight.normal
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}