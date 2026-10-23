import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, LogOut, Calendar, Stethoscope, ShieldCheck } from 'lucide-react';
import Badge from './Badge';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'doctor') return '/doctor-dashboard';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/patient-dashboard';
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand */}
        <Link to="/" className="brand-logo" aria-label="MedPulse Clinic Home">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Activity size={22} />
          </div>
          <span>Med<span style={{ color: 'var(--brand-blue-500)' }}>Pulse</span></span>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <NavLink to="/doctors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Find Doctors
              </NavLink>
            </li>
            <li>
              <NavLink to="/book" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Book Slot
              </NavLink>
            </li>

            {isAuthenticated && (
              <li>
                <NavLink
                  to={getDashboardPath()}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {user.role === 'doctor' && <Stethoscope size={16} />}
                  {user.role === 'admin' && <ShieldCheck size={16} />}
                  {user.role === 'patient' && <Calendar size={16} />}
                  <span>Dashboard</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* User Account Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user.name}
                </span>
                <Badge status={user.role} type="role" />
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
                aria-label="Log Out"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <LogOut size={16} />
                <span style={{ display: 'none', md: 'inline' }}>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
