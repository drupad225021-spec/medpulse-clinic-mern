import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Shield,
  Clock,
  HeartPulse,
  UserCheck,
  Stethoscope,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import StateHandler from '../components/StateHandler';

export const Home = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDoctors({ limit: 3 });
      setFeaturedDoctors(res.doctors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
          paddingTop: '5rem',
          paddingBottom: '5.5rem',
          borderBottom: '1px solid var(--border-light)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '720px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(13, 148, 136, 0.1)',
                color: 'var(--primary-700)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={16} /> Advanced Digital Healthcare Scheduling
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                color: 'var(--text-main)',
              }}
            >
              Your Health, On Time.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--primary-600), var(--brand-blue-500))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Seamless Medical Booking.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              Connect instantly with accredited specialists, check real-time availability slots,
              and manage consultations without queue delays. Engineered for quality care.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to="/book" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
                <Calendar size={18} /> Book an Appointment
              </Link>
              <Link to="/doctors" className="btn btn-secondary btn-lg" style={{ gap: '0.5rem' }}>
                Browse Doctors <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Metric Highlights */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-600)', marginBottom: '0.25rem' }}>100%</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Verified Medical Specialists</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--brand-blue-500)', marginBottom: '0.25rem' }}>Zero</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Double-Booking Guarantee</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-600)', marginBottom: '0.25rem' }}>24/7</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Digital Portal Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Why Choose MedPulse Clinic</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              A clinically oriented platform ensuring smooth coordination between patients, physicians, and clinic operations.
            </p>
          </div>

          <div className="grid-3">
            <div className="card card-hover">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Live Slot Availability</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Select specific dates and inspect real-time open slots. Bookings are synchronized instantly to prevent overlaps.
              </p>
            </div>

            <div className="card card-hover">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--brand-blue-50)',
                  color: 'var(--brand-blue-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Stethoscope size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Multi-Specialty Care</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Access top practitioners across Cardiology, Dermatology, Pediatrics, Orthopedics, and Neurology in one portal.
              </p>
            </div>

            <div className="card card-hover">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Role-Protected Health Records</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Encrypted JWT authorization and strict ownership controls safeguard patient diagnosis notes and prescriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '4.5rem 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Our Lead Medical Specialists</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Certified clinicians ready to attend to your medical consultations.
              </p>
            </div>
            <Link to="/doctors" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              View All Doctors <ArrowRight size={16} />
            </Link>
          </div>

          <StateHandler
            loading={loading}
            error={error}
            empty={featuredDoctors.length === 0}
            emptyMessage="No doctors are currently available."
            onRetry={fetchFeatured}
          >
            <div className="grid-3">
              {featuredDoctors.map((doc) => (
                <div key={doc._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                        color: 'var(--primary-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                      }}
                    >
                      {doc.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem' }}>{doc.name}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                        {doc.doctorProfile?.specialization}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                    {doc.doctorProfile?.bio || `${doc.doctorProfile?.qualification} with ${doc.doctorProfile?.experienceYears} years of clinical experience.`}
                  </p>

                  <div
                    style={{
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Fee</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                        ${doc.doctorProfile?.consultationFee}
                      </span>
                    </div>
                    <Link to={`/book?doctorId=${doc._id}`} className="btn btn-primary btn-sm">
                      Book Slot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </StateHandler>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>How MedPulse Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>Three effortless steps to schedule your clinical consultation.</p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary-600)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  fontWeight: 700,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Choose Doctor & Specialty</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Filter our directory by medical field, credentials, experience, and consultation fees.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary-600)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  fontWeight: 700,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Select Available Slot</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Pick your preferred consultation date and select an unreserved time slot instantly.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary-600)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  fontWeight: 700,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Attend & Receive Notes</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Receive digital confirmation and access your doctor's clinical summary and prescriptions online.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
