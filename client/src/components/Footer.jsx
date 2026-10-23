import React from 'react';
import { Activity, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f8fafc', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
              <Activity size={22} color="#14b8a6" />
              <span>MedPulse Clinic</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem', color: '#94a3b8' }}>
              Excellence in healthcare delivery. Simplifying clinical scheduling and empowering patients, doctors, and staff with digital appointments.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#38bdf8' }}>
              <span>ICTAK Full Stack MERN Capstone Project</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8', transition: 'var(--transition)' }}>Home</Link></li>
              <li><Link to="/doctors" style={{ color: '#94a3b8' }}>Specialist Directory</Link></li>
              <li><Link to="/book" style={{ color: '#94a3b8' }}>Book Appointment</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Patient & Staff Login</Link></li>
            </ul>
          </div>

          {/* Col 3: Specialties */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Clinical Specialties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>Cardiovascular Health</li>
              <li>Clinical Dermatology</li>
              <li>Pediatrics & Neonatal Care</li>
              <li>Orthopedics & Sports Medicine</li>
              <li>Neurology & Pain Management</li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Clinic Hours & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="#14b8a6" />
                <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#14b8a6" />
                <span>+1 (800) 555-PULSE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#14b8a6" />
                <span>care@medpulse.clinic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#14b8a6" />
                <span>100 Health Sciences Way, Med City</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          <p>© {new Date().getFullYear()} MedPulse Healthcare. All rights reserved.</p>
          <p>Built strictly following ICTAK MERN Stack Guidelines & Specifications.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
