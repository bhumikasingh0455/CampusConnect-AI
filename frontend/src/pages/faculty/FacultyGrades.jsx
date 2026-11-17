import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Award, Save, Users, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyGrades = () => {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examType, setExamType] = useState('Midterm');
  const [maxMarks, setMaxMarks] = useState(100);
  const [students, setStudents] = useState([]);
  const [marksState, setMarksState] = useState({}); // { [studentId]: { marks, remarks } }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/faculty/dashboard/overview');
        if (res.data.success) {
          const subs = res.data.data.assignedSubjects || [];
          setSubjects(subs);
          if (subs.length > 0) {
            setSelectedSubject(subs[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    const fetchStudents = async () => {
      try {
        const subDoc = subjects.find(s => s._id === selectedSubject);
        const res = await api.get(`/students${subDoc?.semester ? `?semester=${subDoc.semester}` : ''}`);
        if (res.data.success) {
          const list = res.data.data.students || [];
          setStudents(list);

          const initialMarks = {};
          list.forEach(s => {
            const sId = s.user?._id || s._id;
            initialMarks[sId] = { marks: '', remarks: '' };
          });
          setMarksState(initialMarks);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, [selectedSubject, subjects]);

  const handleSaveAllGrades = async () => {
    if (!selectedSubject) return;
    setSaving(true);
    let successCount = 0;

    try {
      const subDoc = subjects.find(s => s._id === selectedSubject);

      for (const st of students) {
        const sId = st.user?._id || st._id;
        const entry = marksState[sId];
        if (entry && entry.marks !== '') {
          await api.post('/grades', {
            studentId: sId,
            subjectId: selectedSubject,
            semester: subDoc?.semester || 6,
            examType,
            marksObtained: Number(entry.marks),
            maxMarks: Number(maxMarks),
            remarks: entry.remarks || ''
          });
          successCount++;
        }
      }

      toast.success(`Published grades for ${successCount} student(s)! Notifications dispatched.`);
    } catch (err) {
      toast.error('Failed to save some grades');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} height="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Grade & Internal Assessment Entry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Record midterm scores, internal assessment marks, and dispatch instant grade notifications
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Save}
          isLoading={saving}
          onClick={handleSaveAllGrades}
        >
          Publish All Grades
        </Button>
      </div>

      {/* Selector Card */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.code}) - Sem {s.semester}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assessment / Exam Type
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Internal 1">Internal 1 (Cycle Test 1)</option>
              <option value="Internal 2">Internal 2 (Cycle Test 2)</option>
              <option value="Midterm">Midterm Examination</option>
              <option value="Practical">Lab / Practical Exam</option>
              <option value="End Semester">End Semester Final</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Maximum Marks
            </label>
            <input
              type="number"
              min={10}
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Student Marks Entry Table */}
      <Card title={`Student Roster (${students.length} Students)`} subtitle="Enter scores and optional evaluation feedback">
        {students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students found for this subject"
            description="Ensure students are enrolled in this semester."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3 w-36">Score (Max {maxMarks})</th>
                  <th className="px-4 py-3">Instructor Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((st) => {
                  const sId = st.user?._id || st._id;
                  const current = marksState[sId] || { marks: '', remarks: '' };

                  return (
                    <tr key={sId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {st.rollNumber}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {st.user?.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{st.enrollmentNumber}</span>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          max={maxMarks}
                          placeholder="e.g. 85"
                          value={current.marks}
                          onChange={(e) =>
                            setMarksState(prev => ({
                              ...prev,
                              [sId]: { ...prev[sId], marks: e.target.value }
                            }))
                          }
                          className="w-28 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Consistent performance / Needs improvement..."
                          value={current.remarks}
                          onChange={(e) =>
                            setMarksState(prev => ({
                              ...prev,
                              [sId]: { ...prev[sId], remarks: e.target.value }
                            }))
                          }
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FacultyGrades;
