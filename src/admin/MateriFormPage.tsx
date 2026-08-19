import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Trash2,
  Plus,
  Eye,
  Camera,
  Layers,
  Paperclip,
  CheckCircle,
  Cloud,
  ExternalLink,
  Sparkles,
  Tag as TagIcon,
  X,
} from 'lucide-react';
import { useMateri } from '../hooks/useMateri';
import { useCategories } from '../hooks/useCategories';
import { useTags } from '../hooks/useTags';
import { MateriPAI, MateriFile, Tag } from '../types/database';
import { uploadImage, uploadMateriFile } from '../lib/supabase';
import { slugify, formatBytes, getFileBadgeColor } from '../lib/utils';
import { parseCloudEmbedUrl } from '../lib/embedHelper';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { EmbedModalViewer } from '../components/ui/CloudEmbedViewer';
import { useToast } from '../components/ui/Toast';

export const MateriFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'new');
  const navigate = useNavigate();
  const { materiList, createMateri, updateMateri, isCreating, isUpdating } = useMateri({ status: 'all' });
  const { categories } = useCategories();
  const { tags, createTag } = useTags();
  const { success, error: toastError } = useToast();

  const [judul, setJudul] = useState('');
  const [slug, setSlug] = useState('');
  const [deskripsiSingkat, setDeskripsiSingkat] = useState('');
  const [konten, setKonten] = useState('');
  const [gambarCoverUrl, setGambarCoverUrl] = useState('');
  const [kategoriId, setKategoriId] = useState<string>('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  const [files, setFiles] = useState<Array<{
    nama_file: string;
    file_url: string;
    tipe: string;
    ukuran_bytes?: number;
  }>>([]);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write');

  // Cloud Link Attachment Modal State
  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [cloudLinkUrl, setCloudLinkUrl] = useState('');
  const [cloudLinkName, setCloudLinkName] = useState('');
  const [cloudLinkType, setCloudLinkType] = useState('drive');

  // Live Embed Viewer for any attached file
  const [activeEmbedPreview, setActiveEmbedPreview] = useState<{ url: string; title: string } | null>(null);

  // Load existing data if edit mode
  useEffect(() => {
    if (isEdit && materiList.length > 0) {
      const existing = materiList.find((m) => m.id === id);
      if (existing) {
        setJudul(existing.judul);
        setSlug(existing.slug);
        setDeskripsiSingkat(existing.deskripsi_singkat || '');
        setKonten(existing.konten);
        setGambarCoverUrl(existing.gambar_cover_url || '');
        setKategoriId(existing.kategori_id || '');
        setStatus(existing.status);
        if (existing.tags) {
          setSelectedTagIds(existing.tags.map((t) => t.id));
        }
        if (existing.files) {
          setFiles(
            existing.files.map((f) => ({
              nama_file: f.nama_file,
              file_url: f.file_url,
              tipe: f.tipe,
              ukuran_bytes: f.ukuran_bytes || undefined,
            }))
          );
        }
      }
    }
  }, [isEdit, id, materiList]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJudul(val);
    if (!isEdit) {
      setSlug(slugify(val));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadImage(file, 'materi-covers');
      setGambarCoverUrl(url);
      success('Cover artikel berhasil diunggah!');
    } catch (err) {
      toastError('Gagal mengunggah cover artikel.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setUploadingFile(true);
    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const res = await uploadMateriFile(file);
        const ext = file.name.split('.').pop() || 'file';
        setFiles((prev) => [
          ...prev,
          {
            nama_file: res.name,
            file_url: res.url,
            tipe: ext.toLowerCase(),
            ukuran_bytes: res.size,
          },
        ]);
      }
      success('File lampiran berhasil ditambahkan!');
    } catch (err) {
      toastError('Gagal mengunggah file lampiran.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddCloudLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudLinkUrl.trim()) {
      toastError('Tautan cloud storage wajib diisi.');
      return;
    }

    const parsed = parseCloudEmbedUrl(cloudLinkUrl);
    let autoType = cloudLinkType;
    if (parsed.provider === 'gdrive') autoType = 'drive';
    else if (parsed.provider === 'onedrive') autoType = 'onedrive';
    else if (parsed.provider === 'canva') autoType = 'canva';
    else if (parsed.provider === 'gslides') autoType = 'slide';
    else if (parsed.provider === 'gdocs') autoType = 'doc';
    else if (parsed.provider === 'pdf') autoType = 'pdf';

    const defaultName = cloudLinkName.trim() || parsed.title || 'Dokumen Cloud Pembelajaran';

    setFiles((prev) => [
      ...prev,
      {
        nama_file: defaultName,
        file_url: cloudLinkUrl.trim(),
        tipe: autoType,
      },
    ]);

    success('Tautan Cloud Storage berhasil ditambahkan!');
    setCloudLinkUrl('');
    setCloudLinkName('');
    setCloudModalOpen(false);
  };

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleAddNewTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    try {
      const created = await createTag(newTagInput.trim());
      setSelectedTagIds((prev) => [...prev, created.id]);
      setNewTagInput('');
      success(`Tag #${created.nama} berhasil dibuat!`);
    } catch {
      toastError('Gagal membuat tag baru.');
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) {
      toastError('Judul materi wajib diisi.');
      return;
    }

    const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));

    try {
      if (isEdit && id) {
        await updateMateri({
          id,
          materi: {
            judul,
            slug: slug || slugify(judul),
            deskripsi_singkat: deskripsiSingkat,
            konten,
            gambar_cover_url: gambarCoverUrl,
            kategori_id: kategoriId || null,
            status,
            tags: selectedTags,
          },
          files,
        });
        success('Materi PAI berhasil diperbarui!');
      } else {
        await createMateri({
          materi: {
            judul,
            slug: slug || slugify(judul),
            deskripsi_singkat: deskripsiSingkat,
            konten,
            gambar_cover_url: gambarCoverUrl,
            kategori_id: kategoriId || null,
            status,
            tags: selectedTags,
          },
          files,
        });
        success('Materi PAI baru berhasil diterbitkan!');
      }
      navigate('/admin/materi');
    } catch (err) {
      toastError('Terjadi kesalahan saat menyimpan materi.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/materi">
            <button
              type="button"
              aria-label="Kembali ke daftar materi"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              {isEdit ? 'Edit Materi PAI' : 'Tulis Modul / Artikel PAI Baru'}
            </h1>
            <p className="text-xs text-slate-500">
              Isi materi pembelajaran terstruktur, lampirkan link Google Drive/OneDrive, dan kelola tag topik.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Metadata Card */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <Input
                label="Judul Materi / Modul Pembelajaran"
                required
                value={judul}
                onChange={handleTitleChange}
                placeholder="Contoh: Fikih Sujud: Panduan Lengkap Sujud Sahwi, Tilawah, dan Syukur (Kelas 7)"
              />

              <Input
                label="Slug URL (Otomatis)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="fikih-sujud-sahwi-tilawah-syukur"
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Ringkasan / Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={deskripsiSingkat}
                  onChange={(e) => setDeskripsiSingkat(e.target.value)}
                  placeholder="Ringkasan poin-poin utama materi untuk pengantar dan meta preview..."
                  className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </Card>

            {/* Markdown Content Editor & Live Preview */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <label className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  Isi Konten Artikel (Markdown Format)
                </label>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('write')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      previewTab === 'write'
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Tulis Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('preview')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      previewTab === 'preview'
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Pratinjau
                  </button>
                </div>
              </div>

              {previewTab === 'write' ? (
                <div className="space-y-2">
                  <textarea
                    rows={14}
                    required
                    value={konten}
                    onChange={(e) => setKonten(e.target.value)}
                    placeholder="# Judul Bab Utama&#10;&#10;Tuliskan ayat Al-Qur'an, hadits, syarah, dan penjelasan lengkap materi di sini...&#10;&#10;## Sub-bab 1: Definisi & Hukum&#10;> Kutipan ayat atau hadits penting&#10;&#10;- Poin penting 1&#10;- Poin penting 2"
                    className="block w-full font-mono text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <p className="text-[11px] text-slate-400">
                    Mendukung format Markdown: # Heading 1, ## Heading 2, &gt; Quote Ayat/Hadits, - List poin.
                  </p>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 min-h-[300px]">
                  {konten ? (
                    konten.split('\n\n').map((p, i) => {
                      if (p.startsWith('# ')) return <h1 key={i}>{p.replace('# ', '')}</h1>;
                      if (p.startsWith('## ')) return <h2 key={i}>{p.replace('## ', '')}</h2>;
                      if (p.startsWith('> ')) return <blockquote key={i}>{p.replace('> ', '')}</blockquote>;
                      return <p key={i}>{p}</p>;
                    })
                  ) : (
                    <p className="text-slate-400 italic">Belum ada konten untuk dipratinjau.</p>
                  )}
                </div>
              )}
            </Card>

            {/* File Attachments & Cloud Storage Links */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-brand-600" />
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    File Lampiran & Tautan Cloud Storage ({files.length})
                  </h3>
                </div>

                {/* Actions: Add Cloud Link or Upload File */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCloudModalOpen(true)}
                    className="text-xs"
                  >
                    <Cloud className="w-3.5 h-3.5 mr-1 text-blue-500" />
                    + Link Google Drive / OneDrive
                  </Button>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-100 cursor-pointer transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{uploadingFile ? 'Mengunggah...' : 'Upload File'}</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                      onChange={handleAttachmentUpload}
                      className="sr-only"
                      disabled={uploadingFile}
                    />
                  </label>
                </div>
              </div>

              {files.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <p className="text-xs text-slate-500">Belum ada file atau link cloud yang dilampirkan.</p>
                  <p className="text-[11px] text-slate-400">
                    Anda dapat mengunggah file lokal (PDF/PPT/Word) atau menempelkan tautan dari <strong>Google Drive, OneDrive, Canva</strong> untuk di-embed langsung.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {file.nama_file}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className={`px-1.5 py-0.2 rounded font-bold uppercase border ${getFileBadgeColor(file.tipe)}`}>
                              {file.tipe}
                            </span>
                            {file.ukuran_bytes ? <span>{formatBytes(file.ukuran_bytes)}</span> : null}
                            <span className="truncate text-slate-400">{file.file_url}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Test Embed Preview Button */}
                        <button
                          type="button"
                          onClick={() => setActiveEmbedPreview({ url: file.file_url, title: file.nama_file })}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg"
                          title="Cek Pratinjau Embed"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                          title="Hapus file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Column (4 cols): Meta, Categories, Tags & Settings */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Publish & Status Card */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Publikasi & Visibilitas
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Status Publikasi
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold"
                >
                  <option value="published">Tayang untuk Publik (Published)</option>
                  <option value="draft">Simpan sebagai Draf (Draft)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isCreating || isUpdating}
                className="w-full justify-center shadow-lg shadow-brand-600/20 font-bold"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Simpan Perubahan' : 'Terbitkan Materi'}
              </Button>
            </Card>

            {/* Hierarchical Category Selector */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-brand-600" />
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Pilih Kategori Elemen PAI
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Kategori Materi (Fase D)
                </label>
                <select
                  value={kategoriId}
                  onChange={(e) => setKategoriId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
                >
                  <option value="">-- Pilih Kategori Elemen --</option>
                  {categories
                    .filter((c) => !c.parent_id)
                    .map((topCat) => {
                      const childCats = categories.filter((c) => c.parent_id === topCat.id);
                      if (childCats.length > 0) {
                        return (
                          <optgroup key={topCat.id} label={topCat.nama}>
                            {childCats.map((child) => (
                              <option key={child.id} value={child.id}>
                                {child.nama}
                              </option>
                            ))}
                          </optgroup>
                        );
                      }
                      return (
                        <option key={topCat.id} value={topCat.id}>
                          {topCat.nama}
                        </option>
                      );
                    })}
                </select>
              </div>
            </Card>

            {/* Tag Selection & Creation Card (Phase 2) */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <TagIcon className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Tag & Topik Terkait ({selectedTagIds.length} Terpilih)
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      #{tag.nama}
                    </button>
                  );
                })}
              </div>

              {/* Inline Create New Tag */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="Nama tag baru..."
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddNewTag}
                    className="text-xs"
                  >
                    + Tag
                  </Button>
                </div>
              </div>
            </Card>

            {/* Cover Photo Uploader */}
            <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Gambar Cover Artikel
              </h3>

              <div className="space-y-3">
                {gambarCoverUrl && (
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 relative">
                    <img
                      src={gambarCoverUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setGambarCoverUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow-sm"
                      title="Hapus cover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <Input
                  label="Tautan Gambar Cover (URL)"
                  value={gambarCoverUrl}
                  onChange={(e) => setGambarCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />

                <div className="text-center">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                    <Camera className="w-4 h-4 text-brand-600" />
                    <span>{uploadingCover ? 'Mengunggah...' : 'Upload dari Perangkat'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="sr-only"
                      disabled={uploadingCover}
                    />
                  </label>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </form>

      {/* Cloud Link Attachment Modal */}
      <Modal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
        title="Lampirkan Tautan Cloud Storage / Embed"
        description="Tempelkan link dari Google Drive, Microsoft OneDrive, Canva, atau Google Docs/Slides/PDF."
        size="md"
      >
        <form onSubmit={handleAddCloudLink} className="space-y-4">
          <Input
            label="Nama Dokumen / File"
            required
            value={cloudLinkName}
            onChange={(e) => setCloudLinkName(e.target.value)}
            placeholder="Contoh: Modul Ajar Fikih Kelas 7 (Google Drive)"
          />

          <Input
            label="Tautan URL / Embed Code"
            required
            value={cloudLinkUrl}
            onChange={(e) => setCloudLinkUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/... atau OneDrive / Canva"
            helperText="Pastikan akses link Google Drive / OneDrive diset ke 'Siapa saja yang memiliki link (Anyone with link)'"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Tipe Layanan / Ekstensi
            </label>
            <select
              value={cloudLinkType}
              onChange={(e) => setCloudLinkType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm"
            >
              <option value="drive">Google Drive / Docs / Slides</option>
              <option value="onedrive">Microsoft OneDrive / Office 365</option>
              <option value="canva">Canva Presentation / Design</option>
              <option value="pdf">Dokumen PDF Online</option>
              <option value="link">Tautan Web / Lainnya</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setCloudModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Tambahkan Tautan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Embed Test Modal Preview */}
      {activeEmbedPreview && (
        <EmbedModalViewer
          isOpen={Boolean(activeEmbedPreview)}
          onClose={() => setActiveEmbedPreview(null)}
          url={activeEmbedPreview.url}
          title={activeEmbedPreview.title}
        />
      )}
    </div>
  );
};
