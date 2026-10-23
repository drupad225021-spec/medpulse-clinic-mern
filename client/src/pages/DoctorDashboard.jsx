import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  FileEdit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope,
  Settings,
} from 'lucide-react';
import api from '../services/api';
import StateHandler from '../components/StateHandler';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const DoctorDashboard = () => {
  const { user, updateUserInState } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notes editing modal
  const [editingAppt, setEditingAppt] = useState(null);
  const [notesForm, setNotesForm] = useState({ notes: '', prescription: '', status: 'Completed' });
  const [savingNotes, setSavingNotes] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Profile modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    consultationFee: user?.doctorProfile?.consultationFee || 50,
    experienceYears: user?.doctorProfile?.experienceYears || 3,
    bio: user?.doctorProfile?.bio || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
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
    fetchDoctorAppointments();
  }, [page, statusFilter]);

  const openNotesModal = (appt) => {
    setEditingAppt(appt);
    setNotesForm({
      notes: appt.notes || '',
      prescription: appt.prescription || '',
      status: appt.status === 'Confirmed' ? 'Completed' : appt.status,
    });
    setModalError(null);
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!editingAppt) return;
    setSavingNotes(true);
    setModalError(null);

    try {
      await api.updateAppointmentNotes(editingAppt._id, notesForm);
      setEditingAppt(null);
      fetchDoctorAppointments();
    } catch (err) {
      setModalError(err.message || 'Failed to update consultation notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.updateDoctorProfile({
        consultationFee: Number(profileForm.consultationFee),
        experienceYears: Number(profileForm.experienceYears),
        bio: profileForm.bio,
      });
      updateUserInState(res.doctor);
      setIsEditingProfile(false);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      {/* Header */}
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
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Physician Consultation Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Welcome, <strong>{user?.name}</strong> ({user?.doctorProfile?.specialization} - {user?.doctorProfile?.qualification})
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => setIsEditingProfile(true)}
          style={{ gap: '0.45rem' }}
        >
          <Settings size={16} /> Edit Practice Settings
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Consultations</span>
            <h3 style={{ fontSize: '1.5rem' }}>{totalCount}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consultation Fee</span>
            <h3 style={{ fontSize: '1.5rem' }}>${user?.doctorProfile?.consultationFee || 50}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#ecfdf5',
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stethoscope size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Slots</span>
            <h3 style={{ fontSize: '1.5rem' }}>{user?.doctorProfile?.timeSlots?.length || 6} Slots</h3>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter Patients:</span>
        <button
          className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('');
            setPage(1);
          }}
        >
          All Schedules
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Confirmed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('Confirmed');
            setPage(1);
          }}
        >
          Confirmed (Active)
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

      {/* Patient Appointments Table */}
      <StateHandler
        loading={loading}
        error={error}
        empty={appointments.length === 0}
        emptyMessage="No patient consultations match the selected criteria."
        onRetry={fetchDoctorAppointments}
      >
        <div className="table-responsive" style={{ marginBottom: '1.75rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Slot</th>
                <th>Patient Details</th>
                <th>Chief Complaint / Reason</th>
                <th>Status</th>
                <th>Clinical Records</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{appt.appointmentDate}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.timeSlot}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{appt.patient?.name || 'Anonymous Patient'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {appt.patient?.phone || appt.patient?.email}
                    </div>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {appt.reason}
                    </p>
                  </td>
                  <td>
                    <Badge status={appt.status} />
                  </td>
                  <td style={{ maxWidth: '220px' }}>
                    {appt.notes ? (
                      <span style={{ fontSize: '0.825rem', color: '#065f46' }}>
                        ✓ Notes recorded
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        Pending notes
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openNotesModal(appt)}
                      style={{ gap: '0.35rem' }}
                    >
                      <FileEdit size={14} /> Update Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Edit Clinical Notes Modal */}
      <Modal
        isOpen={!!editingAppt}
        onClose={() => setEditingAppt(null)}
        title={`Consultation Record: ${editingAppt?.patient?.name || 'Patient'}`}
      >
        <form onSubmit={handleSaveNotes}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <strong>Date:</strong> {editingAppt?.appointmentDate} at {editingAppt?.timeSlot} |{' '}
            <strong>Reason:</strong> {editingAppt?.reason}
          </div>

          {modalError && (
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
              {modalError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="status">
              Appointment Status
            </label>
            <select
              id="status"
              className="form-select"
              value={notesForm.status}
              onChange={(e) => setNotesForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed (Attended)</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">
              Clinical Findings & Diagnosis
            </label>
            <textarea
              id="notes"
              rows="3"
              className="form-textarea"
              placeholder="Record patient assessment, diagnostic observations, vitals..."
              value={notesForm.notes}
              onChange={(e) => setNotesForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prescription">
              Prescription & Patient Care Plan
            </label>
            <textarea
              id="prescription"
              rows="3"
              className="form-textarea"
              placeholder="Medications, dosage instructions, physical therapy, follow-up..."
              value={notesForm.prescription}
              onChange={(e) => setNotesForm((prev) => ({ ...prev, prescription: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingAppt(null)}
              disabled={savingNotes}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingNotes}>
              {savingNotes ? 'Saving Records...' : 'Save Consultation Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Doctor Profile Settings Modal */}
      <Modal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        title="Update Practice Settings"
      >
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label" htmlFor="consultationFee">
              Consultation Fee ($)
            </label>
            <input
              id="consultationFee"
              type="number"
              min="0"
              className="form-input"
              value={profileForm.consultationFee}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, consultationFee: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="experienceYears">
              Years of Clinical Experience
            </label>
            <input
              id="experienceYears"
              type="number"
              min="0"
              className="form-input"
              value={profileForm.experienceYears}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, experienceYears: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              Professional Bio & Specialties
            </label>
            <textarea
              id="bio"
              rows="3"
              className="form-textarea"
              value={profileForm.bio}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditingProfile(false)}
              disabled={savingProfile}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
              {savingProfile ? 'Updating...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
