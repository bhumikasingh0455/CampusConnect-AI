import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Building2,
  Bed,
  Utensils,
  Clock,
  AlertTriangle,
  FileText,
  CreditCard,
  QrCode,
  Users,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const HostelStudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hostel/dashboard/student');
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load hostel details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  if (!dashboardData || !dashboardData.hasAllocation) {
    return (
      <div className="space-y-6">
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Active Hostel Room Allocation</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
            You are currently registered as a Day Scholar or your hostel room allocation request is being processed by the Chief Warden.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/student/dashboard">
              <Button variant="outline" size="sm">Back to Academic Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { allocation, roommates, todayMess, activeLeave, pendingComplaintsCount, totalOutstandingFee, feeStatus, announcements } = dashboardData;
  const hostel = allocation.hostel;
  const room = allocation.room;
  const block = allocation.block;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Room & Hostel Identity */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Resident
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200">
                AY {allocation.academicYear || '2024-2025'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {hostel?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {block?.name || 'Block A'} • Floor {room?.floor} • Room {room?.roomNumber} • Bed #{allocation.bedNumber}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/student/hostel/gate-pass">
              <Button variant="primary" size="sm" icon={QrCode} className="shadow-lg shadow-indigo-600/30">
                Digital Gate Pass
              </Button>
            </Link>
            <Link to="/student/hostel/leaves">
              <Button variant="outline" size="sm" icon={Calendar} className="text-white border-slate-700 hover:bg-slate-800">
                Apply Leave
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Room Allocation */}
        <Link to="/student/hostel/room" className="group">
          <Card className="hover:border-indigo-500/50 transition-all duration-200 h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">My Room</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Bed className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">Room {room?.roomNumber}</span>
              <span className="text-xs text-slate-500">({room?.roomType})</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {roommates?.length > 0 ? `${roommates.length} Roommate active` : 'Single Occupancy'}
            </p>
          </Card>
        </Link>

        {/* Mess Subscription */}
        <Link to="/student/hostel/mess" className="group">
          <Card className="hover:border-amber-500/50 transition-all duration-200 h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Mess</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">Active</span>
              <Badge variant="success" size="sm">4 Meals Included</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {todayMess?.dayOfWeek ? `${todayMess.dayOfWeek}'s Special Menu` : 'Nutritious Campus Meals'}
            </p>
          </Card>
        </Link>

        {/* Pending Complaints */}
        <Link to="/student/hostel/complaints" className="group">
          <Card className="hover:border-rose-500/50 transition-all duration-200 h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Maintenance</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {pendingComplaintsCount || 0}
              </span>
              <span className="text-xs text-slate-500">open tickets</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {pendingComplaintsCount > 0 ? 'Assigned technician in progress' : 'All facilities operational'}
            </p>
          </Card>
        </Link>

        {/* Hostel Fee Status */}
        <Link to="/student/hostel/fees" className="group">
          <Card className="hover:border-emerald-500/50 transition-all duration-200 h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hostel Dues</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                ₹{totalOutstandingFee.toLocaleString()}
              </span>
              <Badge variant={feeStatus === 'Paid' ? 'success' : 'warning'} size="sm">
                {feeStatus}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {totalOutstandingFee === 0 ? 'Fully settled for current term' : 'Click to view & pay online'}
            </p>
          </Card>
        </Link>
      </div>

      {/* Main Grid: Left = Today's Meals & Roommates, Right = Leave & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Mess Meals Card */}
          <Card
            title={`Today's Mess Menu (${todayMess?.dayOfWeek || 'Today'})`}
            subtitle="Campus dining timetable with live daily preparations"
            headerAction={
              <Link to="/student/hostel/mess" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                Weekly Timetable <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {todayMess ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Breakfast */}
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Breakfast
                    </span>
                    <span className="text-[11px] text-amber-600/80 dark:text-amber-400/70 font-mono">
                      {todayMess.breakfast?.timing || '07:30 AM - 09:30 AM'}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {todayMess.breakfast?.items?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lunch */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                      Lunch
                    </span>
                    <span className="text-[11px] text-indigo-600/80 dark:text-indigo-400/70 font-mono">
                      {todayMess.lunch?.timing || '12:30 PM - 02:30 PM'}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {todayMess.lunch?.items?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Snacks */}
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                      Evening Snacks
                    </span>
                    <span className="text-[11px] text-purple-600/80 dark:text-purple-400/70 font-mono">
                      {todayMess.snacks?.timing || '05:00 PM - 06:15 PM'}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {todayMess.snacks?.items?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dinner */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Dinner
                    </span>
                    <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 font-mono">
                      {todayMess.dinner?.timing || '07:45 PM - 09:45 PM'}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {todayMess.dinner?.items?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No meal menu recorded for today.</p>
            )}
          </Card>

          {/* Roommates & Amenities */}
          <Card
            title={`Room ${room?.roomNumber} Details & Roommates`}
            subtitle="Verified residential companions and room fixtures"
            headerAction={
              <Link to="/student/hostel/room" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View Full Room
              </Link>
            }
          >
            <div className="space-y-4">
              {/* Roommate List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Self */}
                <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                    #{allocation.bedNumber}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      You (Bed #{allocation.bedNumber})
                      <Badge variant="primary" size="sm">You</Badge>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">Allocated on {new Date(allocation.allocatedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Other Roommates */}
                {roommates && roommates.length > 0 ? (
                  roommates.map((rm, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center gap-3">
                      <img
                        src={rm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={rm.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {rm.name} (Bed #{rm.bedNumber})
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{rm.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400">
                    No other roommates in this room
                  </div>
                )}
              </div>

              {/* Amenities tags */}
              {room?.amenities && room.amenities.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Included Room Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Leave Status, Contact & Notices */}
        <div className="space-y-6">
          {/* Active Leave / Outing Status */}
          <Card title="Hostel Leave & Movement" subtitle="Active digital gate authorization">
            {activeLeave ? (
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    {activeLeave.destination}
                  </span>
                  <Badge
                    variant={
                      activeLeave.status === 'Approved'
                        ? 'success'
                        : activeLeave.status === 'Pending'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {activeLeave.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p><strong>Departure:</strong> {new Date(activeLeave.departureDate).toLocaleDateString()}</p>
                  <p><strong>Expected Return:</strong> {new Date(activeLeave.expectedReturnDate).toLocaleDateString()}</p>
                  {activeLeave.reviewRemarks && (
                    <p className="text-[11px] italic text-indigo-600 dark:text-indigo-400">
                      "{activeLeave.reviewRemarks}"
                    </p>
                  )}
                </div>
                <Link to="/student/hostel/leaves" className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Manage Leave Applications →
                </Link>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You are currently checked in on campus. No pending out-of-station leaves.
                </p>
                <Link to="/student/hostel/leaves">
                  <Button variant="outline" size="sm" icon={Calendar} className="w-full">
                    Apply for Outstation Leave
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Quick Hostel Contacts */}
          <Card title="Warden & Helpdesk Contacts" subtitle="24/7 Hostel residential assistance">
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Chief Warden Office</p>
                  <p className="text-[11px] text-slate-500">Dr. Marcus Vance</p>
                </div>
                <a
                  href="tel:+15550198800"
                  className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Main Security Gate</p>
                  <p className="text-[11px] text-slate-500">24/7 Gate Warden & Medical Van</p>
                </div>
                <a
                  href="tel:+15550198822"
                  className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Card>

          {/* Hostel Announcements Bulletin */}
          <Card title="Hostel Bulletins" subtitle="Official notices and guidelines">
            <div className="space-y-3">
              {announcements && announcements.length > 0 ? (
                announcements.map((notice) => (
                  <div
                    key={notice._id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {notice.title}
                      </span>
                      <Badge
                        variant={notice.priority === 'urgent' ? 'danger' : 'default'}
                        size="sm"
                      >
                        {notice.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {notice.content}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">No active hostel bulletins.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HostelStudentDashboard;
