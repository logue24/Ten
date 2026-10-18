import React from 'react';
import { Sparkles, Trophy, Globe, Compass, Star, ArrowRight, Volume2 } from 'lucide-react';
import type { NameAnalysis } from '../utils/nameScorer.ts';

interface CuratedHeroBentoProps {
  topPicks: NameAnalysis[];
  onSelectName: (name: NameAnalysis) => void;
  onQuickApplyFilter: (preset: 'top_elite' | 'global_easy' | 'hidden_gems' | 'boys_noble' | 'girls_elegant') => void;
}

export const CuratedHeroBento: React.FC<CuratedHeroBentoProps> = ({
  topPicks,
  onSelectName,
  onQuickApplyFilter
}) => {
  const speakName = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="mb-10 pt-4">
      {/* Editorial Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/60 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Kết Quả Tuyển Chọn Tối Ưu Từ 1,200+ Tổ Hợp</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Những Cái Tên <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300">Đẹp Nhất, Quốc Tế Dễ Dùng</span> & Chưa Bị Đại Trà Internet
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Lọc bỏ hoàn toàn các tên bị bão hòa (như Minh Anh, Gia Huy, Bảo Nam...) và những âm khiến người phương Tây phát âm sai lệch (như vần "Nguyên", "Duyên", "Phương", "Phát"). Dưới đây là những tên đạt điểm tối ưu 3 chiều: <strong className="text-amber-200">90+ điểm Quốc tế</strong>, <strong className="text-rose-200">Thanh điệu Hán Việt tao nhã</strong>, và <strong className="text-indigo-200">Độc bản thanh lịch</strong>.
          </p>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 mr-1">Bộ lọc nhanh:</span>
            <button
              onClick={() => onQuickApplyFilter('top_elite')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Trophy className="w-3 h-3 text-amber-400" />
              Top Tinh Hoa Nhất
            </button>
            <button
              onClick={() => onQuickApplyFilter('global_easy')}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Globe className="w-3 h-3 text-indigo-400" />
              Chuẩn Quốc Tế (Tây đọc siêu mượt)
            </button>
            <button
              onClick={() => onQuickApplyFilter('hidden_gems')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Compass className="w-3 h-3 text-emerald-400" />
              Độc Bản (Không đại trà)
            </button>
            <button
              onClick={() => onQuickApplyFilter('girls_elegant')}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-medium transition"
            >
              🌸 Tên Nữ Đài Các
            </button>
            <button
              onClick={() => onQuickApplyFilter('boys_noble')}
              className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-medium transition"
            >
              ⚔️ Tên Nam Khí Chất
            </button>
          </div>
        </div>
      </div>

      {/* Featured 6 Spotlight Cards in Bento Grid */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Top 6 Tên Tiêu Biểu Hội Tụ Hoàn Hảo 3 Tiêu Chí</span>
          </h3>
          <p className="text-xs text-slate-400">
            Click vào tên để xem giải mã Hán Việt, phiên âm quốc tế & phân tích thanh điệu
          </p>
        </div>
        <button
          onClick={() => onQuickApplyFilter('top_elite')}
          className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition"
        >
          <span>Xem tất cả ({topPicks.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topPicks.slice(0, 6).map((item, idx) => (
          <div
            key={item.fullName}
            onClick={() => onSelectName(item)}
            className="group relative cursor-pointer rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
          >
            {/* Top row */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <span className="text-amber-400 font-bold">#{idx + 1}</span>
                  <span>{item.gender}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => speakName(e, item.fullName)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
                    title={`Nghe phát âm "${item.fullName}"`}
                    aria-label={`Nghe phát âm ${item.fullName}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-baseline gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                    <span className="text-xs font-extrabold text-amber-400">{item.totalScore}</span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </div>
                </div>
              </div>

              {/* Name Display */}
              <div className="mb-2">
                <h4 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight">
                  {item.fullName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                    🌍 Tây đọc: {item.intlPhonetic}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({item.toneHarmony})
                  </span>
                </div>
              </div>

              {/* Meaning snippet */}
              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                {item.meaning}
              </p>
            </div>

            {/* Metrics pills */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Quốc tế</div>
                  <div className="text-xs font-bold text-emerald-400">{item.intlScore}%</div>
                </div>
                <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Độc đáo</div>
                  <div className="text-xs font-bold text-indigo-400">{item.uniqueScore}%</div>
                </div>
                <div className="bg-slate-950/60 rounded-lg p-1.5 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Nội địa</div>
                  <div className="text-xs font-bold text-rose-400">{item.vnScore}%</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-amber-400/90 font-medium group-hover:text-amber-300">
                <span>{item.intlEquivalentNote}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
