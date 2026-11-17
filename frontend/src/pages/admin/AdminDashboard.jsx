import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  CalendarCheck2,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/users/admin-overview');
        if (res.data.success) {
          setOverview(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={1} height="h-28" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton count={4} height="h-32" />
        </div>
        <LoadingSkeleton count={2} height="h-64" />
      </div>
    );
  }

  const metrics = overview?.metrics || {};
  const departmentBreakdown = overview?.departmentBreakdown || [];
  const attendanceTrend = overview?.attendanceTrend || [];
  const gradeDistribution = overview?.gradeDistribution || [];
  const recentAuditLogs = overview?.recentAuditLogs || [];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Institutional Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Administration
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Real-time analytics, user access management, institutional performance, and audit oversight
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={GraduationCap}
            onClick={() => navigate('/admin/students')}
          >
            Manage Students
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Users}
            onClick={() => navigate('/admin/faculty')}
          >
            Manage Faculty
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={metrics.totalStudents || 0}
          subtitle="Enrolled active scholars"
          icon={GraduationCap}
          color="indigo"
          trend="+12%"
          trendType="up"
        />

        <StatCard
          title="Faculty Members"
          value={metrics.totalFaculty || 0}
          subtitle="Professors & Instructors"
          icon={Users}
          color="purple"
        />

        <StatCard
          title="Average Campus Attendance"
          value={`${metrics.averageAttendancePercentage || 84.5}%`}
          subtitle="Institutional attendance index"
          icon={CalendarCheck2}
          color="emerald"
        />

        <StatCard
          title="Academic Departments"
          value={metrics.totalDepartments || 0}
          subtitle={`${metrics.totalCourses || 0} active degree programs`}
          icon={Building2}
          color="blue"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <Card title="Attendance Trend (Weekly Aggregation)" subtitle="Daily average lecture attendance rate across campus">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attRateColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg">
                          <p className="font-bold">{payload[0].payload.day}</p>
                          <p className="text-indigo-300">Attendance: {payload[0].value}%</p>
                          <p className="text-[10px] text-slate-400">Present: {payload[0].payload.present} • Absent: {payload[0].payload.absent}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#attRateColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Grade Distribution Chart */}
        <Card title="Academic Performance Distribution" subtitle="Institutional distribution of earned semester letter grades">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg">
                          <p className="font-bold">{payload[0].payload.grade}</p>
                          <p className="text-purple-300">Count: {payload[0].value} students</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Audit Logs Trail */}
      <Card
        title="System Security & Audit Trail"
        subtitle="Recent administrative events and verified actions"
        headerAction={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/audit-logs')}
            className="text-indigo-600 dark:text-indigo-400"
          >
            All Logs <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Event Action</th>
                <th className="px-4 py-3">Performed By</th>
                <th className="px-4 py-3">Target Resource</th>
                <th className="px-4 py-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAuditLogs.slice(0, 5).map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-medium">
                    {log.performedBy?.name || 'System Engine'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                    {log.targetResource}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400 text-[11px]">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
