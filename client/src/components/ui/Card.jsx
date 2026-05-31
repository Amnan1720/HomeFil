import React from 'react';
import { colors, radius, shadow } from '../../theme/tokens';

export default function Card(props) {
  var children = props.children;
  var padding  = props.padding !== undefined ? props.padding : 16;
  var mb       = props.mb !== undefined ? props.mb : 14;
  var onClick  = props.onClick;
  var style    = props.style || {};
  var border   = props.border || 'none';

  return (
    <div
      onClick={onClick}
      style={Object.assign({
        background: colors.card,
        borderRadius: radius.lg,
        padding: padding,
        marginBottom: mb,
        boxShadow: shadow.md,
        border: border,
        cursor: onClick ? 'pointer' : 'default'
      }, style)}>
      {children}
    </div>
  );
}