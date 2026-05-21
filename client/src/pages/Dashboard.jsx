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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    const files = Array.from(e.target.files);

    // Max 5 images
    if (files.length > 5) {
      setError('You can only upload a maximum of 5 images');
      return;
    }

    // Max 10MB each
    const oversized = files.filter(f => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      setError('Each image must be less than 10MB');
      return;
    }

    setError('');
    setImageFiles(files);

    // Create previews for all selected images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  }

  function removeImage(index) {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      // Append all images
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

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
      setImageFiles([]);
      setImagePreviews([]);
      fetchMyListings();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving listing');
    }
    setLoading(false);
  }

  function startEdit(listing) {
    setForm({
      category: listing.category,
      serviceType: listing.serviceType,
      productType: listing.productType || '',
      price: listing.price,
      location: listing.location,
      phone: listing.phone,
      whatsapp: listing.whatsapp || '',
      deliveryAvailable: listing.deliveryAvailable,
      deliveryTime: listing.deliveryTime || '',
      status: listing.status
    });
    setEditId(listing._id);
    setShowForm(true);

    // Show existing images as previews
    if (listing.images && listing.images.length > 0) {
      setImagePreviews(listing.images.map(img =>
        `${BASE_URL}/uploads/${img}`
      ));
    } else if (listing.image) {
      setImagePreviews([`${BASE_URL}/uploads/${listing.image}`]);
    } else {
      setImagePreviews([]);
    }
    setImageFiles([]);
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

  function getImages(listing) {
    if (listing.images && listing.images.length > 0) {
      return listing.images;
    }
    if (listing.image) return [listing.image];
    return [];
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
        setImageFiles([]);
        setImagePreviews([]);
        setError('');
        setShowForm(!showForm);
      }}>
        {showForm ? 'Cancel' : '+ Add new listing'}
      </button>

      {showForm && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 12 }}>
            {editId ? 'Edit listing' : 'New listing'}
          </h3>

          {error && (
            <div style={{
              background: '#ffebee', border: '1px solid #ef9a9a',
              borderRadius: 8, padding: '10px 14px', marginBottom: 12
            }}>
              <p style={{ color: '#c62828', fontSize: 13, margin: 0 }}>
                ❌ {error}
              </p>
            </div>
          )}

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

            {/* Multiple image upload */}
            <div style={{
              border: '2px dashed #1a73e8', borderRadius: 12,
              padding: 16, marginBottom: 12, textAlign: 'center',
              background: '#f8fbff'
            }}>
              <p style={{ fontSize: 24, margin: '0 0 8px' }}>📷</p>
              <p style={{ fontSize: 14, fontWeight: 600,
                          color: '#1a73e8', margin: '0 0 4px' }}>
                Upload Product Photos
              </p>
              <p style={{ fontSize: 12, color: '#888', margin: '0 0 12px' }}>
                You can upload up to 5 photos • Max 10MB each
              </p>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="imageUpload"
              />
              <label htmlFor="imageUpload"
                style={{
                  background: '#1a73e8', color: 'white',
                  padding: '8px 20px', borderRadius: 8,
                  cursor: 'pointer', fontSize: 13,
                  fontWeight: 600, display: 'inline-block'
                }}>
                Choose Photos
              </label>
            </div>

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                  Selected photos ({imagePreviews.length}/5):
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8
                }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%', height: 90,
                          objectFit: 'cover', borderRadius: 8,
                          border: index === 0
                            ? '2px solid #1a73e8' : '1px solid #ddd'
                        }}
                      />
                      {index === 0 && (
                        <div style={{
                          position: 'absolute', bottom: 4, left: 4,
                          background: '#1a73e8', color: 'white',
                          fontSize: 10, padding: '2px 6px',
                          borderRadius: 4, fontWeight: 600
                        }}>
                          Main
                        </div>
                      )}
                      {imageFiles.length > 0 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute', top: 4, right: 4,
                            width: 22, height: 22, background: '#c62828',
                            color: 'white', border: 'none',
                            borderRadius: '50%', cursor: 'pointer',
                            fontSize: 12, display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                          }}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: '#1a73e8', margin: '6px 0 0' }}>
                  The first photo with blue border will be the main photo
                </p>
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
        listings.map(listing => {
          const imgs = getImages(listing);
          return (
            <div className="card" key={listing._id}>
              {/* Show images */}
              {imgs.length > 0 ? (
                <div>
                  <img
                    src={`${BASE_URL}/uploads/${imgs[0]}`}
                    alt={listing.productType}
                    style={{
                      width: '100%', height: 180,
                      objectFit: 'cover', borderRadius: 8,
                      marginBottom: imgs.length > 1 ? 8 : 12
                    }}
                  />
                  {/* Thumbnail row for multiple images */}
                  {imgs.length > 1 && (
                    <div style={{
                      display: 'flex', gap: 6, marginBottom: 12,
                      overflowX: 'auto'
                    }}>
                      {imgs.slice(1).map((img, i) => (
                        <img
                          key={i}
                          src={`${BASE_URL}/uploads/${img}`}
                          alt={`Photo ${i + 2}`}
                          style={{
                            width: 60, height: 60,
                            objectFit: 'cover', borderRadius: 6,
                            border: '1px solid #ddd', flexShrink: 0
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
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

              <div style={{ display: 'flex',
                            justifyContent: 'space-between' }}>
                <h3>{listing.productType}</h3>
                {imgs.length > 0 && (
                  <span style={{ fontSize: 12, color: '#888' }}>
                    📷 {imgs.length} photo{imgs.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <span className={`badge badge-${listing.category === 'water'
                ? 'blue' : 'orange'}`}>
                {listing.category}
              </span>
              <span className="badge badge-gray">{listing.serviceType}</span>
              <p>📍 {listing.location}</p>
              <p><strong>KSh {listing.price?.toLocaleString()}</strong></p>
              <p style={{
                color: listing.status === 'available'
                  ? '#2e7d32' : '#c62828', fontSize: 13
              }}>
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
          );
        })
      )}
    </div>
  );
}

export default Dashboard;