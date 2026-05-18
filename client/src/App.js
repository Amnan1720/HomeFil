import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Requests from './pages/Requests';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* These pages have NO navbar — full screen design */}
        <Route path="/auth"        element={<Auth />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* These pages have the navbar */}
        <Route path="/*" element={
          <>
            <Navbar />
            <div className="app-container">
              <Routes>
                <Route path="/"            element={<Home />} />
                <Route path="/listing/:id" element={<ListingDetails />} />
                <Route path="/dashboard"   element={<Dashboard />} />
                <Route path="/requests"    element={<Requests />} />
                <Route path="/admin"       element={<AdminPanel />} />
              </Routes>
            </div>
          </>
        } />

      </Routes>
    </Router>
  );
}

export default App;