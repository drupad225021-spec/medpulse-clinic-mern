import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, AlertCircle, CheckCircle, User, FileText } from 'lucide-react';
import api from '../services/api';
import StateHandler from '../components/StateHandler';

export const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Doctors list
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorIdParam || '');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Date and slot
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Form input
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  // State
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const [loadingDoctorsList, setLoadingDoctorsList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // 1. Fetch all doctors for selector dropdown
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await api.getDoctors({ limit: 50 });
        setDoctors(res.doctors || []);
        if (!selectedDoctorId && res.doctors?.length > 0) {
          setSelectedDoctorId(res.doctors[0]._id);
        }
      } catch (err) {
        console.error('Failed to load doctors list:', err);
      } finally {
        setLoadingDoctorsList(false);
      }
    };
    fetchAllDoctors();
  }, []);

  // 2. Fetch selected doctor and slots whenever doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId) return;

    const fetchDoctorSlots = async () => {
      setLoadingDoctor(true);
      setSubmitError(null);
      setSelectedSlot('');
      try {
        const res = await api.getDoctorById(selectedDoctorId, selectedDate);
        setSelectedDoctor(res.doctor);
        setAvailableSlots(res.availableSlots || []);
        setBookedSlots(res.bookedSlots || []);
      } catch (err) {
        setSubmitError(err.message || 'Failed to retrieve doctor availability.');
      } finally {
        setLoadingDoctor(false);
      }
    };

    fetchDoctorSlots();
  }, [selectedDoctorId, selectedDate]);

  const validate = () => {
    const errs = {};
    if (!selectedDoctorId) {
      errs.doctor = 'Please select a physician';
    }
    if (!selectedDate) {
      errs.date = 'Please select an appointment date';
    } else if (selectedDate < todayStr) {
      errs.date = 'Cannot schedule appointments for past dates';
    }
    if (!selectedSlot) {
      errs.slot = 'Please choose an available consultation time slot';
    }
    if (!reason.trim() || reason.trim().length < 5) {
      errs.reason = 'Please state the visit reason (minimum 5 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/book' } } });
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.bookAppointment({
        doctorId: selectedDoctorId,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        reason: reason.trim(),
      });
      setBookingSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Booking failed. The slot may have just been reserved.');
      // Refresh slots
      const res = await api.getDoctorById(selectedDoctorId, selectedDate).catch(() => ({}));
      if (res.availableSlots) {
        setAvailableSlots(res.availableSlots);
        setBookedSlots(res.bookedSlots || []);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="card" style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <CheckCircle size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Appointment Confirmed!
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your consultation with <strong>{selectedDoctor?.name}</strong> has been scheduled for{' '}
            <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/patient-dashboard" className="btn btn-primary">
              View In My Appointments
            </Link>
            <button
              onClick={() => {
                setBookingSuccess(false);
                setReason('');
                setSelectedSlot('');
              }}
              className="btn btn-secondary"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Schedule Clinical Consultation</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Choose your specialist, pick your date, and select an unreserved consultation slot.
          </p>
        </div>

        {submitError && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#991b1b',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{submitError}</span>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleBookingSubmit} noValidate>
            {/* Step 1: Select Doctor */}
            <div className="form-group">
              <label className="form-label" htmlFor="doctorSelect">
                1. Select Physician *
              </label>
              <select
                id="doctorSelect"
                className={`form-select ${errors.doctor ? 'error' : ''}`}
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                disabled={loadingDoctorsList || isSubmitting}
              >
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.doctorProfile?.specialization} (${doc.doctorProfile?.consultationFee})
                  </option>
                ))}
              </select>
              {errors.doctor && <span className="form-error">{errors.doctor}</span>}
            </div>

            {/* Selected Doctor Summary Card */}
            {selectedDoctor && (
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-light)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{selectedDoctor.name}</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {selectedDoctor.doctorProfile?.qualification} • {selectedDoctor.doctorProfile?.specialization}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consultation Fee: </span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '1.05rem' }}>
                    ${selectedDoctor.doctorProfile?.consultationFee}
                  </span>
                </div>
              </div>
            )}

            {/* Step 2: Pick Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="appointmentDate">
                2. Select Date *
              </label>
              <input
                id="appointmentDate"
                type="date"
                min={todayStr}
                className={`form-input ${errors.date ? 'error' : ''}`}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={isSubmitting}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            {/* Step 3: Slot Selection */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">
                3. Available Consultation Slots for {selectedDate} *
              </label>

              {loadingDoctor ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Checking slot availability...
                </div>
              ) : availableSlots.length === 0 && bookedSlots.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  This physician has no scheduled slots for the selected date. Please choose another date.
                </div>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.65rem' }}>
                    {/* Render available slots */}
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot);
                            if (errors.slot) setErrors((prev) => ({ ...prev, slot: null }));
                          }}
                          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          style={{
                            padding: '0.65rem 0.5rem',
                            fontWeight: 600,
                            borderColor: isSelected ? 'var(--primary-600)' : 'var(--border-light)',
                          }}
                        >
                          <Clock size={14} /> {slot}
                        </button>
                      );
                    })}

                    {/* Render booked slots as disabled */}
                    {bookedSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        disabled
                        className="btn btn-sm"
                        style={{
                          background: '#f1f5f9',
                          color: '#94a3b8',
                          borderColor: '#e2e8f0',
                          textDecoration: 'line-through',
                          cursor: 'not-allowed',
                          opacity: 0.6,
                        }}
                      >
                        {slot} (Booked)
                      </button>
                    ))}
                  </div>
                  {errors.slot && <span className="form-error" style={{ marginTop: '0.5rem', display: 'block' }}>{errors.slot}</span>}
                </div>
              )}
            </div>

            {/* Step 4: Reason for Visit */}
            <div className="form-group">
              <label className="form-label" htmlFor="reason">
                4. Primary Symptoms or Reason for Visit * (min 5 characters)
              </label>
              <textarea
                id="reason"
                rows="3"
                className={`form-textarea ${errors.reason ? 'error' : ''}`}
                placeholder="Describe your symptoms, medical concerns, or consultation goals..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errors.reason) setErrors((prev) => ({ ...prev, reason: null }));
                }}
                disabled={isSubmitting}
              />
              {errors.reason && <span className="form-error">{errors.reason}</span>}
            </div>

            {/* Submit Action */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
              {!isAuthenticated ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    You must be logged in to confirm an appointment booking.
                  </p>
                  <Link to="/login" state={{ from: { pathname: '/book' } }} className="btn btn-primary">
                    Sign In to Confirm Booking
                  </Link>
                </div>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', gap: '0.5rem' }}
                  disabled={isSubmitting || !selectedSlot}
                >
                  {isSubmitting ? (
                    <span>Confirming Appointment...</span>
                  ) : (
                    <>
                      <Calendar size={18} /> Confirm Appointment (${selectedDoctor?.doctorProfile?.consultationFee || 50})
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
