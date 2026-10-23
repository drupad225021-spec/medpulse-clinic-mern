import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  FileText,
  XCircle,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import api from '../services/api';
import StateHandler from '../components/StateHandler';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const PatientDashboard = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [cancellingAppt, setCancellingAppt] = useState(null);
  const [viewingNotesAppt, setViewingNotesAppt] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 8,
        ...(statusFilter && { status: statusFilter }),
      };
      const res = await api.getMyAppointments(params);
      setAppointments(res.appointments || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalCount || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, statusFilter]);

  const handleConfirmCancel = async () => {
    if (!cancellingAppt) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await api.cancelAppointment(cancellingAppt._id);
      setCancellingAppt(null);
      fetchAppointments();
    } catch (err) {
      setActionError(err.message || 'Failed to cancel appointment.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Patient Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Welcome back, <strong>{user?.name}</strong>. Track your consultations and medical summaries.
          </p>
        </div>

        <Link to="/book" className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <PlusCircle size={18} /> Schedule New Appointment
        </Link>
      </div>

      {/* Status Filters */}
      <div
        className="card"
        style={{
          marginBottom: '1.75rem',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
        <button
          className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('');
            setPage(1);
          }}
        >
          All Bookings
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Confirmed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('Confirmed');
            setPage(1);
          }}
        >
          Confirmed
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('Completed');
            setPage(1);
          }}
        >
          Completed
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Cancelled' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('Cancelled');
            setPage(1);
          }}
        >
          Cancelled
        </button>
      </div>

      {/* Appointments List with 4 States */}
      <StateHandler
        loading={loading}
        error={error}
        empty={appointments.length === 0}
        emptyMessage={
          statusFilter
            ? `You have no ${statusFilter.toLowerCase()} appointments.`
            : 'You have not booked any appointments yet.'
        }
        emptyAction={
          <Link to="/book" className="btn btn-primary btn-sm">
            Book Your First Appointment
          </Link>
        }
        onRetry={fetchAppointments}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {appointments.map((appt) => {
            const isCancelable = appt.status === 'Confirmed' || appt.status === 'Pending';
            const hasNotes = appt.notes || appt.prescription;

            return (
              <div
                key={appt._id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1.25rem 1.5rem',
                }}
              >
                {/* Doctor & Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                      {appt.doctor?.name || 'Assigned Physician'}
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                      {appt.doctor?.doctorProfile?.specialization || 'Clinical Consultation'}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      <strong>Reason:</strong> {appt.reason}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <Calendar size={15} color="var(--primary-600)" />
                    <span style={{ fontWeight: 600 }}>{appt.appointmentDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} />
                    <span>{appt.timeSlot}</span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <Badge status={appt.status} />

                  {hasNotes && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setViewingNotesAppt(appt)}
                      style={{ gap: '0.35rem' }}
                    >
                      <FileText size={15} /> Notes
                    </button>
                  )}

                  {isCancelable && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setCancellingAppt(appt);
                        setActionError(null);
                      }}
                      style={{ gap: '0.35rem' }}
                    >
                      <XCircle size={15} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </StateHandler>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancellingAppt}
        onClose={() => setCancellingAppt(null)}
        title="Cancel Appointment"
      >
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Are you sure you wish to cancel your appointment with{' '}
          <strong>{cancellingAppt?.doctor?.name}</strong> on{' '}
          <strong>{cancellingAppt?.appointmentDate}</strong> at{' '}
          <strong>{cancellingAppt?.timeSlot}</strong>?
        </p>

        {actionError && (
          <div
            style={{
              background: '#fef2f2',
              color: '#991b1b',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}
          >
            {actionError}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCancellingAppt(null)}
            disabled={actionLoading}
          >
            Keep Appointment
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirmCancel}
            disabled={actionLoading}
          >
            {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </Modal>

      {/* View Doctor Notes Modal */}
      <Modal
        isOpen={!!viewingNotesAppt}
        onClose={() => setViewingNotesAppt(null)}
        title="Doctor Consultation Summary"
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Attending Physician</span>
          <h4 style={{ fontSize: '1.1rem' }}>{viewingNotesAppt?.doctor?.name}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--primary-600)' }}>
            {viewingNotesAppt?.doctor?.doctorProfile?.specialization}
          </p>
        </div>

        <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <h5 style={{ fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>Clinical Diagnosis & Notes</h5>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {viewingNotesAppt?.notes || 'No notes were entered for this consultation.'}
          </p>
        </div>

        {viewingNotesAppt?.prescription && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <h5 style={{ fontSize: '0.9rem', marginBottom: '0.35rem', color: '#166534' }}>Prescription & Care Instructions</h5>
            <p style={{ fontSize: '0.875rem', color: '#14532d', lineHeight: 1.6 }}>
              {viewingNotesAppt.prescription}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setViewingNotesAppt(null)}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDashboard;
