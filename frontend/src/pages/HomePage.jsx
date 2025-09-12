/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardContainer from '../components/DashboardContainer';
import DashboardCard from '../components/DashboardCard';

const HomePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial render
    return JSON.parse(localStorage.getItem('user') || '{}');
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          credentials: 'include',
        });
        if (!res.ok) {
          navigate('/login');
        } else {
          const data = await res.json();
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user); // Update state so greeting re-renders
          }
        }
      } catch (err) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Extract first name and make it bold
  const fullName = user.name || 'USER';
  const firstName = fullName.split(' ')[0];

  return (
    <>
      <Navbar />
        <div className="flex flex-col items-center min-h-screen pt-24">
          <h2 className="text-2xl text-white text-center">
            hi <span className="font-bold">{firstName}</span>, what are you interested in today...
          </h2>
          <DashboardContainer>
            <div className="grid grid-cols-2 gap-[24px] justify-items-center items-center">
              <DashboardCard
                title="Interview"
                subtitle="PREP"
                width={300}
                height={180}
                padding="18px"
                margin="0"
                onClick={() => navigate('/interview-prep')}
              />
              <DashboardCard title="Road" subtitle="MAPS" width={300} height={180} padding="14px" margin="0" onClick={() => navigate('/roadmaps')} />
              <DashboardCard title="Cover Letter" subtitle="GENERATOR" width={300} height={180} padding="16px" margin="0" onClick={() => navigate('/cover-letter')} />
              <DashboardCard title="Job Application" subtitle="TRACKER" width={300} height={180} padding="12px" margin="0" onClick={() => navigate('/job-application')} />
            </div>
          </DashboardContainer>
        </div>
    </>
  );
};

export default HomePage;
