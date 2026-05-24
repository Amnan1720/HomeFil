import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'https://homefil-backed.onrender.com';

const EMPTY_FORM = {
  category: 'water', serviceType: 'refill', productType: '',
  price: '', location: '', phone: '', whatsapp: '',
  deliveryAvailable: false, deliveryTime: '', status: 'available'
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyListings();
    fetchRequests();
  }, []);

  async function fetchMyListings() {
    try {
      const res = await axios.get(BASE_URL + '/api/listings');
      setListings(res.data.filter(l => l.supplierId === user.id));
    } catch (err) { console.error(err); }
  }

  async function fetchRequests() {
    try {
      const res = await axios.get(BASE_URL + '/api/requests', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setRequests(res.data);
    } catch (err) { console.error(err); }
  }

  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (files.length > 5) { setError('Max 5 images allowed'); return; }
    setError('');
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  }

  function removeImage(index) {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      imageFiles.forEach(file => formData.append('images', file));
      if (editId) {
        await axios.put(BASE_URL + '/api/listings/' + editId, formData, {
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(BASE_URL + '/api/listings', formData, {
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' }
        });
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setImageFiles([]);
      setImagePreviews([]);
      fetchMyListings();
      setActiveTab('listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving listing');
    }
    setLoading(false);
  }

  async function deleteListing(id) {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(BASE_URL + '/api/listings/' + id, {
        headers: { Authorization: 'Bearer ' + token }
      });
      fetchMyListings();
    } catch (err) { alert('Could not delete'); }
  }

  function startEdit(listing) {
    setForm({
      category: listing.category, serviceType: listing.serviceType,
      productType: listing.productType || '', price: listing.price,
      location: listing.location, phone: listing.phone,
      whatsapp: listing.whatsapp || '', deliveryAvailable: listing.deliveryAvailable,
      deliveryTime: listing.deliveryTime || '', status: listing.status
    });
    setEditId(listing._id);
    if (listing.images && listing.images.length > 0) {
      setImagePreviews(listing.images.map(img => BASE_URL + '/uploads/' + img));
    } else if (listing.image) {
      setImagePreviews([BASE_URL + '/uploads/' + listing.image]);
    } else {
      setImagePreviews([]);
    }
    setImageFiles([]);
    setActiveTab('add');
    window.scrollTo(0, 0);
  }

  function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  const available = listings.filter(l => l.status === 'available').length;
  const outOfStock = listings.filter(l => l.status === 'out_of_stock').length;
  const waterListings = listings.filter(l => l.category === 'water').length;
  const gasListings = listings.filter(l => l.category === 'gas').length;

  if (user.role !== 'supplier') {
    return (
      <p style={{ marginTop: 30, textAlign: 'center' }}>
        This page is for suppliers only.
      </p>
    );
  }

  return (
    <div style={{ padding: 0, margin: '-16px', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f57c00, #1a73e8)',
        padding: '20px 16px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '0 0 2px' }}>
              Welcome back,
            </p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>
              {user.name}
            </p>
            <div style={{
              display: 'inline-block',
              background: '#e8f5e9', color: '#2e7d32',
              fontSize: 11, fontWeight: 600,
              padding: '3px 10px', borderRadius: 20
            }}>
              ✓ Approved Supplier
            </div>
          </div>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 16,
              border: '2px solid rgba(255,255,255,0.4)'
            }}>
              {getInitials(user.name)}
            </div>
          </Link>
        </div>
      </div>

      <div style={{ padding: 16 }}>

        {/* ======= OVERVIEW TAB ======= */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Listings', value: listings.length, color: '#f57c00', bg: '#fff3e0' },
                { label: 'Available', value: available, color: '#2e7d32', bg: '#e8f5e9' },
                { label: 'Requests', value: requests.length, color: '#1a73e8', bg: '#e3f2fd' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: stat.bg, borderRadius: 12,
                  padding: '14px 10px', textAlign: 'center'
                }}>
                  <p style={{ fontSize: 24, fontWeight: 700, color: stat.color, margin: '0 0 2px' }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: 11, color: stat.color, margin: 0 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Add listing banner */}
            <div
              onClick={() => { setForm(EMPTY_FORM); setEditId(null); setImageFiles([]); setImagePreviews([]); setActiveTab('add'); }}
              style={{
                background: 'linear-gradient(135deg, #f57c00, #1a73e8)',
                borderRadius: 16, padding: '16px 20px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 16,
                cursor: 'pointer'
              }}>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: '0 0 2px' }}>
                  Add new listing
                </p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>
                  Post water or gas product
                </p>
              </div>
              <div style={{
                width: 42, height: 42,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 24
              }}>+</div>
            </div>

            {/* Stock status */}
            <div style={{
              background: 'white', borderRadius: 16, padding: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 14px' }}>
                Stock Overview
              </p>
              {[
                { label: 'Available listings', value: available, color: '#2e7d32', bg: '#e8f5e9' },
                { label: 'Out of stock',       value: outOfStock, color: '#c62828', bg: '#ffebee' },
                { label: 'Water listings',     value: waterListings, color: '#1565c0', bg: '#e3f2fd' },
                { label: 'Gas listings',       value: gasListings, color: '#e65100', bg: '#fff3e0' }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: i < 3 ? 12 : 0,
                  paddingBottom: i < 3 ? 12 : 0,
                  borderBottom: i < 3 ? '0.5px solid #f0f0f0' : 'none'
                }}>
                  <p style={{ fontSize: 14, color: '#555', margin: 0 }}>{item.label}</p>
                  <div style={{
                    background: item.bg, color: item.color,
                    fontWeight: 700, fontSize: 14,
                    padding: '4px 14px', borderRadius: 20
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent listings */}
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
              Recent listings
            </p>
            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#888' }}>
                <p style={{ fontSize: 32 }}>📋</p>
                <p style={{ fontSize: 14 }}>No listings yet. Add one!</p>
              </div>
            ) : (
              listings.slice(0, 3).map(listing => (
                <div key={listing._id} style={{
                  background: 'white', borderRadius: 12,
                  padding: 12, marginBottom: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', gap: 12
                }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 10,
                    background: listing.category === 'water' ? '#e3f2fd' : '#fff3e0',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 24, flexShrink: 0
                  }}>
                    {listing.image
                      ? <img src={BASE_URL + '/uploads/' + listing.image} alt=""
                          style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover' }} />
                      : listing.category === 'water' ? '💧' : '🔥'
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>
                      {listing.productType}
                    </p>
                    <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0' }}>
                      KSh {listing.price?.toLocaleString()} · {listing.location}
                    </p>
                  </div>
                  <div style={{
                    background: listing.status === 'available' ? '#e8f5e9' : '#ffebee',
                    color: listing.status === 'available' ? '#2e7d32' : '#c62828',
                    fontSize: 11, fontWeight: 600,
                    padding: '3px 8px', borderRadius: 20
                  }}>
                    {listing.status === 'available' ? 'Live' : 'Out'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======= MY LISTINGS TAB ======= */}
        {activeTab === 'listings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                My Listings ({listings.length})
              </p>
              <button
                onClick={() => { setForm(EMPTY_FORM); setEditId(null); setImageFiles([]); setImagePreviews([]); setActiveTab('add'); }}
                style={{
                  background: '#f57c00', color: 'white',
                  border: 'none', borderRadius: 10,
                  padding: '8px 16px', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer'
                }}>
                + Add
              </button>
            </div>

            {listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                <p style={{ fontSize: 40 }}>📋</p>
                <p style={{ fontSize: 14 }}>No listings yet</p>
              </div>
            ) : (
              listings.map(listing => (
                <div key={listing._id} style={{
                  background: 'white', borderRadius: 16,
                  overflow: 'hidden', marginBottom: 14,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ position: 'relative' }}>
                    {listing.image ? (
                      <img
                        src={BASE_URL + '/uploads/' + listing.image}
                        alt={listing.productType}
                        style={{ width: '100%', height: 140, objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        height: 100,
                        background: listing.category === 'water'
                          ? 'linear-gradient(135deg,#e3f2fd,#bbdefb)'
                          : 'linear-gradient(135deg,#fff3e0,#ffe0b2)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 44
                      }}>
                        {listing.category === 'water' ? '💧' : '🔥'}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      background: listing.status === 'available' ? '#e8f5e9' : '#ffebee',
                      color: listing.status === 'available' ? '#2e7d32' : '#c62828',
                      fontSize: 11, fontWeight: 600,
                      padding: '3px 8px', borderRadius: 20
                    }}>
                      {listing.status === 'available' ? 'Available' : 'Out of stock'}
                    </div>
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      display: 'flex', gap: 6
                    }}>
                      <button onClick={() => startEdit(listing)}
                        style={{
                          width: 32, height: 32, background: 'white',
                          border: 'none', borderRadius: '50%',
                          cursor: 'pointer', fontSize: 14,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>✏️</button>
                      <button onClick={() => deleteListing(listing._id)}
                        style={{
                          width: 32, height: 32, background: 'white',
                          border: 'none', borderRadius: '50%',
                          cursor: 'pointer', fontSize: 14,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>🗑️</button>
                    </div>
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>
                        {listing.productType}
                      </p>
                      <p style={{
                        fontSize: 16, fontWeight: 700,
                        color: listing.category === 'water' ? '#1a73e8' : '#f57c00',
                        margin: 0
                      }}>
                        KSh {listing.price?.toLocaleString()}
                      </p>
                    </div>
                    <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>
                      📍 {listing.location} · {listing.serviceType}
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{
                        background: listing.category === 'water' ? '#e3f2fd' : '#fff3e0',
                        color: listing.category === 'water' ? '#1565c0' : '#e65100',
                        fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20
                      }}>
                        {listing.category}
                      </span>
                      {listing.deliveryAvailable && (
                        <span style={{ fontSize: 11, color: '#2e7d32' }}>
                          ✓ Delivery {listing.deliveryTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======= ADD LISTING TAB ======= */}
        {activeTab === 'add' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
              {editId ? '✏️ Edit listing' : '+ New listing'}
            </p>

            {error && (
              <div style={{
                background: '#ffebee', border: '1px solid #ef9a9a',
                borderRadius: 10, padding: '10px 14px', marginBottom: 12
              }}>
                <p style={{ color: '#c62828', fontSize: 13, margin: 0 }}>❌ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: '0 0 12px' }}>Product Info</p>

                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="water">💧 Water</option>
                  <option value="gas">🔥 Gas</option>
                </select>

                <label>Service type</label>
                <select name="serviceType" value={form.serviceType} onChange={handleChange}>
                  <option value="refill">Refill</option>
                  <option value="buy">Buy new</option>
                </select>

                <label>Product description</label>
                <input name="productType" value={form.productType} onChange={handleChange}
                  placeholder="e.g. 20L drinking water, 6kg gas cylinder" required />

                <label>Price (KSh)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required />
              </div>

              <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: '0 0 12px' }}>Contact & Location</p>

                <label>Your location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Nakuru Town" required />

                <label>Phone number</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="e.g. 0712345678" required />

                <label>WhatsApp number (optional)</label>
                <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                  placeholder="e.g. 254712345678" />
              </div>

              <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: '0 0 12px' }}>Delivery & Status</p>

                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="available">Available</option>
                  <option value="out_of_stock">Out of stock</option>
                </select>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <input type="checkbox" name="deliveryAvailable"
                    checked={form.deliveryAvailable} onChange={handleChange}
                    style={{ width: 'auto', marginBottom: 0 }} />
                  Delivery available
                </label>

                {form.deliveryAvailable && (
                  <>
                    <label>Delivery time</label>
                    <input name="deliveryTime" value={form.deliveryTime} onChange={handleChange}
                      placeholder="e.g. Within 2 hours" />
                  </>
                )}
              </div>

              <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px' }}>Product Photos</p>
                <p style={{ fontSize: 12, color: '#888', margin: '0 0 12px' }}>Upload up to 5 photos · Max 10MB each</p>

                <div style={{
                  border: '2px dashed #f57c00', borderRadius: 12,
                  padding: 16, textAlign: 'center', background: '#fff8f0'
                }}>
                  <p style={{ fontSize: 28, margin: '0 0 8px' }}>📷</p>
                  <input
                    type="file" accept="image/*" multiple
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="imgUpload"
                  />
                  <label htmlFor="imgUpload" style={{
                    background: '#f57c00', color: 'white',
                    padding: '8px 20px', borderRadius: 8,
                    cursor: 'pointer', fontSize: 13,
                    fontWeight: 600, display: 'inline-block'
                  }}>
                    Choose Photos
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                      {imagePreviews.length} photo(s) selected:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                      {imagePreviews.map((preview, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img src={preview} alt={'Preview ' + (index + 1)}
                            style={{
                              width: '100%', height: 80, objectFit: 'cover',
                              borderRadius: 8,
                              border: index === 0 ? '2px solid #f57c00' : '1px solid #ddd'
                            }}
                          />
                          {index === 0 && (
                            <div style={{
                              position: 'absolute', bottom: 4, left: 4,
                              background: '#f57c00', color: 'white',
                              fontSize: 9, padding: '2px 5px',
                              borderRadius: 4, fontWeight: 600
                            }}>Main</div>
                          )}
                          {imageFiles.length > 0 && (
                            <button type="button" onClick={() => removeImage(index)}
                              style={{
                                position: 'absolute', top: 4, right: 4,
                                width: 20, height: 20, background: '#c62828',
                                color: 'white', border: 'none', borderRadius: '50%',
                                cursor: 'pointer', fontSize: 11
                              }}>×</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: 15,
                  background: loading ? '#ccc' : 'linear-gradient(135deg,#f57c00,#1a73e8)',
                  color: 'white', border: 'none', borderRadius: 12,
                  fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                {loading ? 'Saving...' : editId ? 'Save changes' : 'Post listing'}
              </button>

              {editId && (
                <button type="button"
                  onClick={() => { setForm(EMPTY_FORM); setEditId(null); setImageFiles([]); setImagePreviews([]); setActiveTab('listings'); }}
                  style={{
                    width: '100%', padding: 12, background: '#f5f7fa',
                    color: '#555', border: 'none', borderRadius: 12,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8
                  }}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}

        {/* ======= ANALYTICS TAB ======= */}
        {activeTab === 'analytics' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
              📊 Analytics
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Total listings', value: listings.length, icon: '📋', color: '#f57c00', bg: '#fff3e0' },
                { label: 'Available', value: available, icon: '✅', color: '#2e7d32', bg: '#e8f5e9' },
                { label: 'Out of stock', value: outOfStock, icon: '❌', color: '#c62828', bg: '#ffebee' },
                { label: 'Requests', value: requests.length, icon: '🚨', color: '#1a73e8', bg: '#e3f2fd' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'white', borderRadius: 16,
                  padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: 44, height: 44, background: item.bg,
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 8px', fontSize: 22
                  }}>
                    {item.icon}
                  </div>
                  <p style={{ fontSize: 24, fontWeight: 700, color: item.color, margin: '0 0 2px' }}>
                    {item.value}
                  </p>
                  <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{item.label}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>
                Category breakdown
              </p>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#555' }}>💧 Water listings</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a73e8' }}>{waterListings}</span>
                </div>
                <div style={{ background: '#e3f2fd', borderRadius: 20, height: 8, overflow: 'hidden' }}>
                  <div style={{
                    background: '#1a73e8', height: '100%', borderRadius: 20,
                    width: listings.length > 0 ? (waterListings / listings.length * 100) + '%' : '0%'
                  }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#555' }}>🔥 Gas listings</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#f57c00' }}>{gasListings}</span>
                </div>
                <div style={{ background: '#fff3e0', borderRadius: 20, height: 8, overflow: 'hidden' }}>
                  <div style={{
                    background: '#f57c00', height: '100%', borderRadius: 20,
                    width: listings.length > 0 ? (gasListings / listings.length * 100) + '%' : '0%'
                  }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg,#f57c00,#1a73e8)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
              <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
                Keep your listings updated!
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>
                Active listings get more customer contacts
              </p>
            </div>
          </div>
        )}

        {/* ======= REQUESTS TAB ======= */}
        {activeTab === 'requests' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
              🚨 Customer Requests
            </p>

            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
                <p style={{ fontSize: 40 }}>🚨</p>
                <p style={{ fontSize: 14 }}>No urgent requests right now</p>
              </div>
            ) : (
              requests.map(req => (
                <div key={req._id} style={{
                  background: 'white', borderRadius: 16,
                  padding: 16, marginBottom: 14,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 38, height: 38,
                      background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                      borderRadius: '50%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 20
                    }}>
                      {req.category === 'gas' ? '🔥' : '💧'}
                    </div>
                    <div>
                      <span style={{
                        background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                        color: req.category === 'gas' ? '#e65100' : '#1565c0',
                        fontSize: 11, fontWeight: 600,
                        padding: '2px 8px', borderRadius: 20
                      }}>
                        {req.category}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: '0 0 6px' }}>
                    {req.requestText}
                  </p>
                  <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>
                    📍 {req.location}
                  </p>
                  {req.userId && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <a href={'tel:' + req.userId.phone}
                        style={{
                          flex: 1, background: '#1a73e8', color: 'white',
                          padding: '9px 0', borderRadius: 10,
                          textAlign: 'center', fontSize: 13,
                          fontWeight: 500, textDecoration: 'none', display: 'block'
                        }}>
                        📞 Call {req.userId.name}
                      </a>
                    </div>
                  )}
                  <p style={{ fontSize: 11, color: '#aaa', margin: '8px 0 0' }}>
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======= PROFILE TAB ======= */}
        {activeTab === 'profile' && (
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
              👤 My Profile
            </p>
            <div style={{
              background: 'white', borderRadius: 16,
              padding: 20, marginBottom: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
            }}>
              <div style={{
                width: 70, height: 70,
                background: 'linear-gradient(135deg,#f57c00,#1a73e8)',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', color: 'white',
                fontSize: 24, fontWeight: 700
              }}>
                {getInitials(user.name)}
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>
                {user.name}
              </p>
              <span style={{
                background: '#e8f5e9', color: '#2e7d32',
                fontSize: 12, fontWeight: 600,
                padding: '4px 12px', borderRadius: 20
              }}>
                ✓ Approved Supplier
              </span>
            </div>

            <div style={{ background: 'white', borderRadius: 16, padding: 4, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {[
                { icon: '📧', label: 'Email', value: user.email || 'Not set' },
                { icon: '📞', label: 'Phone', value: user.phone || 'Not set' },
                { icon: '📍', label: 'Location', value: user.location || 'Not set' },
                { icon: '🏷️', label: 'Role', value: 'Supplier' }
              ].map((item, i, arr) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  borderBottom: i < arr.length - 1 ? '0.5px solid #f0f0f0' : 'none'
                }}>
                  <div style={{
                    width: 36, height: 36, background: '#f5f7fa',
                    borderRadius: 10, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#999', margin: '0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/auth'; }}
              style={{
                width: '100%', padding: 14,
                background: '#ffebee', color: '#c62828',
                border: '1px solid #ef9a9a', borderRadius: 12,
                fontSize: 15, fontWeight: 600, cursor: 'pointer'
              }}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: 'white', borderTop: '0.5px solid #f0f0f0',
        display: 'grid', gridTemplateColumns: 'repeat(6,1fr)',
        padding: '8px 0', zIndex: 100
      }}>
        {[
          { key: 'overview',  icon: '🏠', label: 'Home' },
          { key: 'listings',  icon: '📋', label: 'Listings' },
          { key: 'add',       icon: '➕', label: 'Add' },
          { key: 'analytics', icon: '📊', label: 'Analytics' },
          { key: 'requests',  icon: '🚨', label: 'Requests' },
          { key: 'profile',   icon: '👤', label: 'Profile' }
        ].map(item => (
          <div key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2, cursor: 'pointer',
              padding: '4px 0'
            }}>
            <div style={{
              width: item.key === 'add' ? 36 : 'auto',
              height: item.key === 'add' ? 36 : 'auto',
              background: item.key === 'add' ? '#f57c00' : 'none',
              borderRadius: item.key === 'add' ? '50%' : 0,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: item.key === 'add' ? 18 : 22,
              marginTop: item.key === 'add' ? -8 : 0
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: 10,
              color: activeTab === item.key ? '#f57c00' : '#888',
              fontWeight: activeTab === item.key ? 600 : 400
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;