import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Flame, Bell, TrendingUp, Package,
         CheckCircle, XCircle, AlertCircle, Phone,
         Plus, ChevronRight, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import SupplierNav from '../../components/SupplierNav';
import { colors, radius, shadow, font, weight } from '../../theme/tokens';

const BASE = 'https://homefil-backed.onrender.com';

export default function SupplierDashboard() {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  const token = auth.token;
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);

  const supType   = user ? (user.supplierType || 'water') : 'water';
  const isGas     = supType === 'gas';
  const mainColor = isGas ? colors.secondary     : colors.primary;
  const darkColor = isGas ? colors.secondaryDark  : colors.primaryDark;
  const lightBg   = isGas ? colors.secondaryLight : colors.primaryLight;
  const SupIcon   = isGas ? Flame : Droplets;

  useEffect(function() { load(); }, []);

  function load() {
    axios.get(BASE + '/api/listings/my', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(function(r) { setListings(r.data); }).catch(console.error);

    axios.get(BASE + '/api/requests', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(function(r) { setRequests(r.data); }).catch(console.error);
  }

  function init(name) {
    if (!name) return 'U';
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  }

  const avail = listings.filter(function(l) { return l.status === 'available'; }).length;
  const oos   = listings.filter(function(l) { return l.status === 'out_of_stock'; }).length;

  const stats = [
    { label: 'Listings', value: listings.length, icon: Package,
      color: mainColor, bg: lightBg },
    { label: 'Available', value: avail, icon: CheckCircle,
      color: colors.success, bg: colors.successLight },
    { label: 'Requests', value: requests.length, icon: AlertCircle,
      color: colors.purple, bg: colors.purpleLight }
  ];

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', paddingBottom: '90px' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg,' + mainColor + ' 0%,' + darkColor + ' 100%)',
        padding: '20px 16px 32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
                       alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: font.sm,
                         margin: '0 0 2px' }}>
              Welcome back,
            </p>
            <p style={{ color: 'white', fontSize: '20px', fontWeight: weight.bold,
                         margin: '0 0 10px' }}>
              {user ? user.name : 'Supplier'}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px',
                           background: 'rgba(255,255,255,0.2)',
                           borderRadius: radius.full, padding: '5px 12px' }}>
              <SupIcon size={14} color="white" />
              <span style={{ fontSize: '12px', fontWeight: weight.semibold, color: 'white' }}>
                {isGas ? 'Gas Supplier' : 'Water Supplier'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button style={{ width: '36px', height: '36px',
                              background: 'rgba(255,255,255,0.15)',
                              border: 'none', borderRadius: radius.md,
                              display: 'flex', alignItems: 'center',
                              justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="white" />
            </button>
            <div style={{ width: '40px', height: '40px',
                           background: 'rgba(255,255,255,0.2)',
                           borderRadius: radius.full, display: 'flex',
                           alignItems: 'center', justifyContent: 'center',
                           color: 'white', fontWeight: weight.bold, fontSize: '14px',
                           border: '2px solid rgba(255,255,255,0.3)' }}>
              {init(user ? user.name : 'S')}
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
          {stats.map(function(s, i) {
            const Icon = s.icon;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.15)',
                                     borderRadius: radius.lg, padding: '14px 8px',
                                     textAlign: 'center' }}>
                <Icon size={20} color="white" style={{ marginBottom: '4px' }} />
                <p style={{ color: 'white', fontSize: '22px', fontWeight: weight.bold,
                             margin: '4px 0 2px' }}>
                  {s.value}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px',
                             margin: 0, fontWeight: weight.medium }}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* ── ADD LISTING BANNER ── */}
        <div onClick={function() { navigate('/supplier/listings'); }}
          style={{
            background: 'linear-gradient(135deg,' + mainColor + ',' + darkColor + ')',
            borderRadius: radius.xl, padding: '18px 20px',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px', cursor: 'pointer',
            boxShadow: '0 4px 20px ' + mainColor + '40'
          }}>
          <div>
            <p style={{ color: 'white', fontWeight: weight.bold,
                         fontSize: font.lg, margin: '0 0 3px' }}>
              Add new listing
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: font.sm, margin: 0 }}>
              Post a new {supType} product
            </p>
          </div>
          <div style={{ width: '44px', height: '44px',
                         background: 'rgba(255,255,255,0.2)',
                         borderRadius: radius.full, display: 'flex',
                         alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={24} color="white" />
          </div>
        </div>

        {/* ── ANALYTICS ── */}
        <div style={{ background: colors.white, borderRadius: radius.xl,
                       boxShadow: shadow.md, padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <TrendingUp size={18} color={mainColor} />
            <p style={{ fontSize: font.base, fontWeight: weight.bold,
                         color: colors.text, margin: 0 }}>
              Analytics
            </p>
          </div>
          <p style={{ fontSize: font.sm, color: colors.textMuted, margin: '0 0 16px' }}>
            Your {supType} listings overview
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Total', value: listings.length, icon: Package,
                color: mainColor, bg: lightBg },
              { label: 'Available', value: avail, icon: CheckCircle,
                color: colors.success, bg: colors.successLight },
              { label: 'Out of Stock', value: oos, icon: XCircle,
                color: colors.danger, bg: colors.dangerLight },
              { label: 'Requests', value: requests.length, icon: AlertCircle,
                color: colors.purple, bg: colors.purpleLight }
            ].map(function(item, i) {
              const Icon = item.icon;
              return (
                <div key={i} style={{ background: item.bg, borderRadius: radius.lg,
                                       padding: '14px', textAlign: 'center' }}>
                  <Icon size={22} color={item.color} style={{ marginBottom: '6px' }} />
                  <p style={{ fontSize: '26px', fontWeight: weight.bold,
                               color: item.color, margin: '0 0 2px' }}>
                    {item.value}
                  </p>
                  <p style={{ fontSize: '11px', color: item.color,
                               margin: 0, fontWeight: weight.medium }}>
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          {listings.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SupIcon size={14} color={colors.textMuted} />
                  <span style={{ fontSize: font.sm, color: colors.textMuted }}>
                    Available rate
                  </span>
                </div>
                <span style={{ fontSize: font.sm, fontWeight: weight.bold, color: mainColor }}>
                  {Math.round(avail / listings.length * 100)}%
                </span>
              </div>
              <div style={{ background: colors.bg, borderRadius: radius.full,
                             height: '10px', overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg,' + mainColor + ',' + darkColor + ')',
                  height: '100%', borderRadius: radius.full,
                  width: (avail / listings.length * 100) + '%',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          )}
        </div>

        {/* ── URGENT REQUESTS PREVIEW ── */}
        {requests.length > 0 && (
          <div style={{ background: colors.white, borderRadius: radius.xl,
                         boxShadow: shadow.md, padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                           alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} color={colors.danger} />
                <p style={{ fontSize: font.base, fontWeight: weight.bold,
                             color: colors.text, margin: 0 }}>
                  Urgent Requests
                </p>
              </div>
              <button onClick={function() { navigate('/supplier/requests'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: mainColor, fontSize: font.sm, fontWeight: weight.semibold }}>
                See all ({requests.length})
                <ChevronRight size={14} />
              </button>
            </div>

            {requests.slice(0, 2).map(function(req, i) {
              const isWaterReq = req.category === 'water';
              return (
                <div key={req._id} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  paddingBottom: i === 0 && requests.length > 1 ? '12px' : 0,
                  marginBottom: i === 0 && requests.length > 1 ? '12px' : 0,
                  borderBottom: i === 0 && requests.length > 1 ? '1px solid ' + colors.border : 'none'
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: radius.md, flexShrink: 0,
                    background: isWaterReq ? colors.primaryLight : colors.secondaryLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isWaterReq
                      ? <Droplets size={18} color={colors.primary} />
                      : <Flame size={18} color={colors.secondary} />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: font.sm, fontWeight: weight.medium,
                                 color: colors.text, margin: '0 0 3px' }}>
                      {req.requestText}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={11} color={colors.textMuted} />
                      <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>
                        {req.location}
                      </p>
                    </div>
                  </div>
                  {req.userId && (
                    <a href={'tel:' + req.userId.phone}
                      style={{
                        background: colors.primary, color: 'white',
                        padding: '7px 12px', borderRadius: radius.md,
                        fontSize: '12px', fontWeight: weight.bold,
                        textDecoration: 'none', flexShrink: 0,
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                      <Phone size={12} />
                      Call
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── RECENT LISTINGS ── */}
        <div style={{ background: colors.white, borderRadius: radius.xl,
                       boxShadow: shadow.md, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                         alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color={mainColor} />
              <p style={{ fontSize: font.base, fontWeight: weight.bold,
                           color: colors.text, margin: 0 }}>
                Recent Listings
              </p>
            </div>
            <button onClick={function() { navigate('/supplier/listings'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: mainColor, fontSize: font.sm, fontWeight: weight.semibold }}>
              See all
              <ArrowRight size={14} />
            </button>
          </div>

          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Package size={36} color={colors.textLight} style={{ marginBottom: '10px' }} />
              <p style={{ fontSize: font.sm, color: colors.textMuted, margin: 0 }}>
                No listings yet. Add your first one!
              </p>
            </div>
          ) : (
            listings.slice(0, 3).map(function(l, i) {
              return (
                <div key={l._id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  paddingBottom: i < 2 ? '12px' : 0,
                  marginBottom: i < 2 ? '12px' : 0,
                  borderBottom: i < 2 ? '1px solid ' + colors.border : 'none'
                }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: radius.md,
                    overflow: 'hidden', flexShrink: 0, background: lightBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {l.image
                      ? <img src={BASE + '/uploads/' + l.image} alt=""
                          style={{ width: '52px', height: '52px', objectFit: 'cover' }} />
                      : <SupIcon size={24} color={mainColor} strokeWidth={1.5} />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: font.base, fontWeight: weight.semibold,
                                 color: colors.text, margin: '0 0 3px' }}>
                      {l.productType}
                    </p>
                    <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
                      KSh {l.price ? l.price.toLocaleString() : '0'} · {l.location}
                    </p>
                  </div>
                  <span style={{
                    background: l.status === 'available' ? colors.successLight : colors.dangerLight,
                    color: l.status === 'available' ? colors.success : colors.danger,
                    fontSize: '11px', fontWeight: weight.bold,
                    padding: '4px 10px', borderRadius: radius.full,
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    {l.status === 'available'
                      ? <><CheckCircle size={10} /> Live</>
                      : <><XCircle size={10} /> Out</>
                    }
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <SupplierNav supplierType={supType} />
    </div>
  );
}