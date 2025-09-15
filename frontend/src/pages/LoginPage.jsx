import React, { useState } from 'react';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSuccess = (msg) => {
    setMessage(msg || 'Success');
    if (mode === 'register') setMode('login');
  };

  const handleError = (msg) => setMessage(msg || 'Something went wrong');

  // Google OAuth2.0
  const handleGoogleLogin = async () => {
    // eslint-disable-next-line no-unused-vars
    /* global google */
    if (!window.google) {
      setMessage('Google API not loaded');
      return;
    }
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = await new Promise((resolve, reject) => {
        const client = window.google.accounts.id;
        client.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) resolve(response.credential);
            else reject('No credential');
          },
        });
        client.prompt();
      });
      // Send token to backend
      const res = await fetch(`${backendUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken: token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google login failed');
      // Persist token and user for Authorization header usage
      if (data?.accessToken) {
        localStorage.setItem('access_token', data.accessToken);
      }
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      setMessage('Google login successful!');
      navigate('/home');
    } catch (err) {
      setMessage(err.message || 'Google login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <h1 className="text-4xl font-bold mb-8 tracking-wider font-sans">
        careerHELP
      </h1>
  <div className="bg-midnight p-4 rounded-lg shadow-lg max-w-md w-full">

        <div className="flex mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 p-2 mr-2 rounded ${mode === 'login' ? 'bg-inputs' : 'bg-inputs hover:bg-inputs-hover'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 p-2 ml-2 rounded ${mode === 'register' ? 'bg-inputs' : 'bg-inputs hover:bg-inputs-hover'}`}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <Login onSuccess={handleSuccess} onError={handleError} />
        ) : (
          <Register onSuccess={handleSuccess} onError={handleError} />)
        }

        {message && (
          <div className="mt-4 text-center text-sm text-gray-400">
            {message}
          </div>
        )}
      </div>

      {/* Google button below the container */}
      <button
        type="button"
        className="w-full max-w-sm mt-6 py-2 px-4 bg-inputs text-white rounded hover:bg-inputs-hover"
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </button>
    </div>
  );
};

export default LoginPage;
