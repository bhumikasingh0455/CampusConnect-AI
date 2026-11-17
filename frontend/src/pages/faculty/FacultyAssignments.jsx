import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  FileSpreadsheet,
  Plus,
  Clock,
  Award,
  Users,
  CheckCircle,
  FileText,
  Save,
  Trash2,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyAssignments = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Create Assignment Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    maxMarks: 100
  });
  const [attachmentFile, setAttachmentFile] = useState(null);

  // Review Submissions Modal State
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [gradingState, setGradingState] = useState({}); // { [submissionId]: { marks, feedback } }
  const [savingGradeId, setSavingGradeId] = useState(null);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      if (res.data.success) {
        setAssignments(res.data.data.assignments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/faculty/dashboard/overview');
      if (res.data.success) {
        const subs = res.data.data.assignedSubjects || [];
        setSubjects(subs);
        if (subs.length > 0) {
          setNewAssignment(prev => ({ ...prev, subject: subs[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.description || !newAssignment.subject || !newAssignment.dueDate) {
      toast.error('Please complete all required fields');
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('title', newAssignment.title);
      formData.append('description', newAssignment.description);
      formData.append('subject', newAssignment.subject);
      formData.append('dueDate', newAssignment.dueDate);
      formData.append('maxMarks', newAssignment.maxMarks);
      if (attachmentFile) {
        formData.append('attachment', attachmentFile);
      }

      const res = await api.post('/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Assignment created and published to students!');
        setIsCreateModalOpen(false);
        setNewAssignment({
          title: '',
          description: '',
          subject: subjects[0]?._id || '',
          dueDate: '',
          maxMarks: 100
        });
        setAttachmentFile(null);
        fetchAssignments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenReview = async (asg) => {
    setSelectedAssignment(asg);
    setReviewLoading(true);
    try {
      const res = await api.get(`/assignments/${asg._id}`);
      if (res.data.success) {
        const subs = res.data.data.submissions || [];
        setSubmissions(subs);

        const initGrades = {};
        subs.forEach(s => {
          initGrades[s._id] = {
            marks: s.marksObtained !== null ? s.marksObtained : '',
            feedback: s.feedback || ''
          };
        });
        setGradingState(initGrades);
      }
    } catch (err) {
      toast.error('Failed to load submissions');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSaveGrade = async (submissionId) => {
    const dataToSave = gradingState[submissionId];
    if (!dataToSave || dataToSave.marks === '') {
      toast.error('Please enter a marks score');
      return;
    }

    setSavingGradeId(submissionId);
    try {
      const res = await api.put(`/assignments/grade-submission/${submissionId}`, {
        marksObtained: Number(dataToSave.marks),
        feedback: dataToSave.feedback
      });

      if (res.data.success) {
        toast.success('Grade recorded and notified to student!');
        setSubmissions(prev =>
          prev.map(s => (s._id === submissionId ? res.data.data.submission : s))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to grade submission');
    } finally {
      setSavingGradeId(null);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment and its submissions?')) return;
    try {
      await api.delete(`/assignments/${id}`);
      toast.success('Assignment deleted');
      fetchAssignments();
    } catch (err) {
      toast.error('Failed to delete assignment');
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
            Assignment Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create coursework tasks, monitor deadlines, and evaluate student submissions
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No assignments created yet"
          description="Create your first assignment for enrolled students."
          actionText="Create Assignment"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((asg) => (
            <Card key={asg._id} className="flex flex-col justify-between hover:border-purple-400/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="purple" size="xs">
                    {asg.subject?.code} - Sem {asg.semester}
                  </Badge>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Due {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {asg.title}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    {asg.subject?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {asg.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span>Max Marks: <strong className="text-slate-700 dark:text-slate-300">{asg.maxMarks}</strong></span>
                  <span className="font-mono text-[10px]">Status: {asg.status}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Users}
                  onClick={() => handleOpenReview(asg)}
                >
                  Review Submissions
                </Button>

                <button
                  type="button"
                  onClick={() => handleDeleteAssignment(asg._id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                  title="Delete Assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Publish New Assignment"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Subject
            </label>
            <select
              value={newAssignment.subject}
              onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              placeholder="e.g. Distributed Consensus: Raft Protocol Implementation"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Maximum Score (Marks)
              </label>
              <input
                type="number"
                min={1}
                value={newAssignment.maxMarks}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Instructions / Problem Statement
            </label>
            <textarea
              rows={4}
              required
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              placeholder="Specify requirements, deliverables, grading rubrics, and submission guidelines..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Optional Problem Specification Document (PDF, ZIP)
            </label>
            <input
              type="file"
              onChange={(e) => setAttachmentFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 dark:file:bg-purple-950 dark:file:text-purple-300 hover:file:bg-purple-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={creating}>
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Submissions Modal */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title={`Review Submissions: ${selectedAssignment?.title || ''}`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {submissions.length} student submission(s) received • Max Marks: {selectedAssignment?.maxMarks}
          </p>

          {reviewLoading ? (
            <LoadingSkeleton count={3} height="h-20" />
          ) : submissions.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No student submissions yet"
              description="Students have not uploaded solutions for this assignment yet."
            />
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {submissions.map((sub) => {
                const isLate = sub.isLate;
                const currentGrade = gradingState[sub._id] || { marks: '', feedback: '' };

                return (
                  <div
                    key={sub._id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={sub.student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={sub.student?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {sub.student?.name}
                          </h5>
                          <span className="text-[10px] text-slate-400">{sub.student?.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isLate && <Badge variant="danger" size="xs">Late Submission</Badge>}
                        <span className="text-[10px] text-slate-400">
                          {new Date(sub.submissionDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {sub.content && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                        {sub.content}
                      </p>
                    )}

                    {sub.fileUrl && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <a
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 dark:text-indigo-400 underline font-medium"
                        >
                          View Uploaded Solution ({sub.fileName || 'Solution.pdf'})
                        </a>
                      </div>
                    )}

                    {/* Grading Form Row */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                          Score (Max {selectedAssignment.maxMarks})
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={selectedAssignment.maxMarks}
                          value={currentGrade.marks}
                          onChange={(e) =>
                            setGradingState(prev => ({
                              ...prev,
                              [sub._id]: { ...prev[sub._id], marks: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          placeholder="e.g. 92"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                          Instructor Feedback
                        </label>
                        <input
                          type="text"
                          value={currentGrade.feedback}
                          onChange={(e) =>
                            setGradingState(prev => ({
                              ...prev,
                              [sub._id]: { ...prev[sub._id], feedback: e.target.value }
                            }))
                          }
                          className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          placeholder="Great architecture implementation..."
                        />
                      </div>

                      <div className="sm:col-span-1 sm:mt-4">
                        <Button
                          size="xs"
                          variant="primary"
                          className="w-full"
                          isLoading={savingGradeId === sub._id}
                          onClick={() => handleSaveGrade(sub._id)}
                          icon={Save}
                        >
                          Grade
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FacultyAssignments;
