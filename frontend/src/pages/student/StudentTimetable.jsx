import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { CalendarDays, Clock, MapPin, User, Sparkles } from 'lucide-react';

const StudentTimetable = () => {
  const [loading, setLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const current = days[new Date().getDay()];
    return current === 'Sunday' || current === 'Saturday' ? 'Monday' : current;
  });

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await api.get('/timetable');
        if (res.data.success) {
          setWeeklySchedule(res.data.data.weeklySchedule || {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} height="h-32" />
      </div>
    );
  }

  const currentClasses = weeklySchedule[selectedDay] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Class Timetable & Schedule
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Weekly lecture matrix, timing schedules, and allocated lecture halls
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {daysOrder.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDay === day
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {day}
            <span className="ml-1.5 text-[10px] opacity-75 font-mono">
              ({(weeklySchedule[day] || []).length})
            </span>
          </button>
        ))}
      </div>

      {/* Classes List */}
      {currentClasses.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={`No classes scheduled for ${selectedDay}`}
          description="Use this free period for coding practice, project collaboration, or library research."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentClasses.map((item) => (
            <Card key={item._id} className="hover:border-indigo-400/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                  <Badge variant="primary" size="xs">
                    {item.roomNumber || 'Hall 101'}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.subject?.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {item.subject?.code}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <img
                    src={item.faculty?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={item.faculty?.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <span className="truncate">{item.faculty?.name || 'Assigned Instructor'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
