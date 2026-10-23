import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Route-level screen components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorsList from './pages/DoctorsList';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// 404 Fallback Screen
const NotFound = () => (
  <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
    <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--primary-600)', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        The clinic page or record you requested does not exist or has been relocated.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  </div>
);

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes by Role */}
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient', 'admin']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
