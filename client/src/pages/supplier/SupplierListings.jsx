import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SupplierNav from '../../components/SupplierNav';

const BASE = 'https://homefil-backed.onrender.com';
const EMPTY = {
  serviceType: 'refill', productType: '',
  price: '', location: '', phone: '', whatsapp: '',
  deliveryAvailable: false, deliveryTime: '', status: 'available'
};

export default function SupplierListings() {
  const [listings, setListings] = useState([]);
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
      setShowForm(false); load();
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
    setPreviews(l.images && l.images.length > 0
      ? l.images.map(function(i) { return BASE + '/uploads/' + i; })
      : l.image ? [BASE + '/uploads/' + l.image] : []);
    setImages([]);
    setShowForm(true);
    window.scrollTo(0, 0);
  }

  async function del(id) {
    if (!window.confirm('Delete this listing?')) return;
    await axios.delete(BASE + '/api/listings/' + id, {
      headers: { Authorization: 'Bearer ' + token }
    });
    load();
  }

  return (
    <div style={{ padding: 16, paddingBottom: 90 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between',
                     alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            {isGas ? '🔥' : '💧'} My Listings
          </p>
          <p style={{ fontSize: 13, color: '#888', margin: '2px 0 0' }}>
            {listings.length} {supType} listing{listings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={function() { setForm(EMPTY); setEditId(null); setImages([]); setPreviews([]); setShowForm(!showForm); window.scrollTo(0, 0); }}
          style={{ background: mainColor, color: 'white', border: 'none',
                    borderRadius: 12, padding: '10px 18px', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: 16, padding: 16,
                       boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 16,
                       border: '1.5px solid ' + mainColor }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>
            {editId ? '✏️ Edit listing' : '+ New ' + supType + ' listing'}
          </p>

          {err && (
            <div style={{ background: '#ffebee', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
              <p style={{ color: '#c62828', fontSize: 13, margin: 0 }}>❌ {err}</p>
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ padding: '12px 16px', marginBottom: 12, background: lightBg,
                           borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
                           border: '1.5px solid ' + (isGas ? '#ffb74d' : '#90caf9') }}>
              <span style={{ fontSize: 22 }}>{isGas ? '🔥' : '💧'}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: lightColor }}>
                  {isGas ? 'Gas' : 'Water'}
                </p>
                <p style={{ fontSize: 11, color: '#888', margin: 0 }}>Fixed to your account type</p>
              </div>
            </div>

            <label>Service type</label>
            <select name="serviceType" value={form.serviceType} onChange={change}>
              <option value="refill">Refill</option>
              <option value="buy">Buy new</option>
            </select>

            <label>Product description</label>
            <input name="productType" value={form.productType} onChange={change}
              placeholder={isGas ? 'e.g. 6kg gas cylinder' : 'e.g. 20L drinking water'} required />

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
            <input type="file" accept="image/*" multiple onChange={pickImages}
              style={{ display: 'none' }} id="imgPick" />
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
                        <div style={{ position: 'absolute', bottom: 4, left: 4, background: mainColor,
                                       color: 'white', fontSize: 9, padding: '2px 5px',
                                       borderRadius: 4, fontWeight: 700 }}>MAIN</div>
                      )}
                      {images.length > 0 && (
                        <button type="button"
                          onClick={function() {
                            setImages(images.filter(function(_, j) { return j !== i; }));
                            setPreviews(previews.filter(function(_, j) { return j !== i; }));
                          }}
                          style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20,
                                    background: '#c62828', color: 'white', border: 'none',
                                    borderRadius: '50%', cursor: 'pointer', fontSize: 12,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ×
                        </button>
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
              fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer'
            }}>
              {saving ? '⏳ Saving...' : editId ? '✅ Save changes' : '🚀 Post listing'}
            </button>
          </form>
        </div>
      )}

      {listings.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
          <p style={{ fontSize: 48, margin: '0 0 12px' }}>📋</p>
          <p style={{ fontSize: 15, margin: '0 0 16px' }}>No listings yet</p>
          <button onClick={function() { setShowForm(true); }}
            style={{ background: mainColor, color: 'white', border: 'none',
                      borderRadius: 12, padding: '12px 24px', fontSize: 14,
                      fontWeight: 700, cursor: 'pointer' }}>
            Add your first listing
          </button>
        </div>
      ) : (
        listings.map(function(l) {
          return (
            <div key={l._id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden',
                                       marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ position: 'relative' }}>
                {l.image ? (
                  <img src={BASE + '/uploads/' + l.image} alt={l.productType}
                    style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: 100, fontSize: 48,
                                 background: isGas
                                   ? 'linear-gradient(135deg,#fff3e0,#ffe0b2)'
                                   : 'linear-gradient(135deg,#e3f2fd,#bbdefb)',
                                 display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isGas ? '🔥' : '💧'}
                  </div>
                )}
                <div style={{ position: 'absolute', top: 8, left: 8,
                               background: l.status === 'available' ? '#e8f5e9' : '#ffebee',
                               color: l.status === 'available' ? '#2e7d32' : '#c62828',
                               fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                  {l.status === 'available' ? '● Available' : '● Out of stock'}
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                  <button onClick={function() { startEdit(l); }}
                    style={{ width: 34, height: 34, background: 'white', border: 'none',
                              borderRadius: '50%', cursor: 'pointer', fontSize: 14,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>✏️</button>
                  <button onClick={function() { del(l._id); }}
                    style={{ width: 34, height: 34, background: 'white', border: 'none',
                              borderRadius: '50%', cursor: 'pointer', fontSize: 14,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>🗑️</button>
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
                  <span style={{ background: lightBg, color: lightColor,
                                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                    {isGas ? '🔥' : '💧'} {supType}
                  </span>
                  {l.deliveryAvailable && (
                    <span style={{ background: '#e8f5e9', color: '#2e7d32',
                                    fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20 }}>
                      🚚 {l.deliveryTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      <SupplierNav supplierType={supType} />
    </div>
  );
}