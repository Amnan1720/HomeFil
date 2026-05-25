import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Droplets, Flame, Phone,
         MessageCircle, MapPin, Truck, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import CustomerNav from '../../components/CustomerNav';
import { colors, radius, shadow, font, weight } from '../../theme/tokens';

const BASE = 'https://homefil-backed.onrender.com';

export default function CustomerHome() {
  const auth = useAuth();
  const user = auth.user;
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(function() { load('', ''); }, []);

  function load(cat, loc) {
    setLoading(true);
    var url = '/listings?';
    if (cat) url += 'category=' + cat + '&';
    if (loc) url += 'location=' + loc;
    API.get(url).then(function(r) {
      setListings(r.data); setLoading(false);
    }).catch(function() { setLoading(false); });
  }

  function applyCategory(cat) {
    setCategory(cat); load(cat, search);
  }

  function init(name) {
    if (!name) return 'U';
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  }

  function greeting() {
    var h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  }

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', paddingBottom: '90px' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg,' + colors.primary + ' 0%,' + colors.primaryDark + ' 100%)',
        padding: '20px 16px 28px'
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
                       alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px',
                           background: 'rgba(255,255,255,0.2)',
                           borderRadius: '10px', display: 'flex',
                           alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={18} color="white" />
            </div>
            <span style={{ color: 'white', fontWeight: weight.bold, fontSize: '18px' }}>
              Home<span style={{ color: '#ffa726' }}>Fil</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ background: 'rgba(255,255,255,0.15)',
                              border: 'none', cursor: 'pointer', width: '36px',
                              height: '36px', borderRadius: radius.md,
                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={18} color="white" />
            </button>
            <Link to="/customer/profile" style={{ textDecoration: 'none' }}>
              <div style={{ width: '36px', height: '36px',
                             background: '#ffa726', borderRadius: radius.full,
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             color: 'white', fontWeight: weight.bold, fontSize: '13px' }}>
                {init(user ? user.name : 'U')}
              </div>
            </Link>
          </div>
        </div>

        {/* Greeting */}
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: font.sm,
                     margin: '0 0 2px' }}>
          {greeting()}
        </p>
        <p style={{ color: 'white', fontSize: '20px', fontWeight: weight.bold,
                     margin: '0 0 20px' }}>
          {user ? user.name : 'Welcome'}
        </p>

        {/* Search */}
        <div style={{ background: 'rgba(255,255,255,0.15)',
                       borderRadius: radius.lg, padding: '0 14px',
                       display: 'flex', alignItems: 'center', gap: '10px', height: '48px',
                       border: '1px solid rgba(255,255,255,0.2)' }}>
          <Search size={18} color="rgba(255,255,255,0.7)" />
          <input placeholder="Search water, gas near you..."
            value={search}
            onChange={function(e) { setSearch(e.target.value); }}
            onKeyPress={function(e) { if (e.key === 'Enter') load(category, search); }}
            style={{ background: 'none', border: 'none', color: 'white',
                      fontSize: font.base, flex: 1, outline: 'none',
                      marginBottom: 0, padding: 0 }} />
          {search && (
            <button onClick={function() { setSearch(''); load(category, ''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.7)', display: 'flex',
                        padding: 0 }}>
              <X size={16} />
            </button>
          )}
          <button onClick={function() { load(category, search); }}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none',
                      color: 'white', padding: '6px 14px', borderRadius: radius.md,
                      fontSize: font.sm, fontWeight: weight.semibold,
                      cursor: 'pointer', flexShrink: 0 }}>
            Search
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* ── CATEGORY CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                       gap: '10px', marginBottom: '16px' }}>
          <div onClick={function() { applyCategory(category === 'water' ? '' : 'water'); }}
            style={{
              background: category === 'water' ? colors.primary : colors.primaryLight,
              borderRadius: radius.lg, padding: '14px 12px',
              display: 'flex', alignItems: 'center', gap: '12px',
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: category === 'water' ? shadow.md : 'none'
            }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: radius.md,
              background: category === 'water' ? 'rgba(255,255,255,0.2)' : colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Droplets size={22} color="white" />
            </div>
            <div>
              <p style={{ fontSize: '11px', margin: 0, fontWeight: weight.medium,
                           color: category === 'water' ? 'rgba(255,255,255,0.8)' : colors.primaryText }}>
                Water
              </p>
              <p style={{ fontSize: font.base, fontWeight: weight.bold, margin: 0,
                           color: category === 'water' ? 'white' : colors.primary }}>
                Refill
              </p>
            </div>
          </div>

          <div onClick={function() { applyCategory(category === 'gas' ? '' : 'gas'); }}
            style={{
              background: category === 'gas' ? colors.secondary : colors.secondaryLight,
              borderRadius: radius.lg, padding: '14px 12px',
              display: 'flex', alignItems: 'center', gap: '12px',
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: category === 'gas' ? shadow.md : 'none'
            }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: radius.md,
              background: category === 'gas' ? 'rgba(255,255,255,0.2)' : colors.secondary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Flame size={22} color="white" />
            </div>
            <div>
              <p style={{ fontSize: '11px', margin: 0, fontWeight: weight.medium,
                           color: category === 'gas' ? 'rgba(255,255,255,0.8)' : colors.secondaryText }}>
                Gas
              </p>
              <p style={{ fontSize: font.base, fontWeight: weight.bold, margin: 0,
                           color: category === 'gas' ? 'white' : colors.secondary }}>
                Cylinder
              </p>
            </div>
          </div>
        </div>

        {/* ── DISCLAIMER ── */}
        <div style={{ background: colors.warningLight,
                       borderLeft: '3px solid ' + colors.warning,
                       borderRadius: '0 ' + radius.md + ' ' + radius.md + ' 0',
                       padding: '10px 14px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#5d4037', margin: 0 }}>
            <strong>HomeFil</strong> does not handle payments.
            Pay suppliers directly on delivery.
          </p>
        </div>

        {/* ── SECTION HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
                       alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <p style={{ fontSize: font.lg, fontWeight: weight.bold,
                         color: colors.text, margin: 0 }}>
              {category
                ? (category === 'water' ? 'Water Suppliers' : 'Gas Suppliers')
                : 'Featured Suppliers'}
            </p>
            <p style={{ fontSize: font.sm, color: colors.textMuted, margin: '2px 0 0' }}>
              {listings.length} supplier{listings.length !== 1 ? 's' : ''} found
            </p>
          </div>
          {category && (
            <button onClick={function() { applyCategory(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px',
                        background: colors.bg, border: '1px solid ' + colors.borderMid,
                        borderRadius: radius.full, padding: '5px 12px',
                        fontSize: font.sm, color: colors.textMuted,
                        cursor: 'pointer', fontFamily: 'inherit' }}>
              <X size={12} />
              Clear
            </button>
          )}
        </div>

        {/* ── LISTINGS ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid ' + colors.primaryLight,
                           borderTopColor: colors.primary, borderRadius: radius.full,
                           margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: colors.textMuted, fontSize: font.sm }}>Loading suppliers...</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{ width: '64px', height: '64px', background: colors.primaryLight,
                           borderRadius: radius.full, display: 'flex',
                           alignItems: 'center', justifyContent: 'center',
                           margin: '0 auto 16px' }}>
              <Search size={28} color={colors.primary} />
            </div>
            <p style={{ fontSize: font.lg, fontWeight: weight.bold,
                         color: colors.text, margin: '0 0 6px' }}>
              No suppliers found
            </p>
            <p style={{ fontSize: font.sm, color: colors.textMuted, margin: 0 }}>
              Try a different search or filter
            </p>
          </div>
        ) : (
          listings.map(function(l) {
            const isWater = l.category === 'water';
            const listingColor = isWater ? colors.primary : colors.secondary;
            const listingBg    = isWater ? colors.primaryLight : colors.secondaryLight;
            return (
              <Link to={'/listing/' + l._id} key={l._id}
                style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  background: colors.white, borderRadius: radius.xl,
                  overflow: 'hidden', marginBottom: '14px', boxShadow: shadow.md,
                  transition: 'transform 0.1s, box-shadow 0.1s'
                }}>

                  {/* Image */}
                  {l.image ? (
                    <div style={{ position: 'relative' }}>
                      <img src={BASE + '/uploads/' + l.image} alt={l.productType}
                        style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: l.status === 'available' ? colors.successLight : colors.dangerLight,
                        color: l.status === 'available' ? colors.success : colors.danger,
                        fontSize: '11px', fontWeight: weight.bold,
                        padding: '4px 10px', borderRadius: radius.full
                      }}>
                        {l.status === 'available' ? 'Available' : 'Out of stock'}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      height: '120px', background: listingBg,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', position: 'relative'
                    }}>
                      {isWater
                        ? <Droplets size={52} color={listingColor} strokeWidth={1.5} />
                        : <Flame size={52} color={listingColor} strokeWidth={1.5} />
                      }
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: l.status === 'available' ? colors.successLight : colors.dangerLight,
                        color: l.status === 'available' ? colors.success : colors.danger,
                        fontSize: '11px', fontWeight: weight.bold,
                        padding: '4px 10px', borderRadius: radius.full
                      }}>
                        {l.status === 'available' ? 'Available' : 'Out of stock'}
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '14px' }}>
                    {/* Title and price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                                   alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ flex: 1, marginRight: '8px' }}>
                        <p style={{ fontWeight: weight.bold, fontSize: font.base,
                                     color: colors.text, margin: '0 0 4px' }}>
                          {l.productType || l.category + ' ' + l.serviceType}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color={colors.textMuted} />
                          <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
                            {l.location}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '18px', fontWeight: weight.bold,
                                     color: listingColor, margin: 0 }}>
                          KSh {l.price ? l.price.toLocaleString() : '0'}
                        </p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '6px',
                                   flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span style={{ background: listingBg, color: listingColor,
                                      fontSize: '11px', fontWeight: weight.semibold,
                                      padding: '3px 10px', borderRadius: radius.full,
                                      display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {isWater
                          ? <Droplets size={11} />
                          : <Flame size={11} />
                        }
                        {l.category}
                      </span>
                      <span style={{ background: colors.bg, color: colors.textMuted,
                                      fontSize: '11px', fontWeight: weight.medium,
                                      padding: '3px 10px', borderRadius: radius.full }}>
                        {l.serviceType}
                      </span>
                      {l.deliveryAvailable && (
                        <span style={{ background: colors.successLight, color: colors.success,
                                        fontSize: '11px', fontWeight: weight.medium,
                                        padding: '3px 10px', borderRadius: radius.full,
                                        display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Truck size={11} />
                          {l.deliveryTime || 'Delivery'}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <a href={'tel:' + l.phone}
                        onClick={function(e) { e.stopPropagation(); }}
                        style={{
                          background: colors.primary, color: colors.white,
                          padding: '11px 0', borderRadius: radius.md,
                          textAlign: 'center', fontSize: font.sm,
                          fontWeight: weight.bold, textDecoration: 'none',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '6px'
                        }}>
                        <Phone size={15} />
                        Call
                      </a>
                      {l.whatsapp ? (
                        <a href={'https://wa.me/' + l.whatsapp.replace(/\D/g, '')}
                          target="_blank" rel="noreferrer"
                          onClick={function(e) { e.stopPropagation(); }}
                          style={{
                            background: colors.successLight, color: colors.success,
                            padding: '11px 0', borderRadius: radius.md,
                            textAlign: 'center', fontSize: font.sm,
                            fontWeight: weight.bold, textDecoration: 'none',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '6px'
                          }}>
                          <MessageCircle size={15} />
                          WhatsApp
                        </a>
                      ) : (
                        <div style={{
                          background: colors.bg, color: colors.textLight,
                          padding: '11px 0', borderRadius: radius.md,
                          textAlign: 'center', fontSize: font.sm,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '6px'
                        }}>
                          <MessageCircle size={15} />
                          WhatsApp
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <CustomerNav />
    </div>
  );
}