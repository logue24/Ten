import { RAW_NAMES_LIST } from './rawNames.ts';
import { analyzeName, type NameAnalysis } from './nameScorer.ts';

// Pre-process all names and sort by highest total score
export const ALL_ANALYZED_NAMES: NameAnalysis[] = (() => {
  const seen = new Set<string>();
  const list: NameAnalysis[] = [];

  for (const raw of RAW_NAMES_LIST) {
    const trimmed = raw.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    list.push(analyzeName(trimmed));
  }

  // Sort descending by total composite score
  return list.sort((a, b) => b.totalScore - a.totalScore);
})();

// Curated Top 12 Tinh Hoa (Meeting all 3 user criteria: Beautiful VN meaning + Easy globally + Not saturated on internet)
export const TOP_RECOMMENDED_NAMES = ALL_ANALYZED_NAMES.filter(n => n.isRecommendedTop).slice(0, 16);

// Filter options interface
export interface FilterState {
  searchQuery: string;
  gender: 'Tất cả' | 'Nam' | 'Nữ' | 'Unisex';
  firstLetter: string; // 'Tất cả' or specific prefix word
  minIntlScore: number;
  minUniqueScore: number;
  minVnScore: number;
  presetFilter: 'all' | 'top_elite' | 'global_easy' | 'hidden_gems' | 'boys_noble' | 'girls_elegant';
  sortBy: 'totalScore' | 'intlScore' | 'uniqueScore' | 'vnScore' | 'alphabetical';
}

export function filterNames(names: NameAnalysis[], filters: FilterState): NameAnalysis[] {
  return names.filter(item => {
    // Search query match
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchFull = item.fullName.toLowerCase().includes(q);
      const matchPhonetic = item.intlPhonetic.toLowerCase().includes(q);
      const matchMeaning = item.meaning.toLowerCase().includes(q);
      if (!matchFull && !matchPhonetic && !matchMeaning) return false;
    }

    // Gender filter
    if (filters.gender !== 'Tất cả' && item.gender !== filters.gender) {
      return false;
    }

    // First word filter
    if (filters.firstLetter !== 'Tất cả' && item.word1 !== filters.firstLetter) {
      return false;
    }

    // Preset filters
    if (filters.presetFilter === 'top_elite' && !item.isRecommendedTop) return false;
    if (filters.presetFilter === 'global_easy' && item.intlScore < 88) return false;
    if (filters.presetFilter === 'hidden_gems' && item.uniqueScore < 88) return false;
    if (filters.presetFilter === 'boys_noble' && item.gender !== 'Nam') return false;
    if (filters.presetFilter === 'girls_elegant' && item.gender !== 'Nữ') return false;

    // Numerical thresholds
    if (item.intlScore < filters.minIntlScore) return false;
    if (item.uniqueScore < filters.minUniqueScore) return false;
    if (item.vnScore < filters.minVnScore) return false;

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'totalScore') return b.totalScore - a.totalScore;
    if (filters.sortBy === 'intlScore') return b.intlScore - a.intlScore;
    if (filters.sortBy === 'uniqueScore') return b.uniqueScore - a.uniqueScore;
    if (filters.sortBy === 'vnScore') return b.vnScore - a.vnScore;
    if (filters.sortBy === 'alphabetical') return a.fullName.localeCompare(b.fullName, 'vi');
    return 0;
  });
}

// Popular Vietnamese family surnames for real-world surname testing
export const POPULAR_SURNAMES = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'
];
