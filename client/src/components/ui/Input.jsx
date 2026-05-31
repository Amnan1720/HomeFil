import React from 'react';
import { colors, radius, font } from '../../theme/tokens';

export default function Input(props) {
  var icon        = props.icon;
  var rightIcon   = props.rightIcon;
  var onRightClick = props.onRightClick;
  var style       = props.style || {};

  var inputStyle = {
    width: '100%',
    padding: icon ? '14px 44px' : '14px 16px',
    paddingRight: rightIcon ? '44px' : (icon ? '44px' : '16px'),
    border: '1.5px solid ' + colors.borderMid,
    borderRadius: radius.md,
    fontSize: font.base,
    fontFamily: 'inherit',
    color: colors.text,
    background: colors.white,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 0,
    transition: 'border-color 0.15s'
  };

  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      {icon && (
        <div style={{ position: 'absolute', left: '14px', top: '50%',
                       transform: 'translateY(-50%)', color: colors.textLight,
                       display: 'flex', alignItems: 'center' }}>
          {icon}
        </div>
      )}
      <input {...props} icon={undefined} rightIcon={undefined}
        onRightClick={undefined} style={Object.assign({}, inputStyle, style)} />
      {rightIcon && (
        <button type="button" onClick={onRightClick}
          style={{ position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: colors.textLight,
                    display: 'flex', alignItems: 'center' }}>
          {rightIcon}
        </button>
      )}
    </div>
  );
}