import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  CreditCard,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Download,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const HostelFees = () => {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'UPI',
    remarks: 'Online portal fee installment'
  });

  // Receipt Modal
  const [viewReceipt, setViewReceipt] = useState(null);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hostel/fees/my');
      if (res.data.success) {
        setFeeData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load hostel fee records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const openPaymentModal = (fee) => {
    setSelectedFee(fee);
    setPaymentForm({
      amount: fee.outstandingAmount || '',
      paymentMethod: 'UPI',
      remarks: 'Online portal fee installment'
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;

    const payAmount = Number(paymentForm.amount);
    if (payAmount <= 0) {
      toast.error('Please enter a valid payment amount.');
      return;
    }

    if (payAmount > selectedFee.outstandingAmount) {
      toast.error(`Amount cannot exceed outstanding dues of ₹${selectedFee.outstandingAmount}.`);
      return;
    }

    try {
      setSubmittingPayment(true);
      const res = await api.post(`/hostel/fees/${selectedFee._id}/pay`, {
        amount: payAmount,
        paymentMethod: paymentForm.paymentMethod,
        remarks: paymentForm.remarks
      });

      if (res.data.success) {
        toast.success(`Payment verified! Receipt: ${res.data.data.receiptNumber}`);
        setIsPaymentModalOpen(false);
        fetchFees();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setSubmittingPayment(false);
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

  const fees = feeData?.fees || [];
  const primaryFee = fees[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-emerald-600" /> Hostel Fees & Accounts Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track room rent, mess advances, security deposits, and verified transaction receipts
          </p>
        </div>

        {primaryFee && primaryFee.outstandingAmount > 0 && (
          <Button
            variant="primary"
            size="sm"
            icon={CreditCard}
            onClick={() => openPaymentModal(primaryFee)}
            className="shadow-md shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Pay Outstanding Dues (₹{primaryFee.outstandingAmount.toLocaleString()})
          </Button>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Total Term Charges</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ₹{(primaryFee?.totalAmount || 0).toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{primaryFee?.academicYear} • {primaryFee?.term}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Paid to Date</span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{(feeData?.totalPaid || 0).toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Directly credited to campus accounts</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400">Current Outstanding Dues</span>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{(feeData?.totalOutstanding || 0).toLocaleString()}
            </h3>
            <Badge variant={feeData?.totalOutstanding === 0 ? 'success' : 'warning'} size="sm">
              {feeData?.totalOutstanding === 0 ? 'Settled' : 'Pending'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Due by {primaryFee?.dueDate ? new Date(primaryFee.dueDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Primary Fee Breakdown Card */}
      {primaryFee && (
        <Card title="Fee Schedule Breakdown" subtitle="Transparent head-wise institutional accounting">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Residential Room Charges (5 Months)</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{primaryFee.roomCharges?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Mess & Dining Subscription</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{primaryFee.messCharges?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Security Deposit (Refundable at exit)</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{primaryFee.securityDeposit?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Sanitation & Maintenance Fee</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{primaryFee.maintenanceCharges?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 pt-3 border-t-2 border-slate-200 dark:border-slate-700 text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Total Invoiced Amount</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">₹{primaryFee.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>Institutional Gateway Security</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  All fee payments processed through this portal are secured with SHA-256 verification and immediate university treasury receipts.
                </p>
              </div>

              {primaryFee.outstandingAmount > 0 ? (
                <Button
                  variant="primary"
                  size="md"
                  icon={CreditCard}
                  onClick={() => openPaymentModal(primaryFee)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Pay Balance: ₹{primaryFee.outstandingAmount.toLocaleString()}
                </Button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-center">
                  ✓ All term fees fully settled. No pending balance.
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Verified Payment Receipts History */}
      <Card title="Payment Receipts & Transaction Ledger" subtitle="Immutable payment receipts and transaction records">
        {primaryFee?.payments && primaryFee.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Receipt Number</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {primaryFee.payments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {p.transactionId}
                    </td>
                    <td className="py-3 px-4">{p.paymentMethod}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ₹{p.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success" size="sm">Verified</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Receipt}
                        onClick={() => setViewReceipt(p)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Payment History"
            description="No transactions have been recorded for your account yet."
          />
        )}
      </Card>

      {/* Pay Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Hostel Fee Online Payment"
        maxWidth="max-w-md"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center">
            <span className="text-slate-500">Outstanding Balance:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              ₹{selectedFee?.outstandingAmount?.toLocaleString()}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Amount (₹) *
            </label>
            <input
              type="number"
              min="1"
              max={selectedFee?.outstandingAmount}
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              className="w-full text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Gateway / Channel *
            </label>
            <select
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm / BHIM)</option>
              <option value="Debit/Credit Card">Debit / Credit Card (Visa / Mastercard / RuPay)</option>
              <option value="Net Banking">Net Banking (All Indian & International Banks)</option>
              <option value="Online Gateway">University Central Payment Gateway</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submittingPayment} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Authorize Payment
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Digital Receipt Modal */}
      <Modal
        isOpen={!!viewReceipt}
        onClose={() => setViewReceipt(null)}
        title="Official University Hostel Fee Receipt"
        maxWidth="max-w-md"
      >
        {viewReceipt && (
          <div className="space-y-4 text-xs">
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800 space-y-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">CampusConnect AI</h2>
              <p className="text-[11px] text-slate-500">Hostel Administration & Treasury Department</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 font-bold">
                PAID & VERIFIED
              </span>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt No:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-slate-700 dark:text-slate-300">{viewReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Date:</span>
                <span className="text-slate-700 dark:text-slate-300">{new Date(viewReceipt.paymentDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="text-slate-700 dark:text-slate-300">{viewReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-b border-slate-200 dark:border-slate-800 text-sm font-sans font-bold">
                <span className="text-slate-900 dark:text-white">Amount Paid:</span>
                <span className="text-emerald-600">₹{viewReceipt.amount?.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center pt-2">
              This is an authentic, electronically generated treasury receipt. No signature is required.
            </p>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                Print Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HostelFees;
