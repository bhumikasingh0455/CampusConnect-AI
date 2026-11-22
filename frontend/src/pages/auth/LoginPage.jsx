import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Shield, User, GraduationCap, Users, ArrowRight, Lock, Mail, Building2, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to role dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const redirects = {
        admin: '/admin/dashboard',
        warden: '/warden/dashboard',
        faculty: '/faculty/dashboard',
        student: '/student/dashboard',
        parent: '/parent/dashboard'
      };
      navigate(redirects[user.role] || '/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both institutional email and password.');
      return;
    }

    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const result = await login(cleanEmail, password);
    setIsLoading(false);

    if (result.success) {
      const redirects = {
        admin: '/admin/dashboard',
        warden: '/warden/dashboard',
        faculty: '/faculty/dashboard',
        student: '/student/dashboard',
        parent: '/parent/dashboard'
      };
      navigate(redirects[result.user.role] || '/student/dashboard');
    }
  };

  const handleQuickLogin = async (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    setIsLoading(true);
    const result = await login(roleEmail.toLowerCase(), rolePassword);
    setIsLoading(false);

    if (result.success) {
      const redirects = {
        admin: '/admin/dashboard',
        warden: '/warden/dashboard',
        faculty: '/faculty/dashboard',
        student: '/student/dashboard',
        parent: '/parent/dashboard'
      };
      navigate(redirects[result.user.role] || '/student/dashboard');
    }
  };

  const demoAccounts = [
    {
      role: 'Student',
      email: 'student@campusconnect.edu',
      password: 'Student@123',
      name: 'Alex Rivera (6th Sem B.Tech)',
      icon: GraduationCap,
      color: 'border-indigo-500/30 hover:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
    },
    {
      role: 'Warden',
      email: 'warden@campusconnect.edu',
      password: 'Warden@123',
      name: 'Dr. Marcus Vance (Chief Warden)',
      icon: Building2,
      color: 'border-amber-500/30 hover:border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
    },
    {
      role: 'Faculty',
      email: 'faculty@campusconnect.edu',
      password: 'Faculty@123',
      name: 'Prof. Alan Turing (CSE)',
      icon: Users,
      color: 'border-purple-500/30 hover:border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400'
    },
    {
      role: 'Admin',
      email: 'admin@campusconnect.edu',
      password: 'Admin@123',
      name: 'Dr. Sarah Jenkins (Dean)',
      icon: Shield,
      color: 'border-rose-500/30 hover:border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
    },
    {
      role: 'Parent',
      email: 'parent@campusconnect.edu',
      password: 'Parent@123',
      name: 'Robert Rivera (Guardian)',
      icon: User,
      color: 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors">
      {/* Background visual accents */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-900 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 mb-4">
          <Sparkles className="w-8 h-8 text-amber-300" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          CampusConnect <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">AI</span>
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Intelligent Next-Gen Academic Management & Performance Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-800">
          {/* Direct Live Demo Access (No sign-in required) */}
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-500/30 text-center">
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Live Public Demo Active</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              No sign-in required. Explore all 5 roles and features directly:
            </p>
            <button
              type="button"
              onClick={() => {
                const nextRoute = switchDemoRole('student');
                navigate(nextRoute);
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Explore Live Demo Without Sign-In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-2 text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Or Sign In With Account
            </span>
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="institutional_email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="institutional_email"
                  name="institutional_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campusconnect.edu"
                  className="block w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="user_password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="user_password"
                  name="user_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Quick 1-Click Demo Login Cards Panel */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center">
              Instant 1-Click Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleQuickLogin(account.email, account.password, account.role)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${account.color}`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{account.role}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {account.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          First time here?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register Demo Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
