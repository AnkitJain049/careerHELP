import React from 'react';
import useAuthCheck from '../hooks/useAuthCheck';

const ProtectedPage = () => {
  useAuthCheck();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">This is a Protected Page</h1>
      <p className="text-lg">You are authorized to view this page.</p>
    </div>
  );
};

export default ProtectedPage;
