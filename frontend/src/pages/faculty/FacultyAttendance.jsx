import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import QrDisplayModal from '../../components/qr/QrDisplayModal';
import {
  CalendarCheck2,
  QrCode,
  CheckCheck,
  Save,
  Users,
  AlertTriangle,
  Calendar,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyAttendance = () => {
  const [searchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId') || '';

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(initialSubjectId);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { [studentId]: 'present' | 'absent' | 'leave' }
  const [saving, setSaving] = useState(false);

  // Live QR modal
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Fetch subjects assigned to faculty
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const res = await api.get('/faculty/dashboard/overview');
        if (res.data.success) {
          const subs = res.data.data.assignedSubjects || [];
          setSubjects(subs);
          if (!selectedSubject && subs.length > 0) {
            setSelectedSubject(subs[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyData();
  }, []);

  // Fetch enrolled students when subject changes
  useEffect(() => {
    if (!selectedSubject) return;
    const fetchStudents = async () => {
      try {
        const subDoc = subjects.find(s => s._id === selectedSubject);
        const sem = subDoc?.semester;
        const res = await api.get(`/students${sem ? `?semester=${sem}` : ''}`);
        if (res.data.success) {
          const list = res.data.data.students || [];
          setStudents(list);

          // Initialize attendance as 'present' by default
          const initialMap = {};
          list.forEach(s => {
            initialMap[s.user?._id || s._id] = 'present';
          });
          setAttendanceMap(initialMap);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, [selectedSubject, subjects]);

  const setStatus = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.user?._id || s._id] = status;
    });
    setAttendanceMap(updated);
    toast.success(`Marked all students as ${status}`);
  };

  const handleSaveAttendance = async () => {
    if (!selectedSubject || !selectedDate) {
      toast.error('Please select a subject and date');
      return;
    }

    setSaving(true);
    try {
      const records = students.map(s => {
        const sId = s.user?._id || s._id;
        return {
          studentId: sId,
          status: attendanceMap[sId] || 'present',
          remarks: ''
        };
      });

      const res = await api.post('/attendance/mark', {
        subjectId: selectedSubject,
        date: selectedDate,
        records
      });

      if (res.data.success) {
        const lowCount = res.data.data.lowAttendanceAlerts?.length || 0;
        toast.success(`Attendance successfully recorded! ${lowCount > 0 ? `(${lowCount} low attendance alerts triggered)` : ''}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
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

  const activeSubjectDoc = subjects.find(s => s._id === selectedSubject);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Class Attendance Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mark lecture roll calls, generate dynamic QR codes, and trigger shortage alerts
          </p>
        </div>

        {activeSubjectDoc && (
          <Button
            variant="secondary"
            size="md"
            icon={QrCode}
            onClick={() => setIsQrModalOpen(true)}
            className="shadow-glow-purple"
          >
            Display Live QR Code
          </Button>
        )}
      </div>

      {/* Control Bar: Select Subject & Date */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Assigned Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code}) - Sem {sub.semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Lecture Session Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              size="md"
              className="w-1/2"
              onClick={() => markAll('present')}
              icon={CheckCheck}
            >
              All Present
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-1/2"
              onClick={handleSaveAttendance}
              isLoading={saving}
              icon={Save}
            >
              Save Roll
            </Button>
          </div>
        </div>
      </Card>

      {/* Student Roster Attendance Checklist */}
      <Card
        title={`Student Roster (${students.length} Enrolled)`}
        subtitle="Toggle attendance status for each enrolled student"
      >
        {students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students found in this course semester"
            description="Enroll students into this department semester to mark attendance."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Enrollment</th>
                  <th className="px-4 py-3 text-right">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((st) => {
                  const studentId = st.user?._id || st._id;
                  const currentStatus = attendanceMap[studentId] || 'present';

                  return (
                    <tr key={studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {st.rollNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={st.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={st.user?.name}
                            className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                          />
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {st.user?.name || 'Student'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {st.enrollmentNumber}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => setStatus(studentId, 'present')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(studentId, 'absent')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(studentId, 'leave')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'leave'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Dynamic QR Modal */}
      {activeSubjectDoc && (
        <QrDisplayModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          subjectId={activeSubjectDoc._id}
          subjectName={activeSubjectDoc.name}
        />
      )}
    </div>
  );
};

export default FacultyAttendance;
