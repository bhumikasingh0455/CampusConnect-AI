import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  AlertTriangle,
  PlusCircle,
  Clock,
  CheckCircle2,
  Wrench,
  Wifi,
  Droplets,
  Zap,
  Phone,
  Star,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  'Electricity',
  'Water Supply',
  'Wi-Fi',
  'Room Cleaning',
  'Washroom',
  'Furniture',
  'Plumbing',
  'Security',
  'Mess/Food',
  'Other'
];

const HostelComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Complaint Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newForm, setNewForm] = useState({
    category: 'Wi-Fi',
    title: '',
    description: '',
    priority: 'Medium'
  });

  // Rating Modal
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingData, setRatingData] = useState({ rating: 5, feedback: '' });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hostel/complaints/my');
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
  }, []);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!newForm.title.trim() || !newForm.description.trim()) {
      toast.error('Please enter complaint title and description.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/hostel/complaints', newForm);
      if (res.data.success) {
        toast.success('Complaint ticket registered with Hostel Maintenance desk.');
        setIsNewModalOpen(false);
        setNewForm({ category: 'Wi-Fi', title: '', description: '', priority: 'Medium' });
        fetchComplaints();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setSubmittingRating(true);
      const res = await api.put(`/hostel/complaints/${selectedComplaint._id}/rate`, ratingData);
      if (res.data.success) {
        toast.success('Thank you for rating maintenance service!');
        setRatingModalOpen(false);
        setSelectedComplaint(null);
        fetchComplaints();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
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
            <Wrench className="w-7 h-7 text-rose-500" /> Maintenance & Complaint Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track room repairs, Wi-Fi connectivity, sanitation, and electrical tickets
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setIsNewModalOpen(true)}
          className="shadow-md shadow-rose-500/20 bg-rose-600 hover:bg-rose-700 text-white"
        >
          Raise Complaint
        </Button>
      </div>

      {/* Complaints List */}
      <Card title="My Maintenance Tickets" subtitle="Real-time status updates and technician assignments">
        {loading ? (
          <LoadingSkeleton type="table" />
        ) : complaints.length > 0 ? (
          <div className="space-y-3.5">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{c.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" size="sm">{c.category}</Badge>
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
                          {c.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[c.status] || 'default'} size="md">
                      {c.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  {c.description}
                </p>

                {/* Assigned staff & resolution notes */}
                {(c.assignedStaff?.name || c.resolutionNotes) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {c.assignedStaff?.name && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Wrench className="w-3.5 h-3.5 text-indigo-500" />
                        <span><strong>Staff:</strong> {c.assignedStaff.name} ({c.assignedStaff.phone})</span>
                      </div>
                    )}
                    {c.resolutionNotes && (
                      <div className="text-slate-600 dark:text-slate-300">
                        <strong>Resolution Note:</strong> "{c.resolutionNotes}"
                      </div>
                    )}
                  </div>
                )}

                {/* Footer: Date & Rate Button */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span>Submitted on {new Date(c.createdAt).toLocaleDateString()}</span>

                  {c.status === 'Resolved' && !c.studentRating && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Star}
                      onClick={() => {
                        setSelectedComplaint(c);
                        setRatingModalOpen(true);
                      }}
                      className="text-amber-500 border-amber-500/40 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                    >
                      Rate Resolution
                    </Button>
                  )}

                  {c.studentRating && (
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Rated {c.studentRating}.0 / 5.0</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Maintenance Complaints"
            description="All hostel amenities in your room and floor are currently operating smoothly."
            actionLabel="Raise a Ticket"
            onAction={() => setIsNewModalOpen(true)}
          />
        )}
      </Card>

      {/* New Complaint Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Raise Maintenance Ticket"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateComplaint} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Complaint Category *
            </label>
            <select
              value={newForm.category}
              onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              value={newForm.title}
              onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
              placeholder="E.g., Washroom faucet leaking / Wi-Fi disconnected"
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priority Urgency
            </label>
            <select
              value={newForm.priority}
              onChange={(e) => setNewForm({ ...newForm, priority: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Low">Low (General cosmetic observation)</option>
              <option value="Medium">Medium (Affecting study/routine within 48h)</option>
              <option value="High">High (Immediate utility disruption)</option>
              <option value="Urgent">Urgent (Safety / flooding / power outage)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              value={newForm.description}
              onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              placeholder="Describe what happened, floor location, and when it began..."
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submitting} className="bg-rose-600 hover:bg-rose-700 text-white">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rate Resolution Modal */}
      <Modal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        title="Rate Maintenance Resolution"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRateSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Ticket: <strong>{selectedComplaint?.title}</strong>
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Resolution Satisfaction (1-5 Stars)
            </label>
            <select
              value={ratingData.rating}
              onChange={(e) => setRatingData({ ...ratingData, rating: Number(e.target.value) })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
            >
              <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent & Prompt</option>
              <option value="4">⭐⭐⭐⭐ 4 - Good Work</option>
              <option value="3">⭐⭐⭐ 3 - Satisfactory</option>
              <option value="2">⭐⭐ 2 - Poor Service</option>
              <option value="1">⭐ 1 - Unsatisfactory</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Feedback Remarks (Optional)
            </label>
            <textarea
              rows={3}
              value={ratingData.feedback}
              onChange={(e) => setRatingData({ ...ratingData, feedback: e.target.value })}
              placeholder="Technician was punctual and cleaned up after repair..."
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setRatingModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submittingRating} className="bg-amber-600 hover:bg-amber-700 text-white">
              Submit Rating
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HostelComplaints;
