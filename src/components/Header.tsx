import React from 'react';
import { Sparkles, Globe2, Heart, Scale, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  favoritesCount: number;
  compareCount: number;
  onOpenFavorites: () => void;
  onOpenCompare: () => void;
  onOpenMethodology: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  favoritesCount,
  compareCount,
  onOpenFavorites,
  onOpenCompare,
  onOpenMethodology
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/10 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>VietName</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 font-extrabold">
                  Select
                </span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                1,200+ Tên Độc Bản
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Bộ Lọc Tên Tinh Hoa Song Hành: Dễ Quốc Tế • Sâu Ý Nghĩa • Chưa Đại Trà Internet
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Methodology Info button */}
          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition"
            title="Xem tiêu chí chấm điểm khoa học"
            aria-label="Tiêu chí chấm điểm"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Tiêu chí lọc</span>
          </button>

          {/* Compare drawer trigger */}
          <button
            onClick={onOpenCompare}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition border ${
              compareCount > 0
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
            }`}
            aria-label={`So sánh tên, hiện có ${compareCount} tên`}
          >
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">So sánh</span>
            {compareCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                {compareCount}
              </span>
            )}
          </button>

          {/* Shortlist / Favorites */}
          <button
            onClick={onOpenFavorites}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition border ${
              favoritesCount > 0
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 shadow-sm shadow-rose-500/10'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
            }`}
            aria-label={`Danh sách yêu thích, hiện có ${favoritesCount} tên`}
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-rose-400 fill-rose-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Yêu thích</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
