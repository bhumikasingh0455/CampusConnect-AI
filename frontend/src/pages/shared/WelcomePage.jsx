import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  GraduationCap,
  Building2,
  Users,
  Shield,
  User,
  ArrowRight,
  CheckCircle2,
  Zap,
  BookOpen,
  CalendarDays,
  QrCode,
  Utensils,
  Bot,
  Activity,
  Layers,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import Button from '../../components/common/Button';

const WelcomePage = () => {
  const { switchDemoRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLaunchRole = (role) => {
    const targetRoute = switchDemoRole(role);
    navigate(targetRoute);
  };

  const personas = [
    {
      role: 'student',
      title: 'Student Portal',
      name: 'Alex Rivera',
      subtitle: '6th Sem B.Tech CSE • Tagore Residence',
      icon: GraduationCap,
      description: 'Attendance tracking (88.4%), timetable, assignment submissions, internal grades, digital hostel room & gate pass.',
      gradient: 'from-indigo-600 to-blue-600',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      accentColor: 'hover:border-indigo-500'
    },
    {
      role: 'warden',
      title: 'Hostel Warden Command',
      name: 'Dr. Marcus Vance',
      subtitle: 'Chief Warden • 120 Bed Capacity',
      icon: Building2,
      description: 'Real-time bed allocation, student leave approvals, night curfew gate logs, maintenance complaints & mess schedule.',
      gradient: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      accentColor: 'hover:border-amber-500'
    },
    {
      role: 'faculty',
      title: 'Faculty Portal',
      name: 'Prof. Alan Turing',
      subtitle: 'Professor of Distributed Systems & AI',
      icon: Users,
      description: 'Mark student attendance, create dynamic assignments, upload lecture study materials, enter internal marks & schedule.',
      gradient: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      accentColor: 'hover:border-purple-500'
    },
    {
      role: 'admin',
      title: 'College Administrator',
      name: 'Dr. Sarah Jenkins',
      subtitle: 'Dean of Academic Affairs',
      icon: Shield,
      description: 'University-wide analytics, department enrollment trends, faculty management, academic calendar & security audit logs.',
      gradient: 'from-rose-600 to-red-600',
      badgeColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      accentColor: 'hover:border-rose-500'
    },
    {
      role: 'parent',
      title: 'Parent Portal',
      name: 'Robert Rivera',
      subtitle: 'Guardian of Alex Rivera',
      icon: User,
      description: 'Transparent real-time attendance percentage, academic performance grades, semester exam results & hostel leave alerts.',
      gradient: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      accentColor: 'hover:border-emerald-500'
    }
  ];

  const features = [
    {
      icon: Bot,
      title: 'Gemini AI Campus Assistant',
      desc: 'Floating intelligent chatbot providing concept explanations, assignment breakdowns, and personalized study schedules.'
    },
    {
      icon: Activity,
      title: 'Smart Attendance & Shortage Alert',
      desc: 'Dynamic QR attendance marking, percentage analytics, and automatic warnings for shortage below the 75% threshold.'
    },
    {
      icon: Building2,
      title: 'Comprehensive Hostel Management',
      desc: 'Boys and girls halls, room capacity tracking, bed allocations, digital room transfer requests, and hostel fees.'
    },
    {
      icon: QrCode,
      title: 'Digital Curfew Gate Pass',
      desc: 'QR-verified student gate check-in/out records, late entry tracking, and verified hostel leave clearance.'
    },
    {
      icon: Utensils,
      title: 'Weekly Mess Management',
      desc: '7-day breakfast, lunch, snacks, and dinner schedules with student feedback ratings and meal quality alerts.'
    },
    {
      icon: Zap,
      title: 'Real-Time Socket.IO Engine',
      desc: 'Live instant notifications across all 5 roles for assignment deadlines, leave approvals, and campus announcements.'
    }
  ];

  const techStack = [
    'React.js 18',
    'Vite',
    'Tailwind CSS',
    'Node.js',
    'Express.js',
    'MongoDB Mongoose',
    'Google Gemini AI',
    'Socket.IO',
    'Recharts Analytics',
    'JWT Auth'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                CampusConnect <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live Demo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <Link
              to="/login"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 transition-colors hidden sm:block"
            >
              Sign In
            </Link>

            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={() => handleLaunchRole('student')}
              className="shadow-md shadow-indigo-500/25"
            >
              Launch Live Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Public Live Showcase • No Sign-In Required</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-tight">
              Intelligent Operating System for{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Modern Smart Campuses
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              An enterprise-grade, AI-powered Smart Campus & Hostel Management platform. Featuring multi-role portals, real-time attendance analytics, automated room allocation, digital curfew passes, and Gemini AI assistance.
            </p>

            {/* Quick Hero Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={() => handleLaunchRole('student')}
                className="shadow-xl shadow-indigo-600/30 text-sm font-bold"
              >
                Explore Live Demo (Student)
              </Button>
              <a
                href="#roles"
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                <span>Select a Role Below</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">↓</span>
              </a>
            </div>

            {/* Live Indicator Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero sign-in gate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>5 Interactive Role Dashboards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Full Hostel & Mess Suite</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant 0.1s load time</span>
              </div>
            </div>
          </div>
        </section>

        {/* Role Selector Section */}
        <section id="roles" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Multi-Role Access
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Select Any Persona to Launch Live Dashboard
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Click any role card below to instantly enter that persona's dedicated dashboard with zero credentials required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.role}
                  onClick={() => handleLaunchRole(p.role)}
                  className={`group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 ${p.accentColor}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${p.gradient} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${p.badgeColor}`}>
                        {p.title}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 mb-3">
                      {p.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Launch {p.title}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-16 sm:py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Engineered for Universities
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Complete Architecture & Capabilities
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Built from the ground up to solve academic operations, residential life, and administrative reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {f.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tech Stack Bar */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
            Production Technology Stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">CampusConnect AI</span>
            <span>• Next-Gen Smart Campus Management System</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-indigo-600 transition-colors">
              Institutional Sign In
            </Link>
            <span>•</span>
            <button
              onClick={() => handleLaunchRole('student')}
              className="hover:text-indigo-600 transition-colors cursor-pointer font-semibold"
            >
              Launch Demo Dashboard →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
