import React, { useState, useEffect } from 'react';
import API from '../../api';
import CustomerNav from '../../components/CustomerNav';

export default function CustomerRequests() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ category: 'gas', requestText: '', location: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(function() { load(); }, []);

  function load() {
    API.get('/requests').then(function(r) { setRequests(r.data); }).catch(console.error);
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/requests', form);
      setForm({ category: 'gas', requestText: '', location: '' });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response ? err.response.data.message : 'Error posting request');
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 16, paddingBottom: 90 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>🚨 Urgent Requests</p>
          <p style={{ fontSize: 13, color: '#888', margin: '2px 0 0' }}>Post or view urgent needs</p>
        </div>
        <button onClick={function() { setShowForm(!showForm); }}
          style={{ background: '#f57c00', color: 'white', border: 'none',
                    borderRadius: 12, padding: '10px 16px', fontSize: 13,
                    fontWeight: 700, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Post Request'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: 16, padding: 16,
                       boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16,
                       border: '1.5px solid #f57c00' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>
            New Urgent Request
          </p>
          <form onSubmit={submit}>
            <label>What do you need?</label>
            <select value={form.category}
              onChange={function(e) { setForm(Object.assign({}, form, { category: e.target.value })); }}>
              <option value="gas">🔥 Gas</option>
              <option value="water">💧 Water</option>
            </select>

            <label>Describe your request</label>
            <textarea rows={3} value={form.requestText}
              onChange={function(e) { setForm(Object.assign({}, form, { requestText: e.target.value })); }}
              placeholder="e.g. Need 6kg gas cylinder urgently, running out"
              required />

            <label>Your location</label>
            <input value={form.location}
              onChange={function(e) { setForm(Object.assign({}, form, { location: e.target.value })); }}
              placeholder="e.g. Nakuru Town, Pipeline area" required />

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 14,
              background: loading ? '#ccc' : 'linear-gradient(135deg,#f57c00,#e65100)',
              color: 'white', border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? '⏳ Posting...' : '🚨 Post Request'}
            </button>
          </form>
        </div>
      )}

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
          <p style={{ fontSize: 48, margin: '0 0 12px' }}>🚨</p>
          <p style={{ fontSize: 15 }}>No requests yet</p>
          <p style={{ fontSize: 13, color: '#aaa' }}>Post your first urgent request above</p>
        </div>
      ) : (
        requests.map(function(req) {
          return (
            <div key={req._id} style={{ background: 'white', borderRadius: 16, padding: 16,
                                         marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10,
                               background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                               display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {req.category === 'gas' ? '🔥' : '💧'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                                    color: req.category === 'gas' ? '#e65100' : '#1565c0',
                                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                      {req.category}
                    </span>
                    <span style={{ background: '#ffebee', color: '#c62828',
                                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                      🚨 Urgent
                    </span>
                  </div>
                  {req.userId && (
                    <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>
                      By {req.userId.name}
                    </p>
                  )}
                </div>
                <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>
                  {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ background: '#f9f9f9', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                <p style={{ fontSize: 14, color: '#333', margin: 0 }}>"{req.requestText}"</p>
              </div>
              <p style={{ fontSize: 12, color: '#888', margin: 0 }}>📍 {req.location}</p>
            </div>
          );
        })
      )}

      <CustomerNav />
    </div>
  );
}