/**
 * Name evaluation engine for Vietnamese names:
 * Analyzes:
 * 1. International Friendliness (0-100): ease of pronunciation for non-Vietnamese speakers, no diacritic ambiguity, pleasant sounds.
 * 2. Domestic Vietnamese Elegance (0-100): Sino-Vietnamese Han-Viet meaning harmony, tone balance (Bằng-Trắc), natural naming flow.
 * 3. Uniqueness / Not Saturated on Internet (0-100): penalizes overly saturated/trending names, boosts rare elegant gems.
 */

export interface NameAnalysis {
  fullName: string;
  word1: string;
  word2: string;
  intlScore: number;
  vnScore: number;
  uniqueScore: number;
  totalScore: number;
  gender: 'Nam' | 'Nữ' | 'Unisex';
  meaning: string;
  intlPhonetic: string;
  intlEquivalentNote: string;
  toneHarmony: 'Bằng - Bằng' | 'Bằng - Trắc' | 'Trắc - Bằng' | 'Trắc - Trắc';
  tags: string[];
  isRecommendedTop: boolean;
}

// Phonetic ease mapping for international speakers (0-10 scale)
const INTL_EASE_MAP: Record<string, { ease: number; phonetic: string; note?: string }> = {
  'An': { ease: 10, phonetic: 'Ahn', note: 'Phát âm tựa "Ann / Ahn", Tây gọi chuẩn xác 100%' },
  'Mai': { ease: 10, phonetic: 'My / May', note: 'Phổ quát toàn cầu (Maya, May, Mia)' },
  'Kim': { ease: 10, phonetic: 'Kim', note: 'Tên quen thuộc chuẩn quốc tế (Kimberly)' },
  'Lan': { ease: 9.5, phonetic: 'Lahn', note: 'Âm mở thanh thoát, dễ đọc' },
  'Lâm': { ease: 9, phonetic: 'Lahm', note: 'Gần gũi như Liam / Lam' },
  'Linh': { ease: 9, phonetic: 'Lynn', note: 'Trùng khớp âm tiếng Anh "Lynn"' },
  'Nam': { ease: 9.5, phonetic: 'Nahm', note: 'Ngắn gọn, dứt khoát, dễ nhớ' },
  'Vy': { ease: 9.5, phonetic: 'Vee', note: 'Phát âm tựa Ivy / Vee, rất hiện đại' },
  'Minh': { ease: 8.5, phonetic: 'Min', note: 'Âm mũi nhẹ nhàng, người phương Tây dễ đọc' },
  'Vinh': { ease: 8.5, phonetic: 'Vin', note: 'Tương tự Vince / Vin' },
  'Hải': { ease: 8.5, phonetic: 'Hi / Kai', note: 'Phát âm như Hi hoặc Kai' },
  'Nhi': { ease: 9, phonetic: 'Nee', note: 'Âm thanh tựa "Annie" ngọt ngào' },
  'Châu': { ease: 7.5, phonetic: 'Chow', note: 'Gần âm Chow / Zhou, sang trọng' },
  'Duy': { ease: 7.5, phonetic: 'Zwee / Doo-ee', note: 'Không dấu đọc gọn, lịch lãm' },
  'Sơn': { ease: 8, phonetic: 'Son / Sun', note: 'Tương tự "Son / Sun" trong tiếng Anh' },
  'Thanh': { ease: 8, phonetic: 'Tahn', note: 'Âm mở êm ái' },
  'Thiên': { ease: 7.5, phonetic: 'Tee-en', note: 'Gần âm Etienne / Tien' },
  'Huy': { ease: 7.5, phonetic: 'Hwee', note: 'Tương tự Huey' },
  'Hoa': { ease: 8, phonetic: 'Hwah', note: 'Âm mở quen thuộc trong tên Á Đông' },
  'Như': { ease: 7, phonetic: 'New / Nyu', note: 'Nguyên âm mềm' },
  'Anh': { ease: 8.5, phonetic: 'Ahn', note: 'Gọn gàng, dễ viết không dấu' },
  'Gia': { ease: 8, phonetic: 'Jah / Ziah', note: 'Tương tự Gia (Ý) hoặc Jia' },
  'Giang': { ease: 7, phonetic: 'Zahng', note: 'Âm G mềm' },
  'Phong': { ease: 7, phonetic: 'Fong', note: 'Âm Ph đọc như F' },
  'Khang': { ease: 7, phonetic: 'Kahng', note: 'Phụ âm bật nhẹ' },
  'Khoa': { ease: 6.5, phonetic: 'Kwah', note: 'Khối âm Khw' },
  'Long': { ease: 7.5, phonetic: 'Long', note: 'Trùng từ vựng tiếng Anh' },
  'Trang': { ease: 7, phonetic: 'Chahng', note: 'Âm Tr/Ch' },
  'Quân': { ease: 7, phonetic: 'Kwan', note: 'Âm Qw' },
  'Quang': { ease: 6.5, phonetic: 'Kwahng', note: 'Khối âm Qw-ang' },
  'Thư': { ease: 6, phonetic: 'Too / Tuh', note: 'Người nước ngoài dễ đọc lệch âm "ư"' },
  'Thơ': { ease: 6, phonetic: 'Taw / Tho', note: 'Người phương Tây đọc thành "Tho"' },
  'Đạt': { ease: 6, phonetic: 'Daht', note: 'Tương đồng âm "that"' },
  'Phương': { ease: 4.5, phonetic: 'Fwung', note: 'Nguyên âm đôi "ươ" khiến Tây bối rối' },
  'Dương': { ease: 4.5, phonetic: 'Zung / Young', note: 'Vần "ương" khó phát âm' },
  'Duyên': { ease: 4, phonetic: 'Zwen', note: 'Nguyên âm ba "uyê" phức tạp' },
  'Ngân': { ease: 4.5, phonetic: 'N-gahn', note: 'Âm đầu "Ng-" người bản ngữ Anh khó bật' },
  'Nguyên': { ease: 3, phonetic: 'N-gwen', note: 'Vần "Nguyên" Tây phát âm sai nhiều nhất' },
  'Phát': { ease: 3.5, phonetic: 'Faht', note: 'Dễ bị đồng âm với từ nhạy cảm tiếng Anh (fat/fart)' }
};

// Word Meanings (Sino-Vietnamese)
export const WORD_MEANINGS: Record<string, { han: string; meaning: string; genderBias: 'Nam' | 'Nữ' | 'Unisex' }> = {
  'An': { han: '安', meaning: 'Bình an, an nhiên tự tại, cuộc sống thái bình', genderBias: 'Unisex' },
  'Anh': { han: '英', meaning: 'Tinh anh, tài ba kiệt xuất, thông tuệ', genderBias: 'Unisex' },
  'Châu': { han: '珠', meaning: 'Viên ngọc trai quý giá, sáng lấp lánh và thanh cao', genderBias: 'Nữ' },
  'Duy': { han: '惟', meaning: 'Tư duy sâu sắc, duy nhất, thủy chung chính trực', genderBias: 'Nam' },
  'Duyên': { han: '緣', meaning: 'Duyên dáng, ý trời kết nối tốt lành tao nhã', genderBias: 'Nữ' },
  'Dương': { han: '陽', meaning: 'Ánh thái dương ấm áp rạng rỡ, quang minh', genderBias: 'Unisex' },
  'Đạt': { han: '達', meaning: 'Thành đạt, thông suốt, đạt tới đỉnh cao', genderBias: 'Nam' },
  'Gia': { han: '嘉', meaning: 'Gia đình hưng vượng, phẩm hạnh tốt đẹp đáng trân quý', genderBias: 'Unisex' },
  'Giang': { han: '江', meaning: 'Dòng sông êm đềm bền bỉ, chở nặng phù sa', genderBias: 'Unisex' },
  'Hải': { han: '海', meaning: 'Biển cả mênh mông, phóng khoáng bao la', genderBias: 'Nam' },
  'Hoa': { han: '華', meaning: 'Bông hoa hương sắc rực rỡ, phồn hoa thịnh vượng', genderBias: 'Nữ' },
  'Huy': { han: '輝', meaning: 'Ánh quang huy xán lạn, vinh hiển rực rỡ', genderBias: 'Nam' },
  'Khang': { han: '康', meaning: 'Khang kiện, an khang, sung túc bình ổn', genderBias: 'Nam' },
  'Khoa': { han: '科', meaning: 'Khoa bảng đỗ đạt, học thức trí tuệ sâu rộng', genderBias: 'Nam' },
  'Kim': { han: '金', meaning: 'Vàng ròng quý giá, bền bỉ kiên định và cao sang', genderBias: 'Unisex' },
  'Lan': { han: '蘭', meaning: 'Hoa lan vương giả, thanh tao quý phái', genderBias: 'Nữ' },
  'Lâm': { han: '林', meaning: 'Rừng cây đại ngàn, vững chãi, uy nghi', genderBias: 'Unisex' },
  'Linh': { han: '靈', meaning: 'Linh hồn tinh anh, nhanh nhẹn, cát tường kỳ diệu', genderBias: 'Unisex' },
  'Long': { han: '龍', meaning: 'Rồng dũng mãnh, khí phách phi phàm vương giả', genderBias: 'Nam' },
  'Mai': { han: '梅', meaning: 'Hoa mai thanh khiết đón xuân sang, tinh thần kiên cường', genderBias: 'Nữ' },
  'Minh': { han: '明', meaning: 'Quang minh chính đại, thông minh sáng suốt', genderBias: 'Unisex' },
  'Nam': { han: '南', meaning: 'Phương Nam ấm áp kiên cường, đấng nam nhi trượng phu', genderBias: 'Nam' },
  'Ngân': { han: '銀', meaning: 'Âm thanh trong trẻo như tiếng chuông ngân, của cải quý', genderBias: 'Nữ' },
  'Nguyên': { han: '原', meaning: 'Nguyên vẹn cội nguồn, khởi đầu tốt lành, đồng bằng bao la', genderBias: 'Nam' },
  'Nhi': { han: '兒', meaning: 'Đứa con yêu quý bé nhỏ, thanh thuần hồn nhiên', genderBias: 'Nữ' },
  'Như': { han: '如', meaning: 'Như ý cát tường, dịu dàng thanh tịnh', genderBias: 'Nữ' },
  'Phát': { han: '發', meaning: 'Phát đạt hưng vượng, mở rộng thăng tiến', genderBias: 'Nam' },
  'Phong': { han: '風', meaning: 'Ngọn gió tự do phóng khoáng, dũng mãnh phong nhã', genderBias: 'Nam' },
  'Phương': { han: '芳', meaning: 'Hương thơm nhân đức lan tỏa muôn phương', genderBias: 'Unisex' },
  'Quang': { han: '光', meaning: 'Ánh sáng rực rỡ soi đường chân lý', genderBias: 'Nam' },
  'Quân': { han: '君', meaning: 'Quân tử đường hoàng, khí chất vương giả trượng nghĩa', genderBias: 'Nam' },
  'Sơn': { han: '山', meaning: 'Núi non hùng vĩ, kiên định vững vàng như thái sơn', genderBias: 'Nam' },
  'Thanh': { han: '清', meaning: 'Thanh khiết, thanh tú trong trẻo như dòng suối', genderBias: 'Unisex' },
  'Thiên': { han: '天', meaning: 'Trời cao bao la, ý chí khoáng đạt xuất chúng', genderBias: 'Unisex' },
  'Thơ': { han: '詩', meaning: 'Hồn thơ lãng mạn, thi vị, tâm hồn thanh nhã tao nhã', genderBias: 'Nữ' },
  'Thư': { han: '舒', meaning: 'Thư thái ung dung, sách vở tri thức đài các', genderBias: 'Nữ' },
  'Trang': { han: '莊', meaning: 'Trang nhã đoan trang, đài các lễ độ', genderBias: 'Nữ' },
  'Vinh': { han: '榮', meaning: 'Vinh hiển hiển đạt, rạng danh gia môn', genderBias: 'Nam' },
  'Vy': { han: '薇', meaning: 'Cây tường vi thanh nhã, nhỏ nhắn tinh xảo kiên cường', genderBias: 'Nữ' }
};

// Tone classification for Vietnamese (Bằng: không dấu, dấu huyền; Trắc: sắc, hỏi, ngã, nặng)
const TONE_MAP: Record<string, 'Bằng' | 'Trắc'> = {
  'An': 'Bằng', 'Anh': 'Bằng', 'Châu': 'Bằng', 'Duy': 'Bằng', 'Duyên': 'Bằng', 'Dương': 'Bằng',
  'Đạt': 'Trắc', 'Gia': 'Bằng', 'Giang': 'Bằng', 'Hải': 'Trắc', 'Hoa': 'Bằng', 'Huy': 'Bằng',
  'Khang': 'Bằng', 'Khoa': 'Bằng', 'Kim': 'Bằng', 'Lan': 'Bằng', 'Lâm': 'Bằng', 'Linh': 'Bằng',
  'Long': 'Bằng', 'Mai': 'Bằng', 'Minh': 'Bằng', 'Nam': 'Bằng', 'Ngân': 'Bằng', 'Nguyên': 'Bằng',
  'Nhi': 'Bằng', 'Như': 'Bằng', 'Phát': 'Trắc', 'Phong': 'Bằng', 'Phương': 'Bằng', 'Quang': 'Bằng',
  'Quân': 'Bằng', 'Sơn': 'Bằng', 'Thanh': 'Bằng', 'Thiên': 'Bằng', 'Thơ': 'Bằng', 'Thư': 'Bằng',
  'Trang': 'Bằng', 'Vinh': 'Bằng', 'Vy': 'Bằng'
};

// Over-popular names on internet & baby trends (saturated lists)
const SATURATED_NAMES = new Set([
  'Minh Anh', 'Anh Minh', 'Phương Anh', 'Gia Huy', 'Minh Khang', 'Gia Khang', 'Minh Quân', 'Gia Bảo',
  'Gia Minh', 'Anh Khoa', 'Minh Khoa', 'Bảo Nam', 'Minh Quang', 'Hải Đăng', 'Quang Minh',
  'Phương Linh', 'Khánh Linh', 'Minh Châu', 'Gia Linh', 'Bảo Anh', 'Hoàng Nam',
  'Ngọc Anh', 'Tuấn Kiệt', 'Hữu Phước', 'Đức Huy', 'Quang Huy', 'Phát Đạt', 'Thành Đạt',
  'Minh Duy', 'Anh Duy', 'Đăng Khoa'
]);

// Awkward or redundant combinations that do not flow well in Vietnamese culture
const AWKWARD_COMBINATIONS = new Set([
  'Hoa Mai', 'Mai Hoa', 'Hoa Lan', 'Lan Hoa', 'Hoa Vy', 'Mai Lan', 'Lan Mai',
  'Phát Đạt', // Sounds like enterprise LLC
  'Kim Ngân', // Extremely common commercial term
  'Hải Giang',
  'Long Phát', 'Phát Long'
]);

// Determine gender prediction
export function determineGender(w1: string, w2: string): 'Nam' | 'Nữ' | 'Unisex' {
  const b1 = WORD_MEANINGS[w1]?.genderBias || 'Unisex';
  const b2 = WORD_MEANINGS[w2]?.genderBias || 'Unisex';

  if (b2 === 'Nữ') {
    if (b1 === 'Nam' && (w2 === 'Châu' || w2 === 'Vy' || w2 === 'Nhi' || w2 === 'Mai' || w2 === 'Lan')) return 'Nữ';
    return 'Nữ';
  }
  if (b2 === 'Nam') {
    if (b1 === 'Nữ' && (w2 === 'Duy' || w2 === 'Minh' || w2 === 'Khang' || w2 === 'Nam' || w2 === 'Vinh')) return 'Nam';
    return 'Nam';
  }
  if (b1 === 'Nữ') return 'Nữ';
  if (b1 === 'Nam') return 'Nam';
  return 'Unisex';
}

// Compute individual and combined scores
export function analyzeName(fullName: string): NameAnalysis {
  const parts = fullName.trim().split(/\s+/);
  const word1 = parts[0];
  const word2 = parts[1];

  const info1 = INTL_EASE_MAP[word1] || { ease: 7, phonetic: word1 };
  const info2 = INTL_EASE_MAP[word2] || { ease: 7, phonetic: word2 };

  // 1. International Score (0 - 100)
  let baseIntl = ((info1.ease * 0.45) + (info2.ease * 0.55)) * 10;
  
  if (['An', 'Vy', 'Mai', 'Kim', 'Lan', 'Linh', 'Minh', 'Nam', 'Nhi'].includes(word2)) {
    baseIntl += 6;
  }
  if (['An', 'Duy', 'Kim', 'Lâm', 'Nam', 'Minh', 'Thanh', 'Vinh', 'Hải'].includes(word1)) {
    baseIntl += 4;
  }
  if (['Nguyên', 'Duyên', 'Dương', 'Phương', 'Phát'].includes(word2)) {
    baseIntl -= 18;
  }
  if (['Nguyên', 'Ngân', 'Duyên', 'Dương', 'Phát'].includes(word1)) {
    baseIntl -= 14;
  }
  const intlScore = Math.max(15, Math.min(99, Math.round(baseIntl)));

  // 2. Domestic Vietnamese Elegance Score (0 - 100)
  let baseVn = 84;
  const tone1 = TONE_MAP[word1] || 'Bằng';
  const tone2 = TONE_MAP[word2] || 'Bằng';
  const toneHarmony = `${tone1} - ${tone2}` as NameAnalysis['toneHarmony'];

  if (toneHarmony === 'Bằng - Bằng') baseVn += 6;
  if (toneHarmony === 'Trắc - Bằng') baseVn += 4;
  if (toneHarmony === 'Trắc - Trắc') baseVn -= 8;

  if (['An', 'Minh', 'Châu', 'Thiên', 'Duy', 'Vy', 'Lâm', 'Khang', 'Thanh', 'Thơ', 'Vinh'].includes(word2)) {
    baseVn += 5;
  }
  if (['An', 'Thiên', 'Hải', 'Thanh', 'Minh', 'Kim', 'Duy'].includes(word1)) {
    baseVn += 4;
  }

  if (AWKWARD_COMBINATIONS.has(fullName)) {
    baseVn -= 24;
  }
  const vnScore = Math.max(20, Math.min(99, Math.round(baseVn)));

  // 3. Uniqueness / Not Over-Popular on Internet Score (0 - 100)
  let baseUnique = 80;
  if (SATURATED_NAMES.has(fullName)) {
    baseUnique = 38;
  } else if (['Minh Anh', 'Gia Huy', 'Anh Khoa', 'Minh Khang', 'Gia Khang', 'Phương Anh'].includes(fullName)) {
    baseUnique = 32;
  }

  // Hidden gem boosts (tasteful, poetic, distinctive)
  const HIDDEN_GEMS = new Set([
    'An Châu', 'Thiên An', 'Duy An', 'Minh Lan', 'An Vy', 'Lâm Vy', 'Thanh Thơ', 'Minh Thơ',
    'Thiên Vy', 'Khang An', 'Hải An', 'Vinh An', 'Kim An', 'An Nhi', 'Mai An', 'Nam An',
    'Châu An', 'Thiên Duy', 'Lâm An', 'Thanh Vy', 'Hải Vy', 'Duy Lâm', 'Quân An'
  ]);

  if (HIDDEN_GEMS.has(fullName)) {
    baseUnique += 16;
  } else if (!SATURATED_NAMES.has(fullName) && (word2 === 'An' || word2 === 'Châu' || word2 === 'Vy' || word2 === 'Thơ' || word2 === 'Lâm' || word2 === 'Lan')) {
    baseUnique += 7;
  }
  const uniqueScore = Math.max(20, Math.min(99, Math.round(baseUnique)));

  // Total composite score
  const totalScore = Math.round((intlScore * 0.35) + (vnScore * 0.35) + (uniqueScore * 0.30));

  const gender = determineGender(word1, word2);

  // Tags
  const tags: string[] = [];
  if (intlScore >= 88) tags.push('Global Citizen 🌍');
  if (uniqueScore >= 88) tags.push('Độc Bản Tinh Tế 💎');
  if (vnScore >= 92) tags.push('Ý Nghĩa Cao Quý 📜');
  if (gender === 'Nữ') tags.push('Nữ Tính Thanh Tao 🌸');
  if (gender === 'Nam') tags.push('Khí Phách Nam Nhi ⚔️');
  if (gender === 'Unisex') tags.push('Hài Hòa Unisex ⚖️');

  const isRecommendedTop = totalScore >= 87 && intlScore >= 80 && uniqueScore >= 75 && !AWKWARD_COMBINATIONS.has(fullName);

  const m1 = WORD_MEANINGS[word1]?.meaning || word1;
  const m2 = WORD_MEANINGS[word2]?.meaning || word2;
  const meaning = `Gắn liền chữ "${word1}" (${m1.split(',')[0]}) cùng chữ "${word2}" (${m2.split(',')[0]}), mang lại thanh âm êm dịu, tương lai xán lạn và bình yên.`;

  const intlPhonetic = `${info1.phonetic} ${info2.phonetic}`;
  const intlEquivalentNote = info2.note || info1.note || 'Dễ gọi, không bị biến âm tiêu cực trong tiếng Anh';

  return {
    fullName,
    word1,
    word2,
    intlScore,
    vnScore,
    uniqueScore,
    totalScore,
    gender,
    meaning,
    intlPhonetic,
    intlEquivalentNote,
    toneHarmony,
    tags,
    isRecommendedTop
  };
}
