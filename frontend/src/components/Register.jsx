import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const Register = ({ onSuccess, onError }) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      onError?.('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, contactNumber, email, password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          authenticated: true
        }));
      }
      onSuccess?.('Registered successfully.');
      navigate('/home');
    } catch (err) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full py-2 px-3 bg-inputs rounded-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="contact number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="w-full py-2 px-3 bg-inputs rounded-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
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
      <div className="mb-4">
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-2 px-3 bg-inputs rounded-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full py-2 px-3 bg-inputs rounded-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-3 bg-inputs rounded-lg font-semibold hover:bg-inputs-hover transition-colors disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'register'}
      </button>
    </form>
  );
};

export default Register;


