import React from 'react';

const DashboardCard = ({
  title,
  subtitle,
  onClick,
  width = 220,
  height = 120,
  padding = '1rem',
  margin = '10px',
}) => (
  <div
    className="bg-[var(--color-midnight)] rounded-2xl shadow-lg flex flex-col justify-center items-center cursor-pointer transition hover:scale-105"
    style={{ width, height, padding, margin }}
    onClick={onClick}
  >
    <div className="text-lg text-white mb-2 text-center">{title}</div>
    <div className="text-2xl font-bold text-white text-center">
      {subtitle}
    </div>
  </div>
);

export default DashboardCard;
