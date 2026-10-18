import React, { useState } from 'react';
import { X, Volume2, Heart, Scale, Sparkles, Globe, BookOpen, ShieldCheck, Check, Copy } from 'lucide-react';
import { WORD_MEANINGS, type NameAnalysis } from '../utils/nameScorer.ts';
import { POPULAR_SURNAMES } from '../utils/namesData.ts';

interface NameDetailModalProps {
  nameItem: NameAnalysis | null;
  selectedSurname: string;
  isFavorite: boolean;
  isCompared: boolean;
  onClose: () => void;
  onToggleFavorite: (name: NameAnalysis) => void;
  onToggleCompare: (name: NameAnalysis) => void;
}

export const NameDetailModal: React.FC<NameDetailModalProps> = ({
  nameItem,
  selectedSurname,
  isFavorite,
  isCompared,
  onClose,
  onToggleFavorite,
  onToggleCompare
}) => {
  const [copied, setCopied] = useState(false);
  const [customSurname, setCustomSurname] = useState(selectedSurname || 'Nguyễn');

  if (!nameItem) return null;

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const m1 = WORD_MEANINGS[nameItem.word1] || { han: '', meaning: nameItem.word1 };
  const m2 = WORD_MEANINGS[nameItem.word2] || { han: '', meaning: nameItem.word2 };

  const fullWithSurname = `${customSurname} ${nameItem.fullName}`;

  const copySummary = () => {
    const text = `⭐ TÊN ĐƯỢC CHỌN: ${fullWithSurname}
- Điểm tổng hợp: ${nameItem.totalScore}/100
- Phát âm quốc tế: ${nameItem.intlPhonetic} (${nameItem.intlScore}/100)
- Độ độc đáo (ít trùng lặp): ${nameItem.uniqueScore}/100
- Ý nghĩa Hán Việt: ${nameItem.meaning}
- Thanh điệu: ${nameItem.toneHarmony}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          aria-label="Đóng bảng phân tích"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Name & Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {nameItem.gender}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                {nameItem.toneHarmony}
              </span>
              {nameItem.isRecommendedTop && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  Top Tinh Hoa Khuyên Dùng
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {fullWithSurname}
              </h2>
              <button
                onClick={() => speak(fullWithSurname)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                title="Nghe phát âm"
                aria-label="Phát âm tên"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">Từ nguyên Hán - Việt:</span>
              <span className="text-amber-300 font-semibold">{nameItem.word1}</span> ({m1.meaning.split(',')[0]})
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 font-semibold">{nameItem.word2}</span> ({m2.meaning.split(',')[0]})
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-3xl font-black text-amber-400 leading-none">
              {nameItem.totalScore}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Điểm Tổng Hợp</span>
          </div>
        </div>

        {/* 3 Metric Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Dễ Dùng Quốc Tế</span>
            </div>
            <div className="text-2xl font-black text-white">{nameItem.intlScore}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tây đọc: <strong className="text-slate-200">{nameItem.intlPhonetic}</strong>
            </p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Độ Độc Đáo</span>
            </div>
            <div className="text-2xl font-black text-white">{nameItem.uniqueScore}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Chưa bị bão hòa, ít đụng hàng trường lớp
            </p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ý Nghĩa Nội Địa</span>
            </div>
            <div className="text-2xl font-black text-white">{nameItem.vnScore}%</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Gốc Hán Việt thuần khiết, thanh âm êm
            </p>
          </div>
        </div>

        {/* Deep Dive Analysis Sections */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Sino-Vietnamese Han-Viet meaning */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Giải Nghĩa Từng Chữ Hán - Việt</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>Chữ Đệm: <strong className="text-amber-300">{nameItem.word1}</strong></span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Tiền tố</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{m1.meaning}</p>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                <div className="font-semibold text-white flex items-center justify-between">
                  <span>Tên Chính: <strong className="text-emerald-300">{nameItem.word2}</strong></span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Hậu tố</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{m2.meaning}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800/60 italic">
              💡 Tổng quan: {nameItem.meaning}
            </p>
          </div>

          {/* International Usability Assessment */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40">
            <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Đánh Giá Môi Trường Quốc Tế (Học Tập & Làm Việc)</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Phát âm không dấu:</strong> Viết trong hộ chiếu/visa là "{nameItem.fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')}". Người phương Tây đọc xấp xỉ là "{nameItem.intlPhonetic}".
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Độ thân thiện email & công sở:</strong> {nameItem.intlEquivalentNote}. Không bị nhầm lẫn với các từ lóng thô tục trong tiếng Anh.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Độ độc bản tại Việt Nam:</strong> Tránh được việc cùng lớp hay cơ quan có 3-4 bạn cùng tên (như làn sóng đặt tên Minh Anh, Gia Huy, Bảo Nam).
                </span>
              </li>
            </ul>
          </div>

          {/* Surname preview test */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-2">
              Thử nghiệm âm điệu khi ghép với các dòng họ:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SURNAMES.slice(0, 8).map((surname) => (
                <button
                  key={surname}
                  onClick={() => {
                    setCustomSurname(surname);
                    speak(`${surname} ${nameItem.fullName}`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    customSurname === surname
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {surname} {nameItem.fullName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(nameItem)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{isFavorite ? 'Đã lưu yêu thích' : 'Lưu tên này'}</span>
            </button>

            <button
              onClick={() => onToggleCompare(nameItem)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                isCompared
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>{isCompared ? 'Đang so sánh' : 'So sánh với tên khác'}</span>
            </button>
          </div>

          <button
            onClick={copySummary}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
            <span>{copied ? 'Đã sao chép!' : 'Sao chép thông tin tên'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
