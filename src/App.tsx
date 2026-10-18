import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { CuratedHeroBento } from './components/CuratedHeroBento.tsx';
import { FilterControls } from './components/FilterControls.tsx';
import { NameCard } from './components/NameCard.tsx';
import { NameDetailModal } from './components/NameDetailModal.tsx';
import { CompareDrawer } from './components/CompareDrawer.tsx';
import { FavoritesModal } from './components/FavoritesModal.tsx';
import { AnalysisMethodologyModal } from './components/AnalysisMethodologyModal.tsx';
import {
  ALL_ANALYZED_NAMES,
  TOP_RECOMMENDED_NAMES,
  filterNames,
  type FilterState
} from './utils/namesData.ts';
import type { NameAnalysis } from './utils/nameScorer.ts';
import { Sparkles, Trophy, Globe, Compass, ArrowDown, Check, Heart, ShieldCheck } from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  gender: 'Tất cả',
  firstLetter: 'Tất cả',
  minIntlScore: 0,
  minUniqueScore: 0,
  minVnScore: 0,
  presetFilter: 'all',
  sortBy: 'totalScore'
};

const PAGE_SIZE = 24;

export default function App() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedSurname, setSelectedSurname] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Modals & drawers
  const [selectedNameForDetail, setSelectedNameForDetail] = useState<NameAnalysis | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // LocalStorage state for favorites and compare list
  const [favoriteNames, setFavoriteNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vietname_select_favorites');
      return saved ? JSON.parse(saved) : ['An Châu', 'Duy An', 'An Vy'];
    } catch {
      return ['An Châu', 'Duy An', 'An Vy'];
    }
  });

  const [compareNames, setCompareNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vietname_select_compare');
      return saved ? JSON.parse(saved) : ['An Châu', 'An Vy'];
    } catch {
      return ['An Châu', 'An Vy'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vietname_select_favorites', JSON.stringify(favoriteNames));
    } catch {
      // ignore
    }
  }, [favoriteNames]);

  useEffect(() => {
    try {
      localStorage.setItem('vietname_select_compare', JSON.stringify(compareNames));
    } catch {
      // ignore
    }
  }, [compareNames]);

  // Compute filtered list
  const filteredList = useMemo(() => {
    return filterNames(ALL_ANALYZED_NAMES, filters);
  }, [filters]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const displayedList = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  // Toggle favorite
  const handleToggleFavorite = (name: NameAnalysis) => {
    setFavoriteNames((prev) => {
      if (prev.includes(name.fullName)) {
        return prev.filter((n) => n !== name.fullName);
      } else {
        return [...prev, name.fullName];
      }
    });
  };

  // Toggle compare
  const handleToggleCompare = (name: NameAnalysis) => {
    setCompareNames((prev) => {
      if (prev.includes(name.fullName)) {
        return prev.filter((n) => n !== name.fullName);
      } else {
        if (prev.length >= 4) {
          return [...prev.slice(1), name.fullName];
        }
        return [...prev, name.fullName];
      }
    });
  };

  // Favorite NameAnalysis objects
  const favoriteObjects = useMemo(() => {
    return ALL_ANALYZED_NAMES.filter((n) => favoriteNames.includes(n.fullName));
  }, [favoriteNames]);

  // Compare NameAnalysis objects
  const compareObjects = useMemo(() => {
    return ALL_ANALYZED_NAMES.filter((n) => compareNames.includes(n.fullName));
  }, [compareNames]);

  // Quick preset apply
  const handleQuickApplyFilter = (
    preset: 'top_elite' | 'global_easy' | 'hidden_gems' | 'boys_noble' | 'girls_elegant'
  ) => {
    if (preset === 'top_elite') {
      setFilters({ ...DEFAULT_FILTERS, presetFilter: 'top_elite' });
    } else if (preset === 'global_easy') {
      setFilters({ ...DEFAULT_FILTERS, presetFilter: 'global_easy', minIntlScore: 85 });
    } else if (preset === 'hidden_gems') {
      setFilters({ ...DEFAULT_FILTERS, presetFilter: 'hidden_gems', minUniqueScore: 85 });
    } else if (preset === 'boys_noble') {
      setFilters({ ...DEFAULT_FILTERS, gender: 'Nam', presetFilter: 'top_elite' });
    } else if (preset === 'girls_elegant') {
      setFilters({ ...DEFAULT_FILTERS, gender: 'Nữ', presetFilter: 'top_elite' });
    }

    const element = document.getElementById('filter-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        totalCount={ALL_ANALYZED_NAMES.length}
        favoritesCount={favoriteNames.length}
        compareCount={compareNames.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Curated Hero Bento Section */}
        <CuratedHeroBento
          topPicks={TOP_RECOMMENDED_NAMES}
          onSelectName={(n) => setSelectedNameForDetail(n)}
          onQuickApplyFilter={handleQuickApplyFilter}
        />

        {/* Filter Section Anchor */}
        <div id="filter-section" className="pt-2">
          {/* Filter Controls Component */}
          <FilterControls
            filters={filters}
            onFilterChange={(newF) => setFilters((prev) => ({ ...prev, ...newF }))}
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
            selectedSurname={selectedSurname}
            onSelectSurname={setSelectedSurname}
            totalFilteredCount={filteredList.length}
          />
        </div>

        {/* Results Count & Current Filter Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">
              Đã lọc được <span className="text-amber-400 font-extrabold">{filteredList.length}</span> tên phù hợp
            </span>
            <span className="text-xs text-slate-400">
              (trên tổng số {ALL_ANALYZED_NAMES.length} tổ hợp)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedSurname && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                Đang ghép họ: <strong>{selectedSurname}</strong>
              </span>
            )}
            {filters.presetFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                Bộ lọc: {filters.presetFilter}
              </span>
            )}
          </div>
        </div>

        {/* Name Cards Grid */}
        {displayedList.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-12 text-center my-6">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Không tìm thấy tên phù hợp</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              Không có tên nào thỏa mãn đồng thời các tiêu chuẩn điểm số bạn vừa chọn. Hãy thử hạ bớt ngưỡng lọc hoặc bấm khôi phục mặc định.
            </p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Khôi phục bộ lọc mặc định
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedList.map((item) => (
              <NameCard
                key={item.fullName}
                nameItem={item}
                selectedSurname={selectedSurname}
                isFavorite={favoriteNames.includes(item.fullName)}
                isCompared={compareNames.includes(item.fullName)}
                onToggleFavorite={handleToggleFavorite}
                onToggleCompare={handleToggleCompare}
                onOpenDetail={(n) => setSelectedNameForDetail(n)}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredList.length && (
          <div className="mt-10 mb-6 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-sm font-semibold text-slate-200 hover:text-white transition shadow-lg hover:border-amber-500/40"
            >
              <span>Xem thêm {Math.min(PAGE_SIZE, filteredList.length - visibleCount)} tên tiếp theo</span>
              <ArrowDown className="w-4 h-4 text-amber-400" />
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Đang hiển thị {visibleCount} / {filteredList.length} tên
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-8 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-medium text-slate-300">
            VietName Select • Bộ Tuyển Chọn Tên Song Hành Quốc Tế & Thuần Việt
          </p>
          <p className="text-slate-500 max-w-xl mx-auto">
            Hệ thống đánh giá dựa trên cơ sở ngữ âm học (Phonetics), từ nguyên Hán Việt (Etymology) và luật thanh điệu Bằng - Trắc. Tối ưu cho thế hệ công dân toàn cầu không gặp trở ngại khi giao tiếp quốc tế.
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <NameDetailModal
        nameItem={selectedNameForDetail}
        selectedSurname={selectedSurname}
        isFavorite={selectedNameForDetail ? favoriteNames.includes(selectedNameForDetail.fullName) : false}
        isCompared={selectedNameForDetail ? compareNames.includes(selectedNameForDetail.fullName) : false}
        onClose={() => setSelectedNameForDetail(null)}
        onToggleFavorite={handleToggleFavorite}
        onToggleCompare={handleToggleCompare}
      />

      <CompareDrawer
        comparedNames={compareObjects}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemove={(fullName) => setCompareNames((prev) => prev.filter((n) => n !== fullName))}
        onClear={() => setCompareNames([])}
        onOpenDetail={(n) => {
          setIsCompareOpen(false);
          setSelectedNameForDetail(n);
        }}
      />

      <FavoritesModal
        favorites={favoriteObjects}
        isOpen={isFavoritesOpen}
        selectedSurname={selectedSurname}
        onClose={() => setIsFavoritesOpen(false)}
        onRemove={(fullName) => setFavoriteNames((prev) => prev.filter((n) => n !== fullName))}
        onClear={() => setFavoriteNames([])}
        onOpenDetail={(n) => {
          setIsFavoritesOpen(false);
          setSelectedNameForDetail(n);
        }}
      />

      <AnalysisMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}
