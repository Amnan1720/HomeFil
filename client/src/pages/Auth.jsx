import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [role, setRole] = useState('customer');
  const [supplierType, setSupplierType] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', confirmPassword: '', location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        setError('Please select what you sell (Gas or Water)'); return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await API.post('/login', {
          email: form.email,
          password: form.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          navigate('/');
        }
      } else {
        await API.post('/register', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role,
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

  const inputStyle = {
    paddingLeft: 44, border: '1.5px solid #e0e0e0',
    borderRadius: 12, height: 52, fontSize: 15,
    width: '100%', boxSizing: 'border-box',
    marginBottom: 0, outline: 'none', background: 'white'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a73e8 0%, #1a73e8 40%, #f57c00 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden'
    }}>

      {/* Background circle */}
      <div style={{
        position: 'absolute', width: 350, height: 350,
        background: 'rgba(245,124,0,0.65)', borderRadius: '50%',
        top: -80, right: -100, zIndex: 0
      }} />

      {/* Card */}
      <div style={{
        background: 'white', borderRadius: 24, padding: '32px 24px',
        width: '100%', maxWidth: 420, position: 'relative',
        zIndex: 1, boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>

        {!isLogin && (
          <button onClick={() => setIsLogin(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
                     fontSize: 22, color: '#333', marginBottom: 8, padding: 0 }}>
            ←
          </button>
        )}

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{
            width: 90, height: 90,
            background: 'linear-gradient(135deg,#e3f2fd,#fff3e0)',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', fontSize: 40,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>🏠</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            <span style={{ color: '#1a1a2e' }}>Home</span>
            <span style={{ color: '#f57c00' }}>Fil</span>
          </h1>
          <p style={{ color: '#888', fontSize: 12, margin: '2px 0 0' }}>
            — Water & Gas, Delivered —
          </p>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>
            {isLogin ? 'Welcome back! 👋' : 'Create your account'}
          </h2>
          <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
            {isLogin ? 'Login to continue using HomeFil' : 'Sign up to get started with HomeFil'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#ffebee', border: '1px solid #ef9a9a',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16
          }}>
            <p style={{ color: '#c62828', fontSize: 13, margin: 0 }}>❌ {error}</p>
          </div>
        )}

        <form onSubmit={submit}>

          {/* Register fields */}
          {!isLogin && (
            <>
              {/* Full name */}
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%',
                               transform: 'translateY(-50%)', fontSize: 16, color: '#aaa' }}>👤</span>
                <input name="name" placeholder="Full Name"
                  value={form.name} onChange={change} required style={inputStyle} />
              </div>

              {/* Phone */}
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%',
                               transform: 'translateY(-50%)', fontSize: 16, color: '#aaa' }}>📞</span>
                <input name="phone" placeholder="Phone Number"
                  value={form.phone} onChange={change} required style={inputStyle} />
              </div>

              {/* Location */}
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%',
                               transform: 'translateY(-50%)', fontSize: 16, color: '#aaa' }}>📍</span>
                <input name="location" placeholder="Your location (e.g. Nakuru Town)"
                  value={form.location} onChange={change} style={inputStyle} />
              </div>

              {/* Account type */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 10 }}>
                  I want to join as
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

                  {/* Customer */}
                  <div onClick={() => { setRole('customer'); setSupplierType(''); }}
                    style={{
                      border: role === 'customer' ? '2px solid #1a73e8' : '1.5px solid #e0e0e0',
                      borderRadius: 12, padding: '14px 10px', textAlign: 'center',
                      cursor: 'pointer', background: role === 'customer' ? '#f0f7ff' : 'white',
                      position: 'relative'
                    }}>
                    {role === 'customer' && (
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 20, height: 20, background: '#1a73e8',
                        borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 11
                      }}>✓</div>
                    )}
                    <div style={{
                      width: 48, height: 48, background: '#e3f2fd',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', margin: '0 auto 8px', fontSize: 22
                    }}>👤</div>
                    <p style={{ fontWeight: 700, color: '#1a73e8', fontSize: 14, margin: '0 0 4px' }}>
                      Customer
                    </p>
                    <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                      Order water and gas delivered to you
                    </p>
                  </div>

                  {/* Supplier */}
                  <div onClick={() => setRole('supplier')}
                    style={{
                      border: role === 'supplier' ? '2px solid #f57c00' : '1.5px solid #e0e0e0',
                      borderRadius: 12, padding: '14px 10px', textAlign: 'center',
                      cursor: 'pointer', background: role === 'supplier' ? '#fff8f0' : 'white',
                      position: 'relative'
                    }}>
                    {role === 'supplier' && (
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 20, height: 20, background: '#f57c00',
                        borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 11
                      }}>✓</div>
                    )}
                    <div style={{
                      width: 48, height: 48, background: '#fff3e0',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', margin: '0 auto 8px', fontSize: 22
                    }}>🏪</div>
                    <p style={{ fontWeight: 700, color: '#f57c00', fontSize: 14, margin: '0 0 4px' }}>
                      Supplier
                    </p>
                    <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                      List your products and reach customers
                    </p>
                  </div>
                </div>
              </div>

              {/* Supplier type — only show if supplier selected */}
              {role === 'supplier' && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 10 }}>
                    What do you sell?
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

                    {/* Water */}
                    <div onClick={() => setSupplierType('water')}
                      style={{
                        border: supplierType === 'water' ? '2px solid #1a73e8' : '1.5px solid #e0e0e0',
                        borderRadius: 12, padding: '14px 10px', textAlign: 'center',
                        cursor: 'pointer', background: supplierType === 'water' ? '#f0f7ff' : 'white',
                        position: 'relative'
                      }}>
                      {supplierType === 'water' && (
                        <div style={{
                          position: 'absolute', top: 8, right: 8, width: 20, height: 20,
                          background: '#1a73e8', borderRadius: '50%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11
                        }}>✓</div>
                      )}
                      <div style={{
                        width: 48, height: 48, background: '#e3f2fd', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 8px', fontSize: 26
                      }}>💧</div>
                      <p style={{ fontWeight: 700, color: '#1a73e8', fontSize: 14, margin: '0 0 2px' }}>
                        Water
                      </p>
                      <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                        Water refill & delivery
                      </p>
                    </div>

                    {/* Gas */}
                    <div onClick={() => setSupplierType('gas')}
                      style={{
                        border: supplierType === 'gas' ? '2px solid #f57c00' : '1.5px solid #e0e0e0',
                        borderRadius: 12, padding: '14px 10px', textAlign: 'center',
                        cursor: 'pointer', background: supplierType === 'gas' ? '#fff8f0' : 'white',
                        position: 'relative'
                      }}>
                      {supplierType === 'gas' && (
                        <div style={{
                          position: 'absolute', top: 8, right: 8, width: 20, height: 20,
                          background: '#f57c00', borderRadius: '50%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11
                        }}>✓</div>
                      )}
                      <div style={{
                        width: 48, height: 48, background: '#fff3e0', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 8px', fontSize: 26
                      }}>🔥</div>
                      <p style={{ fontWeight: 700, color: '#f57c00', fontSize: 14, margin: '0 0 2px' }}>
                        Gas
                      </p>
                      <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                        LPG gas cylinders
                      </p>
                    </div>
                  </div>

                  {/* Show warning if supplier type not selected */}
                  {role === 'supplier' && !supplierType && (
                    <p style={{ fontSize: 12, color: '#f57c00', margin: '8px 0 0',
                                 textAlign: 'center', fontWeight: 500 }}>
                      ⚠️ Please select what you sell
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%',
                           transform: 'translateY(-50%)', fontSize: 16, color: '#aaa' }}>
              {isLogin ? '👤' : '✉️'}
            </span>
            <input name="email" type="email"
              placeholder={isLogin ? 'Phone or Email' : 'Email Address'}
              value={form.email} onChange={change} required style={inputStyle} />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%',
                           transform: 'translateY(-50%)', fontSize: 16, color: '#aaa' }}>🔒</span>
            <input name="password" type={showPwd ? 'text' : 'password'}
              placeholder="Password" value={form.password} onChange={change} required
              style={{ ...inputStyle, paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              style={{ position: 'absolute', right: 14, top: '50%',
                       transform: 'translateY(-50%)', background: 'none',
                       border: 'none', cursor: 'pointer', fontSize: 16, color: '#aaa' }}>
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Confirm password */}
          {!isLogin && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%',
                             transform: 'translateY(-50%)', fontSize: 16, color: '#aaa' }}>🔒</span>
              <input name="confirmPassword" type={showPwd2 ? 'text' : 'password'}
                placeholder="Confirm Password" value={form.confirmPassword}
                onChange={change} required style={{ ...inputStyle, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPwd2(!showPwd2)}
                style={{ position: 'absolute', right: 14, top: '50%',
                         transform: 'translateY(-50%)', background: 'none',
                         border: 'none', cursor: 'pointer', fontSize: 16, color: '#aaa' }}>
                {showPwd2 ? '🙈' : '👁️'}
              </button>
            </div>
          )}

          {/* Remember me */}
          {isLogin && (
            <div style={{ display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8,
                              fontSize: 14, color: '#555', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 'auto', marginBottom: 0, accentColor: '#1a73e8' }} />
                Remember me
              </label>
              <span style={{ color: '#1a73e8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Forgot Password?
              </span>
            </div>
          )}

          {/* Terms */}
          {!isLogin && (
            <label style={{ display: 'flex', alignItems: 'flex-start',
                            gap: 8, marginBottom: 16, cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ width: 'auto', marginBottom: 0, marginTop: 2, accentColor: '#1a73e8' }} />
              <span style={{ fontSize: 13, color: '#555' }}>
                I agree to the{' '}
                <span onClick={e => { e.preventDefault(); window.open('/terms', '_blank'); }}
                  style={{ color: '#1a73e8', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                  Terms & Conditions
                </span>
                {' '}and{' '}
                <span onClick={e => { e.preventDefault(); window.open('/privacy', '_blank'); }}
                  style={{ color: '#1a73e8', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                  Privacy Policy
                </span>
              </span>
            </label>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 15,
            background: loading ? '#ccc' : 'linear-gradient(135deg,#1a73e8 0%,#f57c00 100%)',
            color: 'white', border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 16
          }}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
            <span style={{ color: '#aaa', fontSize: 13 }}>
              {isLogin ? 'or login with' : 'or sign up with'}
            </span>
            <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'grid',
                        gridTemplateColumns: isLogin ? '1fr 1fr 1fr' : '1fr 1fr',
                        gap: 10, marginBottom: 20 }}>
            <button type="button" style={{
              padding: '10px 8px', border: '1.5px solid #e0e0e0', borderRadius: 10,
              background: 'white', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              fontSize: 13, fontWeight: 500
            }}>
              <span style={{ fontWeight: 700, color: '#4285f4', fontSize: 16 }}>G</span>
              <span style={{ color: '#555' }}>Google</span>
            </button>
            <button type="button" style={{
              padding: '10px 8px', border: '1.5px solid #e0e0e0', borderRadius: 10,
              background: 'white', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              fontSize: 13, fontWeight: 500
            }}>
              <span style={{ fontWeight: 700, color: '#1877f2', fontSize: 16 }}>f</span>
              <span style={{ color: '#555' }}>Facebook</span>
            </button>
            {isLogin && (
              <button type="button" style={{
                padding: '10px 8px', border: '1.5px solid #e0e0e0', borderRadius: 10,
                background: 'white', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 13, fontWeight: 500
              }}>
                <span style={{ fontSize: 16 }}>📱</span>
                <span style={{ color: '#555' }}>Phone</span>
              </button>
            )}
          </div>

          {/* Toggle */}
          <p style={{ textAlign: 'center', fontSize: 14, color: '#555', margin: 0 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ color: '#1a73e8', fontWeight: 700, cursor: 'pointer' }}>
              {isLogin ? 'Sign up' : 'Login'}
            </span>
          </p>
        </form>
      </div>

      {/* Bottom badges */}
      {isLogin && (
        <div style={{ display: 'flex', gap: 24, marginTop: 24, justifyContent: 'center' }}>
          {[
            { icon: '🛡️', title: 'Secure', sub: '& Reliable' },
            { icon: '🚚', title: 'Fast', sub: 'Delivery' },
            { icon: '✅', title: 'Quality', sub: 'Guaranteed' }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{
                width: 44, height: 44, border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 6px', fontSize: 20
              }}>
                {item.icon}
              </div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.8 }}>{item.sub}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}