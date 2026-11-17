import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  ArrowRightLeft,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const WardenGate = () => {
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [movementFilter, setMovementFilter] = useState('');
  const [lateOnly, setLateOnly] = useState(false);

  // Log Movement Modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [submittingLog, setSubmittingLog] = useState(false);
  const [logForm, setLogForm] = useState({
    studentId: '',
    movementType: 'Check-Out',
    destination: 'Campus Library / Local Market',
    reason: 'Academic Research',
    isLateEntry: false,
    remarks: 'Verified student identity'
  });

  const fetchGateData = async () => {
    try {
      setLoading(true);
      let query = [];
      if (movementFilter) query.push(`movementType=${movementFilter}`);
      if (lateOnly) query.push(`isLateEntry=true`);
      const qs = query.length > 0 ? `?${query.join('&')}` : '';

      const [logsRes, studentsRes] = await Promise.all([
        api.get(`/hostel/gate/all-logs${qs}`),
        api.get('/students?limit=100')
      ]);

      if (logsRes.data.success) {
        setLogs(logsRes.data.data || []);
      }
      if (studentsRes.data.success) {
        setStudents(studentsRes.data.data?.students || studentsRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load gate logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateData();
  }, [movementFilter, lateOnly]);

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!logForm.studentId) {
      toast.error('Please select a student.');
      return;
    }

    try {
      setSubmittingLog(true);
      const res = await api.post('/hostel/gate/movement', logForm);
      if (res.data.success) {
        toast.success(`${logForm.movementType} logged successfully!`);
        setIsLogModalOpen(false);
        fetchGateData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record movement');
    } finally {
      setSubmittingLog(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ArrowRightLeft className="w-7 h-7 text-indigo-600" /> Main Hostel Gate & Curfew Monitor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time biometric & warden checkpoint entry/exit audit logs
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setIsLogModalOpen(true)}
          className="shadow-md shadow-indigo-600/20"
        >
          Record Entry / Exit
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={movementFilter}
            onChange={(e) => setMovementFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Movement Types</option>
            <option value="Check-Out">Check-Out (Exiting Hostel)</option>
            <option value="Check-In">Check-In (Returning to Hostel)</option>
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={lateOnly}
              onChange={(e) => setLateOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span>Filter Late Entries Only (Past 09:30 PM)</span>
          </label>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Total {logs.length} movement records
        </span>
      </div>

      {/* Logs Table */}
      <Card title="Live Gate Audit Records" subtitle="Timestamped student movements with leave verification status">
        {loading ? (
          <LoadingSkeleton type="table" />
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student & Roll No</th>
                  <th className="py-3 px-4">Movement</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Leave Status</th>
                  <th className="py-3 px-4">Late Flag</th>
                  <th className="py-3 px-4">Verified By</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => {
                  const student = log.student;

                  return (
                    <tr
                      key={log._id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                        log.isLateEntry ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={student?.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-300"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{student?.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{student?.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            log.movementType === 'Check-In'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                          }`}
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          {log.movementType}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>

                      <td className="py-3 px-4 max-w-xs font-semibold text-slate-900 dark:text-white">
                        {log.destination}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.hasApprovedLeave ? (
                          <Badge variant="success" size="sm">Leave Verified</Badge>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Local Outing</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.isLateEntry ? (
                          <Badge variant="danger" size="sm">Late Entry</Badge>
                        ) : (
                          <span className="text-emerald-500 font-semibold text-[11px]">On Time</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {log.verifiedBy?.name || 'Gate Warden'}
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                        {log.remarks || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Movement Logs"
            description="No gate check-in or check-out logs match your filter."
          />
        )}
      </Card>

      {/* Record Movement Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Record Gate Movement Checkpoint"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Resident Student *
            </label>
            <select
              value={logForm.studentId}
              onChange={(e) => setLogForm({ ...logForm, studentId: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
              required
            >
              <option value="">-- Choose Student --</option>
              {students.map((st) => {
                const u = st.user || st;
                return (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Movement Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-indigo-600">
                <input
                  type="radio"
                  name="mtype"
                  value="Check-Out"
                  checked={logForm.movementType === 'Check-Out'}
                  onChange={() => setLogForm({ ...logForm, movementType: 'Check-Out' })}
                />
                Check-Out (Exiting)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-600">
                <input
                  type="radio"
                  name="mtype"
                  value="Check-In"
                  checked={logForm.movementType === 'Check-In'}
                  onChange={() => setLogForm({ ...logForm, movementType: 'Check-In' })}
                />
                Check-In (Entering)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Destination *
            </label>
            <input
              type="text"
              value={logForm.destination}
              onChange={(e) => setLogForm({ ...logForm, destination: e.target.value })}
              placeholder="E.g., Central Library / City Center"
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose / Reason
            </label>
            <input
              type="text"
              value={logForm.reason}
              onChange={(e) => setLogForm({ ...logForm, reason: e.target.value })}
              placeholder="E.g., Academic Project Work"
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="lateFlag"
              checked={logForm.isLateEntry}
              onChange={(e) => setLogForm({ ...logForm, isLateEntry: e.target.checked })}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="lateFlag" className="text-xs font-semibold text-rose-600 cursor-pointer">
              Mark as Late Entry (Past 09:30 PM Curfew)
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Security Remarks
            </label>
            <input
              type="text"
              value={logForm.remarks}
              onChange={(e) => setLogForm({ ...logForm, remarks: e.target.value })}
              placeholder="E.g., Verified student ID card"
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submittingLog}>
              Log Movement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WardenGate;
