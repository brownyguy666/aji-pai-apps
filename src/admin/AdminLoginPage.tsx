import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signInWithEmail, isDemoMode, enableDemoAuth, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to admin
  React.useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await signInWithEmail(email, password);
      if (authError) {
        setError(authError.message || 'Gagal masuk. Periksa email dan kata sandi Anda.');
      } else {
        navigate('/admin');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    enableDemoAuth();
    navigate('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white shadow-xl shadow-brand-500/20 mb-2">
            <BookOpen className="w-7 h-7" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Masuk Panel Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola materi PAI, urutan landing page, terjemahan, dan galeri karya.
          </p>
        </div>

        {/* Demo Mode Notice Card */}
        {isDemoMode && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Mode Demo Lokal Aktif</span>
            </div>
            <p>
              Supabase URL & Anon Key belum terhubung di <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono">.env.local</code>. Anda dapat langsung masuk dengan tombol Coba Akses Demo.
            </p>
            <Button
              type="button"
              variant="gold"
              size="sm"
              onClick={handleDemoLogin}
              className="w-full justify-center text-xs font-bold"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
              Masuk Langsung (Demo Mode)
            </Button>
          </div>
        )}

        {/* Login Card Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Alamat Email Admin"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pai-apps.edu"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Kata Sandi"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full justify-center shadow-lg shadow-brand-600/20 font-bold"
            >
              <Shield className="w-4 h-4 mr-2" />
              Masuk ke Dashboard
            </Button>
          </form>

          <div className="pt-2 text-center">
            <Link
              to="/"
              className="text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors"
            >
              ← Kembali ke Beranda Utama
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
