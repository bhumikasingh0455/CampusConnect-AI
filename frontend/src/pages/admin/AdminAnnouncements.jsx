import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Bell, Plus, Pin, Trash2, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAnnouncements = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'normal',
    targetAudience: 'all',
    isPinned: false
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data.announcements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/announcements', {
        ...formData,
        targetAudience: [formData.targetAudience]
      });
      toast.success('Campus announcement published and broadcast!');
      setIsModalOpen(false);
      setFormData({
        title: '',
        content: '',
        category: 'General',
        priority: 'normal',
        targetAudience: 'all',
        isPinned: false
      });
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      toast.success('Announcement removed');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to delete');
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
            Campus Announcements & Notices
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Broadcast official administrative communications to students, faculty, and parents
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Post Notice
        </Button>
      </div>

      <div className="space-y-3">
        {announcements.map((ann) => (
          <Card key={ann._id} className={ann.isPinned ? 'border-indigo-400/50 bg-indigo-50/20 dark:bg-indigo-950/10' : ''}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.isPinned && (
                    <Badge variant="purple" size="xs">
                      <Pin className="w-3 h-3 mr-0.5" /> Pinned
                    </Badge>
                  )}
                  <Badge
                    variant={
                      ann.priority === 'urgent'
                        ? 'danger'
                        : ann.priority === 'high'
                        ? 'warning'
                        : 'primary'
                    }
                    size="xs"
                  >
                    {ann.priority} Priority
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Audience: {ann.targetAudience?.join(', ') || 'All'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                  {ann.content}
                </p>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Author: {ann.author?.name || 'Administrator'}</span>
                  <span>•</span>
                  <span>{new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(ann._id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Post Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Campus Notice"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Headline</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. End-Semester Examination Schedule & Guidelines"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Audience</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">Everyone</option>
                <option value="student">Students Only</option>
                <option value="faculty">Faculty Only</option>
                <option value="parent">Parents Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="General">General</option>
                <option value="Examination">Examination</option>
                <option value="Event">Event</option>
                <option value="Placement">Placement</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Body</label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Provide complete notice details and official instructions..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Pin this announcement to top of dashboard feed</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" isLoading={submitting}>Publish Broadcast</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAnnouncements;
