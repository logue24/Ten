import React from 'react';
import { X, Globe, ShieldCheck, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

interface AnalysisMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalysisMethodologyModal: React.FC<AnalysisMethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Đóng bảng giải thích tiêu chí"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-4 border-b border-slate-800 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Phương Pháp Học & Thẩm Âm Khoa Học
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Bộ Tiêu Chí Tuyển Chọn Tên Song Hành
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cách thức hệ thống phân tích và chấm điểm cho 1,200+ tổ hợp tên Việt Nam
          </p>
        </div>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2 text-sm sm:text-base">
              <Globe className="w-4 h-4" />
              <span>1. Tiêu Chí Quốc Tế (Dễ dùng toàn cầu khi viết không dấu)</span>
            </div>
            <p className="mb-2">
              Khi đi du học, làm việc tại tập đoàn đa quốc gia hay ghi trên hộ chiếu, tên người Việt Nam sẽ được viết không dấu (ví dụ: An Chau, Duy An, Vy An).
            </p>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-white">Tên điểm cao (85-99%):</strong> Chứa các âm tự nhiên với người phương Tây: <em>An (Ann/Ahn), Mai (Maya/May), Kim (Kimberly), Lan (Lahn), Vy (Ivy/Vee), Linh (Lynn), Minh (Min), Vinh (Vin), Nam (Nahm)</em>.
              </li>
              <li>
                <strong className="text-rose-300">Tên điểm thấp:</strong> Chứa âm khó phát âm cho người nước ngoài như âm đầu <em>Ng- (Ngân)</em>, nguyên âm phức hợp <em>uyê (Nguyên, Duyên)</em>, <em>ươ (Dương, Phương)</em>, hoặc từ dễ bị nhầm âm nhạy cảm tiếng Anh như <em>Phát (dễ phát âm thành "fat" hay "fart")</em>.
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2 text-sm sm:text-base">
              <Sparkles className="w-4 h-4" />
              <span>2. Tiêu Chí Độc Đáo (Chưa phổ biến, không đại trà internet)</span>
            </div>
            <p className="mb-2">
              Tránh tình trạng một lớp học hay một phòng làm việc có 4-5 người trùng tên nhau vì chạy theo xu hướng hot trend trên mạng xã hội:
            </p>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-amber-300">Lọc bỏ tên quá phổ biến:</strong> Các tên bão hòa như <em>Minh Anh, Gia Huy, Bảo Nam, Phương Anh, Minh Khang, Gia Khang, Anh Khoa, Minh Quân</em> được hạ điểm độc đáo.
              </li>
              <li>
                <strong className="text-white">Tôn vinh "Viên ngọc ẩn" (Hidden Gems):</strong> Những tên có thanh âm quý phái, hiếm nhưng không lập dị: <em>An Châu, Duy An, Thiên An, Minh Lan, Lâm Vy, Thanh Thơ, Khang An, Hải An, Vinh An</em>.
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40">
            <div className="flex items-center gap-2 text-rose-400 font-bold mb-2 text-sm sm:text-base">
              <BookOpen className="w-4 h-4" />
              <span>3. Tiêu Chí Nội Địa Việt Nam (Ý nghĩa Hán Việt & Thanh điệu)</span>
            </div>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-white">Ý nghĩa Hán Việt:</strong> Chọn lọc những từ gốc Hán mang đức tính tốt lành: An (Bình an), Châu (Ngọc quý), Duy (Tư duy/duy nhất), Lâm (Rừng rậm vững chãi), Vy (Cây tường vi thanh nhã), Khang (An khang).
              </li>
              <li>
                <strong className="text-white">Luật Bằng - Trắc:</strong> Các tên có thanh điệu <em>Bằng - Bằng</em> hoặc <em>Trắc - Bằng</em> tạo sự du dương, thanh thoát và êm tai nhất khi gọi to trong đời thường.
              </li>
              <li>
                <strong className="text-rose-300">Loại trừ tên vụng:</strong> Trừ điểm các tổ hợp trùng lặp hoặc mang tính thương mại (như <em>Hoa Mai, Hoa Lan, Phát Đạt, Kim Ngân</em>).
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
          >
            Đã hiểu, quay lại xem tên
          </button>
        </div>
      </div>
    </div>
  );
};
