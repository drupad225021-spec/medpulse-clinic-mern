import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Stethoscope,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import StateHandler from '../components/StateHandler';
import Badge from '../components/Badge';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, apptsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminAppointments({
          page,
          limit: 10,
          ...(statusFilter && { status: statusFilter }),
        }),
      ]);

      setStats(statsRes.stats);
      setAppointments(apptsRes.appointments || []);
      setTotalPages(apptsRes.totalPages || 1);
      setTotalCount(apptsRes.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to load clinic administrator records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, statusFilter]);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Clinic Administration Center</h1>
            <ShieldCheck size={26} color="var(--primary-600)" />
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Supervisory oversight for clinic registrations, physician rosters, and appointment traffic.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadData} style={{ gap: '0.35rem' }}>
          <RefreshCw size={14} /> Refresh Metrics
        </button>
      </div>

      {/* KPI Statistic Cards */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
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
              <Users size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Patients</span>
              <h3 style={{ fontSize: '1.6rem' }}>{stats.totalPatients}</h3>
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
              <Stethoscope size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Specialists</span>
              <h3 style={{ fontSize: '1.6rem' }}>{stats.totalDoctors}</h3>
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
              <CalendarCheck size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Appointments</span>
              <h3 style={{ fontSize: '1.6rem' }}>{stats.totalAppointments}</h3>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#fef3c7',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed Rate</span>
              <h3 style={{ fontSize: '1.6rem' }}>
                {stats.totalAppointments > 0
                  ? Math.round(
                      (stats.statusBreakdown.completed / stats.totalAppointments) * 100
                    )
                  : 0}
                %
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Oversight Registry */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Global Clinic Appointment Registry</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Detailed record of all patient consultations across all medical departments.
        </p>
      </div>

      {/* Filter Tabs */}
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
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter By:</span>
        <button
          className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('');
            setPage(1);
          }}
        >
          All ({stats?.totalAppointments || 0})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Confirmed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('Confirmed');
            setPage(1);
          }}
        >
          Confirmed ({stats?.statusBreakdown?.confirmed || 0})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('Completed');
            setPage(1);
          }}
        >
          Completed ({stats?.statusBreakdown?.completed || 0})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'Cancelled' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            setStatusFilter('Cancelled');
            setPage(1);
          }}
        >
          Cancelled ({stats?.statusBreakdown?.cancelled || 0})
        </button>
      </div>

      {/* Table with 4 States */}
      <StateHandler
        loading={loading}
        error={error}
        empty={appointments.length === 0}
        emptyMessage="No clinic appointments found under this filter."
        onRetry={loadData}
      >
        <div className="table-responsive" style={{ marginBottom: '1.75rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Patient</th>
                <th>Assigned Physician</th>
                <th>Specialty</th>
                <th>Consultation Reason</th>
                <th>Status</th>
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
                    <div style={{ fontWeight: 600 }}>{appt.patient?.name || 'N/A'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.patient?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{appt.doctor?.name || 'N/A'}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 500 }}>
                      {appt.doctor?.doctorProfile?.specialization || 'Clinical'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {appt.reason}
                    </p>
                  </td>
                  <td>
                    <Badge status={appt.status} />
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
              Page {page} of {totalPages} ({totalCount} total)
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
    </div>
  );
};

export default AdminDashboard;
