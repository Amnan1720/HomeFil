import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE = 'https://homefil-backed.onrender.com';

const EMPTY = {
  category: 'water', serviceType: 'refill', productType: '',
  price: '', location: '', phone: '', whatsapp: '',
  deliveryAvailable: false, deliveryTime: '', status: 'available'
};

export default function Dashboard() {
  const [tab, setTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => { load(); }, []);

  function load() {
    axios.get(BASE + '/api/listings')
      .then(r => setListings(r.data.filter(l => l.supplierId === user.id)))
      .catch(console.error);
    axios.get(BASE + '/api/requests', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => setRequests(r.data))
      .catch(console.error);
  }

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  }

  function pickImages(e) {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  }

  async function submit(e) {
    e.preventDefault();
    setErr(''); setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      images.forEach(f => fd.append('images', f));
      const cfg = { headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' } };
      if (editId) await axios.put(BASE + '/api/listings/' + editId, fd, cfg);
      else await axios.post(BASE + '/api/listings', fd, cfg);
      setForm(EMPTY); setEditId(null); setImages([]); setPreviews([]);
      load(); setTab('listings');
    } catch (e) { setErr(e.response?.data?.message || 'Error saving'); }
    setSaving(false);
  }

  function edit(l) {
    setForm({ category: l.category, serviceType: l.serviceType, productType: l.productType || '',
              price: l.price, location: l.location, phone: l.phone, whatsapp: l.whatsapp || '',
              deliveryAvailable: l.deliveryAvailable, deliveryTime: l.deliveryTime || '', status: l.status });
    setEditId(l._id);
    setPreviews(l.images?.length ? l.images.map(i => BASE + '/uploads/' + i) : l.image ? [BASE + '/uploads/' + l.image] : []);
    setImages([]); setTab('add'); window.scrollTo(0, 0);
  }

  async function del(id) {
    if (!window.confirm('Delete this listing?')) return;
    await axios.delete(BASE + '/api/listings/' + id, { headers: { Authorization: 'Bearer ' + token } });
    load();
  }

  function init(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  const avail = listings.filter(l => l.status === 'available').length;
  const oos = listings.filter(l => l.status === 'out_of_stock').length;
  const water = listings.filter(l => l.category === 'water').length;
  const gas = listings.filter(l => l.category === 'gas').length;

  if (user.role !== 'supplier') {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ fontSize: 40 }}>🚫</p>
        <p style={{ color: '#888' }}>This page is for suppliers only</p>
        <Link to="/auth" style={{ color: '#1a73e8' }}>Go to login</Link>
      </div>
    );
  }

  return (
    <div style={{ margin: '-16px', paddingBottom: 90 }}>

      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg,#f57c00 0%,#1a73e8 100%)', padding: '20px 16px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '0 0 2px' }}>Welcome back,</p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{user.name}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: '#e8f5e9', borderRadius: 20, padding: '4px 12px' }}>
              <div style={{ width: 8, height: 8, background: '#2e7d32', borderRadius: '50%' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32' }}>Approved Supplier</span>
            </div>
          </div>
          <div style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.25)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', fontWeight: 700,
                        fontSize: 18, border: '2px solid rgba(255,255,255,0.4)' }}>
            {init(user.name)}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 20 }}>
          {[
            { label: 'Listings', value: listings.length, icon: '📋' },
            { label: 'Live', value: avail, icon: '✅' },
            { label: 'Requests', value: requests.length, icon: '🚨' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12,
                                   padding: '12px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: 20, margin: '0 0 2px' }}>{s.icon}</p>
              <p style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: '0 0 2px' }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            {/* Add listing button */}
            <div onClick={() => { setForm(EMPTY); setEditId(null); setImages([]); setPreviews([]); setTab('add'); }}
              style={{ background: 'linear-gradient(135deg,#f57c00,#1a73e8)', borderRadius: 16,
                       padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
                       alignItems: 'center', marginBottom: 16, cursor: 'pointer',
                       boxShadow: '0 4px 16px rgba(245,124,0,0.3)' }}>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 16, margin: '0 0 2px' }}>Add new listing</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>Post water or gas product</p>
              </div>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: 'white', fontSize: 28, fontWeight: 300 }}>+</div>
            </div>

            {/* Stock overview */}
            <div style={{ background: 'white', borderRadius: 16, padding: 16,
                          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>Stock Overview</p>
              {[
                { label: 'Available', value: avail, color: '#2e7d32', bg: '#e8f5e9' },
                { label: 'Out of stock', value: oos, color: '#c62828', bg: '#ffebee' },
                { label: '💧 Water', value: water, color: '#1565c0', bg: '#e3f2fd' },
                { label: '🔥 Gas', value: gas, color: '#e65100', bg: '#fff3e0' }
              ].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                                       alignItems: 'center', paddingBottom: i < arr.length - 1 ? 12 : 0,
                                       marginBottom: i < arr.length - 1 ? 12 : 0,
                                       borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <p style={{ fontSize: 14, color: '#555', margin: 0 }}>{item.label}</p>
                  <div style={{ background: item.bg, color: item.color, fontWeight: 700,
                                fontSize: 14, padding: '4px 14px', borderRadius: 20 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Urgent requests preview */}
            {requests.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: 16,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                    🚨 Urgent Requests
                  </p>
                  <span onClick={() => setTab('requests')}
                    style={{ fontSize: 13, color: '#f57c00', cursor: 'pointer', fontWeight: 600 }}>
                    See all ({requests.length})
                  </span>
                </div>
                {requests.slice(0, 2).map((req, i) => (
                  <div key={req._id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start',
                                               paddingBottom: i < 1 ? 12 : 0,
                                               marginBottom: i < 1 ? 12 : 0,
                                               borderBottom: i < 1 && requests.length > 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                   background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {req.category === 'gas' ? '🔥' : '💧'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: '0 0 2px' }}>
                        {req.requestText}
                      </p>
                      <p style={{ fontSize: 11, color: '#888', margin: 0 }}>📍 {req.location}</p>
                    </div>
                    {req.userId && (
                      <a href={'tel:' + req.userId.phone}
                        style={{ background: '#1a73e8', color: 'white', padding: '6px 12px',
                                  borderRadius: 8, fontSize: 12, fontWeight: 600,
                                  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        📞 Call
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Recent listings */}
            <div style={{ background: 'white', borderRadius: 16, padding: 16,
                          boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Recent listings</p>
                <span onClick={() => setTab('listings')}
                  style={{ fontSize: 13, color: '#1a73e8', cursor: 'pointer', fontWeight: 600 }}>
                  See all
                </span>
              </div>
              {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#888' }}>
                  <p style={{ fontSize: 32, margin: '0 0 8px' }}>📋</p>
                  <p style={{ fontSize: 13 }}>No listings yet. Add your first one!</p>
                </div>
              ) : (
                listings.slice(0, 3).map(l => (
                  <div key={l._id} style={{ display: 'flex', alignItems: 'center', gap: 12,
                                             marginBottom: 12, paddingBottom: 12,
                                             borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                                   background: l.category === 'water' ? '#e3f2fd' : '#fff3e0',
                                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                      {l.image
                        ? <img src={BASE + '/uploads/' + l.image} alt="" style={{ width: 52, height: 52, objectFit: 'cover' }} />
                        : (l.category === 'water' ? '💧' : '🔥')
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: '0 0 2px' }}>{l.productType}</p>
                      <p style={{ fontSize: 12, color: '#888', margin: 0 }}>KSh {l.price?.toLocaleString()} · {l.location}</p>
                    </div>
                    <div style={{ background: l.status === 'available' ? '#e8f5e9' : '#ffebee',
                                   color: l.status === 'available' ? '#2e7d32' : '#c62828',
                                   fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                      {l.status === 'available' ? 'Live' : 'Out'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── MY LISTINGS ── */}
        {tab === 'listings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                My Listings ({listings.length})
              </p>
              <button onClick={() => { setForm(EMPTY); setEditId(null); setImages([]); setPreviews([]); setTab('add'); }}
                style={{ background: '#f57c00', color: 'white', border: 'none',
                          borderRadius: 10, padding: '8px 16px', fontSize: 13,
                          fontWeight: 700, cursor: 'pointer' }}>
                + Add
              </button>
            </div>

            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                <p style={{ fontSize: 48, margin: '0 0 12px' }}>📋</p>
                <p style={{ fontSize: 15, margin: '0 0 16px' }}>No listings yet</p>
                <button onClick={() => setTab('add')}
                  style={{ background: '#f57c00', color: 'white', border: 'none',
                            borderRadius: 12, padding: '12px 24px', fontSize: 14,
                            fontWeight: 700, cursor: 'pointer' }}>
                  Add your first listing
                </button>
              </div>
            ) : (
              listings.map(l => (
                <div key={l._id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden',
                                           marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ position: 'relative' }}>
                    {l.image ? (
                      <img src={BASE + '/uploads/' + l.image} alt={l.productType}
                        style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: 100, fontSize: 48,
                                     background: l.category === 'water'
                                       ? 'linear-gradient(135deg,#e3f2fd,#bbdefb)'
                                       : 'linear-gradient(135deg,#fff3e0,#ffe0b2)',
                                     display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {l.category === 'water' ? '💧' : '🔥'}
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: 8, left: 8,
                                   background: l.status === 'available' ? '#e8f5e9' : '#ffebee',
                                   color: l.status === 'available' ? '#2e7d32' : '#c62828',
                                   fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                      {l.status === 'available' ? '● Available' : '● Out of stock'}
                    </div>
                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                      <button onClick={() => edit(l)}
                        style={{ width: 34, height: 34, background: 'white', border: 'none',
                                  borderRadius: '50%', cursor: 'pointer', fontSize: 14,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>✏️</button>
                      <button onClick={() => del(l._id)}
                        style={{ width: 34, height: 34, background: 'white', border: 'none',
                                  borderRadius: '50%', cursor: 'pointer', fontSize: 14,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>🗑️</button>
                    </div>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{l.productType}</p>
                      <p style={{ fontSize: 16, fontWeight: 700,
                                   color: l.category === 'water' ? '#1a73e8' : '#f57c00', margin: 0 }}>
                        KSh {l.price?.toLocaleString()}
                      </p>
                    </div>
                    <p style={{ fontSize: 12, color: '#888', margin: '0 0 10px' }}>
                      📍 {l.location} · {l.serviceType}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ background: l.category === 'water' ? '#e3f2fd' : '#fff3e0',
                                      color: l.category === 'water' ? '#1565c0' : '#e65100',
                                      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                        {l.category === 'water' ? '💧' : '🔥'} {l.category}
                      </span>
                      {l.deliveryAvailable && (
                        <span style={{ background: '#e8f5e9', color: '#2e7d32',
                                        fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20 }}>
                          🚚 Delivery {l.deliveryTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── ADD LISTING ── */}
        {tab === 'add' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <button onClick={() => setTab('listings')}
                style={{ background: '#f5f7fa', border: 'none', borderRadius: '50%',
                          width: 36, height: 36, cursor: 'pointer', fontSize: 18 }}>←</button>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                {editId ? 'Edit Listing' : 'New Listing'}
              </p>
            </div>

            {err && (
              <div style={{ background: '#ffebee', border: '1px solid #ef9a9a',
                             borderRadius: 12, padding: 14, marginBottom: 16 }}>
                <p style={{ color: '#c62828', fontSize: 13, margin: 0 }}>❌ {err}</p>
              </div>
            )}

            <form onSubmit={submit}>
              <div style={{ background: 'white', borderRadius: 16, padding: 16,
                             marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#f57c00', margin: '0 0 14px',
                             paddingBottom: 10, borderBottom: '1px solid #f5f5f5' }}>
                  📦 Product Info
                </p>
                <label>Category</label>
                <select name="category" value={form.category} onChange={change}>
                  <option value="water">💧 Water</option>
                  <option value="gas">🔥 Gas</option>
                </select>
                <label>Service type</label>
                <select name="serviceType" value={form.serviceType} onChange={change}>
                  <option value="refill">Refill</option>
                  <option value="buy">Buy new</option>
                </select>
                <label>Product description</label>
                <input name="productType" value={form.productType} onChange={change}
                  placeholder="e.g. 20L drinking water, 6kg gas cylinder" required />
                <label>Price (KSh)</label>
                <input name="price" type="number" value={form.price} onChange={change} required />
              </div>

              <div style={{ background: 'white', borderRadius: 16, padding: 16,
                             marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a73e8', margin: '0 0 14px',
                             paddingBottom: 10, borderBottom: '1px solid #f5f5f5' }}>
                  📍 Contact & Location
                </p>
                <label>Your location</label>
                <input name="location" value={form.location} onChange={change} placeholder="e.g. Nakuru Town" required />
                <label>Phone number</label>
                <input name="phone" value={form.phone} onChange={change} placeholder="e.g. 0712345678" required />
                <label>WhatsApp number (optional)</label>
                <input name="whatsapp" value={form.whatsapp} onChange={change} placeholder="e.g. 254712345678" />
              </div>

              <div style={{ background: 'white', borderRadius: 16, padding: 16,
                             marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#2e7d32', margin: '0 0 14px',
                             paddingBottom: 10, borderBottom: '1px solid #f5f5f5' }}>
                  🚚 Delivery & Status
                </p>
                <label>Status</label>
                <select name="status" value={form.status} onChange={change}>
                  <option value="available">Available</option>
                  <option value="out_of_stock">Out of stock</option>
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
                  <input type="checkbox" name="deliveryAvailable"
                    checked={form.deliveryAvailable} onChange={change}
                    style={{ width: 18, height: 18, marginBottom: 0, accentColor: '#2e7d32' }} />
                  <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>Delivery available</span>
                </label>
                {form.deliveryAvailable && (
                  <input name="deliveryTime" value={form.deliveryTime} onChange={change}
                    placeholder="e.g. Within 2 hours" />
                )}
              </div>

              <div style={{ background: 'white', borderRadius: 16, padding: 16,
                             marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#555', margin: '0 0 6px' }}>📷 Product Photos</p>
                <p style={{ fontSize: 12, color: '#aaa', margin: '0 0 14px' }}>
                  Upload up to 5 photos · Max 10MB each · First photo is main
                </p>
                <input type="file" accept="image/*" multiple onChange={pickImages}
                  style={{ display: 'none' }} id="imgPick" />
                <label htmlFor="imgPick" style={{
                  display: 'block', border: '2px dashed #f57c00', borderRadius: 12,
                  padding: '20px 16px', textAlign: 'center', background: '#fff8f0',
                  cursor: 'pointer'
                }}>
                  <p style={{ fontSize: 30, margin: '0 0 8px' }}>📸</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#f57c00', margin: '0 0 4px' }}>
                    Tap to choose photos
                  </p>
                  <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>
                    JPEG, PNG, WEBP supported
                  </p>
                </label>

                {previews.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                      {previews.length} photo{previews.length > 1 ? 's' : ''} selected:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                      {previews.map((p, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={p} alt="" style={{
                            width: '100%', height: 85, objectFit: 'cover', borderRadius: 10,
                            border: i === 0 ? '2px solid #f57c00' : '1px solid #eee'
                          }} />
                          {i === 0 && (
                            <div style={{ position: 'absolute', bottom: 4, left: 4, background: '#f57c00',
                                           color: 'white', fontSize: 9, padding: '2px 6px',
                                           borderRadius: 4, fontWeight: 700 }}>MAIN</div>
                          )}
                          {images.length > 0 && (
                            <button type="button"
                              onClick={() => { setImages(images.filter((_,j)=>j!==i)); setPreviews(previews.filter((_,j)=>j!==i)); }}
                              style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22,
                                        background: '#c62828', color: 'white', border: 'none',
                                        borderRadius: '50%', cursor: 'pointer', fontSize: 13,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={saving} style={{
                width: '100%', padding: 16,
                background: saving ? '#ccc' : 'linear-gradient(135deg,#f57c00,#1a73e8)',
                color: 'white', border: 'none', borderRadius: 14,
                fontSize: 16, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: saving ? 'none' : '0 4px 16px rgba(245,124,0,0.3)'
              }}>
                {saving ? '⏳ Saving...' : editId ? '✅ Save changes' : '🚀 Post listing'}
              </button>
            </form>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {tab === 'analytics' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>📊 Analytics</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Total Listings', value: listings.length, icon: '📋', color: '#f57c00', bg: '#fff3e0' },
                { label: 'Live Now', value: avail, icon: '✅', color: '#2e7d32', bg: '#e8f5e9' },
                { label: 'Out of Stock', value: oos, icon: '❌', color: '#c62828', bg: '#ffebee' },
                { label: 'Requests', value: requests.length, icon: '🚨', color: '#1a73e8', bg: '#e3f2fd' }
              ].map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 16, padding: 16,
                                       boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, background: item.bg, borderRadius: '50%',
                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 margin: '0 auto 10px', fontSize: 22 }}>
                    {item.icon}
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 700, color: item.color, margin: '0 0 4px' }}>{item.value}</p>
                  <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{item.label}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 16,
                           boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>
                Category Breakdown
              </p>
              {[
                { label: '💧 Water listings', value: water, total: listings.length, color: '#1a73e8', bg: '#e3f2fd' },
                { label: '🔥 Gas listings', value: gas, total: listings.length, color: '#f57c00', bg: '#fff3e0' }
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: i === 0 ? 16 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: '#555' }}>{item.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                  <div style={{ background: item.bg, borderRadius: 20, height: 10, overflow: 'hidden' }}>
                    <div style={{
                      background: item.color, height: '100%', borderRadius: 20,
                      width: (item.total > 0 ? (item.value / item.total * 100) : 0) + '%',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg,#f57c00,#1a73e8)', borderRadius: 16,
                           padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 18, margin: '0 0 8px' }}>💡</p>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
                Keep your listings updated!
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>
                Active listings get more customer contacts
              </p>
            </div>
          </div>
        )}

        {/* ── REQUESTS ── */}
        {tab === 'requests' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
              🚨 Customer Requests
            </p>

            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                <p style={{ fontSize: 48, margin: '0 0 12px' }}>🚨</p>
                <p style={{ fontSize: 15 }}>No urgent requests right now</p>
              </div>
            ) : (
              requests.map(req => (
                <div key={req._id} style={{ background: 'white', borderRadius: 16, padding: 16,
                                             marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                                   background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                      {req.category === 'gas' ? '🔥' : '💧'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                                        color: req.category === 'gas' ? '#e65100' : '#1565c0',
                                        fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
                          {req.category}
                        </span>
                        <span style={{ background: '#ffebee', color: '#c62828',
                                        fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
                          🚨 Urgent
                        </span>
                      </div>
                      {req.userId && (
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>
                          By {req.userId.name}
                        </p>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: '#aaa', margin: 0, flexShrink: 0 }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ background: '#f9f9f9', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                    <p style={{ fontSize: 14, color: '#333', margin: 0, lineHeight: 1.5 }}>
                      "{req.requestText}"
                    </p>
                  </div>

                  <p style={{ fontSize: 13, color: '#666', margin: '0 0 12px' }}>
                    📍 {req.location}
                  </p>

                  {req.userId && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <a href={'tel:' + req.userId.phone}
                        style={{ background: '#1a73e8', color: 'white', padding: '10px 0',
                                  borderRadius: 10, textAlign: 'center', fontSize: 14,
                                  fontWeight: 600, textDecoration: 'none', display: 'block' }}>
                        📞 Call
                      </a>
                      <a href={'https://wa.me/' + (req.userId.phone || '').replace(/\D/g, '')}
                        target="_blank" rel="noreferrer"
                        style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px 0',
                                  borderRadius: 10, textAlign: 'center', fontSize: 14,
                                  fontWeight: 600, textDecoration: 'none', display: 'block' }}>
                        💬 WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>👤 My Profile</p>

            <div style={{ background: 'white', borderRadius: 16, padding: 24,
                           boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center', marginBottom: 16 }}>
              <div style={{ width: 72, height: 72,
                             background: 'linear-gradient(135deg,#f57c00,#1a73e8)',
                             borderRadius: '50%', display: 'flex', alignItems: 'center',
                             justifyContent: 'center', margin: '0 auto 12px',
                             color: 'white', fontSize: 26, fontWeight: 700 }}>
                {init(user.name)}
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' }}>
                {user.name}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                             background: '#e8f5e9', borderRadius: 20, padding: '4px 14px' }}>
                <div style={{ width: 8, height: 8, background: '#2e7d32', borderRadius: '50%' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32' }}>Approved Supplier</span>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden',
                           boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              {[
                { icon: '📧', label: 'Email', value: user.email || 'Not provided' },
                { icon: '📞', label: 'Phone', value: user.phone || 'Not provided' },
                { icon: '📍', label: 'Location', value: user.location || 'Not provided' },
                { icon: '🏷️', label: 'Account Type', value: 'Supplier' }
              ].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14,
                                       padding: '14px 16px',
                                       borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ width: 38, height: 38, background: '#f5f7fa', borderRadius: 10,
                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 fontSize: 18, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#aaa', margin: '0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden',
                           boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              {[
                { icon: '📋', label: 'Terms & Conditions', link: '/terms', color: '#1a73e8' },
                { icon: '🔒', label: 'Privacy Policy', link: '/privacy', color: '#1a73e8' }
              ].map((item, i, arr) => (
                <Link key={i} to={item.link} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14,
                                 padding: '14px 16px',
                                 borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <div style={{ width: 38, height: 38, background: '#e3f2fd', borderRadius: 10,
                                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {item.icon}
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0, flex: 1 }}>
                      {item.label}
                    </p>
                    <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/auth'; }}
              style={{ width: '100%', padding: 15, background: '#ffebee', color: '#c62828',
                        border: '1.5px solid #ef9a9a', borderRadius: 14, fontSize: 15,
                        fontWeight: 700, cursor: 'pointer' }}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAVIGATION ── */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                     width: '100%', maxWidth: 480, background: 'white',
                     borderTop: '1px solid #f0f0f0', zIndex: 100,
                     display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', padding: '8px 0 12px' }}>
        {[
          { key: 'overview',  icon: '🏠', label: 'Home' },
          { key: 'listings',  icon: '📋', label: 'Listings' },
          { key: 'add',       icon: '➕', label: 'Add', special: true },
          { key: 'analytics', icon: '📊', label: 'Stats' },
          { key: 'requests',  icon: '🚨', label: 'Requests' },
          { key: 'profile',   icon: '👤', label: 'Profile' }
        ].map(item => (
          <div key={item.key} onClick={() => setTab(item.key)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 2, cursor: 'pointer' }}>
            <div style={{
              width: item.special ? 40 : 'auto',
              height: item.special ? 40 : 'auto',
              background: item.special ? 'linear-gradient(135deg,#f57c00,#1a73e8)' : 'none',
              borderRadius: item.special ? '50%' : 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: item.special ? 20 : 22,
              marginTop: item.special ? -14 : 0,
              boxShadow: item.special ? '0 4px 12px rgba(245,124,0,0.4)' : 'none'
            }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 10, color: tab === item.key ? '#f57c00' : '#aaa',
                            fontWeight: tab === item.key ? 700 : 400 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}