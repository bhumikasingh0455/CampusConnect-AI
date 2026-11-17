import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  UserCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const WardenLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Overdue'

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decision, setDecision] = useState('Approved');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      let query = '';
      if (activeTab === 'Pending') query = '?status=Pending';
      if (activeTab === 'Approved') query = '?status=Approved';
      if (activeTab === 'Overdue') query = '?overdue=true';

      const res = await api.get(`/hostel/leaves/warden${query}`);
      if (res.data.success) {
        setLeaves(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load leave applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [activeTab]);

  const openReviewModal = (leave, initialDecision = 'Approved') => {
    setSelectedLeave(leave);
    setDecision(initialDecision);
    setReviewRemarks(initialDecision === 'Approved' ? 'Approved by Chief Warden' : 'Leave rejected due to academic timetable');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    try {
      setSubmittingReview(true);
      const res = await api.put(`/hostel/leaves/${selectedLeave._id}/review`, {
        status: decision,
        remarks: reviewRemarks
      });
      if (res.data.success) {
        toast.success(`Leave application marked as ${decision}. Notification dispatched to student.`);
        setReviewModalOpen(false);
        setSelectedLeave(null);
        fetchLeaves();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMarkReturned = async (leaveId) => {
    try {
      const res = await api.put(`/hostel/leaves/${leaveId}/returned`);
      if (res.data.success) {
        toast.success('Student marked as safely returned. Gate movement recorded.');
        fetchLeaves();
      }
    } catch (err) {
      toast.error('Failed to mark returned');
    }
  };

  const statusVariant = {
    Approved: 'success',
    Pending: 'warning',
    Rejected: 'danger',
    Cancelled: 'default',
    Returned: 'primary'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-amber-500" /> Outstation Leave Verification & Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authorize night-out passes, monitor overdue returns, and log resident re-entry
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All', 'Pending', 'Approved', 'Overdue'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab === 'Overdue' ? '⚠️ Overdue Returns' : `${tab} Requests`}
          </button>
        ))}
      </div>

      {/* Leaves Table */}
      <Card title={`${activeTab} Leave Applications (${leaves.length})`} subtitle="Server-verified departures and returns">
        {loading ? (
          <LoadingSkeleton type="table" />
        ) : leaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student & Room</th>
                  <th className="py-3 px-4">Destination & Reason</th>
                  <th className="py-3 px-4">Departure</th>
                  <th className="py-3 px-4">Expected Return</th>
                  <th className="py-3 px-4">Emergency Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaves.map((leave) => {
                  const student = leave.student;
                  const room = leave.room;

                  return (
                    <tr
                      key={leave._id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                        leave.isOverdue ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={student?.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-300"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{student?.name}</p>
                            <p className="text-[11px] text-slate-400">Room {room?.roomNumber || '204'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                          <span className="truncate">{leave.destination}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{leave.reason}</p>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        {new Date(leave.departureDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        <div>
                          {new Date(leave.expectedReturnDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          {leave.isOverdue && (
                            <span className="block text-[10px] font-bold text-rose-500 uppercase">
                              ⚠️ OVERDUE
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {leave.emergencyContact?.name || 'Guardian'}
                        </p>
                        <p className="text-slate-400">{leave.emergencyContact?.phone || '+1 555-016-5521'}</p>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant={statusVariant[leave.status] || 'default'} size="sm">
                          {leave.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        {leave.status === 'Pending' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => openReviewModal(leave, 'Approved')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2 py-1"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openReviewModal(leave, 'Rejected')}
                              className="text-rose-600 border-rose-300 text-[11px] px-2 py-1"
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {leave.status === 'Approved' && !leave.actualReturnDate && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkReturned(leave._id)}
                            className="text-indigo-600 text-[11px] px-2 py-1"
                          >
                            Mark Returned
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Leave Records Found"
            description={`No leaves currently match the '${activeTab}' tab filter.`}
          />
        )}
      </Card>

      {/* Review Decision Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Review Outstation Leave: ${selectedLeave?.student?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
            <p><strong>Destination:</strong> {selectedLeave?.destination}</p>
            <p><strong>Reason:</strong> "{selectedLeave?.reason}"</p>
            <p>
              <strong>Dates:</strong> {selectedLeave && new Date(selectedLeave.departureDate).toLocaleDateString()} to {selectedLeave && new Date(selectedLeave.expectedReturnDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Decision *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-600">
                <input
                  type="radio"
                  name="decision"
                  value="Approved"
                  checked={decision === 'Approved'}
                  onChange={() => setDecision('Approved')}
                />
                Approve Leave
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-600">
                <input
                  type="radio"
                  name="decision"
                  value="Rejected"
                  checked={decision === 'Rejected'}
                  onChange={() => setDecision('Rejected')}
                />
                Reject Leave
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Warden Remarks & Special Instructions
            </label>
            <textarea
              rows={3}
              value={reviewRemarks}
              onChange={(e) => setReviewRemarks(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={submittingReview}
              className={decision === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}
            >
              Submit {decision}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WardenLeaves;
