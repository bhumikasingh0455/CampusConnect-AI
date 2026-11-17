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
import QrDisplayModal from '../../components/qr/QrDisplayModal';
import {
  Users,
  BookOpen,
  FileSpreadsheet,
  CalendarCheck2,
  Clock,
  Sparkles,
  QrCode,
  Award,
  Plus
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  // Dynamic QR state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeQrSubject, setActiveQrSubject] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/faculty/dashboard/overview');
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
  const todaysSchedule = overview?.todaysSchedule || [];
  const assignedSubjects = overview?.assignedSubjects || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Faculty Management Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {overview?.profile?.designation || 'Faculty Member'} • Department of {overview?.profile?.department?.name || 'Computer Science'} • {overview?.profile?.officeRoom || 'Academic Block'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={CalendarCheck2}
            onClick={() => navigate('/faculty/attendance')}
          >
            Mark Attendance
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={FileSpreadsheet}
            onClick={() => navigate('/faculty/assignments')}
          >
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Courses"
          value={metrics.totalSubjectsAssigned || 0}
          subtitle="Active curriculum subjects"
          icon={BookOpen}
          color="indigo"
        />

        <StatCard
          title="Submissions to Grade"
          value={metrics.pendingSubmissionsToGrade || 0}
          subtitle="Pending student reviews"
          icon={FileSpreadsheet}
          color={metrics.pendingSubmissionsToGrade > 0 ? 'rose' : 'emerald'}
        />

        <StatCard
          title="Average Attendance"
          value={`${metrics.averageAttendanceRate || 86}%`}
          subtitle="Across assigned lecture groups"
          icon={CalendarCheck2}
          color="purple"
        />

        <StatCard
          title="Active Assignments"
          value={metrics.activeAssignmentsCount || 0}
          subtitle="Currently published"
          icon={Award}
          color="blue"
        />
      </div>

      {/* Assigned Subjects Overview */}
      <Card title="Assigned Subjects & Quick Operations" subtitle="Manage attendance, assignments, and study materials">
        {assignedSubjects.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No subjects currently assigned"
            description="Contact your Department Head or Administrator to assign course curriculum."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedSubjects.map((sub) => (
              <div
                key={sub._id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" size="xs">
                      Semester {sub.semester}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {sub.code}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {sub.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sub.credits || 4} Academic Credits
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    icon={CalendarCheck2}
                    onClick={() => navigate(`/faculty/attendance?subjectId=${sub._id}`)}
                  >
                    Attendance
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={QrCode}
                    onClick={() => {
                      setActiveQrSubject(sub);
                      setQrModalOpen(true);
                    }}
                  >
                    Live QR
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    icon={Award}
                    onClick={() => navigate(`/faculty/grades?subjectId=${sub._id}`)}
                  >
                    Enter Marks
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Today's Schedule */}
      <Card title="Today's Teaching Schedule" subtitle="Your lecture schedule for today">
        {todaysSchedule.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No classes scheduled for today"
            description="No lecture sessions assigned on timetable for today."
          />
        ) : (
          <div className="space-y-3">
            {todaysSchedule.map((item) => (
              <div
                key={item._id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex flex-col items-center justify-center font-bold text-xs">
                    <span>{item.startTime}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.subject?.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.course?.name} • Room: {item.roomNumber || 'Hall 101'}
                    </p>
                  </div>
                </div>
                <Button
                  size="xs"
                  variant="primary"
                  icon={QrCode}
                  onClick={() => {
                    setActiveQrSubject(item.subject);
                    setQrModalOpen(true);
                  }}
                >
                  Generate QR
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Dynamic QR Display Modal */}
      {activeQrSubject && (
        <QrDisplayModal
          isOpen={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setActiveQrSubject(null);
          }}
          subjectId={activeQrSubject._id}
          subjectName={activeQrSubject.name}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;
