import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentGrades from './pages/student/StudentGrades';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentLeave from './pages/student/StudentLeave';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyAssignments from './pages/faculty/FacultyAssignments';
import FacultyGrades from './pages/faculty/FacultyGrades';
import FacultyMaterials from './pages/faculty/FacultyMaterials';
import FacultyLeaves from './pages/faculty/FacultyLeaves';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminAcademics from './pages/admin/AdminAcademics';
import AdminTimetable from './pages/admin/AdminTimetable';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';

// Student Hostel Pages
import HostelStudentDashboard from './pages/hostel/HostelStudentDashboard';
import HostelMyRoom from './pages/hostel/HostelMyRoom';
import HostelMessMenu from './pages/hostel/HostelMessMenu';
import HostelLeaves from './pages/hostel/HostelLeaves';
import HostelComplaints from './pages/hostel/HostelComplaints';
import HostelFees from './pages/hostel/HostelFees';
import HostelGatePass from './pages/hostel/HostelGatePass';

// Warden Pages
import WardenDashboard from './pages/warden/WardenDashboard';
import WardenRooms from './pages/warden/WardenRooms';
import WardenLeaves from './pages/warden/WardenLeaves';
import WardenComplaints from './pages/warden/WardenComplaints';
import WardenMess from './pages/warden/WardenMess';
import WardenGate from './pages/warden/WardenGate';

// Admin Hostel Page
import AdminHostel from './pages/admin/AdminHostel';

// Shared Pages
import AnnouncementsPage from './pages/shared/AnnouncementsPage';
import ProfilePage from './pages/shared/ProfilePage';
import NotFoundPage from './pages/shared/NotFoundPage';

// Smart Root Redirect based on active role
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roleRedirects = {
    admin: '/admin/dashboard',
    warden: '/warden/dashboard',
    faculty: '/faculty/dashboard',
    student: '/student/dashboard',
    parent: '/parent/dashboard'
  };

  return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<RootRedirect />} />

              {/* Authenticated Layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  {/* Shared Authenticated Routes */}
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* Student Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/hostel" element={<HostelStudentDashboard />} />
                    <Route path="/student/hostel/room" element={<HostelMyRoom />} />
                    <Route path="/student/hostel/mess" element={<HostelMessMenu />} />
                    <Route path="/student/hostel/leaves" element={<HostelLeaves />} />
                    <Route path="/student/hostel/complaints" element={<HostelComplaints />} />
                    <Route path="/student/hostel/fees" element={<HostelFees />} />
                    <Route path="/student/hostel/gate-pass" element={<HostelGatePass />} />
                    <Route path="/student/attendance" element={<StudentAttendance />} />
                    <Route path="/student/assignments" element={<StudentAssignments />} />
                    <Route path="/student/timetable" element={<StudentTimetable />} />
                    <Route path="/student/grades" element={<StudentGrades />} />
                    <Route path="/student/materials" element={<StudentMaterials />} />
                    <Route path="/student/leave" element={<StudentLeave />} />
                  </Route>

                  {/* Warden Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['warden']} />}>
                    <Route path="/warden/dashboard" element={<WardenDashboard />} />
                    <Route path="/warden/rooms" element={<WardenRooms />} />
                    <Route path="/warden/leaves" element={<WardenLeaves />} />
                    <Route path="/warden/complaints" element={<WardenComplaints />} />
                    <Route path="/warden/mess" element={<WardenMess />} />
                    <Route path="/warden/gate" element={<WardenGate />} />
                  </Route>

                  {/* Faculty Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
                    <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                    <Route path="/faculty/attendance" element={<FacultyAttendance />} />
                    <Route path="/faculty/assignments" element={<FacultyAssignments />} />
                    <Route path="/faculty/grades" element={<FacultyGrades />} />
                    <Route path="/faculty/materials" element={<FacultyMaterials />} />
                    <Route path="/faculty/leaves" element={<FacultyLeaves />} />
                    <Route path="/faculty/announcements" element={<AdminAnnouncements />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/hostel" element={<AdminHostel />} />
                    <Route path="/admin/students" element={<AdminStudents />} />
                    <Route path="/admin/faculty" element={<AdminFaculty />} />
                    <Route path="/admin/departments" element={<AdminDepartments />} />
                    <Route path="/admin/academics" element={<AdminAcademics />} />
                    <Route path="/admin/timetable" element={<AdminTimetable />} />
                    <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                    <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                  </Route>

                  {/* Parent Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
                    <Route path="/parent/dashboard" element={<ParentDashboard />} />
                  </Route>
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
