import React from 'react';
import { colors, radius, font, weight } from '../../theme/tokens';

export default function Badge(props) {
  var type     = props.type || 'default';
  var children = props.children;
  var style    = props.style || {};

  var types = {
    default:  { bg: colors.bg,           color: colors.textMuted },
    primary:  { bg: colors.primaryLight,  color: colors.primaryText },
    secondary:{ bg: colors.secondaryLight,color: colors.secondaryText },
    success:  { bg: colors.successLight,  color: colors.success },
    danger:   { bg: colors.dangerLight,   color: colors.danger },
    warning:  { bg: colors.warningLight,  color: '#5d4037' },
    purple:   { bg: colors.purpleLight,   color: colors.purple }
  };

  var t = types[type] || types.default;

  return (
    <span style={Object.assign({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: t.bg,
      color: t.color,
      fontSize: font.xs,
      fontWeight: weight.semibold,
      padding: '3px 10px',
      borderRadius: radius.full
    }, style)}>
      {children}
    </span>
  );
}