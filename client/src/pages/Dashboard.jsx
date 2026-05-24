import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE = 'https://homefil-backed.onrender.com';
const EMPTY = {
  serviceType: 'refill', productType: '',
  price: '', location: '', phone: '', whatsapp: '',
  deliveryAvailable: false, deliveryTime: '', status: 'available'
};

export default function Dashboard() {
  const [tab, setTab] = useState('dashboard');
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const supType = user.supplierType || 'water';
  const isGas = supType === 'gas';
  const mainColor = isGas ? '#f57c00' : '#1a73e8';
  const lightBg = isGas ? '#fff3e0' : '#e3f2fd';
  const lightColor = isGas ? '#e65100' : '#1565c0';

  useEffect(function() { load(); }, []);

  function load() {
    axios.get(BASE + '/api/listings/my', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(function(r) { setListings(r.data); }).catch(console.error);

    axios.get(BASE + '/api/requests', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(function(r) { setRequests(r.data); }).catch(console.error);
  }

  function change(e) {
    var val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(Object.assign({}, form, { [e.target.name]: val }));
  }

  function pickImages(e) {
    var files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map(function(f) { return URL.createObjectURL(f); }));
  }

  function removeImg(i) {
    setImages(images.filter(function(_, j) { return j !== i; }));
    setPreviews(previews.filter(function(_, j) { return j !== i; }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr(''); setSaving(true);
    try {
      var fd = new FormData();
      Object.keys(form).forEach(function(k) { fd.append(k, form[k]); });
      fd.append('category', supType);
      images.forEach(function(f) { fd.append('images', f); });
      var cfg = { headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' } };
      if (editId) {
        await axios.put(BASE + '/api/listings/' + editId, fd, cfg);
      } else {
        await axios.post(BASE + '/api/listings', fd, cfg);
      }
      setForm(EMPTY); setEditId(null);
      setImages([]); setPreviews([]);
      setShowForm(false); load(); setTab('listings');
    } catch (ex) {
      setErr(ex.response ? ex.response.data.message : 'Error saving listing');
    }
    setSaving(false);
  }

  function startEdit(l) {
    setForm({
      serviceType: l.serviceType, productType: l.productType || '',
      price: l.price, location: l.location, phone: l.phone,
      whatsapp: l.whatsapp || '', deliveryAvailable: l.deliveryAvailable,
      deliveryTime: l.deliveryTime || '', status: l.status
    });
    setEditId(l._id);
    setPreviews(
      l.images && l.images.length > 0
        ? l.images.map(function(i) { return BASE + '/uploads/' + i; })
        : l.image ? [BASE + '/uploads/' + l.image] : []
    );
    setImages([]); setShowForm(true); setTab('listings');
    window.scrollTo(0, 0);
  }

  async function del(id) {
    if (!window.confirm('Delete this listing?')) return;
    await axios.delete(BASE + '/api/listings/' + id, {
      headers: { Authorization: 'Bearer ' + token }
    });
    load();
  }

  function init(name) {
    if (!name) return 'U';
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  }

  var avail = listings.filter(function(l) { return l.status === 'available'; }).length;
  var oos = listings.filter(function(l) { return l.status === 'out_of_stock'; }).length;

  if (user.role !== 'supplier') {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ fontSize: 40 }}>🚫</p>
        <p style={{ color: '#888' }}>This page is for suppliers only</p>
        <Link to="/auth" style={{ color: '#1a73e8' }}>Go to login</Link>
      </div>
    );
  }

  function ListingCard(props) {
    var l = props.listing;
    return (
      <div style={{
        background: 'white', borderRadius: 16, overflow: 'hidden',
        marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <div style={{ position: 'relative' }}>
          {l.image ? (
            <img src={BASE + '/uploads/' + l.image} alt={l.productType}
              style={{ width: '100%', height: 150, objectFit: 'cover' }} />
          ) : (
            <div style={{
              height: 100, fontSize: 48,
              background: isGas
                ? 'linear-gradient(135deg,#fff3e0,#ffe0b2)'
                : 'linear-gradient(135deg,#e3f2fd,#bbdefb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {isGas ? '🔥' : '💧'}
            </div>
          )}
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: l.status === 'available' ? '#e8f5e9' : '#ffebee',
            color: l.status === 'available' ? '#2e7d32' : '#c62828',
            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20
          }}>
            {l.status === 'available' ? '● Available' : '● Out of stock'}
          </div>
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
            <button onClick={function() { startEdit(l); }}
              style={{
                width: 34, height: 34, background: 'white', border: 'none',
                borderRadius: '50%', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>✏️</button>
            <button onClick={function() { del(l._id); }}
              style={{
                width: 34, height: 34, background: 'white', border: 'none',
                borderRadius: '50%', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>🗑️</button>
          </div>
        </div>
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
              {l.productType}
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: mainColor }}>
              KSh {l.price ? l.price.toLocaleString() : '0'}
            </p>
          </div>
          <p style={{ fontSize: 12, color: '#888', margin: '0 0 10px' }}>
            📍 {l.location} · {l.serviceType}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              background: lightBg, color: lightColor,
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20
            }}>
              {isGas ? '🔥' : '💧'} {supType}
            </span>
            {l.deliveryAvailable && (
              <span style={{
                background: '#e8f5e9', color: '#2e7d32',
                fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20
              }}>
                🚚 {l.deliveryTime}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  function RequestCard(props) {
    var req = props.request;
    return (
      <div style={{
        background: 'white', borderRadius: 16, padding: 16,
        marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
          }}>
            {req.category === 'gas' ? '🔥' : '💧'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{
                background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                color: req.category === 'gas' ? '#e65100' : '#1565c0',
                fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20
              }}>{req.category}</span>
              <span style={{
                background: '#ffebee', color: '#c62828',
                fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20
              }}>🚨 Urgent</span>
            </div>
            {req.userId && (
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>
                {req.userId.name}
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
              style={{
                background: '#1a73e8', color: 'white', padding: '11px 0',
                borderRadius: 10, textAlign: 'center', fontSize: 14,
                fontWeight: 600, textDecoration: 'none', display: 'block'
              }}>
              📞 Call
            </a>
            <a href={'https://wa.me/' + (req.userId.phone || '').replace(/\D/g, '')}
              target="_blank" rel="noreferrer"
              style={{
                background: '#e8f5e9', color: '#2e7d32', padding: '11px 0',
                borderRadius: 10, textAlign: 'center', fontSize: 14,
                fontWeight: 600, textDecoration: 'none', display: 'block'
              }}>
              💬 WhatsApp
            </a>
          </div>
        )}
      </div>
    );
  }

  function AddForm() {
    return (
      <div style={{
        background: 'white', borderRadius: 16, padding: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 16,
        border: '1.5px solid ' + mainColor
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            {editId ? '✏️ Edit listing' : '+ New listing'}
          </p>
          <button onClick={function() { setShowForm(false); setEditId(null); }}
            style={{
              background: '#f5f5f5', border: 'none', borderRadius: 8,
              padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: '#555'
            }}>
            Cancel
          </button>
        </div>

        {err && (
          <div style={{ background: '#ffebee', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ color: '#c62828', fontSize: 13, margin: 0 }}>❌ {err}</p>
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{
            padding: '12px 16px', marginBottom: 12,
            background: lightBg, borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1.5px solid ' + (isGas ? '#ffb74d' : '#90caf9')
          }}>
            <span style={{ fontSize: 22 }}>{isGas ? '🔥' : '💧'}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: lightColor }}>
                {isGas ? 'Gas' : 'Water'}
              </p>
              <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                Fixed to your account type
              </p>
            </div>
          </div>

          <label>Service type</label>
          <select name="serviceType" value={form.serviceType} onChange={change}>
            <option value="refill">Refill</option>
            <option value="buy">Buy new</option>
          </select>

          <label>Product description</label>
          <input name="productType" value={form.productType} onChange={change}
            placeholder={isGas ? 'e.g. 6kg gas cylinder' : 'e.g. 20L drinking water'}
            required />

          <label>Price (KSh)</label>
          <input name="price" type="number" value={form.price} onChange={change} required />

          <label>Location</label>
          <input name="location" value={form.location} onChange={change}
            placeholder="e.g. Nakuru Town" required />

          <label>Phone number</label>
          <input name="phone" value={form.phone} onChange={change}
            placeholder="e.g. 0712345678" required />

          <label>WhatsApp (optional)</label>
          <input name="whatsapp" value={form.whatsapp} onChange={change}
            placeholder="e.g. 254712345678" />

          <label>Status</label>
          <select name="status" value={form.status} onChange={change}>
            <option value="available">Available</option>
            <option value="out_of_stock">Out of stock</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
            <input type="checkbox" name="deliveryAvailable"
              checked={form.deliveryAvailable} onChange={change}
              style={{ width: 18, height: 18, marginBottom: 0, accentColor: mainColor }} />
            <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>Delivery available</span>
          </label>

          {form.deliveryAvailable && (
            <input name="deliveryTime" value={form.deliveryTime} onChange={change}
              placeholder="e.g. Within 2 hours" />
          )}

          <label>📷 Photos (up to 5)</label>
          <input type="file" accept="image/*" multiple
            onChange={pickImages} style={{ display: 'none' }} id="imgPick" />
          <label htmlFor="imgPick" style={{
            display: 'block', border: '2px dashed ' + mainColor,
            borderRadius: 12, padding: 16, textAlign: 'center',
            background: lightBg, cursor: 'pointer', marginBottom: 12
          }}>
            <p style={{ fontSize: 24, margin: '0 0 4px' }}>📸</p>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: mainColor }}>
              Tap to choose photos
            </p>
          </label>

          {previews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
              {previews.map(function(p, i) {
                return (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={p} alt="" style={{
                      width: '100%', height: 80, objectFit: 'cover', borderRadius: 10,
                      border: i === 0 ? '2px solid ' + mainColor : '1px solid #eee'
                    }} />
                    {i === 0 && (
                      <div style={{
                        position: 'absolute', bottom: 4, left: 4,
                        background: mainColor, color: 'white',
                        fontSize: 9, padding: '2px 5px', borderRadius: 4, fontWeight: 700
                      }}>MAIN</div>
                    )}
                    {images.length > 0 && (
                      <button type="button" onClick={function() { removeImg(i); }}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 20, height: 20, background: '#c62828',
                          color: 'white', border: 'none', borderRadius: '50%',
                          cursor: 'pointer', fontSize: 12,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>×</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <button type="submit" disabled={saving} style={{
            width: '100%', padding: 14,
            background: saving ? '#ccc' : isGas
              ? 'linear-gradient(135deg,#f57c00,#e65100)'
              : 'linear-gradient(135deg,#1a73e8,#0d47a1)',
            color: 'white', border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}>
            {saving ? '⏳ Saving...' : editId ? '✅ Save changes' : '🚀 Post listing'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ margin: '-16px', paddingBottom: 90 }}>

      <div style={{
        background: isGas
          ? 'linear-gradient(135deg,#f57c00,#e65100)'
          : 'linear-gradient(135deg,#1a73e8,#0d47a1)',
        padding: '20px 16px 28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '0 0 2px' }}>Welcome back,</p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{user.name}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                           background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px' }}>
              <span style={{ fontSize: 14 }}>{isGas ? '🔥' : '💧'}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>
                {isGas ? 'Gas Supplier' : 'Water Supplier'}
              </span>
            </div>
          </div>
          <div style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.2)',
                         borderRadius: '50%', display: 'flex', alignItems: 'center',
                         justifyContent: 'center', color: 'white', fontWeight: 700,
                         fontSize: 18, border: '2px solid rgba(255,255,255,0.4)' }}>
            {init(user.name)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 20 }}>
          {[
            { label: 'Listings', value: listings.length, icon: '📋' },
            { label: 'Available', value: avail, icon: '✅' },
            { label: 'Requests', value: requests.length, icon: '🚨' }
          ].map(function(s, i) {
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.15)',
                                     borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <p style={{ fontSize: 20, margin: '0 0 2px' }}>{s.icon}</p>
                <p style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: '0 0 2px' }}>{s.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, margin: 0 }}>{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: 16 }}>

        {tab === 'dashboard' && (
          <div>
            <div onClick={function() {
              setForm(EMPTY); setEditId(null);
              setImages([]); setPreviews([]);
              setShowForm(true); setTab('listings');
            }} style={{
              background: isGas
                ? 'linear-gradient(135deg,#f57c00,#e65100)'
                : 'linear-gradient(135deg,#1a73e8,#0d47a1)',
              borderRadius: 16, padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 16, cursor: 'pointer',
              boxShadow: isGas
                ? '0 4px 16px rgba(245,124,0,0.3)'
                : '0 4px 16px rgba(26,115,232,0.3)'
            }}>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 16, margin: '0 0 2px' }}>
                  Add new listing
                </p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>
                  Post a new {supType} product
                </p>
              </div>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)',
                             borderRadius: '50%', display: 'flex', alignItems: 'center',
                             justifyContent: 'center', color: 'white', fontSize: 28 }}>+</div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 16,
                           boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>
                📊 Analytics
              </p>
              <p style={{ fontSize: 12, color: '#aaa', margin: '0 0 16px' }}>
                Your {supType} listings overview
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Total', value: listings.length, icon: '📋', color: mainColor, bg: lightBg },
                  { label: 'Available', value: avail, icon: '✅', color: '#2e7d32', bg: '#e8f5e9' },
                  { label: 'Out of Stock', value: oos, icon: '❌', color: '#c62828', bg: '#ffebee' },
                  { label: 'Requests', value: requests.length, icon: '🚨', color: '#7b1fa2', bg: '#f3e5f5' }
                ].map(function(item, i) {
                  return (
                    <div key={i} style={{ background: item.bg, borderRadius: 14, padding: 14, textAlign: 'center' }}>
                      <p style={{ fontSize: 22, margin: '0 0 4px' }}>{item.icon}</p>
                      <p style={{ fontSize: 26, fontWeight: 700, color: item.color, margin: '0 0 2px' }}>{item.value}</p>
                      <p style={{ fontSize: 11, color: item.color, margin: 0, fontWeight: 500 }}>{item.label}</p>
                    </div>
                  );
                })}
              </div>
              {listings.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#555' }}>
                      {isGas ? '🔥' : '💧'} Available rate
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: mainColor }}>
                      {Math.round(avail / listings.length * 100)}%
                    </span>
                  </div>
                  <div style={{ background: '#f0f0f0', borderRadius: 20, height: 10, overflow: 'hidden' }}>
                    <div style={{
                      background: isGas
                        ? 'linear-gradient(90deg,#f57c00,#ffa726)'
                        : 'linear-gradient(90deg,#1a73e8,#42a5f5)',
                      height: '100%', borderRadius: 20,
                      width: (avail / listings.length * 100) + '%'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {requests.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: 16,
                             boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                               alignItems: 'center', marginBottom: 14 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                    🚨 Urgent Requests
                  </p>
                  <span onClick={function() { setTab('requests'); }}
                    style={{ fontSize: 13, color: mainColor, cursor: 'pointer', fontWeight: 600 }}>
                    See all ({requests.length})
                  </span>
                </div>
                {requests.slice(0, 2).map(function(req, i) {
                  return (
                    <div key={req._id} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      paddingBottom: i === 0 && requests.length > 1 ? 12 : 0,
                      marginBottom: i === 0 && requests.length > 1 ? 12 : 0,
                      borderBottom: i === 0 && requests.length > 1 ? '1px solid #f5f5f5' : 'none'
                    }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                     background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                                     display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        {req.category === 'gas' ? '🔥' : '💧'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e', margin: '0 0 2px' }}>
                          {req.requestText}
                        </p>
                        <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                          📍 {req.location}
                        </p>
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
                  );
                })}
              </div>
            )}

            <div style={{ background: 'white', borderRadius: 16, padding: 16,
                           boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                             alignItems: 'center', marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                  Recent listings
                </p>
                <span onClick={function() { setTab('listings'); }}
                  style={{ fontSize: 13, color: mainColor, cursor: 'pointer', fontWeight: 600 }}>
                  See all
                </span>
              </div>
              {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#888' }}>
                  <p style={{ fontSize: 32, margin: '0 0 8px' }}>📋</p>
                  <p style={{ fontSize: 13, margin: 0 }}>No listings yet. Add your first one!</p>
                </div>
              ) : (
                listings.slice(0, 3).map(function(l, i) {
                  return (
                    <div key={l._id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      paddingBottom: i < 2 ? 12 : 0, marginBottom: i < 2 ? 12 : 0,
                      borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none'
                    }}>
                      <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden',
                                     flexShrink: 0, background: lightBg,
                                     display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                        {l.image
                          ? <img src={BASE + '/uploads/' + l.image} alt=""
                              style={{ width: 52, height: 52, objectFit: 'cover' }} />
                          : (isGas ? '🔥' : '💧')
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: '0 0 2px' }}>
                          {l.productType}
                        </p>
                        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                          KSh {l.price ? l.price.toLocaleString() : '0'} · {l.location}
                        </p>
                      </div>
                      <div style={{ background: l.status === 'available' ? '#e8f5e9' : '#ffebee',
                                     color: l.status === 'available' ? '#2e7d32' : '#c62828',
                                     fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                        {l.status === 'available' ? '● Live' : '● Out'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {tab === 'listings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                           alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                My Listings ({listings.length})
              </p>
              <button onClick={function() {
                setForm(EMPTY); setEditId(null);
                setImages([]); setPreviews([]);
                setShowForm(true); window.scrollTo(0, 0);
              }} style={{
                background: mainColor, color: 'white', border: 'none',
                borderRadius: 10, padding: '8px 18px', fontSize: 13,
                fontWeight: 700, cursor: 'pointer'
              }}>
                + Add
              </button>
            </div>

            {showForm && <AddForm />}

            {listings.length === 0 && !showForm ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                <p style={{ fontSize: 48, margin: '0 0 12px' }}>📋</p>
                <p style={{ fontSize: 15, margin: '0 0 16px' }}>No listings yet</p>
                <button onClick={function() { setForm(EMPTY); setShowForm(true); }}
                  style={{ background: mainColor, color: 'white', border: 'none',
                            borderRadius: 12, padding: '12px 24px', fontSize: 14,
                            fontWeight: 700, cursor: 'pointer' }}>
                  Add your first listing
                </button>
              </div>
            ) : (
              listings.map(function(l) {
                return <ListingCard key={l._id} listing={l} />;
              })
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
              🚨 Customer Requests
            </p>
            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                <p style={{ fontSize: 48, margin: '0 0 12px' }}>🚨</p>
                <p style={{ fontSize: 15 }}>No urgent requests right now</p>
                <p style={{ fontSize: 13, color: '#aaa' }}>Check back later</p>
              </div>
            ) : (
              requests.map(function(req) {
                return <RequestCard key={req._id} request={req} />;
              })
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
              👤 My Profile
            </p>

            <div style={{ background: 'white', borderRadius: 16, padding: 24,
                           boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center', marginBottom: 16 }}>
              <div style={{ width: 72, height: 72,
                             background: isGas
                               ? 'linear-gradient(135deg,#f57c00,#e65100)'
                               : 'linear-gradient(135deg,#1a73e8,#0d47a1)',
                             borderRadius: '50%', display: 'flex', alignItems: 'center',
                             justifyContent: 'center', margin: '0 auto 12px',
                             color: 'white', fontSize: 26, fontWeight: 700 }}>
                {init(user.name)}
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' }}>
                {user.name}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                             background: lightBg, borderRadius: 20, padding: '5px 14px' }}>
                <span style={{ fontSize: 16 }}>{isGas ? '🔥' : '💧'}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: lightColor }}>
                  {isGas ? 'Gas Supplier' : 'Water Supplier'}
                </span>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden',
                           boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              {[
                { icon: '📧', label: 'Email', value: user.email || 'Not provided' },
                { icon: '📞', label: 'Phone', value: user.phone || 'Not provided' },
                { icon: '📍', label: 'Location', value: user.location || 'Not provided' },
                { icon: isGas ? '🔥' : '💧', label: 'Supplier Type',
                  value: isGas ? 'Gas Supplier' : 'Water Supplier' }
              ].map(function(item, i, arr) {
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14,
                                         padding: '14px 16px',
                                         borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <div style={{ width: 38, height: 38, background: '#f5f7fa',
                                   borderRadius: 10, display: 'flex', alignItems: 'center',
                                   justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: '#aaa', margin: '0 0 2px' }}>{item.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden',
                           boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              {[
                { icon: '📋', label: 'Terms & Conditions', link: '/terms' },
                { icon: '🔒', label: 'Privacy Policy', link: '/privacy' }
              ].map(function(item, i, arr) {
                return (
                  <Link key={i} to={item.link} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14,
                                   padding: '14px 16px',
                                   borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                      <div style={{ width: 38, height: 38, background: '#e3f2fd',
                                     borderRadius: 10, display: 'flex', alignItems: 'center',
                                     justifyContent: 'center', fontSize: 18 }}>
                        {item.icon}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0, flex: 1 }}>
                        {item.label}
                      </p>
                      <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <button onClick={function() {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/auth';
            }} style={{
              width: '100%', padding: 15, background: '#ffebee',
              color: '#c62828', border: '1.5px solid #ef9a9a',
              borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer'
            }}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: 'white',
        borderTop: '1px solid #f0f0f0',
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        padding: '10px 0 14px', zIndex: 100
      }}>
        {[
          { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
          { key: 'listings',  icon: '📋', label: 'Listings' },
          { key: 'requests',  icon: '🚨', label: 'Requests' },
          { key: 'profile',   icon: '👤', label: 'Profile' }
        ].map(function(item) {
          return (
            <div key={item.key} onClick={function() { setTab(item.key); }}
              style={{ display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 3, cursor: 'pointer' }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 11,
                              color: tab === item.key ? mainColor : '#aaa',
                              fontWeight: tab === item.key ? 700 : 400 }}>
                {item.label}
              </span>
              {tab === item.key && (
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: mainColor }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}