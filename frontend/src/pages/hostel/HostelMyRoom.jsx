import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Bed,
  Building2,
  Users,
  Repeat,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Phone,
  Mail,
  Sparkles,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const HostelMyRoom = () => {
  const [allocationData, setAllocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [transferForm, setTransferForm] = useState({
    requestedRoomType: 'Single',
    reason: ''
  });

  const fetchAllocation = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hostel/my-allocation');
      if (res.data.success) {
        setAllocationData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load room allocation details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocation();
  }, []);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferForm.reason.trim()) {
      toast.error('Please state the reason for requesting a room transfer.');
      return;
    }

    try {
      setSubmittingTransfer(true);
      const res = await api.post('/hostel/request-transfer', transferForm);
      if (res.data.success) {
        toast.success('Room transfer application submitted for Warden review.');
        setIsTransferModalOpen(false);
        fetchAllocation();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit transfer request');
    } finally {
      setSubmittingTransfer(false);
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

  if (!allocationData || !allocationData.hasAllocation) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Bed className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Active Allocation</h2>
        <p className="text-xs text-slate-500 mt-1">You do not currently hold an assigned room in the university hostels.</p>
      </div>
    );
  }

  const { allocation, roommates } = allocationData;
  const room = allocation.room;
  const hostel = allocation.hostel;
  const block = allocation.block;
  const transfer = allocation.transferRequest;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bed className="w-7 h-7 text-indigo-600" /> My Room & Roommates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Residential inventory, roommate profiles, and room reallocation portal
          </p>
        </div>

        <div>
          {transfer && transfer.status === 'Pending' ? (
            <Badge variant="warning" size="md">
              <Clock className="w-3.5 h-3.5 mr-1" /> Transfer Request Under Review
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={Repeat}
              onClick={() => setIsTransferModalOpen(true)}
            >
              Request Room Transfer
            </Button>
          )}
        </div>
      </div>

      {/* Transfer Request Status Banner if active */}
      {transfer && transfer.status === 'Pending' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-800 dark:text-amber-300">
              Pending Room Transfer Application (Requested: {transfer.requestedRoomType} Room)
            </p>
            <p className="text-amber-700 dark:text-amber-400">
              <strong>Reason:</strong> "{transfer.reason}"
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Submitted on {new Date(transfer.requestDate).toLocaleDateString()}. The Warden office will inspect availability and update your record.
            </p>
          </div>
        </div>
      )}

      {/* Room Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room Spec Card */}
        <Card title="Room Specifications" subtitle="Physical specifications & rent">
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Hostel Complex</span>
              <span className="font-semibold text-slate-900 dark:text-white">{hostel?.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Block & Wing</span>
              <span className="font-semibold text-slate-900 dark:text-white">{block?.name || 'Block A'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Room Number</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{room?.roomNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Floor Number</span>
              <span className="font-semibold text-slate-900 dark:text-white">Floor {room?.floor}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Room Category</span>
              <span className="font-semibold text-slate-900 dark:text-white">{room?.roomType} Room</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Bed Allocation</span>
              <span className="font-bold text-slate-900 dark:text-white">Bed #{allocation.bedNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Monthly Rent</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{room?.monthlyRent?.toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Allocated Date</span>
              <span className="text-slate-700 dark:text-slate-300">{new Date(allocation.allocatedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        {/* Visual Bed Occupancy Card */}
        <Card title="Room Occupancy & Bed Layout" subtitle={`Capacity: ${room?.capacity} Beds • Occupied: ${room?.occupiedBeds}`}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Generate beds visual */}
              {Array.from({ length: room?.capacity || 2 }).map((_, index) => {
                const bedNum = index + 1;
                const isSelf = bedNum === allocation.bedNumber;
                const roommate = roommates?.find((r) => r.bedNumber === bedNum);
                const isOccupied = isSelf || !!roommate;

                return (
                  <div
                    key={bedNum}
                    className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                      isSelf
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : isOccupied
                        ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                        : 'border-dashed border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                      <Bed className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Bed #{bedNum}</p>
                      <p className="text-[11px] text-slate-500">
                        {isSelf ? (
                          <span className="text-indigo-600 font-bold">You</span>
                        ) : roommate ? (
                          roommate.name
                        ) : (
                          <span className="text-emerald-600 font-semibold">Available</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
              <p>• Clean bedsheets and pillow covers are laundered every Tuesday and Friday.</p>
              <p>• Noise curfew in residential rooms starts from 10:30 PM nightly.</p>
            </div>
          </div>
        </Card>

        {/* Room Amenities */}
        <Card title="Room Inclusions & Amenities" subtitle="Standard facilities verified for Room 204">
          <div className="space-y-2">
            {room?.amenities && room.amenities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Roommates Directory Section */}
      <Card
        title="Authorized Roommates"
        subtitle="Students registered and allocated to the same room"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Yourself */}
          <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                #{allocation.bedNumber}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Alex Rivera</h3>
                <Badge variant="primary" size="sm">Your Profile</Badge>
              </div>
            </div>
            <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-indigo-100 dark:border-indigo-900/30">
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> student@campusconnect.edu</p>
              <p className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> Bed #{allocation.bedNumber}</p>
            </div>
          </div>

          {/* Roommates */}
          {roommates && roommates.length > 0 ? (
            roommates.map((rm, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={rm.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
                    alt={rm.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{rm.name}</h3>
                    <Badge variant="default" size="sm">Bed #{rm.bedNumber}</Badge>
                  </div>
                </div>
                <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5" /> {rm.email}</p>
                  <p className="flex items-center gap-1.5 truncate"><Phone className="w-3.5 h-3.5" /> {rm.phone || '+1 (555) 017-4491'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center col-span-2">
              <Users className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs text-slate-500">No other roommates allocated in this room yet.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Transfer Request Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Apply for Hostel Room Transfer"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Room Category
            </label>
            <select
              value={transferForm.requestedRoomType}
              onChange={(e) => setTransferForm({ ...transferForm, requestedRoomType: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Single">Single Room (Private Study Desk & Air Conditioner)</option>
              <option value="Double">Double Room (Standard Shared)</option>
              <option value="Triple">Triple Room (Economy Option)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Reason for Transfer Request
            </label>
            <textarea
              rows={4}
              value={transferForm.reason}
              onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
              placeholder="E.g., Preparing for competitive exams requiring silent study environment, medical advice, sleep rhythm adjustment..."
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsTransferModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submittingTransfer}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HostelMyRoom;
