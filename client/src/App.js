import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Auth               from './pages/Auth';
import AdminLogin         from './pages/AdminLogin';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy      from './pages/PrivacyPolicy';
import ListingDetails     from './pages/ListingDetails';
import AdminPanel         from './pages/AdminPanel';

import CustomerHome     from './pages/customer/CustomerHome';
import CustomerProfile  from './pages/customer/CustomerProfile';
import CustomerRequests from './pages/customer/CustomerRequests';

import SupplierDashboard from './pages/supplier/SupplierDashboard';
import SupplierListings  from './pages/supplier/SupplierListings';
import SupplierRequests  from './pages/supplier/SupplierRequests';
import SupplierProfile   from './pages/supplier/SupplierProfile';

import './App.css';

function RequireAuth({ children, role }) {
  var auth = useAuth();

  if (auth.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 36, margin: '0 0 8px' }}>💧</p>
          <p style={{ color: '#888', fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!auth.isLoggedIn()) {
    return <Navigate to="/auth" replace />;
  }

  if (role && auth.user.role !== role) {
    return <Navigate to={auth.getHomeRoute()} replace />;
  }

  return children;
}

function RoleRedirect() {
  var auth = useAuth();

  if (auth.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 36, margin: '0 0 8px' }}>💧</p>
          <p style={{ color: '#888', fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  return <Navigate to={auth.getHomeRoute()} replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ── Public ── */}
        <Route path="/auth"        element={<Auth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/terms"       element={<TermsAndConditions />} />
        <Route path="/privacy"     element={<PrivacyPolicy />} />

        {/* ── Root redirect ── */}
        <Route path="/"  element={<RoleRedirect />} />
        <Route path="*"  element={<RoleRedirect />} />

        {/* ── Customer ── */}
        <Route path="/customer/home"
          element={<RequireAuth role="customer"><CustomerHome /></RequireAuth>} />
        <Route path="/customer/requests"
          element={<RequireAuth role="customer"><CustomerRequests /></RequireAuth>} />
        <Route path="/customer/profile"
          element={<RequireAuth role="customer"><CustomerProfile /></RequireAuth>} />
        <Route path="/listing/:id"
          element={<RequireAuth><ListingDetails /></RequireAuth>} />

        {/* ── Supplier ── */}
        <Route path="/supplier/dashboard"
          element={<RequireAuth role="supplier"><SupplierDashboard /></RequireAuth>} />
        <Route path="/supplier/listings"
          element={<RequireAuth role="supplier"><SupplierListings /></RequireAuth>} />
        <Route path="/supplier/requests"
          element={<RequireAuth role="supplier"><SupplierRequests /></RequireAuth>} />
        <Route path="/supplier/profile"
          element={<RequireAuth role="supplier"><SupplierProfile /></RequireAuth>} />

        {/* ── Admin ── */}
        <Route path="/admin"
          element={<RequireAuth role="admin"><AdminPanel /></RequireAuth>} />

      </Routes>
    </Router>
  );
}