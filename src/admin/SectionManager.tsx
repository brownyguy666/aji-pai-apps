import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  MoveVertical,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Layers,
  BookOpen,
  Languages,
  Palette,
  Phone,
  User,
} from 'lucide-react';
import { YoutubeIcon } from '../components/ui/Icons';
import { useSections } from '../hooks/useSections';
import { SectionItem } from '../types/database';
import { Switch } from '../components/ui/Switch';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

// Icon mapper for section keys
function getSectionIcon(key: string) {
  switch (key) {
    case 'hero':
      return <User className="w-5 h-5 text-indigo-500" />;
    case 'materi':
      return <BookOpen className="w-5 h-5 text-brand-500" />;
    case 'youtube':
      return <YoutubeIcon className="w-5 h-5 text-red-500" />;
    case 'terjemahan':
      return <Languages className="w-5 h-5 text-amber-500" />;
    case 'karya':
      return <Palette className="w-5 h-5 text-teal-500" />;
    case 'kontak':
      return <Phone className="w-5 h-5 text-emerald-500" />;
    default:
      return <Layers className="w-5 h-5 text-slate-400" />;
  }
}

// Sortable Item Component
const SortableSectionRow: React.FC<{
  section: SectionItem;
  onToggle: (id: string, active: boolean) => void;
}> = ({ section, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
        isDragging
          ? 'bg-brand-50/80 dark:bg-brand-950/80 border-brand-500 shadow-2xl scale-[1.02]'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-brand-300 dark:hover:border-brand-800'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 touch-none"
          title="Tahan dan geser untuk ubah urutan"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Section Order Badge */}
        <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center font-display shrink-0">
          #{section.urutan}
        </span>

        {/* Section Icon */}
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 shrink-0">
          {getSectionIcon(section.key)}
        </div>

        {/* Label & Key */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {section.label}
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
              key: {section.key}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {section.is_active ? 'Ditampilkan pada beranda' : 'Disembunyikan dari beranda'}
          </p>
        </div>
      </div>

      {/* Visibility Toggle Switch */}
      <div className="flex items-center gap-3 shrink-0 pl-2">
        <Switch
          checked={section.is_active}
          onChange={(checked) => onToggle(section.id, checked)}
          label={section.is_active ? 'Aktif' : 'Nonaktif'}
        />
      </div>
    </div>
  );
};

export const SectionManager: React.FC = () => {
  const { sections, reorderSections, toggleActive, isReordering } = useSections();
  const [items, setItems] = useState<SectionItem[]>([]);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (sections) {
      setItems([...sections].sort((a, b) => a.urutan - b.urutan));
    }
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Update local state immediately
      setItems(newItems);

      try {
        await reorderSections(newItems);
        success('Urutan section landing page berhasil diperbarui!');
      } catch (err) {
        toastError('Gagal menyimpan urutan section.');
      }
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await toggleActive({ id, is_active: active });
      success(`Status section berhasil ${active ? 'diaktifkan' : 'dinonaktifkan'}!`);
    } catch (err) {
      toastError('Gagal memperbarui status section.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
            <MoveVertical className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            Pengaturan Tata Letak Modular Landing Page
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Ubah urutan section pada landing page dengan cara <strong>menyeret (drag and drop)</strong> baris di bawah. Aktifkan atau nonaktifkan section sesuai kebutuhan. Perubahan tersimpan secara otomatis.
        </p>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-900 dark:text-brand-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Urutan Dinamis Otomatis Tersinkron</p>
          <p className="text-brand-700 dark:text-brand-300">
            Halaman publik <code>/</code> membaca urutan dan status langsung dari database tanpa perlu redeploy kode.
          </p>
        </div>
      </div>

      {/* DND Sortable Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((section) => (
              <SortableSectionRow
                key={section.id}
                section={section}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Helper Footer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>Total Section: {items.length}</span>
        <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          {isReordering ? 'Menyimpan...' : 'Sinkronisasi Otomatis'}
        </span>
      </div>
    </div>
  );
};
