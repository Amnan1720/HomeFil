import React, { useState, useEffect } from 'react';
import API from '../api';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    category: 'gas', requestText: '', location: ''
  });
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (user) fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await API.get('/requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await API.post('/requests', form);
      setForm({ category: 'gas', requestText: '', location: '' });
      setShowForm(false);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not post request');
    }
  }

  if (!user) return (
    <p style={{ textAlign: 'center', marginTop: 40 }}>
      Please <a href="/auth" style={{ color: '#1a73e8' }}>log in</a> to
      view requests.
    </p>
  );

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>Urgent Requests</h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        Customers who need water or gas urgently
      </p>

      {user.role === 'customer' && (
        <button className="btn btn-orange"
                onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '🚨 Post urgent request'}
        </button>
      )}

      {showForm && (
        <div className="card" style={{ marginTop: 12 }}>
          <form onSubmit={handleSubmit}>
            <label>What do you need?</label>
            <select name="category" value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="gas">🔥 Gas</option>
              <option value="water">💧 Water</option>
            </select>

            <label>Describe your request</label>
            <textarea rows={3} value={form.requestText}
                      placeholder="e.g. Need 6kg gas cylinder urgently"
                      onChange={e => setForm({
                        ...form, requestText: e.target.value })}
                      required />

            <label>Your location</label>
            <input value={form.location}
                   placeholder="e.g. Nakuru Town, Pipeline area"
                   onChange={e => setForm({ ...form, location: e.target.value })}
                   required />

            <button className="btn btn-orange" type="submit">
              Post request
            </button>
          </form>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>
            No urgent requests right now.
          </p>
        ) : (
          requests.map(req => (
            <div className="card" key={req._id}>
              <span className={`badge badge-${req.category === 'water'
                ? 'blue' : 'orange'}`}>
                {req.category === 'gas' ? '🔥' : '💧'} {req.category}
              </span>
              <p style={{ marginTop: 8, fontWeight: 500 }}>
                {req.requestText}
              </p>
              <p>📍 {req.location}</p>
              {req.userId && (
                <p style={{ fontSize: 13, color: '#777' }}>
                  By {req.userId.name} · 📞 {req.userId.phone}
                </p>
              )}
              <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                {new Date(req.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Requests;