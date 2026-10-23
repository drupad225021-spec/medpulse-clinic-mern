import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, CheckCircle } from 'lucide-react';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await login(formData.email, formData.password);
      const userRole = res.user.role;

      // Smart redirect
      const destination =
        location.state?.from?.pathname ||
        (userRole === 'doctor'
          ? '/doctor-dashboard'
          : userRole === 'admin'
          ? '/admin-dashboard'
          : '/patient-dashboard');

      navigate(destination, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick autofill buttons for evaluation/testing
  const fillDemoCredentials = (role) => {
    if (role === 'patient') {
      setFormData({ email: 'patient@medpulse.com', password: 'password123' });
    } else if (role === 'doctor') {
      setFormData({ email: 'marcus.vance@medpulse.com', password: 'password123' });
    } else if (role === 'admin') {
      setFormData({ email: 'admin@medpulse.com', password: 'password123' });
    }
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Sign in to manage appointments and records
            </p>
          </div>

          {submitError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#991b1b',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Toolbar */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.65rem', fontWeight: 600, textAlign: 'center' }}>
              QUICK DEMO LOGIN (ONE-CLICK):
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoCredentials('patient')}
                disabled={isSubmitting}
              >
                Patient
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoCredentials('doctor')}
                disabled={isSubmitting}
              >
                Doctor
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillDemoCredentials('admin')}
                disabled={isSubmitting}
              >
                Admin
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Do not have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
