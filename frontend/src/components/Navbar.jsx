import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('user');
    setShowConfirm(false);
    navigate('/login', { replace: true });
  };

  const handleLogoutCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[var(--color-midnight)] shadow-lg px-8 py-3 flex items-center justify-between z-50">
        <span className="text-white font-bold text-lg tracking-wide">careerHELP</span>
        <div className="flex gap-4">
          <Link to="/home" className="text-gray-300 hover:text-white transition">Dashboard</Link>
          <a href="#" className="text-gray-300 hover:text-white transition" onClick={handleLogoutClick}>Logout</a>
        </div>
      </nav>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 backdrop-blur-sm"></div>
          <div className="relative bg-[var(--color-midnight)] rounded-xl shadow-xl p-8 flex flex-col items-center">
            <div className="text-white text-lg mb-6">Are you sure you want to logout?</div>
            <div className="flex gap-6">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded font-bold hover:bg-red-600"
                onClick={handleLogoutConfirm}
              >
                Yes
              </button>
              <button
                className="px-6 py-2 bg-gray-400 text-white rounded font-bold hover:bg-gray-500"
                onClick={handleLogoutCancel}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
