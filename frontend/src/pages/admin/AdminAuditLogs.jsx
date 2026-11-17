import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { ShieldCheck, Filter, Clock } from 'lucide-react';

const AdminAuditLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/users/audit-logs${actionFilter ? `?action=${actionFilter}` : ''}`);
      if (res.data.success) {
        setLogs(res.data.data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

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
            System Security & Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable log of user logins, role modifications, record mutations, and security events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Audit Actions</option>
            <option value="USER_LOGIN">User Logins</option>
            <option value="USER_CREATED_BY_ADMIN">Account Creations</option>
            <option value="PASSWORD_CHANGED">Password Changes</option>
            <option value="SYSTEM_INITIALIZATION">System Events</option>
          </select>
        </div>
      </div>

      <Card>
        {logs.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No audit entries found"
            description="Clear the filter to inspect past system events."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action Event</th>
                  <th className="px-4 py-3">Actor (User)</th>
                  <th className="px-4 py-3">Target Resource</th>
                  <th className="px-4 py-3">Details / Metadata</th>
                  <th className="px-4 py-3 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {log.performedBy?.name || 'System / Anonymous'}
                      <span className="text-[10px] text-slate-400 block">{log.performedBy?.role || ''}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                      {log.targetResource || 'Database'}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-500 max-w-xs truncate">
                      {JSON.stringify(log.details || {})}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[10px] text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminAuditLogs;
