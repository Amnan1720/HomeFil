import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Requests from './pages/Requests';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public pages — no login needed */}
        <Route path="/auth"        element={<Auth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/terms"       element={<TermsAndConditions />} />
        <Route path="/privacy"     element={<PrivacyPolicy />} />

        {/* Protected pages — login required */}
        <Route path="/*" element={
          <PrivateRoute>
            <>
              <Navbar />
              <div className="app-container">
                <Routes>
                  <Route path="/"            element={<Home />} />
                  <Route path="/listing/:id" element={<ListingDetails />} />
                  <Route path="/dashboard"   element={<Dashboard />} />
                  <Route path="/requests"    element={<Requests />} />
                  <Route path="/admin"       element={<AdminPanel />} />
                  <Route path="*"            element={<Navigate to="/" />} />
                </Routes>
              </div>
            </>
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;