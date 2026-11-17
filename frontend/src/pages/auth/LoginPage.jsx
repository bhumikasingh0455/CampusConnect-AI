import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Shield, User, GraduationCap, Users, ArrowRight, Lock, Mail } from 'lucide-react';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      const redirects = {
        admin: '/admin/dashboard',
        faculty: '/faculty/dashboard',
        student: '/student/dashboard',
        parent: '/parent/dashboard'
      };
      navigate(redirects[result.user.role] || '/student/dashboard');
    }
  };

  const handleQuickLogin = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
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
      name: 'Dr. Sarah Jenkins',
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
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
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

          {/* Quick 1-Click Demo Login Panel */}
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
                    onClick={() => handleQuickLogin(account.email, account.password)}
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
