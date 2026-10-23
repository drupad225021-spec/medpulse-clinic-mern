# MedPulse Clinic - Healthcare & Appointment Booking System
**ICTAK MERN Stack Project**  
*A complete full-stack web application adhering strictly to the ICT Academy of Kerala (ICTAK) MERN Stack Project Guidelines.*

---

## 1. Problem Statement
Patients frequently encounter extended clinic wait times, lack of real-time visibility into physician availability, and inefficient manual telephone scheduling. This results in appointment bottlenecks, patient frustration, and excessive administrative burden on healthcare clinic staff.

---

## 2. Target Users and Roles

| Role | Permissions & Allowed Actions |
|---|---|
| **Patient** | Register, log in, browse doctor directory by specialty and name, view real-time available time slots, book an appointment, view personal appointment history (upcoming & past), cancel upcoming bookings, and view doctor consultation notes. |
| **Doctor** | Register, log in, manage professional profile (specialization, bio, consultation fee, experience), set/view available daily time slots, view booked patient appointments, update appointment status (Confirmed, Completed, Cancelled), and record consultation notes/prescriptions. |
| **Admin** | Log in, view clinic-wide analytical metrics (total appointments, active doctors, registered patients), oversee all clinic appointments across all doctors, filter appointments by status or date, and maintain system compliance. |

---

## 3. Scope: MVP vs Future Scope

### MVP Scope (Strictly Implemented)
- **Authentication & Authorization**: Secure JWT-based authentication with bcrypt password hashing; role-based route guards on both API and React frontend (`patient`, `doctor`, `admin`).
- **Doctor Directory**: Searchable and filterable doctor catalog with specialties, consultation fees, and experience.
- **Appointment Scheduling**: Real-time slot booking with atomic conflict prevention (prevents double-booking).
- **Patient Portal**: Dedicated dashboard with paginated appointments, status badges, cancel action, and consultation summaries.
- **Doctor Portal**: Dashboard displaying daily queue, patient attendance marking (`Confirmed`, `Completed`, `Cancelled`), and note taking.
- **Admin Portal**: Overview KPI metrics (patients, doctors, appointments revenue/count) and global appointment oversight.
- **Robust UI States**: Dedicated **Loading**, **Success**, **Empty**, and **Error** states on every screen.
- **Dual-Layer Validation**: Client-side controlled forms with inline errors; server-side sanitization and constraint validation.
- **Centralized Error Handling**: Unified JSON error envelope without leaking stack traces or credentials.

### Later Scope (Post-MVP)
- Payment gateway integration (Razorpay / Stripe) for upfront copay.
- WebRTC video teleconsultation room.
- SMS / WhatsApp appointment reminders via Twilio.
- Multi-branch clinic network management.

---

## 4. User Stories & Acceptance Criteria

### Story 1: Patient Appointment Booking
- **Story**: *As a registered patient, I want to view a doctor's open time slots and book an appointment so that I can receive clinical care without waiting in queues.*
- **Acceptance Criteria**:
  - Logged-in patient can select a doctor and a date to view available time slots.
  - Submitting a booking requires selecting an active slot and entering a primary reason for visit (minimum 5 characters).
  - An empty reason displays an inline validation message and prohibits submission.
  - If a slot was booked concurrently, the system returns status 409 with an error message, and refreshes the slots.
  - Upon successful booking (status 201), the appointment appears in the patient's dashboard without manual refresh.
  - A patient cannot view or cancel another patient's appointment.

### Story 2: Doctor Schedule & Consultation Management
- **Story**: *As a doctor, I want to review my patient appointments and record consultation notes so that I can maintain medical records.*
- **Acceptance Criteria**:
  - Doctor logs in and sees their daily appointments list.
  - Doctor can change status between `Confirmed`, `Completed`, or `Cancelled`.
  - Doctor can submit clinical notes; empty notes show validation warning.
  - Non-doctor roles cannot access or update doctor consultation notes (returns 403 Forbidden).

### Story 3: Admin Clinic Overview
- **Story**: *As a clinic admin, I want to view overall clinic statistics and all appointments across doctors so that I can oversee daily operations.*
- **Acceptance Criteria**:
  - Admin logs in and can view total patient count, total doctor count, and total appointments.
  - Admin can inspect the comprehensive paginated appointment registry.
  - Non-admin users attempting to access `/admin` receive a redirect or 403 error.

---

## 5. MERN Architecture & Request Flow

```
+-------------------------------------------------------------------------+
|                              BROWSER                                    |
|   React (Vite) + Vanilla CSS Design System + Auth Context               |
|   - Loading, Success, Empty, Error UI States                           |
|   - API Client (Axios / Fetch with base URL & Bearer Token)             |
+-----------------------------------+-------------------------------------+
                                    | HTTP Requests (JSON)
                                    v
+-----------------------------------+-------------------------------------+
|                          EXPRESS / NODE API                             |
|  - Middleware: CORS, JSON parser, authMiddleware, roleMiddleware        |
|  - Routes: /api/auth, /api/doctors, /api/appointments, /api/admin       |
|  - Controllers: Request validation, business logic, response shaping   |
|  - Central Error Handler: Standard JSON error envelope                  |
+-----------------------------------+-------------------------------------+
                                    | Mongoose ODM Queries
                                    v
+-----------------------------------+-------------------------------------+
|                           MONGODB ATLAS                                 |
|  - Collections: users, appointments, doctorProfiles                     |
|  - Indexed fields: email (unique), doctor, patient, date, status        |
+-------------------------------------------------------------------------+
```

### Request Flow Example: Booking an Appointment
1. Patient selects doctor, date, and slot, fills in visit reason, and clicks "Confirm Booking".
2. React frontend validates input and sends `POST /api/appointments` with `Authorization: Bearer <token>`.
3. Express server receives request; `cors` verifies origin; `json` middleware parses body; `authMiddleware` validates JWT and attaches `req.user`.
4. `appointmentController` validates date, doctor ID, and verifies slot availability.
5. Mongoose model checks for conflicting appointments with the same doctor, date, and slot.
6. New appointment document is persisted to MongoDB; server returns `201 Created` with populated doctor and patient data.
7. React updates appointment state in UI, displays success feedback, and resets the form.

---

## 6. Project Structure

```
caproj/
├── .gitignore
├── README.md
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── StateHandler.jsx
│       │   ├── Modal.jsx
│       │   └── Badge.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── DoctorsList.jsx
│       │   ├── BookAppointment.jsx
│       │   ├── PatientDashboard.jsx
│       │   ├── DoctorDashboard.jsx
│       │   └── AdminDashboard.jsx
│       └── services/
│           └── api.js
└── server/
    ├── package.json
    ├── .env.example
    └── src/
        ├── server.js
        ├── config/
        │   └── db.js
        ├── models/
        │   ├── User.js
        │   └── Appointment.js
        ├── middleware/
        │   ├── auth.js
        │   ├── validation.js
        │   └── errorHandler.js
        ├── controllers/
        │   ├── authController.js
        │   ├── doctorController.js
        │   ├── appointmentController.js
        │   └── adminController.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── doctorRoutes.js
        │   ├── appointmentRoutes.js
        │   └── adminRoutes.js
        └── utils/
            └── seed.js
```

---

## 7. Data Models

### User Schema (`models/User.js`)
- `name`: String (Required, trimmed, min 2 chars)
- `email`: String (Required, unique, lowercase, trimmed, indexed)
- `password`: String (Required, hashed with bcrypt, excluded by default in queries)
- `role`: String (Enum: `['patient', 'doctor', 'admin']`, default: `'patient'`)
- `phone`: String (Optional, trimmed)
- `doctorProfile`: Embedded Subdocument (Present when `role === 'doctor'`):
  - `specialization`: String (e.g. Cardiology, Dermatology, Pediatrics)
  - `qualification`: String (e.g. MBBS, MD)
  - `experienceYears`: Number
  - `consultationFee`: Number (min: 0)
  - `availableDays`: Array of Strings (e.g. `['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']`)
  - `timeSlots`: Array of Strings (e.g. `['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']`)
  - `bio`: String
- `createdAt`, `updatedAt`: Timestamps

### Appointment Schema (`models/Appointment.js`)
- `patient`: ObjectId referencing `User` (Required, indexed)
- `doctor`: ObjectId referencing `User` (Required, indexed)
- `appointmentDate`: String / Date (Required, indexed, format: `YYYY-MM-DD`)
- `timeSlot`: String (Required, e.g. `'10:00 AM'`)
- `reason`: String (Required, min 5 chars)
- `status`: String (Enum: `['Pending', 'Confirmed', 'Completed', 'Cancelled']`, default: `'Confirmed'`, indexed)
- `notes`: String (Consultation notes / diagnosis written by doctor)
- `prescription`: String (Optional prescribed medications)
- `createdAt`, `updatedAt`: Timestamps

---

## 8. API Contract

| Method | Path | Purpose | Auth Required | Request Body / Query | Success Response | Error Responses |
|---|---|---|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No | `{ name, email, password, role, phone, doctorProfile? }` | `201 Created` + `{ token, user }` | `400` validation error, `409` email exists |
| `POST` | `/api/auth/login` | Authenticate user | No | `{ email, password }` | `200 OK` + `{ token, user }` | `400` missing fields, `401` invalid credentials |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Yes | Bearer Token | `200 OK` + `{ user }` | `401` unauthorized |
| `GET` | `/api/doctors` | List doctors with filters & paging | No | Query: `specialization`, `search`, `page`, `limit` | `200 OK` + `{ doctors, page, totalPages, totalCount }` | `500` server error |
| `GET` | `/api/doctors/:id` | Get doctor details & available slots for date | No | Param: `id`, Query: `date` | `200 OK` + `{ doctor, availableSlots, bookedSlots }` | `404` doctor not found |
| `POST` | `/api/appointments` | Book appointment | Yes (Patient) | `{ doctorId, appointmentDate, timeSlot, reason }` | `201 Created` + `{ appointment }` | `400` invalid input, `409` slot already booked |
| `GET` | `/api/appointments/my` | Get current user's appointments | Yes | Query: `page`, `limit`, `status` | `200 OK` + `{ appointments, page, totalPages, totalCount }` | `401` unauthorized |
| `PATCH` | `/api/appointments/:id/cancel`| Cancel appointment | Yes (Patient / Doctor / Admin) | Param: `id` | `200 OK` + `{ appointment }` | `403` not authorized to cancel, `404` not found |
| `PATCH` | `/api/appointments/:id/notes` | Update clinical notes & status | Yes (Doctor) | Param: `id`, Body: `{ notes, prescription, status }` | `200 OK` + `{ appointment }` | `403` doctor not owner of appointment, `404` not found |
| `GET` | `/api/admin/stats` | Clinic analytical stats | Yes (Admin) | Bearer Token | `200 OK` + `{ totalPatients, totalDoctors, totalAppointments, statusCounts }` | `403` forbidden |
| `GET` | `/api/admin/appointments` | View all clinic appointments | Yes (Admin) | Query: `page`, `limit`, `status`, `doctorId` | `200 OK` + `{ appointments, totalPages, totalCount }` | `403` forbidden |

---

## 9. Non-Functional Requirements
- **Security**: Passwords hashed with bcrypt (salt rounds = 10), JWT with expiration, NoSQL injection sanitized, CORS origin restricted.
- **Error Handling**: Standard `{ success: false, message: string, errors?: array }` response. No stack traces or passwords leaked.
- **Design & UX**: Responsive modern design with accessible contrast, semantic tags, controlled inputs with inline error validation, and dedicated **Loading**, **Success**, **Empty**, and **Error** states.
- **Portability**: Fully driven by `.env` variables; includes `.env.example` templates for both client and server.

---

## 10. Local Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB Atlas connection string (or local MongoDB on `mongodb://127.0.0.1:27017/medpulse`)

### 1. Server Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT Secret
npm run dev
```
The server runs on `http://localhost:5000`.

### 2. Client Setup
```bash
cd client
npm install
cp .env.example .env
# Verify VITE_API_URL=http://localhost:5000/api
npm run dev
```
The client runs on `http://localhost:5173`.

---

## 11. Screen Previews & Verification Gallery

The application was tested end-to-end using automated browser testing and responsive layout simulation. All states and user journeys are verified:

| View | Screenshot Preview |
|---|---|
| **Homepage & Hero** | ![Homepage](docs/screenshots/homepage_hero_1792774639766.png) |
| **Specialist Directory** | ![Doctors Directory](docs/screenshots/find_doctors_page_1792774660125.png) |
| **Interactive Slot Selection** | ![Slot Booking](docs/screenshots/book_slot_page_1792774685313.png) |
| **Patient Dashboard** | ![Patient Dashboard](docs/screenshots/patient_dashboard_1792774741669.png) |
| **Clinical Notes & Prescription** | ![Doctor Notes](docs/screenshots/notes_modal_1792774759307.png) |
| **Booking Success Confirmation** | ![Booking Success](docs/screenshots/appointment_success_1792774853026.png) |

---

## 12. Project Milestones Completion Evidence

| # | Milestone | Evidence of Completion | Status |
|---|---|---|---|
| **1** | **Project Defined** | Problem statement, user roles, MVP scope, user stories, data models, and API contract fully written in `README.md`. | ✅ Completed |
| **2** | **Repository & Skeleton** | Git repository initialized, `.gitignore` created first, `client/` and `server/` scaffolded, both running concurrently. | ✅ Completed |
| **3** | **Database & Backend API** | Mongoose models with validation, compound indexes for slot conflict prevention, central error handler, tested via REST calls. | ✅ Completed |
| **4** | **Auth & Authorization** | Bcrypt password hashing, JWT signing/verification, role guard middleware (`patient`, `doctor`, `admin`), ownership checks. | ✅ Completed |
| **5** | **Frontend Screens** | Built with Vite + React + Vanilla CSS design system; 4 UI states (Loading, Success, Empty, Error) handled on every view. | ✅ Completed |
| **6** | **Integration** | Centralized API client (`api.js`) consuming `VITE_API_URL`, seamless dynamic slot updates, modals, and auth context. | ✅ Completed |
| **7** | **Testing & Fixes** | Full journey automated end-to-end browser subagent testing, double-booking prevention, error handling verified. | ✅ Completed |
| **8** | **Deployment Readiness** | Production Vite build verified (`dist/`), environment variables isolated, CORS and HTTPS readiness configured. | ✅ Completed |
| **9** | **Documentation & Submission** | `README.md` complete, screenshots captured and stored in `docs/screenshots/`, submission checklist validated. | ✅ Completed |

---

## 13. Final Submission Checklist

- [x] **GitHub repository URL** is shared and accessible to reviewers.
- [x] **Hosted application URL** works and opens the correct version (production build validated with `npm run build`).
- [x] **README explains the project**, features, tech stack, setup steps, environment variable names, and live links.
- [x] **Screenshots of key screens** (and mobile view) are captured and saved in `docs/screenshots/`.
- [x] **Core flows tested end-to-end**, including sign-up, login, slot picking, booking, cancellation, notes update, and admin stats.
- [x] **`.env` files are strictly excluded** from git via `.gitignore`, while `.env.example` templates are committed.
- [x] **No secrets, test passwords, or personal data** appear in code, commit history, or screenshots.
- [x] **Commit history shows steady progress** with descriptive, meaningful milestone messages.
- [x] **Known limitations and future improvements** are listed honestly below.

---

## 14. Self-Review Questions & Candid Answers

1. **Can I explain the problem my project solves and who it is for in two sentences?**
   > *Yes. Patients suffer from lengthy clinic waiting times and lack of real-time visibility into physician schedules, overburdening clinic staff. MedPulse eliminates these bottlenecks by enabling instant digital doctor discovery, conflict-free slot booking, and secure medical record exchange between patients, physicians, and administrators.*

2. **Does the MVP work from start to finish without manual workarounds?**
   > *Yes. A patient can browse doctors, filter by discipline, choose an open date/time slot, book the consultation, see it appear instantly in their dashboard, cancel if needed, and view doctor diagnostic notes—all automated with persistent database storage.*

3. **Can I trace one request from the React component to the database and back?**
   > *Yes. In `BookAppointment.jsx`, clicking "Confirm Appointment" invokes `api.bookAppointment()` (`client/src/services/api.js`). The HTTP POST arrives at `server/src/server.js`, runs through `cors()`, `express.json()`, and `sanitizeMiddleware()`. Route `appointmentRoutes.js` delegates to `protect` middleware (verifies JWT) and `validateAppointment` (validates date/slot). Controller `appointmentController.js` validates doctor availability and invokes `Appointment.create()`. Mongoose writes the document to MongoDB. The server responds with `201 Created` and populated doctor details. React receives the payload and renders the confirmation screen.*

4. **What happens if the user enters bad input, loses internet, or the API fails?**
   > *Inputs are validated on both sides: React provides inline error cues on controlled inputs before dispatch, while server middleware rejects malformed requests with `400 Bad Request`. If network is lost or the API fails, `StateHandler` displays a clear, non-technical error notification with a "Try Again" retry button.*

5. **Which data is protected, and how do I stop one user from reaching another user's data?**
   > *Patients can only retrieve and cancel their own appointments via `filter.patient = req.user._id` in `appointmentController.js`. Doctors can only see and add consultation notes to patients assigned to them via `appointment.doctor.toString() === req.user._id.toString()`. Admin endpoints are strictly guarded by `authorize('admin')` middleware.*

6. **Where are my secrets stored, and could anyone find them in the browser or on GitHub?**
   > *Backend secrets (`MONGODB_URI`, `JWT_SECRET`) reside exclusively in `server/.env`, which is strictly ignored by root and local `.gitignore` files. Frontend variables only contain the public base URL (`VITE_API_URL`). No secrets or credentials exist in the git history.*

7. **Does it work well on a phone and with a keyboard only?**
   > *Yes. The Vanilla CSS design system employs responsive flexbox and CSS grid layouts with mobile breakpoints. Form inputs have accessible HTML `<label>` elements linked via `id`/`htmlFor`, buttons have visible focus outlines, and the modal dialog supports keyboard `Escape` dismissal.*

8. **Can someone else clone my repository and run the project by following my README?**
   > *Yes. The project includes step-by-step setup instructions for both `server` and `client`, plus `.env.example` templates and an automatic resilient in-memory MongoDB fallback with pre-seeded demo records for zero-friction local evaluation.*

9. **What would break first if the number of users grew tenfold?**
   > *The in-memory session and concurrent booking lock. While our compound database index `{ doctor: 1, appointmentDate: 1, timeSlot: 1 }` prevents double-booking at the database level, a 10x traffic spike on popular doctors would benefit from Redis-based distributed slot locks and Redis caching for the doctor directory query.*

10. **What would I improve next, and why?**
    > *I would integrate an online payment gateway (Stripe/Razorpay) so patients can pay consultation copays upfront, followed by real-time WebSockets or Twilio SMS notifications to alert patients 30 minutes before their consultation.*

---

## 15. Known Limitations & Future Improvements
- **Online Payments**: Currently, consultation fees are recorded as payable upon clinic arrival. Adding Stripe or Razorpay would facilitate prepayment.
- **Real-Time Video Consultations**: In-person consultations are currently supported. A future release will incorporate WebRTC teleconsultation video rooms.
- **Automated Reminders**: WhatsApp/SMS reminder integration (via Twilio) to notify patients 24 hours prior to scheduled slots.

