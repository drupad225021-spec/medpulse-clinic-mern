const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Appointment.deleteMany({});

    console.log('[Seed] Inserting users and doctors...');

    // 1. Admin
    const admin = await User.create({
      name: 'Dr. Sarah Mitchell (Chief Admin)',
      email: 'admin@medpulse.com',
      password: 'password123',
      role: 'admin',
      phone: '+1 555-0100',
    });

    // 2. Doctors
    const doctor1 = await User.create({
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
        timeSlots: [
          '09:00 AM',
          '10:00 AM',
          '11:00 AM',
          '02:00 PM',
          '03:00 PM',
          '04:00 PM',
        ],
        bio: 'Board-certified cardiologist specializing in preventive cardiology, cardiovascular wellness, and advanced hypertension management.',
      },
    });

    const doctor2 = await User.create({
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
        timeSlots: [
          '09:30 AM',
          '10:30 AM',
          '11:30 AM',
          '02:30 PM',
          '03:30 PM',
        ],
        bio: 'Clinical and cosmetic dermatologist focusing on acne therapy, eczema care, advanced mole screening, and laser dermatology.',
      },
    });

    const doctor3 = await User.create({
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
        timeSlots: [
          '10:00 AM',
          '11:00 AM',
          '12:00 PM',
          '03:00 PM',
          '04:00 PM',
          '05:00 PM',
        ],
        bio: 'Compassionate pediatrician dedicated to newborn care, child immunization, developmental tracking, and adolescent medicine.',
      },
    });

    const doctor4 = await User.create({
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
        timeSlots: [
          '09:00 AM',
          '10:30 AM',
          '01:30 PM',
          '03:00 PM',
          '04:30 PM',
        ],
        bio: 'Neurologist with extensive experience treating chronic migraines, epilepsy, neuropathic pain, and cognitive health.',
      },
    });

    const doctor5 = await User.create({
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
        timeSlots: [
          '09:00 AM',
          '10:00 AM',
          '11:00 AM',
          '02:00 PM',
          '03:00 PM',
        ],
        bio: 'Orthopedic specialist in sports injury rehabilitation, joint pain interventions, and spine biomechanics.',
      },
    });

    // 3. Patients
    const patient1 = await User.create({
      name: 'John Doe',
      email: 'patient@medpulse.com',
      password: 'password123',
      role: 'patient',
      phone: '+1 555-0201',
    });

    const patient2 = await User.create({
      name: 'Sophia Williams',
      email: 'sophia.williams@medpulse.com',
      password: 'password123',
      role: 'patient',
      phone: '+1 555-0202',
    });

    // Helper date formatting
    const formatDate = (daysAhead) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      return d.toISOString().split('T')[0];
    };

    console.log('[Seed] Creating initial appointments...');
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
        appointmentDate: formatDate(-5),
        timeSlot: '02:00 PM',
        reason: 'Post-running knee stiffness and tendon discomfort.',
        status: 'Completed',
        notes: 'Mild patellar tendonitis identified. Advised rest and prescribed NSAID ointment with quad strengthening physical therapy.',
        prescription: 'Apply Diclofenac gel twice daily for 7 days. Cold pack after exercise.',
      },
    ]);

    console.log('--------------------------------------------------');
    console.log('✅ MedPulse Database successfully seeded!');
    console.log('Sample Accounts for testing:');
    console.log('• Admin:   admin@medpulse.com      / password123');
    console.log('• Doctor:  marcus.vance@medpulse.com / password123');
    console.log('• Doctor:  elena.rostova@medpulse.com/ password123');
    console.log('• Patient: patient@medpulse.com    / password123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
