import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { BookOpen, Plus, Edit2, Trash2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAcademics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subjects'); // 'courses' | 'subjects'
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);

  // Course Modal
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    name: '',
    code: '',
    department: '',
    durationYears: 4,
    totalSemesters: 8,
    degreeType: 'Undergraduate'
  });

  // Subject Modal
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectFormData, setSubjectFormData] = useState({
    name: '',
    code: '',
    department: '',
    course: '',
    semester: 1,
    credits: 4,
    faculty: ''
  });

  const fetchData = async () => {
    try {
      const [crsRes, subsRes, deptsRes, facRes] = await Promise.all([
        api.get('/courses'),
        api.get('/subjects'),
        api.get('/departments'),
        api.get('/faculty')
      ]);

      if (crsRes.data.success) {
        const crs = crsRes.data.data.courses || [];
        setCourses(crs);
        if (crs.length > 0) setSubjectFormData(prev => ({ ...prev, course: crs[0]._id }));
      }
      if (subsRes.data.success) setSubjects(subsRes.data.data.subjects || []);
      if (deptsRes.data.success) {
        const depts = deptsRes.data.data.departments || [];
        setDepartments(depts);
        if (depts.length > 0) {
          setCourseFormData(prev => ({ ...prev, department: depts[0]._id }));
          setSubjectFormData(prev => ({ ...prev, department: depts[0]._id }));
        }
      }
      if (facRes.data.success) setFaculty(facRes.data.data.faculty || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', courseFormData);
      toast.success('Course created successfully');
      setIsCourseModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subjects', subjectFormData);
      toast.success('Curriculum subject added successfully');
      setIsSubjectModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add subject');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course program?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete this subject from curriculum?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      toast.success('Subject removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete subject');
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
            Courses & Curriculum Subjects
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Define degree offerings, semester subject structures, and credit requirements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setIsCourseModalOpen(true)}
          >
            Add Degree Course
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsSubjectModalOpen(true)}
          >
            Add Subject
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === 'subjects'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Curriculum Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === 'courses'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Degree Programs ({courses.length})
        </button>
      </div>

      {/* Subjects View */}
      {activeTab === 'subjects' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Degree & Dept</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Assigned Faculty</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subjects.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {sub.code}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {sub.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {sub.department?.code} • {sub.course?.code}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="primary" size="xs">Sem {sub.semester}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-bold">
                      {sub.credits} credits
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {sub.faculty?.name || 'Unassigned'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteSubject(sub._id)}
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
      )}

      {/* Courses View */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((crs) => (
            <Card key={crs._id} className="flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="xs">{crs.degreeType}</Badge>
                  <span className="font-mono font-bold text-xs text-slate-500">{crs.code}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{crs.name}</h3>
                <p className="text-xs text-slate-500">Dept: {crs.department?.name}</p>
                <p className="text-xs text-slate-400">{crs.durationYears} Years ({crs.totalSemesters} Semesters)</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 flex justify-end">
                <button
                  onClick={() => handleDeleteCourse(crs._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Create Degree Program"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCourse} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Program Title</label>
            <input
              type="text"
              required
              value={courseFormData.name}
              onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
              placeholder="e.g. B.Tech in Information Technology"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Code</label>
              <input
                type="text"
                required
                value={courseFormData.code}
                onChange={(e) => setCourseFormData({ ...courseFormData, code: e.target.value })}
                placeholder="BTECH-IT"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={courseFormData.department}
                onChange={(e) => setCourseFormData({ ...courseFormData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsCourseModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Create Program</Button>
          </div>
        </form>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Add Curriculum Subject"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSubject} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
            <input
              type="text"
              required
              value={subjectFormData.name}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
              placeholder="e.g. Distributed Consensus Systems"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Code</label>
              <input
                type="text"
                required
                value={subjectFormData.code}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value })}
                placeholder="CS606"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
              <input
                type="number"
                min={1}
                max={12}
                value={subjectFormData.semester}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, semester: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree Course</label>
              <select
                value={subjectFormData.course}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, course: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Credits</label>
              <input
                type="number"
                min={1}
                max={8}
                value={subjectFormData.credits}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, credits: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Faculty</label>
            <select
              value={subjectFormData.faculty}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, faculty: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="">Unassigned</option>
              {faculty.map(f => (
                <option key={f.user?._id || f._id} value={f.user?._id || f._id}>{f.user?.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsSubjectModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Save Subject</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAcademics;
