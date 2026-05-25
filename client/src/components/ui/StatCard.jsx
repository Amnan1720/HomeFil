import React from 'react';
import { radius, font, weight } from '../../theme/tokens';

export default function StatCard(props) {
  var icon    = props.icon;
  var label   = props.label;
  var value   = props.value;
  var color   = props.color;
  var bg      = props.bg;
  var onClick = props.onClick;

  return (
    <div onClick={onClick}
      style={{ background: bg, borderRadius: radius.lg,
                padding: '16px 12px', textAlign: 'center',
                cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width: 44, height: 44, background: color + '20',
                     borderRadius: radius.full, display: 'flex',
                     alignItems: 'center', justifyContent: 'center',
                     margin: '0 auto 10px', color: color }}>
        {icon}
      </div>
      <p style={{ fontSize: '26px', fontWeight: weight.bold,
                   color: color, margin: '0 0 2px' }}>
        {value}
      </p>
      <p style={{ fontSize: font.xs, color: color,
                   margin: 0, fontWeight: weight.medium }}>
        {label}
      </p>
    </div>
  );
}