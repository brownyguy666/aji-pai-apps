import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Briefcase,
  Award,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Calendar,
  CheckCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useRiwayat } from '../hooks/useRiwayat';
import { Riwayat } from '../types/database';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const RiwayatManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pendidikan' | 'organisasi' | 'pengalaman' | 'sertifikasi'>('all');
  const { riwayatList, createRiwayat, updateRiwayat, deleteRiwayat, seedRiwayat, isSeeding, isLoading } = useRiwayat({
    jenis: activeTab,
  });
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Riwayat | null>(null);

  const [judul, setJudul] = useState('');
  const [instansiOrganisasi, setInstansiOrganisasi] = useState('');
  const [jenis, setJenis] = useState<'pendidikan' | 'organisasi' | 'pengalaman' | 'sertifikasi'>('pendidikan');
  const [tahunMulai, setTahunMulai] = useState<number>(new Date().getFullYear());
  const [tahunSelesai, setTahunSelesai] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState('');
  const [linkVerifikasi, setLinkVerifikasi] = useState('');
  const [badgeUrl, setBadgeUrl] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [accredibleId, setAccredibleId] = useState('');
  const [urutan, setUrutan] = useState<number>(0);

  const openCreateModal = () => {
    setEditingItem(null);
    setJudul('');
    setInstansiOrganisasi('');
    setJenis(activeTab === 'all' ? 'pendidikan' : activeTab);
    setTahunMulai(new Date().getFullYear());
    setTahunSelesai('');
    setDeskripsi('');
    setLinkVerifikasi('');
    setBadgeUrl('');
    setCertificateUrl('');
    setAccredibleId('');
    setUrutan(riwayatList.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (item: Riwayat) => {
    setEditingItem(item);
    setJudul(item.judul);
    setInstansiOrganisasi(item.instansi_organisasi);
    setJenis(item.jenis);
    setTahunMulai(item.tahun_mulai);
    setTahunSelesai(item.tahun_selesai ? item.tahun_selesai.toString() : '');
    setDeskripsi(item.deskripsi || '');
    setLinkVerifikasi(item.link_verifikasi || '');
    setBadgeUrl(item.badge_url || '');
    setCertificateUrl(item.certificate_url || '');
    setAccredibleId(item.accredible_id || '');
    setUrutan(item.urutan || 1);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !instansiOrganisasi.trim()) return;

    try {
      if (editingItem) {
        await updateRiwayat({
          id: editingItem.id,
          updates: {
            judul,
            instansi_organisasi: instansiOrganisasi,
            jenis,
            tahun_mulai: Number(tahunMulai),
            tahun_selesai: tahunSelesai ? Number(tahunSelesai) : null,
            deskripsi: deskripsi || null,
            link_verifikasi: linkVerifikasi || null,
            badge_url: badgeUrl || null,
            certificate_url: certificateUrl || null,
            accredible_id: accredibleId || null,
            urutan: Number(urutan),
          },
        });
        success('Data riwayat berhasil diperbarui!');
      } else {
        await createRiwayat({
          judul,
          instansi_organisasi: instansiOrganisasi,
          jenis,
          tahun_mulai: Number(tahunMulai),
          tahun_selesai: tahunSelesai ? Number(tahunSelesai) : null,
          deskripsi: deskripsi || null,
          link_verifikasi: linkVerifikasi || null,
          badge_url: badgeUrl || null,
          certificate_url: certificateUrl || null,
          accredible_id: accredibleId || null,
          urutan: Number(urutan),
          is_featured: true,
        });
        success('Riwayat baru berhasil ditambahkan!');
      }
      setModalOpen(false);
    } catch {
      toastError('Gagal menyimpan riwayat.');
    }
  };

  const handleSeed = async () => {
    try {
      await seedRiwayat();
      success('Rekam jejak awal berhasil disimpan ke Supabase!');
    } catch {
      toastError('Gagal menyimpan data awal.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus item riwayat ini?')) return;
    try {
      await deleteRiwayat(id);
      success('Item riwayat berhasil dihapus.');
    } catch {
      toastError('Gagal menghapus riwayat.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Google Certs Promo / Quick Switch Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-950 border border-blue-500/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-white">
              Ingin Mengatur Lencana & Sertifikat Resmi Google Accredible?
            </h3>
            <p className="text-xs text-slate-300">
              Kelola preview gambar sertifikat Google Educator L1, Gemini AI, dan verifikasi ID di menu Sertifikasi.
            </p>
          </div>
        </div>

        <Link to="/admin/sertifikasi" className="shrink-0">
          <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs shadow-md">
            Buka Sertifikasi Google
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
              Riwayat Pendidikan, Organisasi & Karir
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola linimasa rekam jejak akademik, kepengurusan MGMP/AGPAII, dan pengalaman mengajar di landing page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="md" onClick={handleSeed} isLoading={isSeeding}>
            <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
            Muat Data Standar
          </Button>
          <Button type="button" variant="primary" size="md" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Riwayat Baru
          </Button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        {[
          { key: 'all', label: 'Semua Jejak', icon: GraduationCap },
          { key: 'pendidikan', label: 'Pendidikan', icon: GraduationCap },
          { key: 'organisasi', label: 'Organisasi', icon: Users },
          { key: 'pengalaman', label: 'Pengalaman', icon: Briefcase },
          { key: 'sertifikasi', label: 'Kredensial & Lainnya', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Riwayat List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : riwayatList.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-white dark:bg-slate-900">
          <GraduationCap className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Belum ada data pada kategori ini.
          </h3>
          <Button variant="outline" size="sm" onClick={handleSeed}>
            Muat Data Standar
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {riwayatList.map((item) => (
            <Card key={item.id} className="p-5 flex items-start justify-between gap-4 bg-white dark:bg-slate-900 border">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {item.jenis}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {item.tahun_mulai} {item.tahun_selesai ? `– ${item.tahun_selesai}` : '– Sekarang'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                  {item.judul}
                </h3>
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {item.instansi_organisasi}
                </p>

                {item.deskripsi && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.deskripsi}
                  </p>
                )}

                {item.link_verifikasi && (
                  <a
                    href={item.link_verifikasi}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-1"
                  >
                    <span>Tautan Verifikasi Resmi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Item Riwayat' : 'Tambah Item Riwayat'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Judul / Nama Gelar / Jabatan / Sertifikat"
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Sarjana Pendidikan Agama Islam (S.Pd)"
          />

          <Input
            label="Instansi / Kampus / Organisasi / Penerbit"
            required
            value={instansiOrganisasi}
            onChange={(e) => setInstansiOrganisasi(e.target.value)}
            placeholder="Contoh: Institut Agama Islam (IAI) Ibrahimy Genteng"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Kategori Jenis
            </label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm"
            >
              <option value="pendidikan">Pendidikan Formal / PPG</option>
              <option value="organisasi">Organisasi & Komunitas Profesi</option>
              <option value="pengalaman">Pengalaman Mengajar & Karir</option>
              <option value="sertifikasi">Sertifikasi & Kredensial Resmi</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tahun Mulai"
              type="number"
              required
              value={tahunMulai.toString()}
              onChange={(e) => setTahunMulai(Number(e.target.value))}
            />
            <Input
              label="Tahun Selesai (Kosongkan jika aktif)"
              type="number"
              value={tahunSelesai}
              onChange={(e) => setTahunSelesai(e.target.value)}
              placeholder="Contoh: 2024"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Deskripsi Singkat / Catatan Prestasi
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Rincian fokus studi, peran kepengurusan, atau ruang lingkup kompetensi..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
            />
          </div>

          <Input
            label="Tautan Verifikasi / Kredensial URL (Opsional)"
            value={linkVerifikasi}
            onChange={(e) => setLinkVerifikasi(e.target.value)}
            placeholder="https://edu.google.accredible.com/..."
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Riwayat
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
