import React, { useMemo, useState } from 'react';
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

  const [errors, setErrors] = useState({
    contactNumber: '',
    password: '',
    confirmPassword: '',
  });

  const passwordRules = useMemo(() => ({
    hasMinLen: password.length >= 6,
    hasDigit: /\d/.test(password || ''),
    hasSpecial: /[^A-Za-z0-9]/.test(password || ''),
  }), [password]);

  const isContactValid = useMemo(() => /^\d{10}$/.test(contactNumber || ''), [contactNumber]);

  const validateForm = () => {
    const nextErrors = { contactNumber: '', password: '', confirmPassword: '' };
    if (!isContactValid) nextErrors.contactNumber = 'Contact number must be exactly 10 digits';
    if (!passwordRules.hasMinLen || !passwordRules.hasDigit || !passwordRules.hasSpecial) {
      nextErrors.password = 'Password must be ≥6 chars, include at least 1 digit and 1 special character';
    }
    if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    return !nextErrors.contactNumber && !nextErrors.password && !nextErrors.confirmPassword;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
        if (data.accessToken) {
          localStorage.setItem('access_token', data.accessToken);
        }
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
        {errors.contactNumber && (
          <div className="mt-1 text-xs" style={{ color: '#ffbdbd' }}>{errors.contactNumber}</div>
        )}
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
        <div className="mt-2 space-y-1 text-xs">
          <div className={passwordRules.hasMinLen ? 'text-white' : 'text-gray-400'}>Password must be at least 6 characters</div>
          <div className={passwordRules.hasDigit ? 'text-white' : 'text-gray-400'}>Password must contain at least one digit</div>
          <div className={passwordRules.hasSpecial ? 'text-white' : 'text-gray-400'}>Password must contain at least one special character</div>
        </div>
        {errors.password && (
          <div className="mt-1 text-xs" style={{ color: '#ffbdbd' }}>{errors.password}</div>
        )}
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
        {errors.confirmPassword && (
          <div className="mt-1 text-xs" style={{ color: '#ffbdbd' }}>{errors.confirmPassword}</div>
        )}
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


