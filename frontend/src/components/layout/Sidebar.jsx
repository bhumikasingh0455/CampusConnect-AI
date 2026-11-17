import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  FileSpreadsheet,
  GraduationCap,
  CalendarDays,
  FileText,
  BookOpen,
  Bell,
  Users,
  Building2,
  ShieldCheck,
  ClipboardList,
  Sparkles,
  Award,
  LogOut,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, role, logout } = useAuth();

  const getNavLinks = () => {
    switch (role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Attendance', path: '/student/attendance', icon: CalendarCheck2 },
          { name: 'Assignments', path: '/student/assignments', icon: FileSpreadsheet },
          { name: 'Class Timetable', path: '/student/timetable', icon: CalendarDays },
          { name: 'Grades & Marks', path: '/student/grades', icon: Award },
          { name: 'Study Materials', path: '/student/materials', icon: BookOpen },
          { name: 'Leave Requests', path: '/student/leave', icon: ClipboardList },
          { name: 'Announcements', path: '/announcements', icon: Bell },
        ];
      case 'faculty':
        return [
          { name: 'Overview', path: '/faculty/dashboard', icon: LayoutDashboard },
          { name: 'Attendance System', path: '/faculty/attendance', icon: CalendarCheck2 },
          { name: 'Assignments', path: '/faculty/assignments', icon: FileSpreadsheet },
          { name: 'Enter Marks', path: '/faculty/grades', icon: Award },
          { name: 'Study Materials', path: '/faculty/materials', icon: BookOpen },
          { name: 'Leave Review', path: '/faculty/leaves', icon: ClipboardList },
          { name: 'Announcements', path: '/announcements', icon: Bell },
        ];
      case 'admin':
        return [
          { name: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Student Directory', path: '/admin/students', icon: GraduationCap },
          { name: 'Faculty Directory', path: '/admin/faculty', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: Building2 },
          { name: 'Courses & Subjects', path: '/admin/academics', icon: BookOpen },
          { name: 'Timetable Scheduling', path: '/admin/timetable', icon: CalendarDays },
          { name: 'Campus Notices', path: '/admin/announcements', icon: Bell },
          { name: 'System Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
        ];
      case 'parent':
        return [
          { name: 'Ward Overview', path: '/parent/dashboard', icon: LayoutDashboard },
          { name: 'Official Notices', path: '/announcements', icon: Bell },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const roleColors = {
    admin: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    faculty: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    student: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    parent: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                CampusConnect <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
              </h1>
              <p className="text-[11px] text-slate-400">Smart Campus Portal</p>
            </div>
          </div>

          {/* User Role Card */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border mt-0.5 ${roleColors[role] || ''}`}>
                {role}
              </span>
            </div>
          </div>

          {/* Nav list */}
          <nav className="px-3 space-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-270px)]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
