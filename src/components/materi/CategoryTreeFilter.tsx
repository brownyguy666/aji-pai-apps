import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Layers, Check } from 'lucide-react';
import { KategoriMateri } from '../../types/database';
import { cn } from '../../lib/utils';

export interface CategoryTreeFilterProps {
  categoryTree: KategoriMateri[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategoryTreeFilter: React.FC<CategoryTreeFilterProps> = ({
  categoryTree,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Expand roots by default
    return new Set(categoryTree.map((c) => c.id));
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderNode = (node: KategoriMateri, level = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedCategoryId === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectCategory(isSelected ? null : node.id)}
          className={cn(
            'flex items-center justify-between py-2 px-2.5 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-all group',
            isSelected
              ? 'bg-brand-600 text-white shadow-sm font-semibold'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
          style={{ paddingLeft: `${Math.max(10, level * 16 + 10)}px` }}
        >
          <div className="flex items-center gap-2 truncate">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5" />
            )}

            {level === 0 ? (
              <Layers className={cn('w-4 h-4 shrink-0', isSelected ? 'text-white' : 'text-brand-600 dark:text-brand-400')} />
            ) : isExpanded ? (
              <FolderOpen className={cn('w-3.5 h-3.5 shrink-0', isSelected ? 'text-white' : 'text-amber-500')} />
            ) : (
              <Folder className={cn('w-3.5 h-3.5 shrink-0', isSelected ? 'text-white' : 'text-slate-400')} />
            )}

            <span className="truncate">{node.nama}</span>
          </div>

          {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5 border-l border-slate-200 dark:border-slate-800 ml-4 pl-1">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-brand-600" />
          Kategori Bertingkat
        </h4>
        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      <div
        onClick={() => onSelectCategory(null)}
        className={cn(
          'flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors',
          selectedCategoryId === null
            ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        )}
      >
        <span>Semua Materi & Modul</span>
        {selectedCategoryId === null && <Check className="w-4 h-4 text-brand-600" />}
      </div>

      <div className="space-y-0.5 pt-1">
        {categoryTree.map((root) => renderNode(root, 0))}
      </div>
    </div>
  );
};
