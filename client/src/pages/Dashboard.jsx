import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EMPTY_FORM = {
  category: 'water', serviceType: 'refill', productType: '',
  price: '', location: '', phone: '', whatsapp: '',
  deliveryAvailable: false, deliveryTime: '', status: 'available'
};

const BASE_URL = 'https://homefil-backed.onrender.com';

function Dashboard() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyListings();
  }, []);

  async function fetchMyListings() {
    try {
      const res = await axios.get(`${BASE_URL}/api/listings`);
      setListings(res.data.filter(l => l.supplierId === user.id));
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    const val = e.target.type === 'checkbox'
      ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (editId) {
        await axios.put(
          `${BASE_URL}/api/listings/${editId}`,
          formData,
          { headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }}
        );
      } else {
        await axios.post(
          `${BASE_URL}/api/listings`,
          formData,
          { headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }}
        );
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      setImageFile(null);
      setImagePreview(null);
      fetchMyListings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving listing');
    }
    setLoading(false);
  }

  function startEdit(listing) {
    setForm({ ...listing });
    setEditId(listing._id);
    setShowForm(true);
    setImagePreview(
      listing.image
        ? `${BASE_URL}/uploads/${listing.image}`
        : null
    );
    window.scrollTo(0, 0);
  }

  async function deleteListing(id) {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/listings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyListings();
    } catch (err) {
      alert('Could not delete listing');
    }
  }

  if (user.role !== 'supplier') {
    return (
      <p style={{ marginTop: 30, textAlign: 'center' }}>
        This page is for suppliers only.
      </p>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>My Listings</h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        Manage your water and gas listings
      </p>

      <button className="btn btn-blue" onClick={() => {
        setForm(EMPTY_FORM);
        setEditId(null);
        setImageFile(null);
        setImagePreview(null);
        setShowForm(!showForm);
      }}>
        {showForm ? 'Cancel' : '+ Add new listing'}
      </button>

      {showForm && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 12 }}>
            {editId ? 'Edit listing' : 'New listing'}
          </h3>
          <form onSubmit={handleSubmit}>
            <label>Category</label>
            <select name="category" value={form.category}
                    onChange={handleChange}>
              <option value="water">💧 Water</option>
              <option value="gas">🔥 Gas</option>
            </select>

            <label>Service type</label>
            <select name="serviceType" value={form.serviceType}
                    onChange={handleChange}>
              <option value="refill">Refill</option>
              <option value="buy">Buy new</option>
            </select>

            <label>Product description</label>
            <input name="productType" value={form.productType}
                   onChange={handleChange}
                   placeholder="e.g. 20L drinking water, 6kg gas cylinder"
                   required />

            <label>Price (KSh)</label>
            <input name="price" type="number" value={form.price}
                   onChange={handleChange} required />

            <label>Your location</label>
            <input name="location" value={form.location}
                   onChange={handleChange}
                   placeholder="e.g. Nakuru Town" required />

            <label>Phone number</label>
            <input name="phone" value={form.phone}
                   onChange={handleChange}
                   placeholder="e.g. 0712345678" required />

            <label>WhatsApp number (optional)</label>
            <input name="whatsapp" value={form.whatsapp}
                   onChange={handleChange}
                   placeholder="e.g. 254712345678" />

            <label>Delivery time (if available)</label>
            <input name="deliveryTime" value={form.deliveryTime}
                   onChange={handleChange}
                   placeholder="e.g. Within 2 hours" />

            <label>Status</label>
            <select name="status" value={form.status}
                    onChange={handleChange}>
              <option value="available">Available</option>
              <option value="out_of_stock">Out of stock</option>
            </select>

            <label style={{ display: 'flex', alignItems: 'center',
                            gap: 8, marginBottom: 12 }}>
              <input type="checkbox" name="deliveryAvailable"
                     checked={form.deliveryAvailable}
                     onChange={handleChange}
                     style={{ width: 'auto', marginBottom: 0 }} />
              Delivery available
            </label>

            <label>📷 Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: 12 }}
            />

            {imagePreview && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
                  Image preview:
                </p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%', height: 200,
                    objectFit: 'cover', borderRadius: 8,
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            )}

            <button className="btn btn-blue" type="submit"
                    disabled={loading}>
              {loading ? 'Saving...' : editId
                ? 'Save changes' : 'Post listing'}
            </button>
          </form>
        </div>
      )}

      {listings.length === 0 ? (
        <p style={{ color: '#888', marginTop: 24, textAlign: 'center' }}>
          You have no listings yet. Add one above!
        </p>
      ) : (
        listings.map(listing => (
          <div className="card" key={listing._id}>
            {listing.image ? (
              <img
                src={`${BASE_URL}/uploads/${listing.image}`}
                alt={listing.productType}
                style={{
                  width: '100%', height: 180,
                  objectFit: 'cover', borderRadius: 8,
                  marginBottom: 12
                }}
              />
            ) : (
              <div style={{
                width: '100%', height: 120,
                background: listing.category === 'water'
                  ? '#e3f2fd' : '#fff3e0',
                borderRadius: 8, marginBottom: 12,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 48
              }}>
                {listing.category === 'water' ? '💧' : '🔥'}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{listing.productType}</h3>
            </div>
            <span className={`badge badge-${listing.category === 'water'
              ? 'blue' : 'orange'}`}>
              {listing.category}
            </span>
            <span className="badge badge-gray">{listing.serviceType}</span>
            <p>📍 {listing.location}</p>
            <p><strong>KSh {listing.price?.toLocaleString()}</strong></p>
            <p style={{ color: listing.status === 'available'
              ? '#2e7d32' : '#c62828', fontSize: 13 }}>
              {listing.status === 'available'
                ? '✅ Available' : '❌ Out of stock'}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn btn-outline"
                      onClick={() => startEdit(listing)}
                      style={{ flex: 1, padding: '8px 0', marginTop: 0 }}>
                ✏️ Edit
              </button>
              <button className="btn btn-red"
                      onClick={() => deleteListing(listing._id)}
                      style={{ flex: 1, padding: '8px 0', marginTop: 0 }}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;