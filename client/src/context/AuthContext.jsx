import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    var savedToken = localStorage.getItem('token');
    var savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        var parsed = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  function login(userData, userToken) {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  function isCustomer() { return user && user.role === 'customer'; }
  function isSupplier() { return user && user.role === 'supplier'; }
  function isAdmin()    { return user && user.role === 'admin'; }
  function isLoggedIn() { return !!user && !!token; }

  function getHomeRoute() {
    if (!user) return '/auth';
    if (user.role === 'customer') return '/customer/home';
    if (user.role === 'supplier') return '/supplier/dashboard';
    if (user.role === 'admin')    return '/admin';
    return '/auth';
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, logout, updateUser,
      isCustomer, isSupplier, isAdmin, isLoggedIn,
      getHomeRoute
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  var context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export default AuthContext;