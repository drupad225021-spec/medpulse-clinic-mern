const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { sanitizeMiddleware } = require('./middleware/validation');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const User = require('./models/User');

const app = express();

// 1. Database Connection
connectDB().then(async () => {
  try {
    // Check if initial seed is needed (e.g. fresh in-memory or empty local db)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database] Database is empty. Auto-seeding initial clinic demo data...');
      const seedData = require('./utils/seed');
      // Run internal seeding without calling process.exit
      const Doctor = User;
      const Appointment = require('./models/Appointment');
      
      const admin = await Doctor.create({
        name: 'Dr. Sarah Mitchell (Chief Admin)',
        email: 'admin@medpulse.com',
        password: 'password123',
        role: 'admin',
        phone: '+1 555-0100',
      });

      const doctor1 = await Doctor.create({
        name: 'Dr. Marcus Vance',
        email: 'marcus.vance@medpulse.com',
        password: 'password123',
        role: 'doctor',
        phone: '+1 555-0101',
        doctorProfile: {
          specialization: 'Cardiology',
          qualification: 'MD, FACC - Harvard Medical School',
          experienceYears: 14,
          consultationFee: 120,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
          bio: 'Board-certified cardiologist specializing in preventive cardiology, cardiovascular wellness, and advanced hypertension management.',
        },
      });

      const doctor2 = await Doctor.create({
        name: 'Dr. Elena Rostova',
        email: 'elena.rostova@medpulse.com',
        password: 'password123',
        role: 'doctor',
        phone: '+1 555-0102',
        doctorProfile: {
          specialization: 'Dermatology',
          qualification: 'MD, FAAD - Johns Hopkins',
          experienceYears: 9,
          consultationFee: 95,
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          timeSlots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM'],
          bio: 'Clinical and cosmetic dermatologist focusing on acne therapy, eczema care, advanced mole screening, and laser dermatology.',
        },
      });

      const doctor3 = await Doctor.create({
        name: 'Dr. Rajesh Nair',
        email: 'rajesh.nair@medpulse.com',
        password: 'password123',
        role: 'doctor',
        phone: '+1 555-0103',
        doctorProfile: {
          specialization: 'Pediatrics',
          qualification: 'MBBS, DCH, MD (Pediatrics)',
          experienceYears: 12,
          consultationFee: 80,
          availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
          timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
          bio: 'Compassionate pediatrician dedicated to newborn care, child immunization, developmental tracking, and adolescent medicine.',
        },
      });

      const doctor4 = await Doctor.create({
        name: 'Dr. Aisha Patel',
        email: 'aisha.patel@medpulse.com',
        password: 'password123',
        role: 'doctor',
        phone: '+1 555-0104',
        doctorProfile: {
          specialization: 'Neurology',
          qualification: 'MD, DM Neurology - Oxford University',
          experienceYears: 11,
          consultationFee: 150,
          availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
          timeSlots: ['09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
          bio: 'Neurologist with extensive experience treating chronic migraines, epilepsy, neuropathic pain, and cognitive health.',
        },
      });

      const doctor5 = await Doctor.create({
        name: 'Dr. David Chen',
        email: 'david.chen@medpulse.com',
        password: 'password123',
        role: 'doctor',
        phone: '+1 555-0105',
        doctorProfile: {
          specialization: 'Orthopedics',
          qualification: 'MS Ortho, MCh - Stanford Health',
          experienceYears: 16,
          consultationFee: 110,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
          bio: 'Orthopedic specialist in sports injury rehabilitation, joint pain interventions, and spine biomechanics.',
        },
      });

      const patient1 = await Doctor.create({
        name: 'John Doe',
        email: 'patient@medpulse.com',
        password: 'password123',
        role: 'patient',
        phone: '+1 555-0201',
      });

      const patient2 = await Doctor.create({
        name: 'Sophia Williams',
        email: 'sophia.williams@medpulse.com',
        password: 'password123',
        role: 'patient',
        phone: '+1 555-0202',
      });

      const today = new Date();
      const formatDate = (daysAhead) => {
        const d = new Date(today);
        d.setDate(d.getDate() + daysAhead);
        return d.toISOString().split('T')[0];
      };

      await Appointment.create([
        {
          patient: patient1._id,
          doctor: doctor1._id,
          appointmentDate: formatDate(1),
          timeSlot: '09:00 AM',
          reason: 'Routine annual cardiovascular checkup and ECG consultation.',
          status: 'Confirmed',
        },
        {
          patient: patient1._id,
          doctor: doctor2._id,
          appointmentDate: formatDate(3),
          timeSlot: '10:30 AM',
          reason: 'Follow-up consultation for seasonal skin allergy treatment.',
          status: 'Confirmed',
        },
        {
          patient: patient2._id,
          doctor: doctor3._id,
          appointmentDate: formatDate(2),
          timeSlot: '11:00 AM',
          reason: 'Child routine wellness check and seasonal flu vaccine.',
          status: 'Confirmed',
        },
        {
          patient: patient1._id,
          doctor: doctor5._id,
          appointmentDate: formatDate(-3),
          timeSlot: '02:00 PM',
          reason: 'Post-running knee stiffness and tendon discomfort.',
          status: 'Completed',
          notes: 'Mild patellar tendonitis identified. Advised rest and prescribed NSAID ointment with quad strengthening physical therapy.',
          prescription: 'Apply Diclofenac gel twice daily for 7 days. Cold pack after exercise.',
        },
      ]);
      console.log('[Database] Demo data auto-seeded successfully.');
    }
  } catch (seedErr) {
    console.warn('[Database] Auto-seeding notice:', seedErr.message);
  }
});

// 2. CORS configuration (allow Vite frontend and any configured live URL)
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid blocking tests
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Input Sanitization (NoSQL injection guard)
app.use(sanitizeMiddleware);

// 5. Root Health Check & API Status
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    application: 'MedPulse Clinic Management API',
    version: '1.0.0',
    documentation: '/api',
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to MedPulse Healthcare API',
    endpoints: {
      auth: '/api/auth (register, login, me)',
      doctors: '/api/doctors (list, filter, slots, profile)',
      appointments: '/api/appointments (book, my, cancel, notes)',
      admin: '/api/admin (stats, appointments)',
    },
  });
});

// 6. Mount Resource Routes (Versioned / Resource-based)
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

// 7. Error Handling Middleware (Always at the end of the pipeline)
app.use(notFoundHandler);
app.use(errorHandler);

// 8. Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Server] MedPulse API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[Server] Base API URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Process] Unhandled Rejection:', err.message);
});

module.exports = app;
