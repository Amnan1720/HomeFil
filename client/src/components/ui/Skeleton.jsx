// ✅ IMPROVEMENT 4: Loading skeletons with shimmer animation
// These replace "Loading..." text with animated placeholders

import React from 'react';

// ── CSS shimmer animation (injected once) ──
var shimmerCSS = `
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .skeleton-box {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
`;

// Inject CSS into page head (only once)
if (!document.getElementById('skeleton-css')) {
  var style = document.createElement('style');
  style.id = 'skeleton-css';
  style.textContent = shimmerCSS;
  document.head.appendChild(style);
}

// ── Single skeleton block ──
function SkeletonBox(props) {
  var w  = props.w  || '100%';
  var h  = props.h  || '16px';
  var br = props.br || '8px';
  var mb = props.mb || '0';
  var extra = props.style || {};

  return (
    <div
      className="skeleton-box"
      style={Object.assign({
        width:        w,
        height:       h,
        borderRadius: br,
        marginBottom: mb,
        flexShrink:   0
      }, extra)}
    />
  );
}

// ── Listing card skeleton (mimics a real listing card) ──
export function ListingCardSkeleton() {
  return (
    <div style={{
      background:    '#ffffff',
      borderRadius:  '16px',
      overflow:      'hidden',
      marginBottom:  '14px',
      boxShadow:     '0 2px 12px rgba(0,0,0,0.06)'
    }}>

      {/* Image placeholder */}
      <SkeletonBox h="160px" br="0" />

      <div style={{ padding: '14px' }}>

        {/* Title and price row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <SkeletonBox w="55%" h="17px" br="6px" />
          <SkeletonBox w="22%" h="17px" br="6px" />
        </div>

        {/* Location */}
        <SkeletonBox w="40%" h="13px" br="6px" mb="12px" />

        {/* Badges */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <SkeletonBox w="60px" h="22px" br="20px" />
          <SkeletonBox w="50px" h="22px" br="20px" />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <SkeletonBox h="40px" br="10px" />
          <SkeletonBox h="40px" br="10px" />
        </div>

      </div>
    </div>
  );
}

// ── Dashboard skeleton (mimics supplier dashboard) ──
export function DashboardSkeleton() {
  return (
    <div style={{ padding: '16px' }}>

      {/* Stat cards grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '10px', marginBottom: '16px'
      }}>
        {[1, 2, 3, 4].map(function(i) {
          return (
            <div key={i} style={{
              background: '#f5f5f5', borderRadius: '14px', padding: '14px',
              textAlign: 'center'
            }}>
              <SkeletonBox w="40px" h="40px" br="50%"
                style={{ margin: '0 auto 8px' }} />
              <SkeletonBox w="60%" h="24px" br="6px"
                style={{ margin: '0 auto 6px' }} />
              <SkeletonBox w="50%" h="12px" br="4px"
                style={{ margin: '0 auto' }} />
            </div>
          );
        })}
      </div>

      {/* Recent listing rows */}
      {[1, 2, 3].map(function(i) {
        return (
          <div key={i} style={{
            display: 'flex', gap: '12px', alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <SkeletonBox w="52px" h="52px" br="12px" />
            <div style={{ flex: 1 }}>
              <SkeletonBox w="70%" h="14px" br="6px" mb="6px" />
              <SkeletonBox w="50%" h="12px" br="4px" />
            </div>
            <SkeletonBox w="50px" h="24px" br="20px" />
          </div>
        );
      })}

    </div>
  );
}

// ── Profile skeleton ──
export function ProfileSkeleton() {
  return (
    <div style={{ padding: '16px' }}>

      {/* Avatar card */}
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '24px',
        textAlign: 'center', marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <SkeletonBox w="80px" h="80px" br="50%"
          style={{ margin: '0 auto 12px' }} />
        <SkeletonBox w="50%" h="20px" br="8px"
          style={{ margin: '0 auto 8px' }} />
        <SkeletonBox w="35%" h="26px" br="20px"
          style={{ margin: '0 auto' }} />
      </div>

      {/* Detail rows */}
      {[1, 2, 3, 4].map(function(i) {
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px 16px', background: '#fff',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <SkeletonBox w="38px" h="38px" br="10px" />
            <div style={{ flex: 1 }}>
              <SkeletonBox w="30%" h="11px" br="4px" mb="6px" />
              <SkeletonBox w="60%" h="14px" br="4px" />
            </div>
          </div>
        );
      })}

    </div>
  );
}

export default SkeletonBox;