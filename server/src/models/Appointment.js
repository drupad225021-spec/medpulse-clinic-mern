const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor ID is required'],
      index: true,
    },
    appointmentDate: {
      type: String, // YYYY-MM-DD for deterministic calendar querying
      required: [true, 'Appointment date is required (YYYY-MM-DD)'],
      index: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for visit is required'],
      trim: true,
      minlength: [5, 'Reason must be at least 5 characters'],
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        message: 'Status must be Pending, Confirmed, Completed, or Cancelled',
      },
      default: 'Confirmed',
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    prescription: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active bookings for the same doctor, date, and slot
appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: 'Cancelled' } },
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
