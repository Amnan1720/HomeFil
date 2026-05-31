// ✅ IMPROVEMENT 5: Error handling screens
// Covers: offline, server crash, empty state, offline banner

import React from 'react';
import { WifiOff, ServerCrash, RefreshCw, AlertTriangle, SearchX } from 'lucide-react';
import { colors, radius, shadow, font, weight } from '../../theme/tokens';

// ── Offline banner — shows at top when internet disconnects ──
export function OfflineBanner() {
  return (
    <div style={{
      background:     '#1a1a2e',
      color:          'white',
      padding:        '10px 16px',
      textAlign:      'center',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '8px',
      fontSize:       font.sm,
      fontWeight:     weight.medium,
      position:       'sticky',
      top:            0,
      zIndex:         200
    }}>
      <WifiOff size={14} />
      You are offline. Check your internet connection.
    </div>
  );
}

// ── Error screen — shown when fetch fails ──
// type can be: 'offline' | 'server' | 'general'
export function ErrorScreen(props) {
  var type    = props.type    || 'general';
  var onRetry = props.onRetry;
  var message = props.message;

  // Different message for each error type
  var configs = {
    offline: {
      Icon:     WifiOff,
      title:    'No Internet Connection',
      desc:     'Please check your WiFi or mobile data and try again.',
      btnLabel: 'Try Again'
    },
    server: {
      Icon:     ServerCrash,
      title:    'Server Unavailable',
      desc:     'Our server is temporarily unavailable. Please wait a moment and try again.',
      btnLabel: 'Retry'
    },
    general: {
      Icon:     AlertTriangle,
      title:    'Something Went Wrong',
      desc:     message || 'An unexpected error occurred. Please try again.',
      btnLabel: 'Retry'
    }
  };

  var cfg = configs[type] || configs.general;

  return (
    <div style={{ textAlign: 'center', padding: '50px 24px' }}>

      {/* Icon circle */}
      <div style={{
        width:          '72px',
        height:         '72px',
        background:     colors.bg,
        borderRadius:   radius.full,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        margin:         '0 auto 16px'
      }}>
        <cfg.Icon size={32} color={colors.textLight} />
      </div>

      {/* Title */}
      <p style={{
        fontSize:   font.lg,
        fontWeight: weight.bold,
        color:      colors.text,
        margin:     '0 0 8px'
      }}>
        {cfg.title}
      </p>

      {/* Description */}
      <p style={{
        fontSize:   font.sm,
        color:      colors.textMuted,
        margin:     '0 0 24px',
        lineHeight: 1.6
      }}>
        {cfg.desc}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button onClick={onRetry}
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '8px',
            background:     'linear-gradient(135deg,' + colors.primary + ',' + colors.primaryDark + ')',
            color:          'white',
            border:         'none',
            borderRadius:   radius.md,
            padding:        '12px 24px',
            fontSize:       font.sm,
            fontWeight:     weight.bold,
            cursor:         'pointer',
            fontFamily:     'inherit',
            boxShadow:      shadow.md
          }}>
          <RefreshCw size={16} />
          {cfg.btnLabel}
        </button>
      )}

    </div>
  );
}

// ── Empty state — shown when no results found ──
export function EmptyState(props) {
  var icon     = props.icon;
  var title    = props.title    || 'Nothing here yet';
  var desc     = props.desc     || '';
  var btnLabel = props.btnLabel;
  var onAction = props.onAction;

  return (
    <div style={{ textAlign: 'center', padding: '50px 24px' }}>

      {/* Icon circle */}
      <div style={{
        width:          '72px',
        height:         '72px',
        background:     colors.primaryLight,
        borderRadius:   radius.full,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        margin:         '0 auto 16px'
      }}>
        {icon || <SearchX size={28} color={colors.primary} />}
      </div>

      {/* Title */}
      <p style={{
        fontSize:   font.lg,
        fontWeight: weight.bold,
        color:      colors.text,
        margin:     '0 0 6px'
      }}>
        {title}
      </p>

      {/* Description */}
      {desc && (
        <p style={{
          fontSize:   font.sm,
          color:      colors.textMuted,
          margin:     '0 0 20px',
          lineHeight: 1.6
        }}>
          {desc}
        </p>
      )}

      {/* Action button */}
      {onAction && btnLabel && (
        <button onClick={onAction}
          style={{
            background:   'linear-gradient(135deg,' + colors.primary + ',' + colors.primaryDark + ')',
            color:        'white',
            border:       'none',
            borderRadius: radius.md,
            padding:      '12px 24px',
            fontSize:     font.sm,
            fontWeight:   weight.bold,
            cursor:       'pointer',
            fontFamily:   'inherit'
          }}>
          {btnLabel}
        </button>
      )}

    </div>
  );
}