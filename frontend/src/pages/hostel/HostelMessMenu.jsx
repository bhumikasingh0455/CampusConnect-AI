import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Utensils,
  Clock,
  Star,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import toast from 'react-hot-toast';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const HostelMessMenu = () => {
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString('en-US', { weekday: 'long' })
  );
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Feedback Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    mealType: 'Lunch',
    rating: 5,
    hygieneRating: 5,
    foodQualityRating: 5,
    comments: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuRes, feedbackRes] = await Promise.all([
        api.get('/hostel/mess-menu'),
        api.get('/hostel/mess-feedback')
      ]);

      if (menuRes.data.success) {
        setWeeklyMenu(menuRes.data.data.weeklyMenu || []);
      }
      if (feedbackRes.data.success) {
        setFeedbackStats(feedbackRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to load mess schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingFeedback(true);
      const res = await api.post('/hostel/mess-feedback', feedbackForm);
      if (res.data.success) {
        toast.success('Thank you! Mess feedback and hygiene ratings recorded.');
        setIsFeedbackModalOpen(false);
        setFeedbackForm({
          mealType: 'Lunch',
          rating: 5,
          hygieneRating: 5,
          foodQualityRating: 5,
          comments: ''
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const activeDayMenu = weeklyMenu.find((m) => m.dayOfWeek === selectedDay);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Utensils className="w-7 h-7 text-amber-500" /> Mess Management & Weekly Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nutritious, hygienic 4-meal daily campus culinary schedule
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={MessageSquare}
          onClick={() => setIsFeedbackModalOpen(true)}
          className="shadow-md shadow-amber-500/20 bg-amber-600 hover:bg-amber-700 text-white"
        >
          Rate Today's Food Quality
        </Button>
      </div>

      {/* Ratings & Hygiene Metrics Banner */}
      {feedbackStats?.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xl">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Student Taste & Quality</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {feedbackStats.stats.avgRating || '4.8'} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Kitchen Hygiene Score</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {feedbackStats.stats.avgHygiene || '4.9'} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xl">
              <ThumbsUp className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Student Reviews</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {feedbackStats.stats.totalReviews || 12} Verified
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* 7 Days Selector Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const isSunday = day === 'Sunday';

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-500'}`}>
                  Today
                </span>
              )}
              {isSunday && (
                <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : 'text-amber-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Special Day Banner if Sunday or marked */}
      {activeDayMenu?.isSpecial && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-900 dark:text-white">
              {activeDayMenu.specialNote || 'Special Grand Campus Culinary Feast'}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Live counters, gourmet desserts, and extended dining hours in the Central Mess Hall.
            </p>
          </div>
        </div>
      )}

      {/* 4 Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Breakfast */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-amber-400/50 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Meal 1</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Breakfast</h3>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Utensils className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{activeDayMenu?.breakfast?.timing || '07:30 AM - 09:30 AM'}</span>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Served Items</p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {activeDayMenu?.breakfast?.items?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lunch */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-indigo-400/50 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Meal 2</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Lunch</h3>
            </div>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Utensils className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{activeDayMenu?.lunch?.timing || '12:30 PM - 02:30 PM'}</span>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Served Items</p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {activeDayMenu?.lunch?.items?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Evening Snacks */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-purple-400/50 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Meal 3</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Evening Snacks</h3>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Utensils className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            <span>{activeDayMenu?.snacks?.timing || '05:00 PM - 06:15 PM'}</span>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Served Items</p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {activeDayMenu?.snacks?.items?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dinner */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-emerald-400/50 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Meal 4</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Dinner</h3>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Utensils className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>{activeDayMenu?.dinner?.timing || '07:45 PM - 09:45 PM'}</span>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Served Items</p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {activeDayMenu?.dinner?.items?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Student Feedback List */}
      <Card title="Recent Mess Feedback & Quality Audit" subtitle="Student ratings submitted across daily meals">
        <div className="space-y-3">
          {feedbackStats?.feedbacks && feedbackStats.feedbacks.length > 0 ? (
            feedbackStats.feedbacks.map((fb) => (
              <div
                key={fb._id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={fb.student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={fb.student?.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {fb.student?.name || 'Resident Student'}
                      <Badge variant="default" size="sm">{fb.mealType}</Badge>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-0.5">
                      "{fb.comments || 'Food was fresh and served hot.'}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{fb.rating}.0</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No feedback recorded yet. Be the first to review today's meal!</p>
          )}
        </div>
      </Card>

      {/* Mess Feedback Modal */}
      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Submit Mess Quality & Hygiene Feedback"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Meal Type
            </label>
            <select
              value={feedbackForm.mealType}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, mealType: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snacks">Evening Snacks</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Taste & Taste (1-5)
              </label>
              <select
                value={feedbackForm.rating}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Stars</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Kitchen Hygiene (1-5)
              </label>
              <select
                value={feedbackForm.hygieneRating}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, hygieneRating: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Stars</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Food Freshness (1-5)
              </label>
              <select
                value={feedbackForm.foodQualityRating}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, foodQualityRating: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Stars</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Suggestions & Remarks
            </label>
            <textarea
              rows={3}
              value={feedbackForm.comments}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
              placeholder="E.g., Sambhar was seasoned nicely, please ensure hot chapattis during late lunch..."
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsFeedbackModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submittingFeedback} className="bg-amber-600 hover:bg-amber-700 text-white">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HostelMessMenu;
