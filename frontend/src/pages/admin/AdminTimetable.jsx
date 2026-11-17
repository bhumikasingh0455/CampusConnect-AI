import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { CalendarDays, Plus, Clock, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminTimetable = () => {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    department: '',
    course: '',
    semester: 6,
    section: 'A',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    faculty: '',
    roomNumber: 'Hall 301'
  });

  const fetchData = async () => {
    try {
      const [ttRes, deptsRes, crsRes, subsRes, facRes] = await Promise.all([
        api.get('/timetable'),
        api.get('/departments'),
        api.get('/courses'),
        api.get('/subjects'),
        api.get('/faculty')
      ]);

      if (ttRes.data.success) setTimetable(ttRes.data.data.allEntries || []);
      if (deptsRes.data.success) {
        const d = deptsRes.data.data.departments || [];
        setDepartments(d);
        if (d.length > 0 && !formData.department) setFormData(prev => ({ ...prev, department: d[0]._id }));
      }
      if (crsRes.data.success) {
        const c = crsRes.data.data.courses || [];
        setCourses(c);
        if (c.length > 0 && !formData.course) setFormData(prev => ({ ...prev, course: c[0]._id }));
      }
      if (subsRes.data.success) {
        const s = subsRes.data.data.subjects || [];
        setSubjects(s);
        if (s.length > 0 && !formData.subject) setFormData(prev => ({ ...prev, subject: s[0]._id }));
      }
      if (facRes.data.success) {
        const f = facRes.data.data.faculty || [];
        setFaculty(f);
        if (f.length > 0 && !formData.faculty) setFormData(prev => ({ ...prev, faculty: f[0].user?._id || f[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEntry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/timetable', formData);
      toast.success('Lecture session scheduled!');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule session');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timetable slot?')) return;
    try {
      await api.delete(`/timetable/${id}`);
      toast.success('Schedule slot deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete slot');
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
            Class Timetable & Room Scheduler
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Coordinate lecture hours, classroom rooms, and faculty time commitments
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Schedule Class Slot
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Day & Time</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Program & Sem</th>
                <th className="px-4 py-3">Assigned Faculty</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {timetable.map((slot) => (
                <tr key={slot._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 dark:text-white">{slot.dayOfWeek}</span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 block font-mono">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{slot.subject?.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{slot.subject?.code}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {slot.course?.code || 'CSE'} (Sem {slot.semester} - {slot.section})
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {slot.faculty?.name || 'Instructor'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="primary" size="xs">{slot.roomNumber || 'Room 101'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(slot._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Lecture Session"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateEntry} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Day of Week</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Room Hall</label>
              <input
                type="text"
                required
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="Hall 301"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Faculty</label>
            <select
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {faculty.map(f => (
                <option key={f.user?._id || f._id} value={f.user?._id || f._id}>{f.user?.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>Save Session</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTimetable;
