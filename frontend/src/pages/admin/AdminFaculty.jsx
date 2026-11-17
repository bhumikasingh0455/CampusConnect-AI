import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Users, Plus, Search, Edit2, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFaculty = () => {
  const [loading, setLoading] = useState(true);
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    employeeId: '',
    department: '',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Computer Science',
    specialization: 'Artificial Intelligence & Machine Learning',
    officeRoom: 'Block A - 302',
    assignedSubjects: []
  });

  const fetchData = async () => {
    try {
      const [facRes, deptsRes, subsRes] = await Promise.all([
        api.get('/faculty'),
        api.get('/departments'),
        api.get('/subjects')
      ]);

      if (facRes.data.success) setFacultyList(facRes.data.data.faculty || []);
      if (deptsRes.data.success) {
        const depts = deptsRes.data.data.departments || [];
        setDepartments(depts);
        if (depts.length > 0 && !formData.department) {
          setFormData(prev => ({ ...prev, department: depts[0]._id }));
        }
      }
      if (subsRes.data.success) setSubjects(subsRes.data.data.subjects || []);
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
    setEditingFaculty(null);
    setFormData({
      name: '',
      email: '',
      password: 'Campus@123',
      phone: '',
      employeeId: `EMP-FAC-${Math.floor(100 + Math.random() * 900)}`,
      department: departments[0]?._id || '',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Computer Science',
      specialization: 'Systems & Computing',
      officeRoom: 'Faculty Wing B-204',
      assignedSubjects: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setEditingFaculty(f);
    setFormData({
      name: f.user?.name || '',
      email: f.user?.email || '',
      password: '',
      phone: f.user?.phone || '',
      employeeId: f.employeeId || '',
      department: f.department?._id || '',
      designation: f.designation || 'Assistant Professor',
      qualification: f.qualification || '',
      specialization: f.specialization || '',
      officeRoom: f.officeRoom || '',
      assignedSubjects: (f.assignedSubjects || []).map(s => s._id)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingFaculty) {
        await api.put(`/faculty/${editingFaculty._id}`, formData);
        toast.success('Faculty profile updated successfully');
      } else {
        await api.post('/faculty', formData);
        toast.success('Faculty account appointed successfully');
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
    if (!window.confirm('Are you sure you want to delete this faculty account?')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('Faculty account removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete faculty');
    }
  };

  const filteredFaculty = facultyList.filter(f => {
    const q = search.toLowerCase();
    return (
      f.user?.name?.toLowerCase().includes(q) ||
      f.user?.email?.toLowerCase().includes(q) ||
      f.employeeId?.toLowerCase().includes(q) ||
      f.specialization?.toLowerCase().includes(q)
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
            Faculty Directory & Appointees
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Appoint professors, manage course allocations, and maintain faculty qualifications
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Appoint Faculty
        </Button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty name, ID, specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredFaculty.length} faculty members
          </span>
        </div>

        {filteredFaculty.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No faculty members found"
            description="Appoint professors or search by different keywords."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Faculty Member</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Department & Rank</th>
                  <th className="px-4 py-3">Assigned Courses</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredFaculty.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={f.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={f.user?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{f.user?.name}</p>
                          <span className="text-[10px] text-slate-400">{f.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {f.employeeId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{f.designation}</span>
                      <span className="text-[10px] text-slate-400 block">{f.department?.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(f.assignedSubjects || []).map((sub) => (
                          <span key={sub._id} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                            {sub.code}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(f)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Edit Faculty"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(f.user?._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                        title="Delete Faculty"
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

      {/* Appoint / Edit Faculty Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaculty ? `Edit Faculty: ${editingFaculty.user?.name}` : 'Appoint Faculty Member'}
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
                placeholder="Prof. Alan Turing"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                required
                disabled={!!editingFaculty}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@campusconnect.edu"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          {!editingFaculty && (
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
                Employee ID
              </label>
              <input
                type="text"
                required
                disabled={!!editingFaculty}
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="EMP-CSE-001"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-50"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Designation
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Head of Department">Head of Department</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Highest Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="Ph.D. in Computer Science"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assign Curriculum Subjects
            </label>
            <div className="max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 space-y-1.5">
              {subjects.map(s => {
                const isChecked = (formData.assignedSubjects || []).includes(s._id);
                return (
                  <label key={s._id} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, assignedSubjects: [...formData.assignedSubjects, s._id] });
                        } else {
                          setFormData({
                            ...formData,
                            assignedSubjects: formData.assignedSubjects.filter(id => id !== s._id)
                          });
                        }
                      }}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{s.name} ({s.code}) - Sem {s.semester}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              {editingFaculty ? 'Save Changes' : 'Confirm Appointment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFaculty;
