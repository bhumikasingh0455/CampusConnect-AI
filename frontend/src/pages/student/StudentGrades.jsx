import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award, TrendingUp, BookOpen, CheckCircle, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const StudentGrades = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gradesData, setGradesData] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await api.get(`/grades/student/${user._id}`);
        if (res.data.success) {
          setGradesData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} height="h-28" />
        <LoadingSkeleton count={1} height="h-64" />
      </div>
    );
  }

  const cgpa = gradesData?.cgpa || 8.85;
  const grades = gradesData?.grades || [];
  const semesterAnalytics = gradesData?.semesterAnalytics || [];

  // Trend data over semesters
  const trendData = [
    { sem: 'Sem 1', sgpa: 8.4 },
    { sem: 'Sem 2', sgpa: 8.6 },
    { sem: 'Sem 3', sgpa: 8.5 },
    { sem: 'Sem 4', sgpa: 8.9 },
    { sem: 'Sem 5', sgpa: 8.8 },
    { sem: 'Sem 6', sgpa: 9.1 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Academic Performance & Grade Card
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Transcript breakdown, semester grade points, and internal evaluation marks
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Cumulative Grade Point (CGPA)"
          value={cgpa.toFixed(2)}
          subtitle="Out of 10.0 scale"
          icon={Award}
          color="indigo"
          trend="+0.24"
          trendType="up"
        />

        <StatCard
          title="Current Semester SGPA"
          value="9.10"
          subtitle="Semester 6 predicted SGPA"
          icon={TrendingUp}
          color="emerald"
        />

        <StatCard
          title="Total Credits Earned"
          value="132"
          subtitle="Graduation requirement: 160 credits"
          icon={BookOpen}
          color="purple"
        />
      </div>

      {/* SGPA Trend Chart */}
      <Card title="Semester Performance Progression" subtitle="SGPA progression across completed academic semesters">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sgpaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="sem" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[7, 10]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg">
                        <p className="font-bold">{payload[0].payload.sem}</p>
                        <p className="text-indigo-300">SGPA: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="sgpa" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#sgpaColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detailed Grades Table */}
      <Card title="Coursework & Examination Mark Sheet" subtitle="Official recorded scores and letter grades">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Exam Type</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3 text-right">Grade Letter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {grades.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No examination records published for this semester yet.
                  </td>
                </tr>
              ) : (
                grades.map((g) => (
                  <tr key={g._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{g.subject?.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{g.subject?.code}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {g.examType}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {g.subject?.credits || 4} credits
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {g.marksObtained} / {g.maxMarks}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant={
                          ['O', 'A+'].includes(g.gradeLetter)
                            ? 'success'
                            : ['A', 'B+'].includes(g.gradeLetter)
                            ? 'primary'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {g.gradeLetter} ({g.gradePoint} pts)
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentGrades;
