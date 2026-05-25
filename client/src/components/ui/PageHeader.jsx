import React from 'react';
import { colors, font, weight } from '../../theme/tokens';

export default function PageHeader(props) {
  var title    = props.title;
  var subtitle = props.subtitle;
  var right    = props.right;
  var style    = props.style || {};

  return (
    <div style={Object.assign({
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '20px'
    }, style)}>
      <div>
        <p style={{ fontSize: font.lg, fontWeight: weight.bold,
                     color: colors.text, margin: 0 }}>
          {title}
        </p>
        {subtitle && (
          <p style={{ fontSize: font.sm, color: colors.textMuted,
                       margin: '2px 0 0' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}