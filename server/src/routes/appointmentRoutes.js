const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateNotesAndStatus,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');

router.use(protect);

router.post('/', authorize('patient', 'admin'), validateAppointment, bookAppointment);
router.get('/my', getMyAppointments);
router.patch('/:id/cancel', cancelAppointment);
router.patch('/:id/notes', authorize('doctor', 'admin'), updateNotesAndStatus);

module.exports = router;
