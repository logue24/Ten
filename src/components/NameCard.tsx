import React from 'react';
import { Volume2, Heart, Scale, Sparkles, ArrowUpRight } from 'lucide-react';
import type { NameAnalysis } from '../utils/nameScorer.ts';
import { WORD_MEANINGS } from '../utils/nameScorer.ts';

interface NameCardProps {
  nameItem: NameAnalysis;
  selectedSurname?: string;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (name: NameAnalysis) => void;
  onToggleCompare: (name: NameAnalysis) => void;
  onOpenDetail: (name: NameAnalysis) => void;
}

export const NameCard: React.FC<NameCardProps> = ({
  nameItem,
  selectedSurname,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onOpenDetail
}) => {
  const speakName = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = selectedSurname ? `${selectedSurname} ${nameItem.fullName}` : nameItem.fullName;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const han1 = WORD_MEANINGS[nameItem.word1]?.han || '';
  const han2 = WORD_MEANINGS[nameItem.word2]?.han || '';

  return (
    <div
      onClick={() => onOpenDetail(nameItem)}
      className="group relative cursor-pointer bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Gender and special status */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                nameItem.gender === 'Nữ'
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  : nameItem.gender === 'Nam'
                  ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              }`}
            >
              {nameItem.gender}
            </span>

            {nameItem.isRecommendedTop && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                Tinh Hoa
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Pronunciation TTS */}
            <button
              onClick={speakName}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
              title="Nghe phát âm tiếng Việt"
              aria-label={`Nghe phát âm ${nameItem.fullName}`}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {/* Compare toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(nameItem);
              }}
              className={`p-1.5 rounded-lg transition border ${
                isCompared
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-indigo-300 hover:bg-slate-700'
              }`}
              title={isCompared ? 'Bỏ so sánh' : 'Thêm vào bảng so sánh'}
              aria-label={`So sánh ${nameItem.fullName}`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Favorite toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(nameItem);
              }}
              className={`p-1.5 rounded-lg transition border ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-rose-400 hover:bg-slate-700'
              }`}
              title={isFavorite ? 'Bỏ yêu thích' : 'Lưu vào danh sách'}
              aria-label={`Yêu thích ${nameItem.fullName}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Name & Surname combination */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              {selectedSurname && (
                <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-wider block mb-0.5">
                  {selectedSurname}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight flex items-baseline gap-2">
                <span>{nameItem.fullName}</span>
                <span className="text-[11px] font-normal text-slate-400 group-hover:text-slate-300">
                  ({nameItem.toneHarmony})
                </span>
              </h3>
            </div>

            {/* Total score */}
            <div className="flex flex-col items-end">
              <span className="text-lg font-black text-amber-400 leading-none">
                {nameItem.totalScore}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Điểm tổng</span>
            </div>
          </div>

          {/* International Western guide */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 text-xs">
            <span className="font-semibold text-slate-400">Tây đọc:</span>
            <span className="font-mono font-medium text-white">{nameItem.intlPhonetic}</span>
          </div>
        </div>

        {/* Meaning snippet */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {nameItem.meaning}
        </p>
      </div>

      {/* Metric Visual Bars */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="space-y-2">
          {/* International Score */}
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400">Dễ gọi Quốc tế</span>
              <span className="font-bold text-emerald-400">{nameItem.intlScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${nameItem.intlScore}%` }}
              />
            </div>
          </div>

          {/* Uniqueness Score */}
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400">Độc đáo (Chưa bão hòa)</span>
              <span className="font-bold text-indigo-400">{nameItem.uniqueScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${nameItem.uniqueScore}%` }}
              />
            </div>
          </div>

          {/* Domestic VN Score */}
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400">Ý nghĩa & Thanh điệu</span>
              <span className="font-bold text-rose-400">{nameItem.vnScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${nameItem.vnScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer info & click detail */}
        <div className="mt-3.5 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-300 transition-colors">
          <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
            {nameItem.intlEquivalentNote}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-medium">
            <span>Chi tiết</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
