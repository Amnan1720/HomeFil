import React from 'react';
import { colors, radius, font, weight } from '../../theme/tokens';

export default function Button(props) {
  var variant  = props.variant  || 'primary';
  var size     = props.size     || 'md';
  var disabled = props.disabled || false;
  var fullWidth = props.fullWidth || false;
  var onClick  = props.onClick;
  var type     = props.type || 'button';
  var children = props.children;
  var style    = props.style || {};

  var base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: radius.md,
    fontWeight: weight.bold,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.15s, transform 0.1s',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    fontFamily: 'inherit'
  };

  var sizes = {
    sm: { padding: '8px 14px', fontSize: font.sm },
    md: { padding: '12px 20px', fontSize: font.base },
    lg: { padding: '15px 24px', fontSize: font.base }
  };

  var variants = {
    primary: {
      background: 'linear-gradient(135deg,' + colors.primary + ',' + colors.primaryDark + ')',
      color: colors.white,
      boxShadow: '0 4px 14px rgba(26,115,232,0.25)'
    },
    secondary: {
      background: 'linear-gradient(135deg,' + colors.secondary + ',' + colors.secondaryDark + ')',
      color: colors.white,
      boxShadow: '0 4px 14px rgba(245,124,0,0.25)'
    },
    outline: {
      background: colors.white,
      color: colors.primary,
      border: '1.5px solid ' + colors.primary
    },
    ghost: {
      background: colors.bg,
      color: colors.text
    },
    danger: {
      background: colors.dangerLight,
      color: colors.danger,
      border: '1.5px solid #ef9a9a'
    },
    success: {
      background: colors.successLight,
      color: colors.success
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={Object.assign({}, base, sizes[size], variants[variant], style)}>
      {children}
    </button>
  );
}