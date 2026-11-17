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
  Upload,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Award,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentAssignments = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (submissionFile) {
        formData.append('file', submissionFile);
      }
      formData.append('content', submissionContent);

      const res = await api.post(`/assignments/${selectedAssignment._id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Assignment submitted successfully!');
        setIsSubmitModalOpen(false);
        setSubmissionContent('');
        setSubmissionFile(null);
        fetchAssignments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Assignments & Coursework
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Submit lab reports, track deadlines, and view faculty marks & feedback
        </p>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No assignments assigned"
          description="Your instructors have not published any assignments for this semester."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((asg) => {
            const isSubmitted = asg.isSubmitted;
            const submission = asg.mySubmission;
            const isOverdue = asg.isOverdue;

            return (
              <Card
                key={asg._id}
                className={`flex flex-col justify-between ${
                  isOverdue ? 'border-rose-300 dark:border-rose-900/60' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={isSubmitted ? 'success' : isOverdue ? 'danger' : 'warning'}>
                      {isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Action Required'}
                    </Badge>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Due {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {asg.title}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                      {asg.subject?.name} ({asg.subject?.code})
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {asg.description}
                    </p>
                  </div>

                  {asg.attachment?.url && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="text-xs text-slate-700 dark:text-slate-300 truncate">
                          {asg.attachment.fileName || 'Assignment_Brief.pdf'}
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                        Attachment
                      </span>
                    </div>
                  )}

                  {/* If Graded: Show Marks and Faculty Feedback */}
                  {submission?.status === 'graded' && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <Award className="w-4 h-4 text-emerald-600" />
                          Graded: {submission.marksObtained} / {asg.maxMarks}
                        </span>
                        <Badge variant="success" size="xs">Evaluated</Badge>
                      </div>
                      {submission.feedback && (
                        <p className="text-xs text-emerald-900 dark:text-emerald-200 italic mt-1">
                          "{submission.feedback}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Max Marks: <strong className="text-slate-700 dark:text-slate-300">{asg.maxMarks}</strong>
                  </span>
                  <Button
                    variant={isSubmitted ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => {
                      setSelectedAssignment(asg);
                      setIsSubmitModalOpen(true);
                    }}
                  >
                    {isSubmitted ? 'Update Submission' : 'Submit Solution'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Submit: ${selectedAssignment?.title || 'Assignment'}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmitAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Upload Report / Code File (PDF, DOCX, ZIP)
            </label>
            <input
              type="file"
              onChange={(e) => setSubmissionFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-300 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Submission Comments / Implementation Summary
            </label>
            <textarea
              rows={4}
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              placeholder="Detail your methodology, architecture decisions, and links to github repo if required..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting} icon={Upload}>
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentAssignments;
