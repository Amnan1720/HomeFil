import React from 'react';
import { colors, radius, font, weight } from '../../theme/tokens';

export default function Avatar(props) {
  var name    = props.name || 'U';
  var size    = props.size || 40;
  var color1  = props.color1 || colors.primary;
  var color2  = props.color2 || colors.primaryDark;
  var style   = props.style || {};

  function init(n) {
    if (!n) return 'U';
    return n.split(' ').map(function(w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  }

  return (
    <div style={Object.assign({
      width: size, height: size,
      background: 'linear-gradient(135deg,' + color1 + ',' + color2 + ')',
      borderRadius: radius.full,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      color: colors.white,
      fontSize: Math.round(size * 0.35) + 'px',
      fontWeight: weight.bold,
      flexShrink: 0
    }, style)}>
      {init(name)}
    </div>
  );
}