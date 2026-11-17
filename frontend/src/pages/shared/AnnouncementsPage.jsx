import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Bell, Pin, Filter, Calendar, Megaphone, Download } from 'lucide-react';

const AnnouncementsPage = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');

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

  const categories = ['all', 'Examination', 'Academic', 'Placement', 'Event', 'General'];

  const filtered = announcements.filter(a => {
    if (categoryFilter === 'all') return true;
    return a.category === categoryFilter;
  });

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
            Campus Announcements & Bulletins
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official institutional notices, examination dates, placement drives, and academic schedules
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === c
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices found"
          description="There are currently no announcements matching the selected category."
        />
      ) : (
        <div className="space-y-3.5">
          {filtered.map(ann => {
            const isPinned = ann.isPinned;
            const priorityVariants = {
              urgent: 'danger',
              high: 'warning',
              normal: 'primary',
              low: 'default'
            };

            return (
              <Card
                key={ann._id}
                className={
                  isPinned
                    ? 'border-indigo-400/60 bg-gradient-to-r from-indigo-50/20 to-purple-50/20 dark:from-indigo-950/20 dark:to-purple-950/20 shadow-md'
                    : ''
                }
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isPinned && (
                        <Badge variant="purple" size="xs">
                          <Pin className="w-3 h-3 mr-0.5" /> Pinned Bulletin
                        </Badge>
                      )}
                      <Badge variant={priorityVariants[ann.priority] || 'default'} size="xs">
                        {ann.priority} Priority
                      </Badge>
                      <Badge variant="primary" size="xs">
                        {ann.category || 'General'}
                      </Badge>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Published by: {ann.author?.name || 'Academic Registrar Office'}</span>
                    <span className="font-mono uppercase text-[10px]">Target: {ann.targetAudience?.join(', ') || 'Campus'}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
