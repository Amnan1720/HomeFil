import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function AdminPanel() {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (tab === 'stats')     fetchStats();
    if (tab === 'suppliers') fetchSuppliers();
    if (tab === 'customers') fetchCustomers();
    if (tab === 'listings')  fetchListings();
    if (tab === 'requests')  fetchRequests();
  }, [tab]);

  async function fetchStats() {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) { console.error(err); }
  }

  async function fetchSuppliers() {
    try {
      const res = await API.get('/admin/suppliers');
      setSuppliers(res.data);
    } catch (err) { console.error(err); }
  }

  async function fetchCustomers() {
    try {
      const res = await API.get('/admin/customers');
      setCustomers(res.data);
    } catch (err) { console.error(err); }
  }

  async function fetchListings() {
    try {
      const res = await API.get('/admin/listings');
      setListings(res.data);
    } catch (err) { console.error(err); }
  }

  async function fetchRequests() {
    try {
      const res = await API.get('/admin/requests');
      setRequests(res.data);
    } catch (err) { console.error(err); }
  }

  async function approveSupplier(id) {
    try {
      await API.put(`/admin/suppliers/${id}/approve`);
      fetchSuppliers();
      fetchStats();
    } catch (err) { alert('Error approving supplier'); }
  }

  async function rejectSupplier(id) {
    try {
      await API.put(`/admin/suppliers/${id}/reject`);
      fetchSuppliers();
    } catch (err) { alert('Error rejecting supplier'); }
  }

  async function deleteUser(id) {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchCustomers();
      fetchSuppliers();
    } catch (err) { alert('Error deleting user'); }
  }

  async function deleteListing(id) {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await API.delete(`/admin/listings/${id}`);
      fetchListings();
    } catch (err) { alert('Error deleting listing'); }
  }

  const tabStyle = (name) => ({
    padding: '10px 16px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    background: tab === name ? '#1a73e8' : '#f0f0f0',
    color: tab === name ? 'white' : '#333',
    marginRight: 8,
    marginBottom: 8
  });

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>🛡️ Admin Panel</h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        Manage all users suppliers and listings
      </p>

      <div style={{ marginBottom: 20, flexWrap: 'wrap', display: 'flex' }}>
        <button style={tabStyle('stats')}
                onClick={() => setTab('stats')}>
          📊 Stats
        </button>
        <button style={tabStyle('suppliers')}
                onClick={() => setTab('suppliers')}>
          🏪 Suppliers
        </button>
        <button style={tabStyle('customers')}
                onClick={() => setTab('customers')}>
          👥 Customers
        </button>
        <button style={tabStyle('listings')}
                onClick={() => setTab('listings')}>
          📋 Listings
        </button>
        <button style={tabStyle('requests')}
                onClick={() => setTab('requests')}>
          🚨 Requests
        </button>
      </div>

      {tab === 'stats' && (
        <div>
          <div className="card" style={{ background: '#e3f2fd' }}>
            <h3>👥 Total Customers</h3>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#1a73e8' }}>
              {stats.totalUsers || 0}
            </p>
          </div>
          <div className="card" style={{ background: '#fff3e0' }}>
            <h3>🏪 Total Suppliers</h3>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#f57c00' }}>
              {stats.totalSuppliers || 0}
            </p>
          </div>
          <div className="card" style={{ background: '#fff8e1' }}>
            <h3>⏳ Pending Approvals</h3>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#f9a825' }}>
              {stats.pendingSuppliers || 0}
            </p>
          </div>
          <div className="card" style={{ background: '#e8f5e9' }}>
            <h3>📋 Total Listings</h3>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#2e7d32' }}>
              {stats.totalListings || 0}
            </p>
          </div>
          <div className="card" style={{ background: '#fce4ec' }}>
            <h3>🚨 Total Requests</h3>
            <p style={{ fontSize: 32, fontWeight: 700, color: '#c62828' }}>
              {stats.totalRequests || 0}
            </p>
          </div>
        </div>
      )}

      {tab === 'suppliers' && (
        <div>
          <h3 style={{ marginBottom: 12 }}>All Suppliers</h3>
          {suppliers.length === 0 ? (
            <p style={{ color: '#888' }}>No suppliers yet</p>
          ) : (
            suppliers.map(s => (
              <div className="card" key={s._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{s.name}</h3>
                  <span className={`badge ${
                    s.status === 'approved' ? 'badge-green' :
                    s.status === 'rejected' ? 'badge-gray' : 'badge-orange'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <p>📧 {s.email}</p>
                <p>📞 {s.phone}</p>
                <p>📍 {s.location}</p>
                <p style={{ fontSize: 12, color: '#aaa' }}>
                  Joined: {new Date(s.createdAt).toLocaleDateString()}
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {s.status !== 'approved' && (
                    <button className="btn btn-green"
                            onClick={() => approveSupplier(s._id)}
                            style={{ flex: 1, padding: '8px 0', marginTop: 0 }}>
                      ✅ Approve
                    </button>
                  )}
                  {s.status !== 'rejected' && (
                    <button className="btn btn-orange"
                            onClick={() => rejectSupplier(s._id)}
                            style={{ flex: 1, padding: '8px 0', marginTop: 0 }}>
                      ❌ Reject
                    </button>
                  )}
                  <button className="btn btn-red"
                          onClick={() => deleteUser(s._id)}
                          style={{ flex: 1, padding: '8px 0', marginTop: 0 }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'customers' && (
        <div>
          <h3 style={{ marginBottom: 12 }}>All Customers</h3>
          {customers.length === 0 ? (
            <p style={{ color: '#888' }}>No customers yet</p>
          ) : (
            customers.map(c => (
              <div className="card" key={c._id}>
                <h3>{c.name}</h3>
                <p>📧 {c.email}</p>
                <p>📞 {c.phone}</p>
                <p>📍 {c.location}</p>
                <p style={{ fontSize: 12, color: '#aaa' }}>
                  Joined: {new Date(c.createdAt).toLocaleDateString()}
                </p>
                <button className="btn btn-red"
                        onClick={() => deleteUser(c._id)}
                        style={{ padding: '8px 0', marginTop: 8 }}>
                  🗑️ Delete Customer
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'listings' && (
        <div>
          <h3 style={{ marginBottom: 12 }}>All Listings</h3>
          {listings.length === 0 ? (
            <p style={{ color: '#888' }}>No listings yet</p>
          ) : (
            listings.map(l => (
              <div className="card" key={l._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{l.productType}</h3>
                  <span>{l.category === 'water' ? '💧' : '🔥'}</span>
                </div>
                <span className={`badge badge-${l.category === 'water'
                  ? 'blue' : 'orange'}`}>
                  {l.category}
                </span>
                <span className="badge badge-gray">{l.serviceType}</span>
                <p>📍 {l.location}</p>
                <p><strong>KSh {l.price?.toLocaleString()}</strong></p>
                {l.supplierId && (
                  <p style={{ fontSize: 13, color: '#777' }}>
                    By {l.supplierId.name} · {l.supplierId.phone}
                  </p>
                )}
                <button className="btn btn-red"
                        onClick={() => deleteListing(l._id)}
                        style={{ padding: '8px 0', marginTop: 8 }}>
                  🗑️ Delete Listing
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'requests' && (
        <div>
          <h3 style={{ marginBottom: 12 }}>All Urgent Requests</h3>
          {requests.length === 0 ? (
            <p style={{ color: '#888' }}>No requests yet</p>
          ) : (
            requests.map(r => (
              <div className="card" key={r._id}>
                <span className={`badge badge-${r.category === 'water'
                  ? 'blue' : 'orange'}`}>
                  {r.category === 'gas' ? '🔥' : '💧'} {r.category}
                </span>
                <p style={{ marginTop: 8, fontWeight: 500 }}>
                  {r.requestText}
                </p>
                <p>📍 {r.location}</p>
                {r.userId && (
                  <p style={{ fontSize: 13, color: '#777' }}>
                    By {r.userId.name} · 📞 {r.userId.phone}
                  </p>
                )}
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;