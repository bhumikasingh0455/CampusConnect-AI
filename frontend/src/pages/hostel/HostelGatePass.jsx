import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  ArrowRightLeft,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  MapPin,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const HostelGatePass = () => {
  const [passData, setPassData] = useState(null);
  const [gateLogs, setGateLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPassAndLogs = async () => {
    try {
      setLoading(true);
      const [passRes, logsRes] = await Promise.all([
        api.get('/hostel/gate/my-pass'),
        api.get('/hostel/gate/my-logs')
      ]);

      if (passRes.data.success) {
        setPassData(passRes.data.data);
      }
      if (logsRes.data.success) {
        setGateLogs(logsRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load digital pass or gate logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassAndLogs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  const qrImageUrl = passData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        JSON.stringify({
          passId: passData.passId,
          student: passData.studentName,
          token: passData.token
        })
      )}`
    : '';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <QrCode className="w-7 h-7 text-indigo-600" /> Digital Student Identity & Gate Pass
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Server-verified cryptographic pass for automated hostel main gate entry and exit
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={fetchPassAndLogs}
        >
          Refresh Pass Token
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pass Card Visual (Left Col) */}
        <div className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 text-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow">
                  CC
                </div>
                <div>
                  <h3 className="font-extrabold text-xs tracking-wider uppercase">CampusConnect</h3>
                  <p className="text-[10px] text-slate-400">Hostel Residence Pass</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>

            {/* QR Code Container */}
            <div className="flex justify-center my-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-indigo-400/40">
                {qrImageUrl ? (
                  <img
                    src={qrImageUrl}
                    alt="Digital Gate Pass QR"
                    className="w-44 h-44 object-contain"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-slate-100 text-slate-400">
                    Generating...
                  </div>
                )}
              </div>
            </div>

            {/* Student Details on Pass */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={passData?.studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                  alt={passData?.studentName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{passData?.studentName}</h4>
                  <p className="text-slate-400 text-[11px] font-mono">{passData?.studentEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="bg-slate-800/60 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Hostel</span>
                  <span className="font-bold text-slate-200">{passData?.hostelName}</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Room & Bed</span>
                  <span className="font-bold text-slate-200">
                    Room {passData?.roomNumber} • Bed #{passData?.bedNumber}
                  </span>
                </div>
              </div>

              {passData?.activeLeave ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 space-y-0.5">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved Outstation Leave
                  </p>
                  <p className="text-[10px] text-emerald-300">
                    Destination: {passData.activeLeave.destination}
                  </p>
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-slate-800/40 text-[11px] text-slate-400 text-center">
                  Standard On-Campus Clearance (Night Curfew: 09:30 PM)
                </div>
              )}

              <p className="text-[9px] font-mono text-slate-500 text-center pt-2">
                Pass Token: {passData?.token?.slice(0, 24)}...
              </p>
            </div>
          </div>
        </div>

        {/* Gate Movement Audit History (Right 2 Cols) */}
        <div className="lg:col-span-2">
          <Card
            title="My Movement History & Gate Logs"
            subtitle="Recorded entries and exits by Warden & biometric checkpoint"
          >
            {gateLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Movement</th>
                      <th className="py-3 px-4">Time & Date</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Leave Status</th>
                      <th className="py-3 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {gateLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
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

                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          {log.destination}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {log.hasApprovedLeave ? (
                            <Badge variant="success" size="sm">Leave Approved</Badge>
                          ) : log.isLateEntry ? (
                            <Badge variant="danger" size="sm">Late Entry</Badge>
                          ) : (
                            <Badge variant="default" size="sm">Routine Outing</Badge>
                          )}
                        </td>

                        <td className="py-3 px-4 text-[11px] text-slate-500">
                          {log.remarks || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No Gate Movement Logs"
                description="Your check-in and check-out events at the hostel gate will be logged here."
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HostelGatePass;
