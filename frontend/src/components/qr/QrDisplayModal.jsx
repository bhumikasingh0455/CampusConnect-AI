import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import api from '../../api/axios';
import { QrCode, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const QrDisplayModal = ({ isOpen, onClose, subjectId, subjectName }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  const generateCode = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      const res = await api.post('/attendance/generate-qr', { subjectId });
      if (res.data.success) {
        setQrData(res.data.data);
        setTimeLeft(res.data.data.validitySeconds || 90);
      }
    } catch (err) {
      toast.error('Failed to generate attendance QR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateCode();
    }
  }, [isOpen, subjectId]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Live Attendance QR: ${subjectName || 'Class'}`} maxWidth="max-w-md">
      <div className="flex flex-col items-center justify-center p-2 text-center space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          Instruct students to open their student dashboard and scan or submit this code before expiration.
        </p>

        {loading ? (
          <div className="w-64 h-64 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : qrData ? (
          <div className="p-4 bg-white rounded-2xl border-2 border-indigo-500/30 shadow-lg">
            <img src={qrData.qrDataUrl} alt="Attendance QR" className="w-64 h-64 object-contain" />
          </div>
        ) : null}

        {/* Expiration Timer Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className={timeLeft < 15 ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
            Code expires in: {timeLeft}s
          </span>
        </div>

        {/* Token code for fallback manual copy */}
        {qrData && (
          <div className="w-full">
            <p className="text-[11px] text-slate-400 mb-1">Direct Verification Token (For remote/text entry):</p>
            <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-left overflow-x-auto">
              <code className="text-[10px] font-mono text-slate-600 dark:text-slate-300 truncate select-all">
                {qrData.rawToken}
              </code>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateCode}
            isLoading={loading}
            icon={RefreshCw}
          >
            Refresh Code
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QrDisplayModal;
