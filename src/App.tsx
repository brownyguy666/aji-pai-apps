import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';

// Public Layout & Pages
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { MateriListPage } from './pages/MateriListPage';
import { MateriDetailPage } from './pages/MateriDetailPage';
import { TerjemahanPage } from './pages/TerjemahanPage';
import { KaryaPage } from './pages/KaryaPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Layout & Pages
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { SectionManager } from './admin/SectionManager';
import { ProfileEditor } from './admin/ProfileEditor';
import { MateriManager } from './admin/MateriManager';
import { MateriFormPage } from './admin/MateriFormPage';
import { KategoriManager } from './admin/KategoriManager';
import { TerjemahanManager } from './admin/TerjemahanManager';
import { KaryaManager } from './admin/KaryaManager';
import { YouTubeManager } from './admin/YouTubeManager';
import { SertifikasiManager } from './admin/SertifikasiManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Website Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="materi" element={<MateriListPage />} />
                <Route path="materi/:slug" element={<MateriDetailPage />} />
                <Route path="terjemahan" element={<TerjemahanPage />} />
                <Route path="karya" element={<KaryaPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Protected Dashboard Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="sections" element={<SectionManager />} />
                <Route path="sertifikasi" element={<SertifikasiManager />} />
                <Route path="profile" element={<ProfileEditor />} />
                <Route path="materi" element={<MateriManager />} />
                <Route path="materi/new" element={<MateriFormPage />} />
                <Route path="materi/edit/:id" element={<MateriFormPage />} />
                <Route path="kategori" element={<KategoriManager />} />
                <Route path="terjemahan" element={<TerjemahanManager />} />
                <Route path="karya" element={<KaryaManager />} />
                <Route path="youtube" element={<YouTubeManager />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
