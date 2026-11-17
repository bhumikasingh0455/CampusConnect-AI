import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  Bed,
  PlusCircle,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Repeat,
  Info,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const WardenRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedHostel, setSelectedHostel] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Allocation Modal
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [submittingAllocate, setSubmittingAllocate] = useState(false);
  const [allocateForm, setAllocateForm] = useState({
    studentId: '',
    roomId: '',
    bedNumber: 1,
    academicYear: '2024-2025',
    remarks: 'Allocated by Chief Warden'
  });

  // Transfer Review Modal
  const [transferReviewModal, setTransferReviewModal] = useState(false);
  const [selectedTransferAlloc, setSelectedTransferAlloc] = useState(null);
  const [transferDecision, setTransferDecision] = useState('Approved');
  const [transferRemarks, setTransferRemarks] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchRoomsAndHostels = async () => {
    try {
      setLoading(true);
      const [roomsRes, hostelsRes, studentsRes] = await Promise.all([
        api.get(`/hostel/rooms?${selectedHostel ? `hostel=${selectedHostel}&` : ''}${roomTypeFilter ? `roomType=${roomTypeFilter}&` : ''}${onlyAvailable ? 'onlyAvailable=true' : ''}`),
        api.get('/hostel/hostels'),
        api.get('/students?limit=100')
      ]);

      if (roomsRes.data.success) {
        setRooms(roomsRes.data.data || []);
      }
      if (hostelsRes.data.success) {
        setHostels(hostelsRes.data.data || []);
        if (!selectedHostel && hostelsRes.data.data?.length > 0) {
          // optionally set default hostel
        }
      }
      if (studentsRes.data.success) {
        setStudents(studentsRes.data.data?.students || studentsRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load rooms inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndHostels();
  }, [selectedHostel, roomTypeFilter, onlyAvailable]);

  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    if (!allocateForm.studentId || !allocateForm.roomId) {
      toast.error('Please select both a student and a target room.');
      return;
    }

    try {
      setSubmittingAllocate(true);
      const res = await api.post('/hostel/allocate', allocateForm);
      if (res.data.success) {
        toast.success('Student room allocation completed successfully!');
        setIsAllocateModalOpen(false);
        setAllocateForm({
          studentId: '',
          roomId: '',
          bedNumber: 1,
          academicYear: '2024-2025',
          remarks: 'Allocated by Chief Warden'
        });
        fetchRoomsAndHostels();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Room allocation failed');
    } finally {
      setSubmittingAllocate(false);
    }
  };

  const handleTransferReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTransferAlloc) return;

    try {
      setSubmittingReview(true);
      const res = await api.put(`/hostel/review-transfer/${selectedTransferAlloc._id}`, {
        decision: transferDecision,
        remarks: transferRemarks
      });
      if (res.data.success) {
        toast.success(`Transfer request marked as ${transferDecision}`);
        setTransferReviewModal(false);
        setSelectedTransferAlloc(null);
        fetchRoomsAndHostels();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review transfer');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bed className="w-7 h-7 text-indigo-600" /> Room Allocation & Inventory Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prevent over-allocation, manage bed assignments, and approve room transfer requests
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => setIsAllocateModalOpen(true)}
          className="shadow-md shadow-indigo-600/20"
        >
          Allocate Student
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Hostel Filter */}
          <select
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Residence Halls</option>
            {hostels.map((h) => (
              <option key={h._id} value={h._id}>{h.name} ({h.type})</option>
            ))}
          </select>

          {/* Room Type */}
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
          >
            <option value="">All Room Types</option>
            <option value="Single">Single Room</option>
            <option value="Double">Double Room</option>
            <option value="Triple">Triple Room</option>
            <option value="Dormitory">Dormitory</option>
          </select>

          {/* Only Available toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Only Vacant Beds</span>
          </label>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {rooms.length} rooms
        </span>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => {
            const isFull = room.occupiedBeds >= room.capacity;
            const availableBeds = Math.max(0, room.capacity - room.occupiedBeds);

            return (
              <div
                key={room._id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isFull
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    : 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isFull
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}
                    >
                      <Bed className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        Room {room.roomNumber}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Floor {room.floor} • {room.block?.name || 'Block A'}
                      </p>
                    </div>
                  </div>

                  <Badge variant={isFull ? 'default' : 'success'} size="sm">
                    {isFull ? 'Full (0 Vacant)' : `${availableBeds} Vacant Bed${availableBeds > 1 ? 's' : ''}`}
                  </Badge>
                </div>

                {/* Capacity Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Occupancy: {room.occupiedBeds} / {room.capacity} Beds</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{room.monthlyRent?.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFull ? 'bg-indigo-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(room.occupiedBeds / room.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Room Amenities */}
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {room.amenities?.slice(0, 3).map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {a}
                    </span>
                  ))}
                  {room.amenities?.length > 3 && (
                    <span className="px-1.5 py-0.5 text-slate-400">+{room.amenities.length - 3}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">{room.roomType}</span>
                  {!isFull && (
                    <button
                      type="button"
                      onClick={() => {
                        setAllocateForm({ ...allocateForm, roomId: room._id });
                        setIsAllocateModalOpen(true);
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Allocate Bed →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Rooms Found"
          description="No hostel rooms match the selected building or capacity filters."
        />
      )}

      {/* Allocate Room Modal */}
      <Modal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        title="Allocate Student to Hostel Room"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Student *
            </label>
            <select
              value={allocateForm.studentId}
              onChange={(e) => setAllocateForm({ ...allocateForm, studentId: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Choose Student --</option>
              {students.map((st) => {
                const u = st.user || st;
                return (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Target Room *
            </label>
            <select
              value={allocateForm.roomId}
              onChange={(e) => setAllocateForm({ ...allocateForm, roomId: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Choose Room --</option>
              {rooms
                .filter((r) => r.occupiedBeds < r.capacity)
                .map((r) => (
                  <option key={r._id} value={r._id}>
                    Room {r.roomNumber} ({r.roomType} • {r.capacity - r.occupiedBeds} Beds Free • Floor {r.floor})
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bed Number (1-4)
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={allocateForm.bedNumber}
                onChange={(e) => setAllocateForm({ ...allocateForm, bedNumber: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={allocateForm.academicYear}
                onChange={(e) => setAllocateForm({ ...allocateForm, academicYear: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Allocation Remarks
            </label>
            <textarea
              rows={2}
              value={allocateForm.remarks}
              onChange={(e) => setAllocateForm({ ...allocateForm, remarks: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAllocateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submittingAllocate}>
              Confirm Allocation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WardenRooms;
