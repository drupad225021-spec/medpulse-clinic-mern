const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllAppointments,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/appointments', getAllAppointments);

module.exports = router;
