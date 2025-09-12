import React from 'react';

const DashboardContainer = ({ children }) => (
  <div className="bg-[var(--color-inputs)] rounded-2xl shadow-xl mx-auto mt-6 p-10 w-full max-w-2xl flex flex-col items-center">
    {children}
  </div>
);

export default DashboardContainer;
