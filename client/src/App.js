import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Profile from './pages/Profile';
import './App.css';

// Pages that have their own header — no navbar needed
const NO_NAVBAR_PAGES = ['/', '/auth', '/admin-login', '/terms', '/privacy'];

function Layout() {
  const location = useLocation();
  const showNavbar = !NO_NAVBAR_PAGES.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'app-container' : ''}>
        <Routes>
          <Route path="/" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />
          <Route path="/listing/:id" element={
            <PrivateRoute><ListingDetails /></PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/requests" element={
            <PrivateRoute><Requests /></PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute><AdminPanel /></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/auth"        element={<Auth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/terms"       element={<TermsAndConditions />} />
          <Route path="/privacy"     element={<PrivacyPolicy />} />
          <Route path="*"            element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;