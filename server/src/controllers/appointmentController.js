const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient, Admin)
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason } = req.body;

    // Verify doctor exists and has role 'doctor'
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'The requested doctor was not found.',
      });
    }

    // Check if slot is already taken on this date
    const existingBooking = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      status: { $ne: 'Cancelled' },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The time slot '${timeSlot}' on ${appointmentDate} is already booked. Please choose another slot.`,
      });
    }

    // Prohibit booking dates in the past
    const today = new Date().toISOString().split('T')[0];
    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule appointments for past dates.',
      });
    }

    const newAppointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      reason: reason.trim(),
      status: 'Confirmed',
    });

    const populated = await Appointment.findById(newAppointment._id)
      .populate('doctor', 'name email phone doctorProfile')
      .populate('patient', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully!',
      appointment: populated,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for this doctor.',
      });
    }
    next(error);
  }
};

// @desc    Get appointments for the logged-in user (role-aware)
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admin can view all or filter by query
      if (req.query.doctorId) filter.doctor = req.query.doctorId;
      if (req.query.patientId) filter.patient = req.query.patientId;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.date) {
      filter.appointmentDate = req.query.date;
    }

    const totalCount = await Appointment.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'name email phone doctorProfile')
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1, timeSlot: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      appointments,
      page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PATCH /api/appointments/:id/cancel
// @access  Private (Patient owner, Assigned doctor, Admin)
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Ownership & permission check
    const isPatientOwner =
      req.user.role === 'patient' &&
      appointment.patient.toString() === req.user._id.toString();
    const isDoctorAssigned =
      req.user.role === 'doctor' &&
      appointment.doctor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatientOwner && !isDoctorAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this appointment.',
      });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled.',
      });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name email phone doctorProfile')
      .populate('patient', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully.',
      appointment: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation notes, prescription, and status
// @route   PATCH /api/appointments/:id/notes
// @access  Private (Doctor only)
const updateNotesAndStatus = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Verify doctor ownership
    if (
      req.user.role !== 'admin' &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit records for this appointment.',
      });
    }

    const { notes, prescription, status } = req.body;

    if (notes !== undefined) appointment.notes = notes.trim();
    if (prescription !== undefined) appointment.prescription = prescription.trim();
    if (status && ['Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      appointment.status = status;
    }

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name email phone doctorProfile')
      .populate('patient', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Consultation notes updated successfully.',
      appointment: populated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateNotesAndStatus,
};
