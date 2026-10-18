import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_ANALYZED_NAMES, TOP_RECOMMENDED_NAMES, filterNames, type FilterState } from './namesData.ts';

test('ALL_ANALYZED_NAMES contains hundreds of evaluated names without crashing', () => {
  assert.ok(ALL_ANALYZED_NAMES.length > 500, `Expected > 500 names, got ${ALL_ANALYZED_NAMES.length}`);
  const top1 = ALL_ANALYZED_NAMES[0];
  assert.ok(top1.totalScore >= 80, 'Top name should have a high composite score');
});

test('TOP_RECOMMENDED_NAMES contains top filtered names meeting all criteria', () => {
  assert.ok(TOP_RECOMMENDED_NAMES.length > 0, 'Should have top recommended names');
  for (const n of TOP_RECOMMENDED_NAMES) {
    assert.ok(n.intlScore >= 75, `${n.fullName} intlScore should be >= 75`);
    assert.ok(n.uniqueScore >= 70, `${n.fullName} uniqueScore should be >= 70`);
  }
});

test('filterNames properly respects filter criteria', () => {
  const initialFilters: FilterState = {
    searchQuery: 'Châu',
    gender: 'Tất cả',
    firstLetter: 'Tất cả',
    minIntlScore: 0,
    minUniqueScore: 0,
    minVnScore: 0,
    presetFilter: 'all',
    sortBy: 'totalScore'
  };

  const results = filterNames(ALL_ANALYZED_NAMES, initialFilters);
  assert.ok(results.length > 0, 'Should find names with Châu');
  assert.ok(results.every(r => r.fullName.includes('Châu')), 'Every result should have Châu');
});
