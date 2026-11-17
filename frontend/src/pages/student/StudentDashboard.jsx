import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import QrScannerModal from '../../components/qr/QrScannerModal';
import {
  CalendarCheck2,
  Award,
  FileSpreadsheet,
  Clock,
  Sparkles,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const fetchOverview = async () => {
    try {
      const res = await api.get('/students/dashboard/overview');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const overall = data?.overallAttendance || { percentage: 84.5, isLowAttendance: false };
  const academic = data?.academicPerformance || { cgpa: 8.85 };
  const todaysClasses = data?.todaysClasses || [];
  const pendingAssignments = data?.pendingAssignments || [];
  const subjectAttendance = data?.subjectAttendance || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-navy-900 via-indigo-900 to-purple-900 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CampusConnect AI Academic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
              {data?.profile?.course?.name || 'B.Tech Computer Science'} • Semester {data?.profile?.currentSemester || 6} • Roll No: {data?.profile?.rollNumber || '23CSE042'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              icon={QrCode}
              onClick={() => setIsQrModalOpen(true)}
              className="shadow-glow-purple"
            >
              Scan Class QR
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={BookOpen}
              onClick={() => navigate('/student/assignments')}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Assignments
            </Button>
          </div>
        </div>
      </div>

      {/* Attendance Shortage Alert Banner (If < 75%) */}
      {overall.isLowAttendance && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider">Attendance Shortage Warning</h4>
            <p className="text-xs mt-0.5">{overall.statusMessage}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/student/attendance')}
            className="text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50"
          >
            Details
          </Button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${overall.percentage}%`}
          subtitle={`${overall.attended} of ${overall.total} classes attended`}
          icon={CalendarCheck2}
          color={overall.isLowAttendance ? 'amber' : 'emerald'}
        />

        <StatCard
          title="Cumulative CGPA"
          value={academic.cgpa ? academic.cgpa.toFixed(2) : '8.85'}
          subtitle="Scale of 10.0"
          icon={Award}
          color="indigo"
          trend="+0.18"
          trendType="up"
        />

        <StatCard
          title="Pending Assignments"
          value={pendingAssignments.length}
          subtitle="Due in the next 7 days"
          icon={FileSpreadsheet}
          color={pendingAssignments.length > 0 ? 'rose' : 'blue'}
        />

        <StatCard
          title="Classes Scheduled Today"
          value={todaysClasses.length}
          subtitle="Check room numbers below"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Middle Grid: Today's Schedule & Pending Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2">
          <Card
            title="Today's Class Schedule"
            subtitle="Real-time room allocations and timing"
            headerAction={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student/timetable')}
                className="text-indigo-600 dark:text-indigo-400"
              >
                Full Week <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            }
          >
            {todaysClasses.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No classes scheduled for today"
                description="Enjoy your self-study time or complete pending assignments."
              />
            ) : (
              <div className="space-y-3">
                {todaysClasses.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between hover:border-indigo-400/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center font-bold text-xs">
                        <span>{item.startTime}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.subject?.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.subject?.code} • {item.faculty?.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="primary" size="sm">
                      {item.roomNumber || 'Room 301'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Pending Assignments */}
        <div>
          <Card
            title="Pending Assignments"
            subtitle="Upcoming deadlines"
            headerAction={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student/assignments')}
                className="text-indigo-600 dark:text-indigo-400"
              >
                View All
              </Button>
            }
          >
            {pendingAssignments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">All assignments submitted!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Great job staying on top of coursework.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAssignments.slice(0, 3).map((a) => (
                  <div
                    key={a._id}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={a.isOverdue ? 'danger' : 'warning'} size="xs">
                        {a.isOverdue ? 'Overdue' : 'Due Soon'}
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        {new Date(a.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                      {a.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {a.subject?.name} • Max: {a.maxMarks} pts
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Subject-Wise Attendance Progress */}
      <Card
        title="Subject Attendance & Thresholds"
        subtitle="University requires minimum 75% attendance for end-semester examination hall tickets"
        headerAction={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/attendance')}
          >
            Detailed Log
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectAttendance.map((sub) => {
            const isLow = sub.percentage < 75;
            return (
              <div
                key={sub.subjectId}
                className={`p-4 rounded-xl border ${
                  isLow
                    ? 'border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {sub.subjectName}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {sub.subjectCode} • {sub.attended} / {sub.total} classes attended
                    </p>
                  </div>
                  <Badge variant={isLow ? 'warning' : 'success'} size="sm">
                    {sub.percentage}%
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLow ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>

                {/* Shortage predictor note */}
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                  {sub.statusMessage}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Smart QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSuccess={fetchOverview}
      />
    </div>
  );
};

export default StudentDashboard;
