import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Stethoscope, User } from 'lucide-react';

export const Register = () => {
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'General Physician',
    qualification: '',
    experienceYears: '3',
    consultationFee: '50',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format';
    }

    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (role === 'doctor') {
      if (!formData.specialization.trim()) {
        errs.specialization = 'Specialization is required';
      }
      if (!formData.qualification.trim()) {
        errs.qualification = 'Medical qualification is required (e.g. MBBS, MD)';
      }
      if (!formData.consultationFee || Number(formData.consultationFee) < 0) {
        errs.consultationFee = 'Valid fee is required';
      }
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
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role,
      };

      if (role === 'doctor') {
        payload.doctorProfile = {
          specialization: formData.specialization,
          qualification: formData.qualification,
          experienceYears: Number(formData.experienceYears) || 0,
          consultationFee: Number(formData.consultationFee) || 50,
          bio: formData.bio,
        };
      }

      await register(payload);

      if (role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Create MedPulse Account</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Join as a patient to schedule care or as a physician to manage consultations
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              marginBottom: '1.75rem',
            }}
          >
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`btn ${role === 'patient' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ gap: '0.5rem', padding: '0.75rem' }}
            >
              <User size={18} /> I am a Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`btn ${role === 'doctor' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ gap: '0.5rem', padding: '0.75rem' }}
            >
              <Stethoscope size={18} /> I am a Doctor
            </button>
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
              <label className="form-label" htmlFor="name">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder={role === 'doctor' ? 'Dr. John Watson' : 'John Watson'}
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="+1 555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password * (min 6 characters)
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
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Doctor-Specific Fields */}
            {role === 'doctor' && (
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--border-light)',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--primary-700)' }}>
                  Professional Medical Credentials
                </h4>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="specialization">
                      Specialization *
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      className="form-select"
                      value={formData.specialization}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Physician">General Physician</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="qualification">
                      Qualification *
                    </label>
                    <input
                      id="qualification"
                      name="qualification"
                      type="text"
                      className={`form-input ${errors.qualification ? 'error' : ''}`}
                      placeholder="e.g. MBBS, MD, MS"
                      value={formData.qualification}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.qualification && <span className="form-error">{errors.qualification}</span>}
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="experienceYears">
                      Experience (Years)
                    </label>
                    <input
                      id="experienceYears"
                      name="experienceYears"
                      type="number"
                      min="0"
                      className="form-input"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="consultationFee">
                      Consultation Fee ($) *
                    </label>
                    <input
                      id="consultationFee"
                      name="consultationFee"
                      type="number"
                      min="0"
                      className="form-input"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="bio">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="2"
                    className="form-textarea"
                    placeholder="Brief background of clinical focus and patient care ethos..."
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Registering account...</span>
              ) : (
                <>
                  <UserPlus size={18} /> Complete Registration
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
