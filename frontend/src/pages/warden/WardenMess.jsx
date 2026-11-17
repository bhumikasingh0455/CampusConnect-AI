import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Utensils,
  Clock,
  Save,
  Star,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WardenMess = () => {
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State for active day
  const [menuForm, setMenuForm] = useState({
    breakfastTiming: '07:30 AM - 09:30 AM',
    breakfastItems: '',
    lunchTiming: '12:30 PM - 02:30 PM',
    lunchItems: '',
    snacksTiming: '05:00 PM - 06:15 PM',
    snacksItems: '',
    dinnerTiming: '07:45 PM - 09:45 PM',
    dinnerItems: '',
    isSpecial: false,
    specialNote: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hostelsRes, menuRes] = await Promise.all([
        api.get('/hostel/hostels'),
        api.get(`/hostel/mess-menu${selectedHostel ? `?hostelId=${selectedHostel}` : ''}`)
      ]);

      if (hostelsRes.data.success) {
        setHostels(hostelsRes.data.data || []);
        if (!selectedHostel && hostelsRes.data.data?.length > 0) {
          setSelectedHostel(hostelsRes.data.data[0]._id);
        }
      }

      if (menuRes.data.success) {
        const menus = menuRes.data.data.weeklyMenu || [];
        setWeeklyMenu(menus);
        loadDayIntoForm(selectedDay, menus);
      }
    } catch (err) {
      toast.error('Failed to load mess data');
    } finally {
      setLoading(false);
    }
  };

  const loadDayIntoForm = (day, menus) => {
    const target = menus.find((m) => m.dayOfWeek === day);
    if (target) {
      setMenuForm({
        breakfastTiming: target.breakfast?.timing || '07:30 AM - 09:30 AM',
        breakfastItems: target.breakfast?.items?.join(', ') || '',
        lunchTiming: target.lunch?.timing || '12:30 PM - 02:30 PM',
        lunchItems: target.lunch?.items?.join(', ') || '',
        snacksTiming: target.snacks?.timing || '05:00 PM - 06:15 PM',
        snacksItems: target.snacks?.items?.join(', ') || '',
        dinnerTiming: target.dinner?.timing || '07:45 PM - 09:45 PM',
        dinnerItems: target.dinner?.items?.join(', ') || '',
        isSpecial: Boolean(target.isSpecial),
        specialNote: target.specialNote || ''
      });
    } else {
      setMenuForm({
        breakfastTiming: '07:30 AM - 09:30 AM',
        breakfastItems: '',
        lunchTiming: '12:30 PM - 02:30 PM',
        lunchItems: '',
        snacksTiming: '05:00 PM - 06:15 PM',
        snacksItems: '',
        dinnerTiming: '07:45 PM - 09:45 PM',
        dinnerItems: '',
        isSpecial: false,
        specialNote: ''
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedHostel]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    loadDayIntoForm(day, weeklyMenu);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (!selectedHostel) {
      toast.error('Please select a target hostel.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        hostel: selectedHostel,
        dayOfWeek: selectedDay,
        breakfast: {
          timing: menuForm.breakfastTiming,
          items: menuForm.breakfastItems.split(',').map((s) => s.trim()).filter(Boolean)
        },
        lunch: {
          timing: menuForm.lunchTiming,
          items: menuForm.lunchItems.split(',').map((s) => s.trim()).filter(Boolean)
        },
        snacks: {
          timing: menuForm.snacksTiming,
          items: menuForm.snacksItems.split(',').map((s) => s.trim()).filter(Boolean)
        },
        dinner: {
          timing: menuForm.dinnerTiming,
          items: menuForm.dinnerItems.split(',').map((s) => s.trim()).filter(Boolean)
        },
        isSpecial: menuForm.isSpecial,
        specialNote: menuForm.specialNote
      };

      const res = await api.put('/hostel/mess-menu', payload);
      if (res.data.success) {
        toast.success(`Mess menu for ${selectedDay} saved and broadcasted!`);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save mess menu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Utensils className="w-7 h-7 text-amber-500" /> Mess Management & Weekly Menu Editor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure daily breakfast, lunch, snacks, and dinner schedules across campus dining halls
          </p>
        </div>

        {hostels.length > 0 && (
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            {hostels.map((h) => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => handleDaySelect(day)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedDay === day
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Menu Form */}
      <Card title={`Edit Dining Schedule: ${selectedDay}`} subtitle="Changes update live on all student portals">
        <form onSubmit={handleSaveMenu} className="space-y-6 text-xs">
          {/* Breakfast & Lunch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Breakfast */}
            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-700 dark:text-amber-400 uppercase text-xs">Breakfast</span>
                <input
                  type="text"
                  value={menuForm.breakfastTiming}
                  onChange={(e) => setMenuForm({ ...menuForm, breakfastTiming: e.target.value })}
                  placeholder="07:30 AM - 09:30 AM"
                  className="text-[11px] rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 px-2 py-1 w-40 text-right"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Menu Items (Comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={menuForm.breakfastItems}
                  onChange={(e) => setMenuForm({ ...menuForm, breakfastItems: e.target.value })}
                  placeholder="Masala Dosa, Sambar, Coconut Chutney, Boiled Eggs, Tea, Fresh Fruits"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Lunch */}
            <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase text-xs">Lunch</span>
                <input
                  type="text"
                  value={menuForm.lunchTiming}
                  onChange={(e) => setMenuForm({ ...menuForm, lunchTiming: e.target.value })}
                  placeholder="12:30 PM - 02:30 PM"
                  className="text-[11px] rounded-lg border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 px-2 py-1 w-40 text-right"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Menu Items (Comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={menuForm.lunchItems}
                  onChange={(e) => setMenuForm({ ...menuForm, lunchItems: e.target.value })}
                  placeholder="Paneer Butter Masala, Dal Tadka, Jeera Rice, Tawa Roti, Salad"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Snacks & Dinner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Snacks */}
            <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-700 dark:text-purple-400 uppercase text-xs">Evening Snacks</span>
                <input
                  type="text"
                  value={menuForm.snacksTiming}
                  onChange={(e) => setMenuForm({ ...menuForm, snacksTiming: e.target.value })}
                  placeholder="05:00 PM - 06:15 PM"
                  className="text-[11px] rounded-lg border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 px-2 py-1 w-40 text-right"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Menu Items (Comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={menuForm.snacksItems}
                  onChange={(e) => setMenuForm({ ...menuForm, snacksItems: e.target.value })}
                  placeholder="Crispy Samosa, Mint Chutney, Masala Chai"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Dinner */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-xs">Dinner</span>
                <input
                  type="text"
                  value={menuForm.dinnerTiming}
                  onChange={(e) => setMenuForm({ ...menuForm, dinnerTiming: e.target.value })}
                  placeholder="07:45 PM - 09:45 PM"
                  className="text-[11px] rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 px-2 py-1 w-40 text-right"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Menu Items (Comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={menuForm.dinnerItems}
                  onChange={(e) => setMenuForm({ ...menuForm, dinnerItems: e.target.value })}
                  placeholder="Kadai Chicken, Dal Makhani, Steamed Rice, Butter Roti, Gulab Jamun"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Special Day note */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <label className="flex items-center gap-2 font-bold text-slate-900 dark:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={menuForm.isSpecial}
                onChange={(e) => setMenuForm({ ...menuForm, isSpecial: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Mark as Special Grand Feast Day (Sunday / Festival)</span>
            </label>
            {menuForm.isSpecial && (
              <input
                type="text"
                value={menuForm.specialNote}
                onChange={(e) => setMenuForm({ ...menuForm, specialNote: e.target.value })}
                placeholder="E.g., Sunday Grand Feast with Live Chaat & Ice Cream Counters"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              />
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={saving}
              icon={Save}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Save & Broadcast {selectedDay}'s Menu
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default WardenMess;
