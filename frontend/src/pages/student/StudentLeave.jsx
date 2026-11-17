import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { ClipboardList, Plus, Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentLeave = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: 'Medical',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves/my-leaves');
      if (res.data.success) {
        setLeaves(res.data.data.leaves);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/leaves/apply', formData);
      if (res.data.success) {
        toast.success('Leave application submitted!');
        setIsApplyModalOpen(false);
        setFormData({ leaveType: 'Medical', startDate: '', endDate: '', reason: '' });
        fetchLeaves();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} height="h-28" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Leave Request Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit medical or academic leave requests and monitor faculty approvals
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsApplyModalOpen(true)}
        >
          Apply for Leave
        </Button>
      </div>

      {leaves.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No leave requests found"
          description="You have not submitted any leave applications this semester."
          actionText="Apply for Leave"
          onAction={() => setIsApplyModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {leaves.map((leave) => {
            const statusVariants = {
              approved: 'success',
              pending: 'warning',
              rejected: 'danger'
            };

            return (
              <Card key={leave._id} className="hover:border-indigo-400/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariants[leave.status] || 'default'} size="xs">
                        {leave.status}
                      </Badge>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {leave.leaveType} Leave
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {new Date(leave.startDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} —{' '}
                      {new Date(leave.endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                      "{leave.reason}"
                    </p>
                    {leave.reviewRemarks && (
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic pt-1">
                        Faculty Remarks: "{leave.reviewRemarks}" (Reviewed by {leave.reviewedBy?.name || 'Department Faculty'})
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    Applied on {new Date(leave.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Campus Leave"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Leave Category
            </label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Medical">Medical Leave (Doctor Certificate)</option>
              <option value="Casual">Casual / Personal Emergency</option>
              <option value="Academic">Academic / Hackathon Representation</option>
              <option value="Duty">On-Duty University Representation</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason / Justification
            </label>
            <textarea
              rows={3}
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="State clear reason for absence and emergency contact..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentLeave;
