import React, { useState, useEffect } from 'react';
import { User, Upload, Save, Sparkles, Mail, Camera, Phone } from 'lucide-react';
import {
  YoutubeIcon,
  InstagramIcon,
  WhatsAppIcon,
  TelegramIcon,
  FacebookIcon,
  GithubIcon,
} from '../components/ui/Icons';
import { useProfile } from '../hooks/useProfile';
import { uploadImage } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';

export const ProfileEditor: React.FC = () => {
  const { profile, updateProfile, isUpdating } = useProfile();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    nama: '',
    tagline: '',
    bio: '',
    foto_url: '',
    email: '',
    youtube_channel_id: '',
    socials: {
      youtube: '',
      instagram: '',
      facebook: '',
      whatsapp: '',
      telegram: '',
      github: '',
    },
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        nama: profile.nama || '',
        tagline: profile.tagline || '',
        bio: profile.bio || '',
        foto_url: profile.foto_url || '',
        email: profile.email || '',
        youtube_channel_id: profile.youtube_channel_id || '',
        socials: {
          youtube: profile.socials?.youtube || '',
          instagram: profile.socials?.instagram || '',
          facebook: profile.socials?.facebook || '',
          whatsapp: profile.socials?.whatsapp || '',
          telegram: profile.socials?.telegram || '',
          github: profile.socials?.github || '',
        },
      });
    }
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const publicUrl = await uploadImage(file, 'profile');
      setFormData((prev) => ({ ...prev, foto_url: publicUrl }));
      success('Foto profil berhasil diunggah!');
    } catch (err) {
      toastError('Gagal mengunggah foto profil.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      success('Informasi profil dan bio berhasil disimpan!');
    } catch (err) {
      toastError('Gagal menyimpan profil.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600">
            <User className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Edit Profil & Bio Pendidik
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sesuaikan data diri, foto profil beranda, kontak resmi, dan tautan sosial media Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Foto & Informasi Dasar */}
        <Card className="p-6 space-y-6 bg-white dark:bg-slate-900">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Foto & Identitas Utama
          </h3>

          {/* Photo Uploader */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-brand-500 shadow-md group shrink-0">
              <img
                src={
                  formData.foto_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                }
                alt="Foto Profil"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-xs font-semibold">
                <Camera className="w-6 h-6 mb-1" />
                <span>Ganti Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Unggah Foto Profil Berkualitas Tinggi
              </p>
              <p className="text-xs text-slate-500 max-w-md">
                Disarankan rasio kotak (1:1), format JPG/PNG/WebP, resolusi minimal 500x500 piksel. Foto akan langsung tersimpan di Supabase Storage.
              </p>
              <div className="pt-1">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingPhoto ? 'Mengunggah...' : 'Pilih File Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap & Gelar"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Ahmad Fauzi, S.Pd.I., M.Ag."
            />

            <Input
              label="Tagline Profesional"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Contoh: Guru PAI & Penerjemah Turats"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Biografi Lengkap
            </label>
            <textarea
              rows={4}
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tuliskan pengalaman mengajar, latar belakang keilmuan, dan visi pendidikan Islam Anda..."
              className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </Card>

        {/* Card 2: Kontak & Media Sosial */}
        <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Kontak & Tautan Media Sosial
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Alamat Email Kontak"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ahmad.fauzi@gmail.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Link WhatsApp"
              value={formData.socials.whatsapp}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socials: { ...formData.socials, whatsapp: e.target.value },
                })
              }
              placeholder="https://wa.me/6281234567890"
              leftIcon={<WhatsAppIcon className="w-4 h-4 text-emerald-500" />}
            />

            <Input
              label="Link Channel YouTube"
              value={formData.socials.youtube}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socials: { ...formData.socials, youtube: e.target.value },
                })
              }
              placeholder="https://youtube.com/@edukasipai"
              leftIcon={<YoutubeIcon className="w-4 h-4 text-red-500" />}
            />

            <Input
              label="Link Instagram"
              value={formData.socials.instagram}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socials: { ...formData.socials, instagram: e.target.value },
                })
              }
              placeholder="https://instagram.com/ahmadfauzi.pai"
              leftIcon={<InstagramIcon className="w-4 h-4 text-pink-500" />}
            />

            <Input
              label="Link Telegram"
              value={formData.socials.telegram}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socials: { ...formData.socials, telegram: e.target.value },
                })
              }
              placeholder="https://t.me/ahmadfauzipai"
              leftIcon={<TelegramIcon className="w-4 h-4 text-sky-500" />}
            />

            <Input
              label="Link GitHub (Opsional)"
              value={formData.socials.github}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socials: { ...formData.socials, github: e.target.value },
                })
              }
              placeholder="https://github.com/username"
              leftIcon={<GithubIcon className="w-4 h-4 text-slate-500" />}
            />
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isUpdating}
            className="shadow-lg shadow-brand-600/20 font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan Perubahan Profil
          </Button>
        </div>
      </form>
    </div>
  );
};
