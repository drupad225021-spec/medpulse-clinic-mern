const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all active doctors with search and pagination
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const skip = (page - 1) * limit;

    const filter = { role: 'doctor' };

    if (req.query.specialization) {
      filter['doctorProfile.specialization'] = new RegExp(
        `^${req.query.specialization}$`,
        'i'
      );
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { 'doctorProfile.specialization': searchRegex },
        { 'doctorProfile.qualification': searchRegex },
      ];
    }

    const totalCount = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    const doctors = await User.find(filter)
      .select('name email phone doctorProfile createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Also get all distinct available specializations for quick filter buttons in frontend
    const specializations = await User.distinct(
      'doctorProfile.specialization',
      { role: 'doctor' }
    );

    res.status(200).json({
      success: true,
      doctors,
      page,
      totalPages,
      totalCount,
      specializations: specializations.filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor details and slot availability for a specified date
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor',
    }).select('name email phone doctorProfile');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
      });
    }

    const dateQuery = req.query.date;
    let bookedSlots = [];

    if (dateQuery) {
      // Find all non-cancelled appointments for this doctor on this specific date
      const activeAppointments = await Appointment.find({
        doctor: doctor._id,
        appointmentDate: dateQuery,
        status: { $ne: 'Cancelled' },
      }).select('timeSlot');

      bookedSlots = activeAppointments.map((appt) => appt.timeSlot);
    }

    const allSlots = doctor.doctorProfile?.timeSlots || [
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM',
    ];

    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({
      success: true,
      doctor,
      selectedDate: dateQuery || null,
      allSlots,
      bookedSlots,
      availableSlots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor's profile details & schedule
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
const updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await User.findById(req.user._id);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only registered doctors can update a doctor profile.',
      });
    }

    const {
      name,
      phone,
      specialization,
      qualification,
      experienceYears,
      consultationFee,
      availableDays,
      timeSlots,
      bio,
    } = req.body;

    if (name) doctor.name = name.trim();
    if (phone) doctor.phone = phone.trim();

    if (!doctor.doctorProfile) {
      doctor.doctorProfile = {};
    }

    if (specialization) doctor.doctorProfile.specialization = specialization;
    if (qualification) doctor.doctorProfile.qualification = qualification;
    if (experienceYears !== undefined)
      doctor.doctorProfile.experienceYears = Number(experienceYears);
    if (consultationFee !== undefined)
      doctor.doctorProfile.consultationFee = Number(consultationFee);
    if (availableDays) doctor.doctorProfile.availableDays = availableDays;
    if (timeSlots) doctor.doctorProfile.timeSlots = timeSlots;
    if (bio !== undefined) doctor.doctorProfile.bio = bio;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDoctors, getDoctorById, updateDoctorProfile };
