import React from 'react';
import { X, Scale, Trash2, ArrowRight, Volume2 } from 'lucide-react';
import type { NameAnalysis } from '../utils/nameScorer.ts';

interface CompareDrawerProps {
  comparedNames: NameAnalysis[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (fullName: string) => void;
  onClear: () => void;
  onOpenDetail: (name: NameAnalysis) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedNames,
  isOpen,
  onClose,
  onRemove,
  onClear,
  onOpenDetail
}) => {
  if (!isOpen) return null;

  const speak = (name: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Đóng bảng so sánh"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">
              Bảng So Sánh Chi Tiết ({comparedNames.length}/4 Tên)
            </h3>
          </div>
          {comparedNames.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>

        {comparedNames.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Scale className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-sm">Chưa có tên nào trong bảng so sánh.</p>
            <p className="text-xs text-slate-500 mt-1">
              Hãy bấm vào biểu tượng cân đong trên các thẻ tên để so sánh tối đa 4 tên cùng lúc!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
            {comparedNames.map((item) => (
              <div
                key={item.fullName}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.gender}
                    </span>
                    <button
                      onClick={() => onRemove(item.fullName)}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Bỏ tên này khỏi so sánh"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-xl font-bold text-white">{item.fullName}</h4>
                    <button
                      onClick={() => speak(item.fullName)}
                      className="p-1 rounded-md bg-slate-800 text-slate-300 hover:text-amber-400"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-indigo-300 font-mono mb-3">
                    🌍 {item.intlPhonetic}
                  </div>

                  {/* Scores comparison */}
                  <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tổng điểm:</span>
                      <strong className="text-amber-400 font-bold">{item.totalScore}/100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dễ quốc tế:</span>
                      <span className="text-emerald-400 font-semibold">{item.intlScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Độ độc đáo:</span>
                      <span className="text-indigo-400 font-semibold">{item.uniqueScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nội địa:</span>
                      <span className="text-rose-400 font-semibold">{item.vnScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thanh điệu:</span>
                      <span className="text-slate-300">{item.toneHarmony}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 my-3 line-clamp-3 leading-relaxed">
                    {item.meaning}
                  </p>
                </div>

                <button
                  onClick={() => onOpenDetail(item)}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center gap-1"
                >
                  <span>Xem phân tích</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
