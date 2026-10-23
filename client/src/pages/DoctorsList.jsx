import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Stethoscope, Award, DollarSign, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import StateHandler from '../components/StateHandler';

export const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 6,
        ...(selectedSpecialty && { specialization: selectedSpecialty }),
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      };

      const res = await api.getDoctors(params);
      setDoctors(res.doctors || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalCount || 0);

      if (res.specializations && specializations.length === 0) {
        setSpecializations(res.specializations);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, selectedSpecialty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  const handleSpecialtyClick = (spec) => {
    setSelectedSpecialty(spec === selectedSpecialty ? '' : spec);
    setPage(1);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Find a Healthcare Specialist</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse verified physicians, compare credentials, and select your clinical appointment slot.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search doctor by name, qualification, or clinical keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                setPage(1);
                setTimeout(fetchDoctors, 0);
              }}
            >
              Clear
            </button>
          )}
        </form>

        {/* Specialization Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Specialty:</span>
          <button
            type="button"
            className={`btn btn-sm ${selectedSpecialty === '' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleSpecialtyClick('')}
          >
            All Disciplines
          </button>
          {specializations.map((spec) => (
            <button
              key={spec}
              type="button"
              className={`btn btn-sm ${selectedSpecialty === spec ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSpecialtyClick(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid with 4 States */}
      <StateHandler
        loading={loading}
        error={error}
        empty={doctors.length === 0}
        emptyMessage="No doctors matched your search criteria. Try clearing filters or searching another keyword."
        emptyAction={
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedSpecialty('');
              setSearchTerm('');
              setPage(1);
            }}
          >
            Reset Filters
          </button>
        }
        onRetry={fetchDoctors}
      >
        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="card card-hover"
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {/* Doctor Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    flexShrink: 0,
                  }}
                >
                  {doc.name.replace('Dr. ', '').charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{doc.name}</h3>
                  <span
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--primary-600)',
                      background: 'var(--primary-50)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    {doc.doctorProfile?.specialization}
                  </span>
                </div>
              </div>

              {/* Doctor Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Award size={16} color="var(--primary-600)" />
                  <span>{doc.doctorProfile?.qualification} ({doc.doctorProfile?.experienceYears} yrs experience)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Calendar size={16} color="var(--primary-600)" />
                  <span>{doc.doctorProfile?.availableDays?.join(', ')}</span>
                </div>
              </div>

              {/* Bio */}
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  marginBottom: '1.25rem',
                  flex: 1,
                }}
              >
                {doc.doctorProfile?.bio || 'Certified specialist providing comprehensive diagnosis and clinical treatment consultations.'}
              </p>

              {/* Card Footer */}
              <div
                style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1rem',
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Fee</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ gap: '0.35rem' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Page {page} of {totalPages} ({totalCount} specialists)
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{ gap: '0.35rem' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </StateHandler>
    </div>
  );
};

export default DoctorsList;
