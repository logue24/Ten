import React, { useState } from 'react';
import { X, Heart, Trash2, Copy, Check, Download, ArrowRight, Volume2 } from 'lucide-react';
import type { NameAnalysis } from '../utils/nameScorer.ts';

interface FavoritesModalProps {
  favorites: NameAnalysis[];
  isOpen: boolean;
  selectedSurname: string;
  onClose: () => void;
  onRemove: (fullName: string) => void;
  onClear: () => void;
  onOpenDetail: (name: NameAnalysis) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  favorites,
  isOpen,
  selectedSurname,
  onClose,
  onRemove,
  onClear,
  onOpenDetail
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const speak = (name: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = selectedSurname ? `${selectedSurname} ${name}` : name;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyAll = () => {
    if (favorites.length === 0) return;
    const lines = favorites.map(
      (f, idx) =>
        `${idx + 1}. ${selectedSurname ? `${selectedSurname} ` : ''}${f.fullName} (${f.gender}) - Điểm: ${f.totalScore}/100 | Tây đọc: ${f.intlPhonetic} | Ý nghĩa: ${f.meaning}`
    );
    const content = `DANH SÁCH TÊN TUYỂN CHỌN (VIETNAME SELECT):\n\n${lines.join('\n\n')}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (favorites.length === 0) return;
    const lines = favorites.map(
      (f, idx) =>
        `${idx + 1}. ${selectedSurname ? `${selectedSurname} ` : ''}${f.fullName} (${f.gender})\n   - Điểm tổng hợp: ${f.totalScore}/100\n   - Quốc tế dễ đọc: ${f.intlScore}%\n   - Độ độc đáo: ${f.uniqueScore}%\n   - Phiên âm Tây: ${f.intlPhonetic}\n   - Ý nghĩa: ${f.meaning}\n`
    );
    const content = `DANH SÁCH TÊN TUYỂN CHỌN (VIETNAME SELECT):\n=========================================\n\n${lines.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danh-sach-ten-tuyen-chon-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Đóng danh sách yêu thích"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-xl font-bold text-white">
              Tên Yêu Thích & Danh Sách Rút Gọn ({favorites.length})
            </h3>
          </div>

          {favorites.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép!' : 'Chép tất cả'}</span>
              </button>

              <button
                onClick={downloadTxt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải file TXT</span>
              </button>

              <button
                onClick={onClear}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                title="Xóa danh sách yêu thích"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Heart className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-sm">Chưa có tên nào trong danh sách rút gọn.</p>
            <p className="text-xs text-slate-500 mt-1">
              Hãy bấm vào biểu tượng trái tim ở các thẻ tên để lưu lại những cái tên bạn ưng ý nhất!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {favorites.map((item, idx) => (
              <div
                key={item.fullName}
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/30 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-400">#{idx + 1}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.gender}
                    </span>
                    <span className="text-xs text-indigo-300 font-mono">
                      🌍 {item.intlPhonetic}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h4 className="text-lg font-bold text-white">
                      {selectedSurname ? `${selectedSurname} ` : ''}{item.fullName}
                    </h4>
                    <span className="text-xs font-extrabold text-amber-400">
                      {item.totalScore}/100 đ
                    </span>
                    <button
                      onClick={() => speak(item.fullName)}
                      className="p-1 rounded-md text-slate-400 hover:text-amber-400"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    {item.meaning}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onOpenDetail(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition flex items-center gap-1"
                  >
                    <span>Chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemove(item.fullName)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
