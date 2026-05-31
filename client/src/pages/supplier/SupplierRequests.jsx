import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SupplierNav from '../../components/SupplierNav';

const BASE = 'https://homefil-backed.onrender.com';

export default function SupplierRequests() {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const supType = user.supplierType || 'water';

  useEffect(function() { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function load() {
    axios.get(BASE + '/api/requests', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(function(r) { setRequests(r.data); }).catch(console.error);
  }

  return (
    <div style={{ padding: 16, paddingBottom: 90 }}>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
          🚨 Customer Requests
        </p>
        <p style={{ fontSize: 13, color: '#888', margin: '2px 0 0' }}>
          {requests.length} urgent request{requests.length !== 1 ? 's' : ''} from customers
        </p>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
          <p style={{ fontSize: 48, margin: '0 0 12px' }}>🚨</p>
          <p style={{ fontSize: 15 }}>No urgent requests right now</p>
          <p style={{ fontSize: 13, color: '#aaa' }}>Check back later</p>
        </div>
      ) : (
        requests.map(function(req) {
          return (
            <div key={req._id} style={{ background: 'white', borderRadius: 16, padding: 16,
                                         marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                               background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                               display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {req.category === 'gas' ? '🔥' : '💧'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ background: req.category === 'gas' ? '#fff3e0' : '#e3f2fd',
                                    color: req.category === 'gas' ? '#e65100' : '#1565c0',
                                    fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
                      {req.category}
                    </span>
                    <span style={{ background: '#ffebee', color: '#c62828',
                                    fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
                      🚨 Urgent
                    </span>
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
                    style={{ background: '#1a73e8', color: 'white', padding: '11px 0',
                              borderRadius: 10, textAlign: 'center', fontSize: 14,
                              fontWeight: 600, textDecoration: 'none', display: 'block' }}>
                    📞 Call
                  </a>
                  <a href={'https://wa.me/' + (req.userId.phone || '').replace(/\D/g, '')}
                    target="_blank" rel="noreferrer"
                    style={{ background: '#e8f5e9', color: '#2e7d32', padding: '11px 0',
                              borderRadius: 10, textAlign: 'center', fontSize: 14,
                              fontWeight: 600, textDecoration: 'none', display: 'block' }}>
                    💬 WhatsApp
                  </a>
                </div>
              )}
            </div>
          );
        })
      )}

      <SupplierNav supplierType={supType} />
    </div>
  );
}