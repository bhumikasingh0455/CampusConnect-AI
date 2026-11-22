import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  Users,
  Shield,
  User,
  Sparkles,
  LogIn,
  Home
} from 'lucide-react';

const DemoBanner = () => {
  const { user, role, switchDemoRole, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const personas = [
    { role: 'student', label: 'Student', icon: GraduationCap, name: 'Alex Rivera' },
    { role: 'warden', label: 'Warden', icon: Building2, name: 'Dr. Marcus Vance' },
    { role: 'faculty', label: 'Faculty', icon: Users, name: 'Prof. Alan Turing' },
    { role: 'admin', label: 'Admin', icon: Shield, name: 'Dr. Sarah Jenkins' },
    { role: 'parent', label: 'Parent', icon: User, name: 'Robert Rivera' }
  ];

  const handlePersonaSwitch = (targetRole) => {
    const nextRoute = switchDemoRole(targetRole);
    navigate(nextRoute);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-500/20 shadow-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left: Live Demo Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-extrabold text-emerald-400 tracking-wide uppercase text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Live Demo Mode
          </span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            • No sign-in required to test all features & roles
          </span>
        </div>

        {/* Center/Right: Persona Switcher */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 text-amber-300 hover:bg-white/20 transition-all mr-1"
            title="Return to Welcome Showcase Page"
          >
            <Home className="w-3 h-3" />
            <span>Welcome Page</span>
          </Link>

          <span className="text-[11px] text-slate-300 font-semibold mr-1 hidden sm:inline">
            Switch Persona:
          </span>
          {personas.map((p) => {
            const Icon = p.icon;
            const isActive = role === p.role;

            return (
              <button
                key={p.role}
                onClick={() => handlePersonaSwitch(p.role)}
                title={`Explore as ${p.name}`}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{p.label}</span>
              </button>
            );
          })}

          <Link
            to="/login"
            className="ml-2 pl-2 border-l border-white/20 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
            title="Sign in with your own institutional credentials"
          >
            <LogIn className="w-3 h-3" />
            <span className="hidden lg:inline">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
