import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { ClipboardList, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyLeaves = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leaves/all');
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

  const handleReview = async (status) => {
    if (!selectedLeave) return;
    setReviewing(true);
    try {
      const res = await api.put(`/leaves/${selectedLeave._id}/review`, {
        status,
        reviewRemarks
      });
      if (res.data.success) {
        toast.success(`Leave request ${status}!`);
        setSelectedLeave(null);
        setReviewRemarks('');
        fetchLeaves();
      }
    } catch (err) {
      toast.error('Failed to review leave');
    } finally {
      setReviewing(false);
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Student Leave Applications
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review medical, academic, and duty leave requests submitted by students
        </p>
      </div>

      {leaves.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No pending leave applications"
          description="There are currently no student leave requests requiring review."
        />
      ) : (
        <div className="space-y-3">
          {leaves.map((l) => (
            <Card key={l._id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        l.status === 'approved'
                          ? 'success'
                          : l.status === 'rejected'
                          ? 'danger'
                          : 'warning'
                      }
                      size="xs"
                    >
                      {l.status}
                    </Badge>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {l.applicant?.name} ({l.leaveType} Leave)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Duration: {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    "{l.reason}"
                  </p>
                  {l.reviewRemarks && (
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic">
                      Remarks: "{l.reviewRemarks}" (Reviewed by {l.reviewedBy?.name || 'Faculty'})
                    </p>
                  )}
                </div>

                {l.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedLeave(l)}
                  >
                    Review Request
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        title={`Review Leave: ${selectedLeave?.applicant?.name}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 text-xs">
            <p><strong>Category:</strong> {selectedLeave?.leaveType}</p>
            <p><strong>Dates:</strong> {new Date(selectedLeave?.startDate).toLocaleDateString()} — {new Date(selectedLeave?.endDate).toLocaleDateString()}</p>
            <p><strong>Reason:</strong> {selectedLeave?.reason}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Remarks / Justification
            </label>
            <textarea
              rows={3}
              value={reviewRemarks}
              onChange={(e) => setReviewRemarks(e.target.value)}
              placeholder="e.g. Approved. Medical certificate verified by campus clinic."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="danger"
              size="sm"
              isLoading={reviewing}
              onClick={() => handleReview('rejected')}
              icon={XCircle}
            >
              Reject
            </Button>
            <Button
              variant="success"
              size="sm"
              isLoading={reviewing}
              onClick={() => handleReview('approved')}
              icon={CheckCircle}
            >
              Approve
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FacultyLeaves;
