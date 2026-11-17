import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  GraduationCap,
  CalendarCheck2,
  Award,
  FileSpreadsheet,
  AlertTriangle,
  Bell,
  Sparkles,
  User,
  ShieldCheck
} from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentOverview, setStudentOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Fetch linked students
  useEffect(() => {
    const fetchLinked = async () => {
      try {
        const res = await api.get('/parents/students');
        if (res.data.success) {
          const list = res.data.data.linkedStudents || [];
          setLinkedStudents(list);
          if (list.length > 0) {
            setSelectedStudentId(list[0].student?._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinked();
  }, []);

  // Fetch student overview when selected
  useEffect(() => {
    if (!selectedStudentId) return;
    const fetchStudentData = async () => {
      setOverviewLoading(true);
      try {
        const res = await api.get(`/parents/student-overview/${selectedStudentId}`);
        if (res.data.success) {
          setStudentOverview(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setOverviewLoading(false);
      }
    };
    fetchStudentData();
  }, [selectedStudentId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} height="h-32" />
      </div>
    );
  }

  if (linkedStudents.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="No linked student accounts"
        description="Your parent account is not currently linked to any student profile. Please contact the campus administration office."
      />
    );
  }

  const overall = studentOverview?.overallAttendance || { percentage: 84.5, isLowAttendance: false };
  const student = studentOverview?.student;
  const profile = studentOverview?.profile;
  const subjects = studentOverview?.subjectAttendance || [];
  const assignments = studentOverview?.assignments || [];
  const grades = studentOverview?.grades || [];
  const notices = studentOverview?.notices || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Parent & Guardian Oversight Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Monitoring academic progress for <strong className="text-white">{student?.name || 'Alex Rivera'}</strong> ({profile?.course?.code || 'B.Tech CSE'} • Sem {profile?.currentSemester || 6})
          </p>
        </div>

        {/* Student Selector if multiple */}
        {linkedStudents.length > 1 && (
          <div className="bg-white/10 p-2.5 rounded-2xl border border-white/20">
            <label className="block text-[11px] text-slate-300 mb-1">Select Student Ward</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-900 text-white border border-slate-700"
            >
              {linkedStudents.map(l => (
                <option key={l.student?._id} value={l.student?._id}>
                  {l.student?.name} ({l.relationship})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Attendance Shortage Warning Alert */}
      {overall.isLowAttendance && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Attendance Shortage Notice for Parents</h4>
            <p className="text-xs mt-0.5">
              Your ward's attendance is currently at <strong>{overall.percentage}%</strong>, below the university mandatory 75% threshold. {overall.statusMessage}
            </p>
          </div>
        </div>
      )}

      {overviewLoading ? (
        <LoadingSkeleton count={3} height="h-32" />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Attendance Record"
              value={`${overall.percentage}%`}
              subtitle={`${overall.attended} of ${overall.total} lectures attended`}
              icon={CalendarCheck2}
              color={overall.isLowAttendance ? 'amber' : 'emerald'}
            />

            <StatCard
              title="Cumulative Grade Point"
              value={studentOverview?.cgpa ? studentOverview.cgpa.toFixed(2) : '8.85'}
              subtitle="Scale of 10.0"
              icon={Award}
              color="indigo"
            />

            <StatCard
              title="Upcoming Coursework"
              value={assignments.length}
              subtitle="Assignments in current term"
              icon={FileSpreadsheet}
              color="purple"
            />
          </div>

          {/* Subject Attendance Breakdown */}
          <Card title="Subject Attendance Breakdown" subtitle="University eligibility tracking by course">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map(s => {
                const isLow = s.percentage < 75;
                return (
                  <div
                    key={s.subjectCode}
                    className={`p-3.5 rounded-xl border ${
                      isLow
                        ? 'border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{s.subjectName}</h5>
                        <p className="text-[11px] text-slate-500">{s.subjectCode} • {s.attended}/{s.total} attended</p>
                      </div>
                      <Badge variant={isLow ? 'warning' : 'success'} size="xs">{s.percentage}%</Badge>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, s.percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Examination Marks & Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Examination Mark Sheet */}
            <Card title="Examination Performance" subtitle="Reported cycle tests and midterm exams">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-3 py-2.5">Subject</th>
                      <th className="px-3 py-2.5">Exam</th>
                      <th className="px-3 py-2.5">Marks</th>
                      <th className="px-3 py-2.5 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {grades.slice(0, 5).map(g => (
                      <tr key={g._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-3 py-2.5 font-medium text-slate-900 dark:text-white">
                          {g.subject?.name}
                        </td>
                        <td className="px-3 py-2.5 text-slate-500">{g.examType}</td>
                        <td className="px-3 py-2.5 font-bold text-slate-800 dark:text-slate-200">{g.marksObtained}/{g.maxMarks}</td>
                        <td className="px-3 py-2.5 text-right">
                          <Badge variant="success" size="xs">{g.gradeLetter}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Official Notices */}
            <Card title="Official College Notices" subtitle="Announcements for guardians">
              <div className="space-y-3">
                {notices.map(n => (
                  <div key={n._id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentDashboard;
