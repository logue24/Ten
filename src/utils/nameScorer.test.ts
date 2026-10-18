import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeName, determineGender } from './nameScorer.ts';

test('analyzeName evaluates international and unique names properly', () => {
  const anChau = analyzeName('An Châu');
  assert.equal(anChau.fullName, 'An Châu');
  assert.ok(anChau.intlScore >= 75, 'An Chau should have good international score');
  assert.ok(anChau.uniqueScore >= 80, 'An Chau should have high uniqueness score');
  assert.ok(anChau.totalScore >= 80, 'An Chau total score should be high');
});

test('analyzeName penalizes over-saturated trending internet names', () => {
  const minhAnh = analyzeName('Minh Anh');
  const giaHuy = analyzeName('Gia Huy');
  assert.ok(minhAnh.uniqueScore < 60, 'Minh Anh should be penalized for internet saturation');
  assert.ok(giaHuy.uniqueScore < 60, 'Gia Huy should be penalized for internet saturation');
});

test('analyzeName scores hard-to-pronounce names lower in international friendliness', () => {
  const nguyen = analyzeName('Nguyên Duyên');
  const an = analyzeName('An Vy');
  assert.ok(an.intlScore > nguyen.intlScore, 'An Vy must be far easier internationally than Nguyen Duyen');
});

test('gender classification works correctly', () => {
  assert.equal(determineGender('An', 'Vy'), 'Nữ');
  assert.equal(determineGender('Duy', 'An'), 'Nam');
  assert.equal(determineGender('Thiên', 'An'), 'Unisex');
});
