import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function Home() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    category: '', serviceType: '', location: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category)    params.append('category', filters.category);
      if (filters.serviceType) params.append('serviceType', filters.serviceType);
      if (filters.location)    params.append('location', filters.location);

      const res = await API.get(`/listings?${params.toString()}`);
      setListings(res.data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    }
    setLoading(false);
  }

  function handleFilter(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>Find water & gas near you</h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        Browse refill services and suppliers in your area
      </p>

      {/* Filters */}
      <div className="filter-bar">
        <select name="category" value={filters.category} onChange={handleFilter}>
          <option value="">All categories</option>
          <option value="water">💧 Water</option>
          <option value="gas">🔥 Gas</option>
        </select>
        <select name="serviceType" value={filters.serviceType} onChange={handleFilter}>
          <option value="">All services</option>
          <option value="refill">Refill</option>
          <option value="buy">Buy new</option>
        </select>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          name="location"
          placeholder="🔍 Search by location..."
          value={filters.location}
          onChange={handleFilter}
          style={{ marginBottom: 0, flex: 1 }}
        />
        <button
          className="btn btn-blue"
          onClick={fetchListings}
          style={{ width: 'auto', padding: '0 18px', marginTop: 0 }}>
          Search
        </button>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        🚫 HomeFil does not handle payments. You pay suppliers directly upon delivery.
      </div>

      {/* Listings */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>
          Loading listings...
        </p>
      ) : listings.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
          No listings found. Try a different filter.
        </p>
      ) : (
        listings.map(listing => (
          <Link
            to={`/listing/${listing._id}`}
            key={listing._id}
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card">

              {/* Listing image */}
              {listing.image ? (
                <img
                  src={`https://homefil-backed.onrender.com/uploads/${listing.image}`}
                  alt={listing.productType}
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginBottom: 12
                  }}
                />
              ) : (
                <div style={{
                  width: '100%', height: 120,
                  background: listing.category === 'water' ? '#e3f2fd' : '#fff3e0',
                  borderRadius: 8, marginBottom: 12,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 48
                }}>
                  {listing.category === 'water' ? '💧' : '🔥'}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between',
                            alignItems: 'flex-start' }}>
                <h3>{listing.productType ||
                  `${listing.category} ${listing.serviceType}`}</h3>
              </div>

              <span className={`badge badge-${listing.category === 'water'
                ? 'blue' : 'orange'}`}>
                {listing.category}
              </span>
              <span className="badge badge-gray">{listing.serviceType}</span>
              {listing.status === 'out_of_stock' && (
                <span className="badge badge-gray">Out of stock</span>
              )}

              <p>📍 {listing.location}</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: '#222' }}>
                KSh {listing.price.toLocaleString()}
              </p>
              {listing.deliveryAvailable && (
                <p style={{ color: '#2e7d32', fontSize: 13 }}>
                  ✅ Delivery available — {listing.deliveryTime}
                </p>
              )}
              <div className="pay-tag">💵 Pay on Delivery</div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default Home;