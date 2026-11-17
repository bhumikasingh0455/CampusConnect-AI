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
  Users,
  Calendar,
  AlertTriangle,
  CreditCard,
  ArrowRightLeft,
  Utensils,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const WardenDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hostel/dashboard/warden');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load warden analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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

  const occupancyPieData = [
    { name: 'Occupied Beds', value: analytics?.occupiedBeds || 0 },
    { name: 'Available Beds', value: analytics?.availableBeds || 0 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-600" /> Chief Warden Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time residential occupancy, night-out clearance, maintenance, and gate auditing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/warden/rooms">
            <Button variant="primary" size="sm" icon={Bed} className="shadow-md shadow-indigo-600/20">
              Allocate Room
            </Button>
          </Link>
          <Link to="/warden/gate">
            <Button variant="outline" size="sm" icon={ArrowRightLeft}>
              Gate Movement
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Occupancy */}
        <Link to="/warden/rooms">
          <Card className="hover:border-indigo-500/50 transition-all h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Total Occupancy</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Bed className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {analytics?.occupancyRate || 0}%
              </span>
              <span className="text-xs text-slate-500">
                ({analytics?.occupiedBeds}/{analytics?.totalCapacity} Beds)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {analytics?.availableBeds || 0} vacant beds across {analytics?.totalRooms || 0} rooms
            </p>
          </Card>
        </Link>

        {/* Pending Leave Requests */}
        <Link to="/warden/leaves">
          <Card className="hover:border-amber-500/50 transition-all h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Leave Approvals</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {analytics?.pendingLeaves || 0}
              </span>
              <Badge variant="warning" size="sm">Action Needed</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {analytics?.studentsOnLeave || 0} currently on approved leave
            </p>
          </Card>
        </Link>

        {/* Maintenance Tickets */}
        <Link to="/warden/complaints">
          <Card className="hover:border-rose-500/50 transition-all h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Active Complaints</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {analytics?.openComplaints || 0}
              </span>
              <Badge variant={analytics?.openComplaints > 0 ? 'danger' : 'success'} size="sm">
                {analytics?.openComplaints > 0 ? 'Open Tickets' : 'All Clear'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">Maintenance staff dispatch pipeline</p>
          </Card>
        </Link>

        {/* Total Fee Collection */}
        <div className="h-full">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Hostel Fee Collections</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                ₹{(analytics?.feeSummary?.totalCollected || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ₹{(analytics?.feeSummary?.totalOutstanding || 0).toLocaleString()} pending balance
            </p>
          </Card>
        </div>
      </div>

      {/* Visual Analytics & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Donut Chart */}
        <Card title="Bed Occupancy Distribution" subtitle="Live campus capacity ratio">
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#6366F1" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-slate-600 dark:text-slate-300">Occupied ({analytics?.occupiedBeds})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">Available ({analytics?.availableBeds})</span>
            </div>
          </div>
        </Card>

        {/* Quick Operations Shortcuts */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Warden Operational Workflows" subtitle="Direct access to residential administration systems">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Link
                to="/warden/rooms"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                    <Bed className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Room Allocations & Beds</p>
                    <p className="text-[11px] text-slate-500">Allocate student or review room transfer</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/warden/leaves"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Leave Approvals & Returns</p>
                    <p className="text-[11px] text-slate-500">{analytics?.pendingLeaves || 0} applications awaiting decision</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/warden/complaints"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Maintenance Desk</p>
                    <p className="text-[11px] text-slate-500">Assign plumbers, electricians, network team</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/warden/mess"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Mess Timetable & Menu</p>
                    <p className="text-[11px] text-slate-500">Edit weekly 4-meal items and inspect reviews</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Gate Logs & Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Maintenance Tickets */}
        <Card
          title="Recent Complaints Awaiting Action"
          subtitle="Latest issues submitted by residential students"
          headerAction={
            <Link to="/warden/complaints" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          }
        >
          <div className="space-y-3">
            {analytics?.recentComplaints && analytics.recentComplaints.length > 0 ? (
              analytics.recentComplaints.map((c) => (
                <div
                  key={c._id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{c.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Room {c.room?.roomNumber} • Student: {c.student?.name} • Category: {c.category}
                    </p>
                  </div>
                  <Badge variant={c.status === 'Resolved' ? 'success' : 'warning'} size="sm">
                    {c.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No open complaints.</p>
            )}
          </div>
        </Card>

        {/* Live Gate Movement Feed */}
        <Card
          title="Live Main Gate Checkpoint Activity"
          subtitle="Real-time check-in and check-out logs"
          headerAction={
            <Link to="/warden/gate" className="text-xs font-semibold text-indigo-600 hover:underline">
              Open Gate Monitor
            </Link>
          }
        >
          <div className="space-y-3">
            {analytics?.recentGateLogs && analytics.recentGateLogs.length > 0 ? (
              analytics.recentGateLogs.map((log) => (
                <div
                  key={log._id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`p-1.5 rounded-lg text-[10px] font-bold ${
                        log.movementType === 'Check-In'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-indigo-500/10 text-indigo-600'
                      }`}
                    >
                      {log.movementType}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{log.student?.name}</p>
                      <p className="text-[11px] text-slate-500">{log.destination}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent movements recorded.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WardenDashboard;
