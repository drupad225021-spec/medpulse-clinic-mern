// Guard against NoSQL injection (strip out keys starting with $)
const sanitizeInput = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }

  const clean = {};
  for (const key of Object.keys(obj)) {
    if (!key.startsWith('$')) {
      clean[key] = sanitizeInput(obj[key]);
    }
  }
  return clean;
};

// Middleware to sanitize req.body, req.query, and req.params
const sanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
};

// Validate registration inputs
const validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name is required (at least 2 characters)');
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (role && !['patient', 'doctor', 'admin'].includes(role)) {
    errors.push('Role must be patient, doctor, or admin');
  }

  if (role === 'doctor') {
    const dp = req.body.doctorProfile;
    if (!dp || !dp.specialization || !dp.qualification) {
      errors.push('Doctor registration requires specialization and qualification');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Validate appointment booking inputs
const validateAppointment = (req, res, next) => {
  const { doctorId, appointmentDate, timeSlot, reason } = req.body;
  const errors = [];

  if (!doctorId || typeof doctorId !== 'string') {
    errors.push('Doctor ID is required');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!appointmentDate || !dateRegex.test(appointmentDate)) {
    errors.push('Valid appointment date is required (format YYYY-MM-DD)');
  }

  if (!timeSlot || typeof timeSlot !== 'string') {
    errors.push('Time slot selection is required');
  }

  if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
    errors.push('Reason for visit is required (minimum 5 characters)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  sanitizeMiddleware,
  validateRegistration,
  validateAppointment,
};
