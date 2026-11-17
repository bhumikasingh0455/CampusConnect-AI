import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { BookOpen, Upload, Plus, FileText, Sparkles, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyMaterials = () => {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    category: 'Lecture Notes'
  });
  const [file, setFile] = useState(null);

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

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/faculty/dashboard/overview');
      if (res.data.success) {
        const subs = res.data.data.assignedSubjects || [];
        setSubjects(subs);
        if (subs.length > 0) {
          setFormData(prev => ({ ...prev, subject: subs[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchSubjects();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !file) {
      toast.error('Title, subject, and file are required');
      return;
    }

    setUploading(true);
    try {
      const subDoc = subjects.find(s => s._id === formData.subject);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('subject', formData.subject);
      data.append('department', subDoc?.department || '');
      data.append('semester', subDoc?.semester || 6);
      data.append('category', formData.category);
      data.append('file', file);

      const res = await api.post('/materials', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        toast.success('Study material uploaded and AI summary synthesized!');
        setIsUploadModalOpen(false);
        setFormData({ title: '', description: '', subject: subjects[0]?._id || '', category: 'Lecture Notes' });
        setFile(null);
        fetchMaterials();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload study material');
    } finally {
      setUploading(false);
    }
  };

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
            Curriculum Materials & Lecture Notes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribute lecture slide decks, lab manuals, and question banks with automatic AI summarization
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Material
        </Button>
      </div>

      {materials.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No study materials published"
          description="Upload course lecture notes and presentations for students."
          actionText="Upload Material"
          onAction={() => setIsUploadModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((mat) => (
            <Card key={mat._id} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="xs">
                    {mat.category || 'Lecture Notes'}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">{mat.fileSize || '1.8 MB'}</span>
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

                {mat.summary && (
                  <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-bold flex items-center gap-1 text-indigo-600 dark:text-indigo-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI High-Yield Summary
                    </span>
                    <p className="line-clamp-3 leading-relaxed">{mat.summary}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{mat.downloadsCount || 0} downloads</span>
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  View File
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Academic Study Material"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpload} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Material Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Distributed Operating Systems & Cloud Models Notes"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Material Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Lecture Notes">Lecture Notes</option>
              <option value="Presentation">Presentation (Slides)</option>
              <option value="Lab Manual">Lab Manual</option>
              <option value="Reference Book">Reference Book</option>
              <option value="Question Bank">Question Bank</option>
              <option value="Code Sample">Code Sample</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Summary / Topic Overview
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Chapter breakdown and topics covered..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Upload Document File (PDF, PPT, DOCX)
            </label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-300 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={uploading} icon={Upload}>
              Upload & Generate AI Summary
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyMaterials;
