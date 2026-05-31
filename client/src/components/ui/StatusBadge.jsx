// ✅ IMPROVEMENT 1: Supplier status badges and status picker
// StatusBadge: shows current status (Open / Busy / Offline / Closed)
// StatusPicker: lets supplier change their status

import React from 'react';
import { radius, font, weight } from '../../theme/tokens';

// ── Status configurations ──
var STATUS_CONFIG = {
  open: {
    color:    '#2e7d32',  // dark green
    bg:       '#e8f5e9',  // light green
    dotColor: '#4caf50',  // bright green
    label:    'Open'
  },
  busy: {
    color:    '#e65100',  // dark orange
    bg:       '#fff3e0',  // light orange
    dotColor: '#ff9800',  // bright orange
    label:    'Busy'
  },
  offline: {
    color:    '#757575',  // grey
    bg:       '#f5f5f5',  // light grey
    dotColor: '#bdbdbd',  // mid grey
    label:    'Offline'
  },
  closed: {
    color:    '#c62828',  // dark red
    bg:       '#ffebee',  // light red
    dotColor: '#ef5350',  // bright red
    label:    'Closed'
  }
};

// ── StatusBadge: Display only (for listing cards) ──
// size prop: 'sm' | 'md'
export default function StatusBadge(props) {
  var status = props.status || 'open';
  var size   = props.size   || 'md';
  var cfg    = STATUS_CONFIG[status] || STATUS_CONFIG.open;

  var padding  = size === 'sm' ? '3px 8px'  : '4px 12px';
  var fontSize = size === 'sm' ? '11px'      : font.sm;
  var dotSize  = size === 'sm' ? '7px'       : '8px';

  return (
    <span style={{
      display:        'inline-flex',
      alignItems:     'center',
      gap:            '5px',
      background:     cfg.bg,
      color:          cfg.color,
      fontSize:       fontSize,
      fontWeight:     weight.semibold,
      padding:        padding,
      borderRadius:   radius.full
    }}>

      {/* Animated dot for Open status */}
      <span style={{
        width:        dotSize,
        height:       dotSize,
        borderRadius: '50%',
        background:   cfg.dotColor,
        display:      'inline-block',
        animation:    status === 'open' ? 'pulse-status 2s infinite' : 'none'
      }} />

      {cfg.label}

      {/* Pulse animation CSS */}
      <style>{`
        @keyframes pulse-status {
          0%,  100% { opacity: 1; transform: scale(1); }
          50%        { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>

    </span>
  );
}

// ── StatusPicker: Interactive (for supplier dashboard) ──
// Lets supplier tap to change their status
export function StatusPicker(props) {
  var current  = props.current  || 'open';
  var onChange = props.onChange;  // function(newStatus)
  var loading  = props.loading  || false;

  var statuses = ['open', 'busy', 'offline', 'closed'];

  return (
    <div>

      {/* Section title */}
      <p style={{
        fontSize:       '12px',
        fontWeight:     weight.bold,
        color:          '#666',
        margin:         '0 0 10px',
        textTransform:  'uppercase',
        letterSpacing:  '0.5px'
      }}>
        Your Status
      </p>

      {/* 2x2 grid of status buttons */}
      <div style={{
        display:               'grid',
        gridTemplateColumns:   '1fr 1fr',
        gap:                   '8px'
      }}>
        {statuses.map(function(s) {
          var cfg    = STATUS_CONFIG[s];
          var active = current === s;

          return (
            <button
              key={s}
              onClick={function() { if (!loading) onChange(s); }}
              disabled={loading}
              style={{
                padding:        '11px 12px',
                background:     active ? cfg.bg      : '#f9f9f9',
                border:         active
                  ? '2px solid ' + cfg.dotColor
                  : '1.5px solid #e0e0e0',
                borderRadius:   '12px',
                cursor:         loading ? 'not-allowed' : 'pointer',
                display:        'flex',
                alignItems:     'center',
                gap:            '8px',
                fontFamily:     'inherit',
                transition:     'all 0.15s',
                opacity:        loading ? 0.6 : 1
              }}>

              {/* Status dot */}
              <span style={{
                width:        '10px',
                height:       '10px',
                borderRadius: '50%',
                background:   active ? cfg.dotColor : '#cccccc',
                flexShrink:   0
              }} />

              {/* Status label */}
              <span style={{
                fontSize:   '13px',
                fontWeight: active ? weight.bold : weight.medium,
                color:      active ? cfg.color   : '#666666'
              }}>
                {cfg.label}
              </span>

            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <p style={{
        fontSize:  '12px',
        color:     '#aaa',
        margin:    '8px 0 0',
        textAlign: 'center'
      }}>
        Customers see your status on your listings
      </p>

    </div>
  );
}