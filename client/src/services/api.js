/**
 * Centralized API Client Module (ICTAK Section 7.2)
 * Reads base URL from import.meta.env.VITE_API_URL
 * Handles auth headers, JSON parsing, and normalized error rejection
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('medpulse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...getAuthHeaders(), ...options.headers };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.errors = data.errors;
      throw err;
    }

    return data;
  } catch (error) {
    // If network failure (e.g. offline or server down)
    if (!error.status) {
      error.message = 'Unable to connect to the clinic server. Please check your internet connection.';
    }
    throw error;
  }
};

export const api = {
  // Auth
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request('/auth/me'),

  // Doctors
  getDoctors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/doctors${query ? `?${query}` : ''}`);
  },

  getDoctorById: (id, date = '') => {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return request(`/doctors/${id}${query}`);
  },

  updateDoctorProfile: (profileData) =>
    request('/doctors/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Appointments
  bookAppointment: (bookingData) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getMyAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments/my${query ? `?${query}` : ''}`);
  },

  cancelAppointment: (id) =>
    request(`/appointments/${id}/cancel`, {
      method: 'PATCH',
    }),

  updateAppointmentNotes: (id, data) =>
    request(`/appointments/${id}/notes`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Admin
  getAdminStats: () => request('/admin/stats'),

  getAdminAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/appointments${query ? `?${query}` : ''}`);
  },
};

export default api;
