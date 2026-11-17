# CampusConnect AI - Next-Gen Smart Campus Management System

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-47A248.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini_1.5_Flash-orange.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CampusConnect AI** is a complete, production-ready, enterprise-grade **Smart Campus Management & Performance Analytics System** designed with the modern MERN stack, real-time WebSockets, and Google Gemini AI integration. 

Built specifically for high-stakes evaluations, final-year B.Tech CSE capstone portfolios, software engineering placements, and enterprise campus digitizations.

---

## 🌟 Key Highlights & Engineering Features

### 1. Four Distinct Role-Based Portals (RBAC)
- 👨‍🎓 **Student Portal**: Real-time attendance tracking with 75% shortage forecaster, daily timetable, coursework submission with late detection, CGPA/SGPA progression analytics, study materials library with AI summarization, leave applications, and instant QR check-in.
- 👨‍🏫 **Faculty Portal**: Class roster management, 1-click batch attendance roll, time-limited dynamic QR code generation with anti-replay protection, assignment creation with file attachments, submission evaluation with grades and custom feedback, curriculum notes publishing, and leave reviews.
- 🛡️ **Administrator Portal**: Institutional KPI dashboard, Recharts analytics (attendance trends, department enrollment, grade distribution), full CRUD over students, faculty, departments, courses, subjects, timetable scheduling, campus bulletin broadcasts, and an immutable security audit log.
- 👨‍👩‍👧 **Parent / Guardian Portal**: Direct verified oversight into linked wards with real-time attendance percentage alerts below 75%, official grade cards, upcoming assignment deadlines, and administrative notices.

### 2. Smart Attendance Engine with Mathematical Shortage Predictor
- Standardized university 75% examination eligibility boundary.
- **Shortage Prediction Formula**:
  $$\text{Classes Needed} = \max\left(0, \lceil 3 \times T - 4 \times A \rceil\right)$$
  *(where $T = \text{Total Classes}$, $A = \text{Attended Classes}$)*
- **Safe Miss Buffer Formula**:
  $$\text{Safe Miss Limit} = \max\left(0, \left\lfloor \frac{4 \times A - 3 \times T}{3} \right\rfloor\right)$$
- **Dynamic QR Attendance**: Generates cryptographically signed HMAC-SHA256 time-limited QR codes (valid for 90 seconds) with server-side validation, enrollment verification, and anti-replay protection.

### 3. Integrated Gemini AI Campus Assistant
- Floating contextual academic assistant accessible across student and faculty workspaces.
- Pre-configured prompt shortcuts for concept explanations (e.g., Raft consensus, neural networks, normalization), personalized 7-day revision timetables, and lecture notes summarization.
- Strict security & privacy proxy: never exposes API keys to client browsers and isolates sensitive student records.

### 4. Real-Time Socket.IO Infrastructure
- Authenticated WebSocket rooms (`user:<id>` and `role:<role>`).
- Immediate push alerts for low attendance (<75%), newly published assignments, approaching deadlines, grade releases, and campus announcements.
- Full MongoDB persistence with read/unread tracking.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React + Vite + Tailwind CSS)"]
        UI["Modern Responsive SaaS UI"]
        AuthContext["Auth Context (JWT + LocalStorage)"]
        SocketClient["Socket.IO Client (Real-time Alerts)"]
        AIChat["Floating AI Campus Assistant"]
        QRScanner["QR Attendance Scanner"]
    end

    subgraph Backend["Backend API Server (Node.js + Express)"]
        Router["Express REST Router (/api/*)"]
        AuthMW["JWT Auth & RBAC Middleware"]
        UploadMW["Multer Secure Uploads"]
        RateLimiter["Rate Limiting Middleware"]
        SocketServer["Socket.IO Server Engine"]
        QRService["Cryptographic QR Signing Service"]
        GeminiService["Google Gemini 1.5 Flash SDK"]
    end

    subgraph Database["Database & AI Cloud"]
        MongoDB[(MongoDB Database - 17 Mongoose Models)]
        GeminiAPI["Google Gemini AI Cloud"]
    end

    Client -->|HTTP REST Requests (Bearer Token)| Router
    Client <-->|WebSockets (Events)| SocketServer
    Router --> AuthMW --> RateLimiter
    Router --> UploadMW
    Router --> QRService
    Router --> GeminiService --> GeminiAPI
    Router --> MongoDB
    SocketServer --> Client
```

---

## 🗄️ Database Schemas (17 Mongoose Models)

| Model | Description | Core Attributes |
| :--- | :--- | :--- |
| **User** | Core identity & authentication | `name`, `email`, `password` (bcrypt), `role`, `phone`, `avatar`, `isActive`, `lastLogin` |
| **StudentProfile** | Academic student records | `user`, `enrollmentNumber`, `rollNumber`, `department`, `course`, `currentSemester`, `section`, `batchYear` |
| **FacultyProfile** | Faculty appointment records | `user`, `employeeId`, `department`, `designation`, `qualification`, `specialization`, `officeRoom`, `assignedSubjects` |
| **ParentStudentLink** | Verified parent-child association | `parent`, `student`, `relationship` ('Father'/'Mother'/'Guardian'), `verified` |
| **Department** | Academic departments | `name`, `code` (e.g. 'CSE'), `headOfDepartment`, `building`, `establishedYear` |
| **Course** | Degree programs | `name`, `code`, `department`, `durationYears`, `totalSemesters`, `degreeType` |
| **Subject** | Curriculum subjects | `name`, `code`, `department`, `course`, `semester`, `credits`, `faculty`, `syllabus` |
| **Enrollment** | Semester registrations | `student`, `course`, `semester`, `subjects`, `academicYear`, `status` |
| **Timetable** | Weekly schedule matrix | `department`, `course`, `semester`, `section`, `dayOfWeek`, `startTime`, `endTime`, `subject`, `faculty`, `roomNumber` |
| **Attendance** | Class session presence | `student`, `subject`, `faculty`, `date`, `status` ('present'/'absent'/'leave'), `verifiedVia` ('manual'/'qr') |
| **Assignment** | Coursework assignments | `title`, `description`, `subject`, `faculty`, `department`, `semester`, `dueDate`, `maxMarks`, `attachment` |
| **Submission** | Student coursework solutions | `assignment`, `student`, `submissionDate`, `fileUrl`, `content`, `isLate`, `marksObtained`, `feedback`, `status` |
| **Grade** | Internal & exam grade points | `student`, `subject`, `semester`, `examType`, `marksObtained`, `maxMarks`, `gradeLetter`, `gradePoint` |
| **Announcement** | Official campus notices | `title`, `content`, `author`, `targetAudience`, `priority`, `category`, `isPinned`, `attachmentUrl` |
| **Notification** | User-directed alerts | `recipient`, `title`, `message`, `type`, `link`, `isRead`, `createdAt` |
| **LeaveRequest** | Student & faculty leave | `applicant`, `role`, `leaveType`, `startDate`, `endDate`, `reason`, `status`, `reviewedBy`, `reviewRemarks` |
| **AuditLog** | Immutable security audit trail | `action`, `performedBy`, `targetResource`, `resourceId`, `details`, `ipAddress`, `userAgent` |

---

## 🔑 Demo Credentials (Seeded for Immediate Testing)

The database includes realistic campus records (Computer Science department, enrolled students, faculty, syllabus, assignments, past attendance, and grades).

| Role | Email | Password | Name / Description |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campusconnect.edu` | `Admin@123` | Dr. Sarah Jenkins (Academic Dean) |
| **Faculty** | `faculty@campusconnect.edu` | `Faculty@123` | Prof. Alan Turing (Professor of CSE) |
| **Student** | `student@campusconnect.edu` | `Student@123` | Alex Rivera (6th Sem B.Tech CSE) |
| **Parent** | `parent@campusconnect.edu` | `Parent@123` | Robert Rivera (Father of Alex Rivera) |

*Tip: The Login page includes convenient **1-Click Demo Login** buttons to authenticate with any role instantly without typing.*

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local service or MongoDB Atlas cluster connection string)

### 1. Clone the repository & Install Dependencies
```bash
git clone https://github.com/your-username/campusconnect-ai.git
cd campusconnect-ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create `.env` inside `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=campusconnect_super_secret_jwt_key_2026_dev_prod
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
UPLOAD_PATH=uploads
MAX_FILE_SIZE_MB=10
```

Create `.env` inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed Realistic Campus Data
```bash
cd backend
npm run seed
```

### 4. Run Automated Backend Tests
```bash
cd backend
npm test
```
*Executes Supertest integration tests verifying authentication, JWT generation, RBAC route restrictions, and attendance shortage mathematics.*

### 5. Launch the Servers
**Terminal 1 (Backend API & Socket Server):**
```bash
cd backend
npm run dev
# Server listens on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Vite dev server live at http://localhost:5173
```

---

## 📡 REST API Documentation

### Authentication & Profiles
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `POST /api/auth/register` - Self-registration endpoint
- `GET /api/auth/me` - Get profile and linked metadata of active user
- `PUT /api/auth/update-profile` - Update display name, phone, or avatar
- `PUT /api/auth/change-password` - Securely change account password

### Smart Attendance
- `POST /api/attendance/mark` - Faculty marks batch/single session attendance *(Faculty, Admin)*
- `POST /api/attendance/generate-qr` - Generate dynamic time-limited signed QR code *(Faculty, Admin)*
- `POST /api/attendance/verify-qr` - Student verifies QR token for class check-in *(Student)*
- `GET /api/attendance/student/:studentId` - Get student attendance logs & 75% shortage forecast
- `GET /api/attendance/subject-report/:subjectId` - Export subject-level attendance report

### Coursework & Assignments
- `GET /api/assignments` - Fetch role-filtered assignments
- `POST /api/assignments` - Create assignment with optional specification attachment *(Faculty, Admin)*
- `GET /api/assignments/:id` - Assignment details with submissions list
- `POST /api/assignments/:id/submit` - Student submits coursework file or text solution *(Student)*
- `PUT /api/assignments/grade-submission/:submissionId` - Grade submission with score & feedback *(Faculty, Admin)*

### Institutional Management (Admin)
- `GET /api/users/admin-overview` - Comprehensive institutional analytics & charts data
- `GET /api/users` - Paginated user directory with search & filters
- `POST /api/students` & `PUT /api/students/:id` - Full student CRUD
- `POST /api/faculty` & `PUT /api/faculty/:id` - Full faculty appointment CRUD
- `POST /api/departments` & `POST /api/courses` & `POST /api/subjects` - Curriculum CRUD
- `POST /api/timetable` - Create classroom timetable slots
- `GET /api/users/audit-logs` - Query system security audit logs

### Gemini AI Assistant
- `POST /api/ai/chat` - Context-aware interactive assistant proxy
- `POST /api/ai/study-schedule` - Synthesize personalized 7-day revision timetable
- `POST /api/ai/performance-insights` - AI analysis of attendance and grade points

---

## ☁️ Production Deployment Guide

### Deploying Frontend to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select the `frontend` directory as the root folder.
4. Set Build Command: `npm run build` and Output Directory: `dist`.
5. Add Environment Variables:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-backend-api.onrender.com`
6. Click **Deploy**. SPA rewrites are pre-configured via `frontend/vercel.json`.

### Deploying Backend to Render
1. Create an account on [Render](https://render.com/).
2. Select **New Web Service** and connect your repository.
3. Set Root Directory: `backend`.
4. Set Build Command: `npm install` and Start Command: `node server.js`.
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster0.mongodb.net/campusconnect?retryWrites=true&w=majority`
   - `JWT_SECRET` = `<your-secure-random-64-character-string>`
   - `CLIENT_URL` = `https://your-frontend.vercel.app`
   - `GEMINI_API_KEY` = `<your-google-ai-studio-api-key>`
6. Deploy the service.

### Setting Up MongoDB Atlas
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0 sandbox).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere).
5. In **Database** > **Connect** > **Drivers**, copy the connection string and insert it into `MONGODB_URI`.

---

## 📄 License
This project is licensed under the MIT License.
