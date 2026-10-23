const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get clinic system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      confirmedCount,
      completedCount,
      cancelledCount,
      recentAppointments,
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Confirmed' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.countDocuments({ status: 'Cancelled' }),
      Appointment.find()
        .populate('doctor', 'name email doctorProfile.specialization')
        .populate('patient', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        statusBreakdown: {
          confirmed: confirmedCount,
          completed: completedCount,
          cancelled: cancelledCount,
        },
        recentAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments clinic-wide with filters and pagination
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
const getAllAppointments = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.doctorId) {
      filter.doctor = req.query.doctorId;
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

module.exports = { getAdminStats, getAllAppointments };
