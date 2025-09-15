/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);
};

export default useAuthCheck;
