import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-28 max-w-md mx-auto text-center px-4 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mx-auto shadow-lg">
        <BookOpen className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold font-display text-slate-900 dark:text-white">404</h1>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Mohon maaf, halaman yang Anda tuju tidak tersedia atau tautan sudah usang.
        </p>
      </div>
      <Link to="/">
        <Button variant="primary" size="md">
          <Home className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
};
