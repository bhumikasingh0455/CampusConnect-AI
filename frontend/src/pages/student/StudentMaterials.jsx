import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { BookOpen, Download, Sparkles, FileText, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentMaterials = () => {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [activeSummary, setActiveSummary] = useState('');

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/materials');
      if (res.data.success) {
        setMaterials(res.data.data.materials);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleOpenSummary = async (material) => {
    setSelectedMaterial(material);
    if (material.summary) {
      setActiveSummary(material.summary);
      return;
    }

    setSummaryLoading(true);
    try {
      const res = await api.post(`/materials/${material._id}/summarize`);
      if (res.data.success) {
        setActiveSummary(res.data.data.summary);
      }
    } catch (err) {
      toast.error('Failed to generate AI summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDownload = async (id, fileUrl) => {
    try {
      await api.post(`/materials/${id}/download-count`);
      toast.success('Downloading document...');
      window.open(fileUrl || '#', '_blank');
    } catch (err) {
      window.open(fileUrl || '#', '_blank');
    }
  };

  const filteredMaterials = materials.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={3} height="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Curriculum Study Materials
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Download verified faculty lecture notes, slide decks, and generate instant AI summaries
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No study materials found"
          description="Your instructors have not uploaded notes for this criteria yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => (
            <Card key={mat._id} className="flex flex-col justify-between hover:border-indigo-400/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="xs">
                    {mat.category || 'Lecture Notes'}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {mat.fileSize || '2.4 MB'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    {mat.subject?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span>By {mat.faculty?.name || 'Faculty Member'}</span>
                  <span>{mat.downloadsCount || 0} downloads</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  icon={Download}
                  onClick={() => handleDownload(mat._id, mat.fileUrl)}
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Sparkles}
                  onClick={() => handleOpenSummary(mat)}
                  title="Generate high-yield AI summary"
                >
                  AI Summary
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* AI Material Summary Modal */}
      <Modal
        isOpen={!!selectedMaterial}
        onClose={() => {
          setSelectedMaterial(null);
          setActiveSummary('');
        }}
        title={`AI Summary: ${selectedMaterial?.title || 'Material'}`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-900 flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Curated by CampusConnect AI Engine</span>
          </div>

          {summaryLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
              <p className="text-xs font-medium">Extracting core examination concepts...</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {activeSummary}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedMaterial(null);
                setActiveSummary('');
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentMaterials;
