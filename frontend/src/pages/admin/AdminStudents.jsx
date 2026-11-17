import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { GraduationCap, Plus, Search, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminStudents = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    enrollmentNumber: '',
    rollNumber: '',
    department: '',
    course: '',
    currentSemester: 1,
    section: 'A',
    batchYear: '2023-2027',
    gender: 'Male'
  });

  const fetchData = async () => {
    try {
      const [studentsRes, deptsRes, coursesRes] = await Promise.all([
        api.get('/students'),
        api.get('/departments'),
        api.get('/courses')
      ]);

      if (studentsRes.data.success) setStudents(studentsRes.data.data.students || []);
      if (deptsRes.data.success) {
        const depts = deptsRes.data.data.departments || [];
        setDepartments(depts);
        if (depts.length > 0 && !formData.department) {
          setFormData(prev => ({ ...prev, department: depts[0]._id }));
        }
      }
      if (coursesRes.data.success) {
        const crs = coursesRes.data.data.courses || [];
        setCourses(crs);
        if (crs.length > 0 && !formData.course) {
          setFormData(prev => ({ ...prev, course: crs[0]._id }));
        }
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

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      password: 'Campus@123',
      phone: '',
      enrollmentNumber: `EN2026CSE${Math.floor(100 + Math.random() * 900)}`,
      rollNumber: `26CSE${Math.floor(10 + Math.random() * 90)}`,
      department: departments[0]?._id || '',
      course: courses[0]?._id || '',
      currentSemester: 1,
      section: 'A',
      batchYear: '2024-2028',
      gender: 'Male'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (st) => {
    setEditingStudent(st);
    setFormData({
      name: st.user?.name || '',
      email: st.user?.email || '',
      password: '',
      phone: st.user?.phone || '',
      enrollmentNumber: st.enrollmentNumber || '',
      rollNumber: st.rollNumber || '',
      department: st.department?._id || '',
      course: st.course?._id || '',
      currentSemester: st.currentSemester || 1,
      section: st.section || 'A',
      batchYear: st.batchYear || '2023-2027',
      gender: st.gender || 'Male'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
        toast.success('Student profile updated successfully');
      } else {
        await api.post('/students', formData);
        toast.success('Student account created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this student account?')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('Student account deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(st => {
    const q = search.toLowerCase();
    return (
      st.user?.name?.toLowerCase().includes(q) ||
      st.user?.email?.toLowerCase().includes(q) ||
      st.rollNumber?.toLowerCase().includes(q) ||
      st.enrollmentNumber?.toLowerCase().includes(q)
    );
  });

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
            Student Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Directory of enrolled students, enrollment IDs, departments, and credentials
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Enroll Student
        </Button>
      </div>

      {/* Search and Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll no, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredStudents.length} students found
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No students matched search criteria"
            description="Enroll new students or clear the search query."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Department & Course</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {st.rollNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={st.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={st.user?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{st.user?.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{st.enrollmentNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{st.department?.code || 'CSE'}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-xs">{st.course?.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="primary" size="xs">
                        Sem {st.currentSemester} ({st.section || 'A'})
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <p className="text-[11px] truncate max-w-[140px]">{st.user?.email}</p>
                      <p className="text-[10px]">{st.user?.phone || 'No phone'}</p>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(st)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Edit Student"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(st.user?._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `Edit Student: ${editingStudent.user?.name}` : 'Enroll New Student'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Rivera"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={!!editingStudent}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@campusconnect.edu"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          {!editingStudent && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Account Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="23CSE042"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enrollment Number
              </label>
              <input
                type="text"
                required
                disabled={!!editingStudent}
                value={formData.enrollmentNumber}
                onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                placeholder="EN2023CSE042"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Degree Course
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={formData.currentSemester}
                onChange={(e) => setFormData({ ...formData, currentSemester: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Section
              </label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0123"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              {editingStudent ? 'Save Changes' : 'Confirm Enrollment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStudents;
