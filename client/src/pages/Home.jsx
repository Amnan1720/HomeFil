import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const BASE_URL = 'https://homefil-backed.onrender.com';

function Home() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    category: '', serviceType: '', location: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  async function fetchListings() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.serviceType) params.append('serviceType', filters.serviceType);
      if (filters.location) params.append('location', filters.location);
      const res = await API.get(`/listings?${params.toString()}`);
      setListings(res.data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    }
    setLoading(false);
  }

  function handleFilterButton(filter) {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilters({ category: '', serviceType: '', location: '' });
    } else if (filter === 'water') {
      setFilters({ ...filters, category: 'water', serviceType: '' });
    } else if (filter === 'gas') {
      setFilters({ ...filters, category: 'gas', serviceType: '' });
    } else if (filter === 'delivery') {
      setFilters({ ...filters, serviceType: 'refill', category: '' });
    }
  }

  function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  }

  return (
    <div style={{ padding: 0, margin: '-16px' }}>

      {/* Header */}
      <div style={{
        background: '#1a73e8',
        padding: '20px 16px 24px',
        marginBottom: 0
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 34, height: 34, background: 'white',
              borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 18
            }}>🏠</div>
            <span style={{ color: 'white', fontWeight: 500, fontSize: 18 }}>
              Home<span style={{ color: '#ffa726' }}>Fil</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ color: 'white', fontSize: 22 }}>🔔</span>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 8, height: 8, background: '#ff5252',
                borderRadius: '50%'
              }} />
            </div>
            {user && (
              <div style={{
                width: 34, height: 34, background: '#ffa726',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 500, fontSize: 13
              }}>
                {getInitials(user.name)}
              </div>
            )}
          </div>
        </div>

        {/* Greeting */}
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '0 0 2px' }}>
          {getGreeting()}
        </p>
        <p style={{ color: 'white', fontSize: 20, fontWeight: 500, margin: '0 0 20px' }}>
          {user ? user.name : 'Welcome'}
        </p>

        {/* Search bar */}
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 12, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            placeholder="Search water, gas near you..."
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
            onKeyPress={e => e.key === 'Enter' && fetchListings()}
            style={{
              background: 'none', border: 'none',
              color: 'white', fontSize: 14, flex: 1,
              outline: 'none', marginBottom: 0, padding: 0
            }}
          />
          <button
            onClick={fetchListings}
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: 'none', color: 'white',
              padding: '4px 12px', borderRadius: 8,
              fontSize: 13, cursor: 'pointer',
              marginTop: 0, width: 'auto'
            }}>
            Search
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Category cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10, marginBottom: 16
        }}>
          <div
            onClick={() => handleFilterButton('water')}
            style={{
              background: activeFilter === 'water' ? '#1a73e8' : '#e3f2fd',
              borderRadius: 12, padding: 12,
              display: 'flex', alignItems: 'center',
              gap: 10, cursor: 'pointer'
            }}>
            <div style={{
              width: 42, height: 42,
              background: activeFilter === 'water'
                ? 'rgba(255,255,255,0.2)' : '#1a73e8',
              borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 20
            }}>💧</div>
            <div>
              <p style={{
                fontSize: 11,
                color: activeFilter === 'water'
                  ? 'rgba(255,255,255,0.8)' : '#1565c0',
                margin: 0
              }}>Water</p>
              <p style={{
                fontSize: 14, fontWeight: 500,
                color: activeFilter === 'water' ? 'white' : '#1565c0',
                margin: 0
              }}>Refill</p>
            </div>
          </div>

          <div
            onClick={() => handleFilterButton('gas')}
            style={{
              background: activeFilter === 'gas' ? '#f57c00' : '#fff3e0',
              borderRadius: 12, padding: 12,
              display: 'flex', alignItems: 'center',
              gap: 10, cursor: 'pointer'
            }}>
            <div style={{
              width: 42, height: 42,
              background: activeFilter === 'gas'
                ? 'rgba(255,255,255,0.2)' : '#f57c00',
              borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 20
            }}>🔥</div>
            <div>
              <p style={{
                fontSize: 11,
                color: activeFilter === 'gas'
                  ? 'rgba(255,255,255,0.8)' : '#e65100',
                margin: 0
              }}>Gas</p>
              <p style={{
                fontSize: 14, fontWeight: 500,
                color: activeFilter === 'gas' ? 'white' : '#e65100',
                margin: 0
              }}>Cylinder</p>
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{
          display: 'flex', gap: 8,
          marginBottom: 16, overflowX: 'auto', paddingBottom: 4
        }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'near', label: 'Near me' },
            { key: 'delivery', label: 'Delivery' },
            { key: 'water', label: 'Water' },
            { key: 'gas', label: 'Gas' }
          ].map(item => (
            <div
              key={item.key}
              onClick={() => handleFilterButton(item.key)}
              style={{
                background: activeFilter === item.key ? '#1a73e8' : 'white',
                color: activeFilter === item.key ? 'white' : '#555',
                padding: '6px 14px', borderRadius: 20,
                fontSize: 12,
                fontWeight: activeFilter === item.key ? 500 : 400,
                whiteSpace: 'nowrap', cursor: 'pointer',
                border: activeFilter === item.key
                  ? 'none' : '0.5px solid #e0e0e0'
              }}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{
          background: '#fff8e1',
          borderLeft: '3px solid #f9a825',
          borderRadius: '0 8px 8px 0',
          padding: '10px 12px', marginBottom: 16
        }}>
          <p style={{ fontSize: 12, color: '#5d4037', margin: 0 }}>
            <strong>HomeFil</strong> does not handle payments.
            Pay suppliers directly on delivery.
          </p>
        </div>

        {/* Section title */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 12
        }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>
            Featured suppliers
          </p>
          <span style={{ fontSize: 13, color: '#1a73e8', cursor: 'pointer' }}>
            See all
          </span>
        </div>

        {/* Listings */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#888', fontSize: 14 }}>Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>🔍</p>
            <p style={{ color: '#888', fontSize: 14 }}>
              No listings found. Try a different filter.
            </p>
          </div>
        ) : (
          listings.map(listing => (
            <Link
              to={`/listing/${listing._id}`}
              key={listing._id}
              style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: 'white', borderRadius: 16,
                border: '0.5px solid #f0f0f0', overflow: 'hidden',
                marginBottom: 14,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>

                {/* Image */}
                {listing.image ? (
                  <img
                    src={`${BASE_URL}/uploads/${listing.image}`}
                    alt={listing.productType}
                    style={{ width: '100%', height: 160, objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    height: 120,
                    background: listing.category === 'water'
                      ? 'linear-gradient(135deg, #e3f2fd, #bbdefb)'
                      : 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 48,
                    position: 'relative'
                  }}>
                    {listing.category === 'water' ? '💧' : '🔥'}
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      background: listing.status === 'available'
                        ? '#e8f5e9' : '#ffebee',
                      color: listing.status === 'available'
                        ? '#2e7d32' : '#c62828',
                      fontSize: 11, fontWeight: 500,
                      padding: '3px 8px', borderRadius: 20
                    }}>
                      {listing.status === 'available'
                        ? 'Available' : 'Out of stock'}
                    </div>
                  </div>
                )}

                <div style={{ padding: 12 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 6
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: 500, fontSize: 15,
                        color: '#1a1a2e', margin: 0
                      }}>
                        {listing.productType ||
                          `${listing.category} ${listing.serviceType}`}
                      </p>
                      <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0' }}>
                        📍 {listing.location}
                      </p>
                    </div>
                    <p style={{
                      fontSize: 16, fontWeight: 500,
                      color: listing.category === 'water' ? '#1a73e8' : '#f57c00',
                      margin: 0, marginLeft: 8
                    }}>
                      KSh {listing.price?.toLocaleString()}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex', gap: 6,
                    marginBottom: 10, flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: listing.category === 'water'
                        ? '#e3f2fd' : '#fff3e0',
                      color: listing.category === 'water'
                        ? '#1565c0' : '#e65100',
                      fontSize: 11, fontWeight: 500,
                      padding: '2px 8px', borderRadius: 20
                    }}>
                      {listing.category}
                    </span>
                    <span style={{
                      background: '#f5f5f5', color: '#666',
                      fontSize: 11, padding: '2px 8px', borderRadius: 20
                    }}>
                      {listing.serviceType}
                    </span>
                    {listing.deliveryAvailable && (
                      <span style={{ fontSize: 11, color: '#2e7d32' }}>
                        ✓ Delivery {listing.deliveryTime}
                      </span>
                    )}
                  </div>

                  {/* Call and WhatsApp buttons */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr', gap: 8
                  }}>
                    
                      href={`tel:${listing.phone}`}
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: '#1a73e8', color: 'white',
                        padding: '9px 0', borderRadius: 10,
                        textAlign: 'center', fontSize: 13,
                        fontWeight: 500, textDecoration: 'none',
                        display: 'block'
                      }}>
                      📞 Call
                    </a>
                    {listing.whatsapp ? (
                      
                        href={`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          background: '#e8f5e9', color: '#2e7d32',
                          padding: '9px 0', borderRadius: 10,
                          textAlign: 'center', fontSize: 13,
                          fontWeight: 500, textDecoration: 'none',
                          display: 'block'
                        }}>
                        💬 WhatsApp
                      </a>
                    ) : (
                      <div style={{
                        background: '#f5f5f5', color: '#aaa',
                        padding: '9px 0', borderRadius: 10,
                        textAlign: 'center', fontSize: 13
                      }}>
                        💬 WhatsApp
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Bottom navigation */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'white',
        borderTop: '0.5px solid #f0f0f0',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '10px 0'
      }}>
        {[
          { icon: '🏠', label: 'Home', active: true, link: '/' },
          { icon: '🔍', label: 'Search', active: false, link: '/' },
          { icon: '🚨', label: 'Requests', active: false, link: '/requests' },
          { icon: '👤', label: 'Profile', active: false, link: '/auth' }
        ].map((item, i) => (
          <Link
            key={i}
            to={item.link}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, textDecoration: 'none'
            }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{
              fontSize: 11,
              color: item.active ? '#1a73e8' : '#888',
              fontWeight: item.active ? 500 : 400
            }}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;