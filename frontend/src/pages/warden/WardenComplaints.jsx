import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  UserCheck,
  Star,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const WardenComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Update Modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: 'In Progress',
    staffName: '',
    staffPhone: '',
    resolutionNotes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let query = [];
      if (statusFilter) query.push(`status=${statusFilter}`);
      if (categoryFilter) query.push(`category=${categoryFilter}`);
      const qs = query.length > 0 ? `?${query.join('&')}` : '';

      const res = await api.get(`/hostel/complaints/all${qs}`);
      if (res.data.success) {
        setComplaints(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const openUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateForm({
      status: ticket.status || 'In Progress',
      staffName: ticket.assignedStaff?.name || '',
      staffPhone: ticket.assignedStaff?.phone || '',
      resolutionNotes: ticket.resolutionNotes || ''
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      setSubmitting(true);
      const res = await api.put(`/hostel/complaints/${selectedTicket._id}/status`, updateForm);
      if (res.data.success) {
        toast.success(`Ticket status updated to '${updateForm.status}'.`);
        setUpdateModalOpen(false);
        setSelectedTicket(null);
        fetchComplaints();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const statusVariant = {
    Submitted: 'default',
    Assigned: 'warning',
    'In Progress': 'primary',
    Resolved: 'success',
    Closed: 'default'
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-rose-500" /> Maintenance & Repair Operations Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dispatch technicians, assign repair staff, and audit resident satisfaction ratings
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted (Unassigned)</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Wi-Fi">Wi-Fi / Internet</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Washroom">Washroom</option>
            <option value="Furniture">Furniture</option>
            <option value="Mess/Food">Mess / Food</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Total {complaints.length} tickets
        </span>
      </div>

      {/* Complaints Table */}
      <Card title="Maintenance Work Orders" subtitle="Live tracking across residential blocks">
        {loading ? (
          <LoadingSkeleton type="table" />
        ) : complaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket & Category</th>
                  <th className="py-3 px-4">Student & Room</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Student Rating</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{c.title}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mt-0.5">
                        {c.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900 dark:text-white">{c.student?.name}</p>
                      <p className="text-[11px] text-slate-400">Room {c.room?.roomNumber}</p>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          c.priority === 'Urgent'
                            ? 'danger'
                            : c.priority === 'High'
                            ? 'warning'
                            : 'default'
                        }
                        size="sm"
                      >
                        {c.priority}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                      {c.assignedStaff?.name ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{c.assignedStaff.name}</p>
                          <p className="text-slate-400">{c.assignedStaff.phone}</p>
                        </div>
                      ) : (
                        <span className="text-amber-500 font-semibold">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={statusVariant[c.status] || 'default'} size="sm">
                        {c.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {c.studentRating ? (
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {c.studentRating}.0
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openUpdateModal(c)}
                        className="text-[11px] px-2.5 py-1"
                      >
                        Update Ticket
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Maintenance Tickets"
            description="No tickets currently match the selected filters."
          />
        )}
      </Card>

      {/* Update Modal */}
      <Modal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title={`Update Maintenance Ticket: ${selectedTicket?.title}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ticket Status *
            </label>
            <select
              value={updateForm.status}
              onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
            >
              <option value="Assigned">Assigned to Technician</option>
              <option value="In Progress">In Progress (Work Underway)</option>
              <option value="Resolved">Resolved (Repair Tested)</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Technician / Staff Name
              </label>
              <input
                type="text"
                value={updateForm.staffName}
                onChange={(e) => setUpdateForm({ ...updateForm, staffName: e.target.value })}
                placeholder="Rajesh Sharma"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Technician Phone Number
              </label>
              <input
                type="tel"
                value={updateForm.staffPhone}
                onChange={(e) => setUpdateForm({ ...updateForm, staffPhone: e.target.value })}
                placeholder="+1 555-012-4499"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Resolution Notes & Technician Findings
            </label>
            <textarea
              rows={3}
              value={updateForm.resolutionNotes}
              onChange={(e) => setUpdateForm({ ...updateForm, resolutionNotes: e.target.value })}
              placeholder="E.g., Replaced optical fiber patch cable. Wi-Fi signal restored to 120 Mbps..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WardenComplaints;
