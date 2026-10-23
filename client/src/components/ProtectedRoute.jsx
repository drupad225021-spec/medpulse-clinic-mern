import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StateHandler } from './StateHandler';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '5rem' }}>
        <StateHandler loading={true} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <h2 style={{ color: '#b91c1c', marginBottom: '0.5rem' }}>403 - Access Prohibited</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Your account role (<strong>{user.role}</strong>) does not have authorization to view this clinical portal.
          </p>
          <a href="/" className="btn btn-primary">Return to Homepage</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
