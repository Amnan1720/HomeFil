import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', role: 'customer', location: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await API.post('/login', {
          email: form.email,
          password: form.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        await API.post('/register', form);
        alert('Account created! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 22 }}>
        {isLogin ? 'Welcome back' : 'Create an account'}
      </h2>

      {error && (
        <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <label>Full name</label>
            <input name="name" placeholder="e.g. Jane Wanjiku"
                   value={form.name} onChange={handleChange} required />

            <label>Phone number</label>
            <input name="phone" placeholder="e.g. 0712345678"
                   value={form.phone} onChange={handleChange} required />

            <label>I am a</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
            </select>

            <label>Location</label>
            <input name="location" placeholder="e.g. Nakuru Town"
                   value={form.location} onChange={handleChange} />
          </>
        )}

        <label>Email address</label>
        <input name="email" type="email" placeholder="you@email.com"
               value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" placeholder="Min. 6 characters"
               value={form.password} onChange={handleChange} required />

        <button className="btn btn-blue" type="submit">
          {isLogin ? 'Log in' : 'Create account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <span style={{ color: '#1a73e8', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Log in'}
        </span>
      </p>
    </div>
  );
}

export default Auth;