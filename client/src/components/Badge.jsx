import React from 'react';

export const Badge = ({ status, type = 'status' }) => {
  if (type === 'role') {
    return <span className="badge badge-role">{status}</span>;
  }

  const s = String(status).toLowerCase();
  let badgeClass = 'badge-pending';

  if (s === 'confirmed') badgeClass = 'badge-confirmed';
  else if (s === 'completed') badgeClass = 'badge-completed';
  else if (s === 'cancelled') badgeClass = 'badge-cancelled';

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default Badge;
