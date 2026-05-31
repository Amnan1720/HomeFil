import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Phone, User, MapPin,
         Droplets, Flame, Store, UserCircle, Shield } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { colors, radius, font, weight, shadow } from '../theme/tokens';

export default function Auth() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [role, setRole] = useState('customer');
  const [supplierType, setSupplierType] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', confirmPassword: '', location: ''
  });

  function change(e) {
    setForm(Object.assign({}, form, { [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!isLogin) {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match'); return;
      }
      if (!agreed) {
        setError('Please agree to Terms & Conditions'); return;
      }
      if (role === 'supplier' && !supplierType) {
        setError('Please select what you sell'); return;
      }
    }
    setLoading(true);
    try {
      if (isLogin) {
        const res = await API.post('/login', {
          email: form.email, password: form.password
        });
        auth.login(res.data.user, res.data.token);
        const r = res.data.user.role;
        if (r === 'admin')    window.location.href = '/admin';
        else if (r === 'supplier') window.location.href = '/supplier/dashboard';
        else window.location.href = '/customer/home';
      } else {
        await API.post('/register', {
          name: form.name, email: form.email, phone: form.phone,
          password: form.password, role,
          supplierType: role === 'supplier' ? supplierType : null,
          location: form.location
        });
        alert(role === 'supplier'
          ? 'Account created! Wait for admin approval.'
          : 'Account created! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  }

  const inp = {
    width: '100%', height: '52px',
    border: '1.5px solid ' + colors.borderMid,
    borderRadius: radius.md, fontSize: font.base,
    fontFamily: 'inherit', color: colors.text,
    background: colors.white, outline: 'none',
    boxSizing: 'border-box', marginBottom: 0,
    transition: 'border-color 0.15s'
  };

  function Field(props) {
    return (
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <div style={{ position: 'absolute', left: '14px', top: '50%',
                       transform: 'translateY(-50%)', color: colors.textLight,
                       display: 'flex', pointerEvents: 'none' }}>
          {props.leftIcon}
        </div>
        <input
          name={props.name} type={props.type || 'text'}
          placeholder={props.placeholder}
          value={props.value} onChange={props.onChange}
          required={props.required}
          style={{ ...inp, paddingLeft: '44px', paddingRight: props.rightIcon ? '44px' : '16px' }}
        />
        {props.rightIcon && (
          <button type="button" onClick={props.onRight}
            style={{ position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer',
                      color: colors.textLight, display: 'flex' }}>
            {props.rightIcon}
          </button>
        )}
      </div>
    );
  }

  function RoleCard(props) {
    const active = props.active;
    const ac = props.accentColor;
    const abg = props.activeBg;
    return (
      <div onClick={props.onClick}
        style={{
          border: active ? '2px solid ' + ac : '1.5px solid ' + colors.borderMid,
          borderRadius: radius.lg, padding: '16px 12px',
          textAlign: 'center', cursor: 'pointer',
          background: active ? abg : colors.white,
          position: 'relative', transition: 'all 0.15s'
        }}>
        {active && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '20px', height: '20px', background: ac,
            borderRadius: radius.full, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <div style={{
          width: '50px', height: '50px', background: active ? ac + '20' : colors.bg,
          borderRadius: radius.full, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 8px', color: ac
        }}>
          {props.icon}
        </div>
        <p style={{ fontWeight: weight.bold, color: ac, fontSize: font.base, margin: '0 0 3px' }}>
          {props.label}
        </p>
        <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>
          {props.desc}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a73e8 0%, #1a73e8 45%, #f57c00 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden'
    }}>

      {/* Background decoration */}
      <div style={{
        position: 'absolute', width: '320px', height: '320px',
        background: 'rgba(245,124,0,0.5)', borderRadius: '50%',
        top: '-80px', right: '-80px', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', width: '200px', height: '200px',
        background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
        bottom: '60px', left: '-60px', zIndex: 0
      }} />

      {/* Card */}
      <div style={{
        background: colors.white, borderRadius: '24px',
        padding: '32px 24px', width: '100%', maxWidth: '420px',
        position: 'relative', zIndex: 1, boxShadow: shadow.xl
      }}>

        {!isLogin && (
          <button onClick={() => setIsLogin(true)}
            style={{ background: colors.bg, border: 'none', cursor: 'pointer',
                      width: '36px', height: '36px', borderRadius: radius.full,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '12px', color: colors.text }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg,' + colors.primaryLight + ',' + colors.secondaryLight + ')',
            borderRadius: radius.full, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', boxShadow: shadow.md
          }}>
            <Droplets size={36} color={colors.primary} strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: weight.bold, margin: 0 }}>
            <span style={{ color: colors.text }}>Home</span>
            <span style={{ color: colors.secondary }}>Fil</span>
          </h1>
          <p style={{ color: colors.textMuted, fontSize: '12px', margin: '2px 0 0' }}>
            Water & Gas, Delivered
          </p>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: weight.bold,
                        color: colors.text, margin: '0 0 4px' }}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p style={{ color: colors.textMuted, fontSize: font.sm, margin: 0 }}>
            {isLogin ? 'Sign in to continue' : 'Join HomeFil today'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: colors.dangerLight,
            border: '1px solid #ef9a9a',
            borderRadius: radius.md, padding: '10px 14px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <Shield size={14} color={colors.danger} />
            <p style={{ color: colors.danger, fontSize: font.sm, margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={submit}>

          {/* Register fields */}
          {!isLogin && (
            <>
              <Field name="name" placeholder="Full Name"
                value={form.name} onChange={change} required
                leftIcon={<User size={16} />} />

              <Field name="phone" placeholder="Phone Number"
                value={form.phone} onChange={change} required
                leftIcon={<Phone size={16} />} />

              <Field name="location" placeholder="Your Location (e.g. Nakuru Town)"
                value={form.location} onChange={change}
                leftIcon={<MapPin size={16} />} />
            </>
          )}

          <Field name="email" type="email"
            placeholder={isLogin ? 'Email Address' : 'Email Address'}
            value={form.email} onChange={change} required
            leftIcon={<Mail size={16} />} />

          <Field name="password"
            type={showPwd ? 'text' : 'password'}
            placeholder="Password"
            value={form.password} onChange={change} required
            leftIcon={<Lock size={16} />}
            rightIcon={showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            onRight={() => setShowPwd(!showPwd)} />

          {!isLogin && (
            <Field name="confirmPassword"
              type={showPwd2 ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword} onChange={change} required
              leftIcon={<Lock size={16} />}
              rightIcon={showPwd2 ? <EyeOff size={16} /> : <Eye size={16} />}
              onRight={() => setShowPwd2(!showPwd2)} />
          )}

          {/* Remember me */}
          {isLogin && (
            <div style={{ display: 'flex', justifyContent: 'space-between',
                           alignItems: 'center', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center',
                               gap: '8px', fontSize: font.sm,
                               color: colors.textMuted, cursor: 'pointer' }}>
                <input type="checkbox"
                  style={{ width: 'auto', marginBottom: 0, accentColor: colors.primary }} />
                Remember me
              </label>
              <span style={{ color: colors.primary, fontSize: font.sm,
                              fontWeight: weight.semibold, cursor: 'pointer' }}>
                Forgot Password?
              </span>
            </div>
          )}

          {/* Account type */}
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: weight.bold, fontSize: font.base,
                           color: colors.text, margin: '0 0 10px' }}>
                I want to join as
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <RoleCard
                  active={role === 'customer'}
                  accentColor={colors.primary}
                  activeBg={colors.primaryLight}
                  onClick={() => { setRole('customer'); setSupplierType(''); }}
                  icon={<UserCircle size={24} />}
                  label="Customer"
                  desc="Order water & gas"
                />
                <RoleCard
                  active={role === 'supplier'}
                  accentColor={colors.secondary}
                  activeBg={colors.secondaryLight}
                  onClick={() => setRole('supplier')}
                  icon={<Store size={24} />}
                  label="Supplier"
                  desc="Sell & reach customers"
                />
              </div>
            </div>
          )}

          {/* Supplier type */}
          {!isLogin && role === 'supplier' && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: weight.bold, fontSize: font.base,
                           color: colors.text, margin: '0 0 10px' }}>
                What do you sell?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <RoleCard
                  active={supplierType === 'water'}
                  accentColor={colors.primary}
                  activeBg={colors.primaryLight}
                  onClick={() => setSupplierType('water')}
                  icon={<Droplets size={24} />}
                  label="Water"
                  desc="Refill & delivery"
                />
                <RoleCard
                  active={supplierType === 'gas'}
                  accentColor={colors.secondary}
                  activeBg={colors.secondaryLight}
                  onClick={() => setSupplierType('gas')}
                  icon={<Flame size={24} />}
                  label="Gas"
                  desc="LPG cylinders"
                />
              </div>
              {!supplierType && (
                <p style={{ fontSize: '12px', color: colors.secondary,
                             margin: '8px 0 0', textAlign: 'center',
                             fontWeight: weight.medium }}>
                  Please select what you sell
                </p>
              )}
            </div>
          )}

          {/* Terms */}
          {!isLogin && (
            <label style={{ display: 'flex', alignItems: 'flex-start',
                             gap: '8px', marginBottom: '16px', cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ width: 'auto', marginBottom: 0,
                          marginTop: '2px', accentColor: colors.primary }} />
              <span style={{ fontSize: '13px', color: colors.textMuted }}>
                I agree to the{' '}
                <span onClick={e => { e.preventDefault(); window.open('/terms', '_blank'); }}
                  style={{ color: colors.primary, fontWeight: weight.semibold,
                            cursor: 'pointer', textDecoration: 'underline' }}>
                  Terms & Conditions
                </span>
                {' '}and{' '}
                <span onClick={e => { e.preventDefault(); window.open('/privacy', '_blank'); }}
                  style={{ color: colors.primary, fontWeight: weight.semibold,
                            cursor: 'pointer', textDecoration: 'underline' }}>
                  Privacy Policy
                </span>
              </span>
            </label>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '15px',
              background: loading ? colors.textLight
                : 'linear-gradient(135deg,' + colors.primary + ',' + colors.secondary + ')',
              color: colors.white, border: 'none',
              borderRadius: radius.md, fontSize: font.base,
              fontWeight: weight.bold, cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px', fontFamily: 'inherit',
              boxShadow: loading ? 'none' : shadow.md,
              transition: 'opacity 0.15s'
            }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center',
                         gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: colors.borderMid }} />
            <span style={{ color: colors.textLight, fontSize: font.sm }}>
              {isLogin ? 'or sign in with' : 'or sign up with'}
            </span>
            <div style={{ flex: 1, height: '1px', background: colors.borderMid }} />
          </div>

          {/* Social */}
          <div style={{ display: 'grid',
                         gridTemplateColumns: isLogin ? '1fr 1fr 1fr' : '1fr 1fr',
                         gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Google', color: '#4285f4' },
              { label: 'Facebook', color: '#1877f2' },
              ...(isLogin ? [{ label: 'Phone', color: colors.primary }] : [])
            ].map(function(s, i) {
              return (
                <button key={i} type="button"
                  style={{ padding: '10px 8px',
                            border: '1.5px solid ' + colors.borderMid,
                            borderRadius: radius.md, background: colors.white,
                            cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            gap: '6px', fontSize: font.sm,
                            fontWeight: weight.medium, fontFamily: 'inherit',
                            color: s.color }}>
                  {s.label === 'Google' && (
                    <span style={{ fontWeight: weight.bold, fontSize: '16px' }}>G</span>
                  )}
                  {s.label === 'Facebook' && (
                    <span style={{ fontWeight: weight.bold, fontSize: '16px' }}>f</span>
                  )}
                  {s.label === 'Phone' && <Phone size={14} />}
                  <span style={{ color: colors.textMuted }}>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle */}
          <p style={{ textAlign: 'center', fontSize: font.sm,
                       color: colors.textMuted, margin: 0 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ color: colors.primary, fontWeight: weight.bold, cursor: 'pointer' }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </form>
      </div>

      {/* Bottom badges */}
      {isLogin && (
        <div style={{ display: 'flex', gap: '24px', marginTop: '24px',
                       justifyContent: 'center', zIndex: 1 }}>
          {[
            { icon: <Shield size={20} color="white" />, title: 'Secure', sub: '& Reliable' },
            { icon: <Store size={20} color="white" />, title: 'Fast', sub: 'Delivery' },
            { icon: <Droplets size={20} color="white" />, title: 'Quality', sub: 'Guaranteed' }
          ].map(function(item, i) {
            return (
              <div key={i} style={{ textAlign: 'center', color: 'white' }}>
                <div style={{
                  width: '44px', height: '44px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: radius.full, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 6px'
                }}>
                  {item.icon}
                </div>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: weight.bold }}>
                  {item.title}
                </p>
                <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}