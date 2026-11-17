import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../api/axios';
import { QrCode, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const QrScannerModal = ({ isOpen, onClose, onSuccess }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      toast.error('Please enter the attendance code provided by faculty');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      const res = await api.post('/attendance/verify-qr', {
        qrToken: tokenInput.trim()
      });

      if (res.data.success) {
        setVerificationResult({
          success: true,
          message: res.data.message || 'Attendance verified successfully!',
          subjectName: res.data.data.subjectName
        });
        toast.success('Attendance recorded!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Token expired or invalid.';
      setVerificationResult({
        success: false,
        message: msg
      });
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTokenInput('');
    setVerificationResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Smart QR Attendance Verification" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900/60">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Anti-Replay Protection</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Tokens are time-limited and uniquely signed by faculty.</p>
          </div>
        </div>

        {verificationResult ? (
          <div className={`p-4 rounded-xl border text-center space-y-2 ${
            verificationResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-800 dark:text-rose-300'
          }`}>
            <div className="flex justify-center">
              {verificationResult.success ? (
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-rose-500" />
              )}
            </div>
            <p className="text-sm font-bold">{verificationResult.message}</p>
            {verificationResult.subjectName && (
              <p className="text-xs font-medium">Subject: {verificationResult.subjectName}</p>
            )}
            <div className="pt-2">
              <Button size="sm" variant={verificationResult.success ? 'success' : 'outline'} onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Paste / Enter Attendance QR Code Token
              </label>
              <textarea
                rows={3}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste the session token generated on faculty screen..."
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
                Verify & Mark Attendance
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default QrScannerModal;
