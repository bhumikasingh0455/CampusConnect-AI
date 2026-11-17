import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import QrScannerModal from '../../components/qr/QrScannerModal';
import {
  CalendarCheck2,
  QrCode,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [filterSubject, setFilterSubject] = useState('all');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Shortage simulator interactive calculator state
  const [simSubject, setSimSubject] = useState(null);
  const [futureMissCount, setFutureMissCount] = useState(0);

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/student/${user._id}`);
      if (res.data.success) {
        setAttendanceData(res.data.data);
        if (res.data.data.subjectBreakdown?.length > 0) {
          setSimSubject(res.data.data.subjectBreakdown[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} height="h-28" />
        <LoadingSkeleton count={1} height="h-80" />
      </div>
    );
  }

  const overall = attendanceData?.overall || { percentage: 0, attended: 0, total: 0 };
  const subjects = attendanceData?.subjectBreakdown || [];
  const records = attendanceData?.records || [];

  const filteredRecords = records.filter(r => {
    if (filterSubject === 'all') return true;
    return r.subject?._id === filterSubject;
  });

  // Calculate simulated attendance
  let simulatedPercentage = simSubject?.percentage || 0;
  if (simSubject) {
    const totalSim = simSubject.total + Number(futureMissCount);
    simulatedPercentage = totalSim > 0 ? Math.round((simSubject.attended / totalSim) * 1000) / 10 : 0;
  }

  const chartData = subjects.map(s => ({
    name: s.subjectCode,
    attendance: s.percentage,
    isLow: s.percentage < 75
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Smart Attendance Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time lecture tracking, shortfall forecasting, and verified QR check-in
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={QrCode}
          onClick={() => setIsQrModalOpen(true)}
          className="shadow-glow-purple"
        >
          Check-In with QR Code
        </Button>
      </div>

      {/* Top Cards: Overall Standing & Shortage Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cumulative Campus Attendance
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {overall.percentage}%
              </span>
              <span className="text-xs text-slate-400">
                ({overall.attended}/{overall.total} classes)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  overall.isLowAttendance ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, overall.percentage)}%` }}
              />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <Badge variant={overall.isLowAttendance ? 'warning' : 'success'}>
              {overall.isLowAttendance ? '⚠️ Shortage Warning' : '✅ Good Academic Standing'}
            </Badge>
          </div>
        </Card>

        {/* Shortage Forecast Card */}
        <Card className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              75% Eligibility Shortage Predictor
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Our predictive engine models future attendance trajectories so you can plan absences without risking exam debarment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Recovery Requirement</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {overall.isLowAttendance
                  ? `Attend next ${overall.classesNeededFor75} classes consecutively`
                  : 'Zero recovery classes needed'}
              </p>
              <p className="text-[10px] text-slate-400">To reach or exceed the mandatory 75% boundary</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Safe Miss Margin</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {overall.classesCanMissBeforeLow > 0
                  ? `Can safely miss up to ${overall.classesCanMissBeforeLow} classes`
                  : '0 buffer classes remaining'}
              </p>
              <p className="text-[10px] text-slate-400">Before overall attendance falls below 75%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Chart of Subjects */}
      <Card title="Subject Attendance Comparison" subtitle="Percentage breakdown per enrolled subject">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg">
                        <p className="font-bold">{payload[0].payload.name}</p>
                        <p className="text-indigo-300">Attendance: {payload[0].value}%</p>
                        <p className="text-[10px] text-slate-400">Threshold: 75% required</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isLow ? '#f59e0b' : '#4f46e5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detailed Records Log Table */}
      <Card
        title="Attendance Session History"
        subtitle="Individual lecture records and verification method"
        headerAction={
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
              ))}
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Faculty</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No attendance records for selected filter
                  </td>
                </tr>
              ) : (
                filteredRecords.slice(0, 15).map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {new Date(rec.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.subject?.name}</span>
                      <span className="text-[10px] text-slate-400 block">{rec.subject?.code}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {rec.faculty?.name || 'Assigned Faculty'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500">
                        {rec.verifiedVia === 'qr' ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                            Secure QR
                          </>
                        ) : (
                          'Manual Roll'
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant={
                          rec.status === 'present'
                            ? 'success'
                            : rec.status === 'absent'
                            ? 'danger'
                            : 'warning'
                        }
                        size="xs"
                      >
                        {rec.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSuccess={fetchAttendance}
      />
    </div>
  );
};

export default StudentAttendance;
