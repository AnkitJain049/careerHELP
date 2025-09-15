import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const Login = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          authenticated: true
        }));
        // Persist access token for Authorization header fallback (Edge blocks cross-site cookies by default)
        if (data.accessToken) {
          localStorage.setItem('access_token', data.accessToken);
        }
      }
      onSuccess?.('Logged in successfully.');
      navigate('/home');
    } catch (err) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-2 px-3 bg-inputs rounded-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-2 px-3 bg-inputs rounded-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-3 bg-inputs rounded-lg font-semibold hover:bg-inputs-hover transition-colors disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'login'}
      </button>
    </form>
  );
};

export default Login;


