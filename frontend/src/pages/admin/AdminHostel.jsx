import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Building2,
  PlusCircle,
  Bed,
  Users,
  ShieldCheck,
  CreditCard,
  MapPin,
  Phone,
  Layers,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminHostel = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Hostel Modal
  const [isAddHostelOpen, setIsAddHostelOpen] = useState(false);
  const [hostelForm, setHostelForm] = useState({
    name: '',
    code: '',
    type: 'Boys',
    description: '',
    location: 'Main University Campus',
    contactNumber: ''
  });
  const [submittingHostel, setSubmittingHostel] = useState(false);

  // Add Block Modal
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [selectedHostelForBlock, setSelectedHostelForBlock] = useState('');
  const [blockForm, setBlockForm] = useState({
    blockName: '',
    code: '',
    totalFloors: 4,
    description: ''
  });
  const [submittingBlock, setSubmittingBlock] = useState(false);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hostel/hostels');
      if (res.data.success) {
        setHostels(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    try {
      setSubmittingHostel(true);
      const res = await api.post('/hostel/hostels', hostelForm);
      if (res.data.success) {
        toast.success(`Hostel '${hostelForm.name}' created successfully.`);
        setIsAddHostelOpen(false);
        setHostelForm({
          name: '',
          code: '',
          type: 'Boys',
          description: '',
          location: 'Main University Campus',
          contactNumber: ''
        });
        fetchHostels();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create hostel');
    } finally {
      setSubmittingHostel(false);
    }
  };

  const handleCreateBlock = async (e) => {
    e.preventDefault();
    if (!selectedHostelForBlock) {
      toast.error('Please select a hostel building.');
      return;
    }

    try {
      setSubmittingBlock(true);
      const res = await api.post('/hostel/blocks', {
        hostel: selectedHostelForBlock,
        name: blockForm.blockName,
        blockName: blockForm.blockName,
        code: blockForm.code || blockForm.blockName.slice(0, 3).toUpperCase(),
        totalFloors: Number(blockForm.totalFloors),
        description: blockForm.description
      });
      if (res.data.success) {
        toast.success(`Block '${blockForm.blockName}' created.`);
        setIsAddBlockOpen(false);
        fetchHostels();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create block');
    } finally {
      setSubmittingBlock(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-600" /> University Hostel & Residential Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional overview, residence hall configuration, and block infrastructure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Layers}
            onClick={() => {
              if (hostels.length > 0) setSelectedHostelForBlock(hostels[0]._id);
              setIsAddBlockOpen(true);
            }}
          >
            Add Block
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setIsAddHostelOpen(true)}
            className="shadow-md shadow-indigo-600/20"
          >
            Create Residence Hall
          </Button>
        </div>
      </div>

      {/* Hostels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hostels.map((h) => (
          <Card key={h._id} className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {h.code}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  {h.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {h.location}
                </p>
              </div>

              <Badge
                variant={h.type === 'Boys' ? 'primary' : h.type === 'Girls' ? 'danger' : 'default'}
                size="md"
              >
                {h.type} Hostel
              </Badge>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {h.description || 'Modern air-conditioned student residence complex with high-speed optical Wi-Fi.'}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Rooms</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{h.totalRooms || 0}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Capacity</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{h.totalCapacity || 0} Beds</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Occupancy</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{h.occupancyRate || 0}%</span>
              </div>
            </div>

            {/* Chief Warden Info */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Chief Warden: <strong>{h.chiefWarden?.name || 'Dr. Marcus Vance'}</strong></span>
              <span className="text-emerald-600 font-bold">{h.availableBeds} Vacant Beds</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Hostel Modal */}
      <Modal
        isOpen={isAddHostelOpen}
        onClose={() => setIsAddHostelOpen(false)}
        title="Create New Residence Hall"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateHostel} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Hostel Name *
            </label>
            <input
              type="text"
              value={hostelForm.name}
              onChange={(e) => setHostelForm({ ...hostelForm, name: e.target.value })}
              placeholder="E.g., Homi Bhabha Residence Hall"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hostel Code *
              </label>
              <input
                type="text"
                value={hostelForm.code}
                onChange={(e) => setHostelForm({ ...hostelForm, code: e.target.value.toUpperCase() })}
                placeholder="BH-2"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender Category *
              </label>
              <select
                value={hostelForm.type}
                onChange={(e) => setHostelForm({ ...hostelForm, type: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              >
                <option value="Boys">Boys Hostel</option>
                <option value="Girls">Girls Hostel</option>
                <option value="Co-ed">Co-ed Complex</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campus Location
            </label>
            <input
              type="text"
              value={hostelForm.location}
              onChange={(e) => setHostelForm({ ...hostelForm, location: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={hostelForm.description}
              onChange={(e) => setHostelForm({ ...hostelForm, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddHostelOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submittingHostel}>
              Create Hostel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Block Modal */}
      <Modal
        isOpen={isAddBlockOpen}
        onClose={() => setIsAddBlockOpen(false)}
        title="Add Residence Block"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateBlock} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Hostel *
            </label>
            <select
              value={selectedHostelForBlock}
              onChange={(e) => setSelectedHostelForBlock(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200"
              required
            >
              {hostels.map((h) => (
                <option key={h._id} value={h._id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Block Name *
            </label>
            <input
              type="text"
              value={blockForm.blockName}
              onChange={(e) => setBlockForm({ ...blockForm, blockName: e.target.value })}
              placeholder="Block C (Raman)"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Block Code
              </label>
              <input
                type="text"
                value={blockForm.code}
                onChange={(e) => setBlockForm({ ...blockForm, code: e.target.value.toUpperCase() })}
                placeholder="BLK-C"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Floors
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={blockForm.totalFloors}
                onChange={(e) => setBlockForm({ ...blockForm, totalFloors: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddBlockOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submittingBlock}>
              Create Block
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminHostel;
