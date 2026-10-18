import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import type { FilterState } from '../utils/namesData.ts';
import { POPULAR_SURNAMES } from '../utils/namesData.ts';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  selectedSurname: string;
  onSelectSurname: (surname: string) => void;
  totalFilteredCount: number;
}

const FIRST_WORDS_LIST = [
  'Tất cả', 'An', 'Anh', 'Châu', 'Duy', 'Gia', 'Giang', 'Hải', 'Huy', 'Khang',
  'Khoa', 'Kim', 'Lan', 'Lâm', 'Linh', 'Long', 'Mai', 'Minh', 'Nam', 'Nhi',
  'Phát', 'Phong', 'Phương', 'Quang', 'Quân', 'Sơn', 'Thanh', 'Thiên', 'Thơ', 'Thư', 'Vinh', 'Vy'
];

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  selectedSurname,
  onSelectSurname,
  totalFilteredCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
      {/* Search Bar + Primary Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Tìm theo tên (ví dụ: An, Châu, Duy...), âm đọc Tây (Ahn, Chow), ý nghĩa..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Surname Pairing Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="surname-select" className="text-xs text-slate-300 font-medium whitespace-nowrap">
            Thử ghép họ:
          </label>
          <select
            id="surname-select"
            value={selectedSurname}
            onChange={(e) => onSelectSurname(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">(Không ghép họ)</option>
            {POPULAR_SURNAMES.map((s) => (
              <option key={s} value={s}>
                Họ {s}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-slate-300 font-medium whitespace-nowrap">
            Sắp xếp:
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="totalScore">⭐ Điểm Tổng Hợp Cao Nhất</option>
            <option value="intlScore">🌍 Dễ Gọi Quốc Tế Nhất</option>
            <option value="uniqueScore">💎 Độc Bản (Ít trùng nhất)</option>
            <option value="vnScore">📜 Ý Nghĩa & Thanh Điệu</option>
            <option value="alphabetical">🔤 Bảng Chữ Cái (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Preset tabs & Gender toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onFilterChange({ presetFilter: 'all' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filters.presetFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Tất cả ({totalFilteredCount})
          </button>
          <button
            onClick={() => onFilterChange({ presetFilter: 'top_elite' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              filters.presetFilter === 'top_elite'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            Top Tinh Hoa Nhất
          </button>
          <button
            onClick={() => onFilterChange({ presetFilter: 'global_easy' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filters.presetFilter === 'global_easy'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            🌍 Chuẩn Quốc Tế
          </button>
          <button
            onClick={() => onFilterChange({ presetFilter: 'hidden_gems' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filters.presetFilter === 'hidden_gems'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            💎 Độc Bản (Không đại trà)
          </button>
        </div>

        {/* Gender toggles */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['Tất cả', 'Nam', 'Nữ', 'Unisex'] as const).map((g) => (
            <button
              key={g}
              onClick={() => onFilterChange({ gender: g })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filters.gender === g
                  ? 'bg-slate-800 text-amber-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {g === 'Tất cả' ? 'Mọi giới tính' : g}
            </button>
          ))}
        </div>

        {/* Toggle Advanced filter sliders */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition ml-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Bộ lọc điểm chi tiết</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Advanced sliders drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl">
          {/* First word filter */}
          <div>
            <label htmlFor="first-word-select" className="block text-xs font-medium text-slate-300 mb-1">
              Chữ đệm đầu tiên:
            </label>
            <select
              id="first-word-select"
              value={filters.firstLetter}
              onChange={(e) => onFilterChange({ firstLetter: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
            >
              {FIRST_WORDS_LIST.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Min International score slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Điểm Quốc Tế tối thiểu:</span>
              <span className="font-bold text-emerald-400">{filters.minIntlScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={filters.minIntlScore}
              onChange={(e) => onFilterChange({ minIntlScore: Number(e.target.value) })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Min Uniqueness score slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Độ Độc Đáo tối thiểu:</span>
              <span className="font-bold text-indigo-400">{filters.minUniqueScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={filters.minUniqueScore}
              onChange={(e) => onFilterChange({ minUniqueScore: Number(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <button
              onClick={onResetFilters}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
