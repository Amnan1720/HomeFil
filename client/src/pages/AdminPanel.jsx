import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function AdminPanel() {
  var [tab,       setTab]       = useState('stats');
  var [stats,     setStats]     = useState({});
  var [suppliers, setSuppliers] = useState([]);
  var [customers, setCustomers] = useState([]);
  var [listings,  setListings]  = useState([]);
  var [requests,  setRequests]  = useState([]);
  var [loading,   setLoading]   = useState(false);
  var navigate = useNavigate();
  var user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(function() {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, []); // eslint-disable-line

  useEffect(function() {
    if (tab === 'stats')     fetchStats();
    if (tab === 'suppliers') fetchSuppliers();
    if (tab === 'customers') fetchCustomers();
    if (tab === 'listings')  fetchListings();
    if (tab === 'requests')  fetchRequests();
  }, [tab]); // eslint-disable-line

  async function fetchStats() {
    try {
      var res = await API.get('/admin/stats');
      setStats(res.data);
    } catch(e) { console.error(e); }
  }

  async function fetchSuppliers() {
    setLoading(true);
    try {
      var res = await API.get('/admin/suppliers');
      setSuppliers(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function fetchCustomers() {
    setLoading(true);
    try {
      var res = await API.get('/admin/customers');
      setCustomers(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function fetchListings() {
    setLoading(true);
    try {
      var res = await API.get('/admin/listings');
      setListings(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function fetchRequests() {
    setLoading(true);
    try {
      var res = await API.get('/admin/requests');
      setRequests(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function approveSupplier(id) {
    try {
      await API.put('/admin/suppliers/' + id + '/approve');
      fetchSuppliers();
    } catch(e) { alert('Could not approve supplier'); }
  }

  async function rejectSupplier(id) {
    try {
      await API.put('/admin/suppliers/' + id + '/reject');
      fetchSuppliers();
    } catch(e) { alert('Could not reject supplier'); }
  }

  async function deleteUser(id) {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete('/admin/users/' + id);
      fetchSuppliers();
      fetchCustomers();
    } catch(e) { alert('Could not delete user'); }
  }

  async function deleteListing(id) {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await API.delete('/admin/listings/' + id);
      fetchListings();
    } catch(e) { alert('Could not delete listing'); }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  }

  var tabList = [
    { key:'stats',     label:'Stats' },
    { key:'suppliers', label:'Suppliers' },
    { key:'customers', label:'Customers' },
    { key:'listings',  label:'Listings' },
    { key:'requests',  label:'Requests' }
  ];

  var S = {
    page: { minHeight:'100vh', background:'#f5f7fa', fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif' },
    header: { background:'linear-gradient(135deg,#1a73e8,#0d47a1)', padding:'20px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' },
    headerTitle: { color:'white', fontSize:'20px', fontWeight:700, margin:0 },
    headerSub: { color:'rgba(255,255,255,0.8)', fontSize:'13px', margin:'2px 0 0' },
    logoutBtn: { background:'rgba(255,255,255,0.2)', border:'none', color:'white', padding:'8px 16px', borderRadius:'20px', cursor:'pointer', fontSize:'13px', fontWeight:600 },
    tabBar: { display:'flex', overflowX:'auto', background:'white', borderBottom:'1px solid #f0f0f0', padding:'0 16px' },
    tabItem: function(active) { return { padding:'14px 16px', fontSize:'13px', fontWeight: active?700:500, color: active?'#1a73e8':'#888', borderBottom: active?'2px solid #1a73e8':'2px solid transparent', cursor:'pointer', whiteSpace:'nowrap' }; },
    content: { padding:'16px', maxWidth:'480px', margin:'0 auto' },
    card: { background:'white', borderRadius:'16px', padding:'16px', marginBottom:'14px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' },
    statGrid: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px', marginBottom:'16px' },
    statCard: function(color, bg) { return { background:bg, borderRadius:'14px', padding:'16px', textAlign:'center' }; },
    statNum: function(color) { return { fontSize:'28px', fontWeight:700, color:color, margin:'0 0 4px' }; },
    statLabel: function(color) { return { fontSize:'12px', color:color, margin:0, fontWeight:500 }; },
    row: { display:'flex', alignItems:'center', gap:'12px', padding:'14px 0', borderBottom:'1px solid #f5f5f5' },
    avatar: function(color) { return { width:'42px', height:'42px', borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'14px', flexShrink:0 }; },
    name: { fontSize:'15px', fontWeight:600, color:'#1a1a2e', margin:'0 0 2px' },
    sub: { fontSize:'12px', color:'#888', margin:0 },
    badge: function(color, bg) { return { background:bg, color:color, fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', display:'inline-block' }; },
    approveBtn: { background:'#e8f5e9', color:'#2e7d32', border:'none', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:600, cursor:'pointer', marginRight:'6px' },
    rejectBtn: { background:'#ffebee', color:'#c62828', border:'none', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:600, cursor:'pointer', marginRight:'6px' },
    deleteBtn: { background:'#ffebee', color:'#c62828', border:'none', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:600, cursor:'pointer' },
    sectionTitle: { fontSize:'15px', fontWeight:700, color:'#1a1a2e', margin:'0 0 16px' },
    empty: { textAlign:'center', padding:'40px 0', color:'#888' },
    loadingText: { textAlign:'center', padding:'40px 0', color:'#888', fontSize:'14px' }
  };

  function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  }

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <div>
          <p style={S.headerTitle}>
            <span style={{ color:'white' }}>Home</span>
            <span style={{ color:'#ffa726' }}>Fil</span>
            <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'14px', fontWeight:400 }}> · Admin Panel</span>
          </p>
          <p style={S.headerSub}>Welcome, {user ? user.name : 'Admin'}</p>
        </div>
        <button onClick={logout} style={S.logoutBtn}>Logout</button>
      </div>

      {/* Tab bar */}
      <div style={S.tabBar}>
        {tabList.map(function(t) {
          return (
            <div key={t.key} onClick={function() { setTab(t.key); }} style={S.tabItem(tab === t.key)}>
              {t.label}
            </div>
          );
        })}
      </div>

      <div style={S.content}>

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <div>
            <p style={S.sectionTitle}>Dashboard Overview</p>

            <div style={S.statGrid}>
              {[
                { label:'Total Suppliers', value: stats.suppliers || 0,   color:'#1a73e8', bg:'#e3f2fd' },
                { label:'Total Customers', value: stats.customers || 0,   color:'#2e7d32', bg:'#e8f5e9' },
                { label:'Total Listings',  value: stats.listings  || 0,   color:'#f57c00', bg:'#fff3e0' },
                { label:'Pending Approval',value: stats.pending   || 0,   color:'#c62828', bg:'#ffebee' }
              ].map(function(s, i) {
                return (
                  <div key={i} style={S.statCard(s.color, s.bg)}>
                    <p style={S.statNum(s.color)}>{s.value}</p>
                    <p style={S.statLabel(s.color)}>{s.label}</p>
                  </div>
                );
              })}
            </div>

            <div style={S.card}>
              <p style={S.sectionTitle}>Quick Actions</p>
              {[
                { label:'Manage Suppliers', key:'suppliers', color:'#1a73e8' },
                { label:'Manage Customers', key:'customers', color:'#2e7d32' },
                { label:'Manage Listings',  key:'listings',  color:'#f57c00' },
                { label:'View Requests',    key:'requests',  color:'#7b1fa2' }
              ].map(function(item, i, arr) {
                return (
                  <div key={item.key} onClick={function() { setTab(item.key); }}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 0', borderBottom: i < arr.length-1 ? '1px solid #f5f5f5' : 'none', cursor:'pointer' }}>
                    <span style={{ fontSize:'14px', fontWeight:500, color:'#1a1a2e' }}>{item.label}</span>
                    <span style={{ color:item.color, fontSize:'18px' }}>›</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SUPPLIERS TAB ── */}
        {tab === 'suppliers' && (
          <div>
            <p style={S.sectionTitle}>Suppliers ({suppliers.length})</p>
            {loading && <p style={S.loadingText}>Loading suppliers...</p>}
            {!loading && suppliers.length === 0 && <p style={S.empty}>No suppliers found</p>}
            {!loading && suppliers.map(function(sup) {
              var isPending  = sup.status === 'pending';
              var isApproved = sup.status === 'approved';
              var isRejected = sup.status === 'rejected';
              return (
                <div key={sup._id} style={S.card}>
                  <div style={S.row}>
                    <div style={S.avatar('#1a73e8')}>{getInitials(sup.name)}</div>
                    <div style={{ flex:1 }}>
                      <p style={S.name}>{sup.name}</p>
                      <p style={S.sub}>{sup.email} · {sup.phone}</p>
                      <p style={S.sub}>{sup.supplierType === 'gas' ? '🔥 Gas' : '💧 Water'} Supplier</p>
                    </div>
                    <span style={
                      isPending  ? S.badge('#e65100','#fff3e0') :
                      isApproved ? S.badge('#2e7d32','#e8f5e9') :
                                   S.badge('#c62828','#ffebee')
                    }>
                      {isPending ? 'Pending' : isApproved ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                  <div style={{ display:'flex', gap:'8px', paddingTop:'10px', flexWrap:'wrap' }}>
                    {isPending && (
                      <button onClick={function() { approveSupplier(sup._id); }} style={S.approveBtn}>
                        Approve
                      </button>
                    )}
                    {isPending && (
                      <button onClick={function() { rejectSupplier(sup._id); }} style={S.rejectBtn}>
                        Reject
                      </button>
                    )}
                    {isRejected && (
                      <button onClick={function() { approveSupplier(sup._id); }} style={S.approveBtn}>
                        Approve
                      </button>
                    )}
                    <button onClick={function() { deleteUser(sup._id); }} style={S.deleteBtn}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CUSTOMERS TAB ── */}
        {tab === 'customers' && (
          <div>
            <p style={S.sectionTitle}>Customers ({customers.length})</p>
            {loading && <p style={S.loadingText}>Loading customers...</p>}
            {!loading && customers.length === 0 && <p style={S.empty}>No customers found</p>}
            {!loading && customers.map(function(cust) {
              return (
                <div key={cust._id} style={S.card}>
                  <div style={S.row}>
                    <div style={S.avatar('#2e7d32')}>{getInitials(cust.name)}</div>
                    <div style={{ flex:1 }}>
                      <p style={S.name}>{cust.name}</p>
                      <p style={S.sub}>{cust.email}</p>
                      <p style={S.sub}>{cust.phone} · {cust.location || 'No location'}</p>
                    </div>
                    <span style={S.badge('#2e7d32','#e8f5e9')}>Customer</span>
                  </div>
                  <div style={{ paddingTop:'10px' }}>
                    <button onClick={function() { deleteUser(cust._id); }} style={S.deleteBtn}>
                      Delete Account
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LISTINGS TAB ── */}
        {tab === 'listings' && (
          <div>
            <p style={S.sectionTitle}>All Listings ({listings.length})</p>
            {loading && <p style={S.loadingText}>Loading listings...</p>}
            {!loading && listings.length === 0 && <p style={S.empty}>No listings found</p>}
            {!loading && listings.map(function(l) {
              var isWater = l.category === 'water';
              return (
                <div key={l._id} style={S.card}>
                  <div style={S.row}>
                    <div style={{
                      width:'52px', height:'52px', borderRadius:'12px', flexShrink:0,
                      background: isWater ? '#e3f2fd' : '#fff3e0',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px'
                    }}>
                      {isWater ? '💧' : '🔥'}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={S.name}>{l.productType || l.category + ' ' + l.serviceType}</p>
                      <p style={S.sub}>KSh {l.price ? l.price.toLocaleString() : '0'} · {l.location}</p>
                      <p style={S.sub}>{l.phone}</p>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px' }}>
                      <span style={l.status === 'available' ? S.badge('#2e7d32','#e8f5e9') : S.badge('#c62828','#ffebee')}>
                        {l.status === 'available' ? 'Available' : 'Out of Stock'}
                      </span>
                      <span style={isWater ? S.badge('#1565c0','#e3f2fd') : S.badge('#e65100','#fff3e0')}>
                        {l.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ paddingTop:'10px' }}>
                    <button onClick={function() { deleteListing(l._id); }} style={S.deleteBtn}>
                      Delete Listing
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── REQUESTS TAB ── */}
        {tab === 'requests' && (
          <div>
            <p style={S.sectionTitle}>Customer Requests ({requests.length})</p>
            {loading && <p style={S.loadingText}>Loading requests...</p>}
            {!loading && requests.length === 0 && <p style={S.empty}>No requests found</p>}
            {!loading && requests.map(function(req) {
              var isGas = req.category === 'gas';
              return (
                <div key={req._id} style={S.card}>
                  <div style={S.row}>
                    <div style={{
                      width:'46px', height:'46px', borderRadius:'12px', flexShrink:0,
                      background: isGas ? '#fff3e0' : '#e3f2fd',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px'
                    }}>
                      {isGas ? '🔥' : '💧'}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:'6px', marginBottom:'6px', flexWrap:'wrap' }}>
                        <span style={isGas ? S.badge('#e65100','#fff3e0') : S.badge('#1565c0','#e3f2fd')}>
                          {req.category}
                        </span>
                        <span style={S.badge('#c62828','#ffebee')}>Urgent</span>
                      </div>
                      <p style={S.name}>
                        {req.userId ? req.userId.name : 'Unknown'}
                      </p>
                    </div>
                    <p style={{ fontSize:'11px', color:'#aaa', margin:0, flexShrink:0 }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ background:'#f9f9f9', borderRadius:'10px', padding:'12px', margin:'8px 0' }}>
                    <p style={{ fontSize:'14px', color:'#333', margin:0, lineHeight:1.5 }}>
                      "{req.requestText}"
                    </p>
                  </div>
                  <p style={{ fontSize:'13px', color:'#666', margin:'0 0 10px' }}>
                    📍 {req.location}
                  </p>
                  {req.userId && req.userId.phone && (
                    <a href={'tel:' + req.userId.phone}
                      style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'#1a73e8', color:'white', padding:'9px 16px', borderRadius:'10px', fontSize:'13px', fontWeight:600, textDecoration:'none' }}>
                      📞 Call {req.userId.name}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminPanel;