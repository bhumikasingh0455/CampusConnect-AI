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
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  UserCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const HostelLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    departureDate: '',
    expectedReturnDate: '',
    destination: '',
    reason: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: 'Parent',
    parentConsentConfirmed: true
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hostel/leaves/my');
      if (res.data.success) {
        setLeaves(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!formData.departureDate || !formData.expectedReturnDate) {
      toast.error('Please select both departure and return dates/times.');
      return;
    }

    if (new Date(formData.departureDate) >= new Date(formData.expectedReturnDate)) {
      toast.error('Expected return date must be strictly after departure date.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        departureDate: formData.departureDate,
        expectedReturnDate: formData.expectedReturnDate,
        destination: formData.destination,
        reason: formData.reason,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        },
        parentConsentConfirmed: formData.parentConsentConfirmed
      };

      const res = await api.post('/hostel/leaves/apply', payload);
      if (res.data.success) {
        toast.success('Hostel leave application submitted for Warden approval.');
        setIsApplyModalOpen(false);
        setFormData({
          departureDate: '',
          expectedReturnDate: '',
          destination: '',
          reason: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyContactRelationship: 'Parent',
          parentConsentConfirmed: true
        });
        fetchLeaves();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this pending leave request?')) return;
    try {
      const res = await api.put(`/hostel/leaves/${leaveId}/cancel`);
      if (res.data.success) {
        toast.success('Leave application cancelled.');
        fetchLeaves();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel leave');
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
            <CalendarDays className="w-7 h-7 text-indigo-600" /> Hostel Leave & Outstation Passes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Digital night-out and vacation gate clearance management
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setIsApplyModalOpen(true)}
          className="shadow-md shadow-indigo-600/20"
        >
          Apply for Leave
        </Button>
      </div>

      {/* Guidelines info card */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">Hostel Outstation Leave Protocol:</p>
          <p>
            • Leave requests for out-of-station travel must be applied at least 24 hours prior to departure.
          </p>
          <p>
            • Once approved by the Warden, your digital QR gate pass will be automatically authorized for exit and entry.
          </p>
        </div>
      </div>

      {/* Leave Applications List */}
      <Card title="My Leave History & Status" subtitle="All pending and archived residential leave requests">
        {loading ? (
          <LoadingSkeleton type="table" />
        ) : leaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Destination & Reason</th>
                  <th className="py-3 px-4">Departure</th>
                  <th className="py-3 px-4">Expected Return</th>
                  <th className="py-3 px-4">Emergency Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Warden Remarks</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span>{leave.destination}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{leave.reason}</p>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                      {new Date(leave.departureDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                      {new Date(leave.expectedReturnDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                      {leave.emergencyContact?.name ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{leave.emergencyContact.name}</p>
                          <p className="text-slate-400">{leave.emergencyContact.phone}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">On file</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={statusVariant[leave.status] || 'default'} size="sm">
                        {leave.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-[11px] max-w-xs">
                      {leave.reviewRemarks ? (
                        <span className="italic text-slate-600 dark:text-slate-300">"{leave.reviewRemarks}"</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {leave.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handleCancelLeave(leave._id)}
                          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Leave Applications"
            description="You have not submitted any outstation or vacation hostel leave applications."
            actionLabel="Apply for Leave"
            onAction={() => setIsApplyModalOpen(true)}
          />
        )}
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Hostel Outstation Leave"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Departure Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Return Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.expectedReturnDate}
                onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Destination City & Address *
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="E.g., San Francisco, CA / Home address"
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose / Reason for Leave *
            </label>
            <textarea
              rows={2}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="E.g., Attending National Collegiate Hackathon finals..."
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Emergency Contact Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Robert Rivera"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Emergency Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="+1 (555) 016-5521"
                  className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="parentConsent"
              checked={formData.parentConsentConfirmed}
              onChange={(e) => setFormData({ ...formData, parentConsentConfirmed: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="parentConsent" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              I certify that parent/guardian consent has been obtained for this leave.
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HostelLeaves;
