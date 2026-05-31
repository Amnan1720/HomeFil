import React from 'react';
import { colors, font, weight } from '../../theme/tokens';

export default function Divider(props) {
  var label = props.label;

  if (!label) {
    return (
      <div style={{ height: '1px', background: colors.border, margin: '4px 0' }} />
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0 16px' }}>
      <div style={{ flex: 1, height: '1px', background: colors.borderMid }} />
      <span style={{ fontSize: font.sm, color: colors.textMuted,
                      fontWeight: weight.medium }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: colors.borderMid }} />
    </div>
  );
}