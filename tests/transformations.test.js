import test from 'node:test';
import assert from 'node:assert/strict';
import { getAppearanceScore } from '../js/transformations.js';

test('the first set of forms keeps its original score thresholds', () => {
  for (const score of [0, 12, 13, 22, 23, 33, 43, 53, 63, 73, 83, 93, 103, 112]) {
    assert.equal(getAppearanceScore(score), score);
  }
});

test('the basic llama returns for ten points, then the named forms repeat', () => {
  for (let score = 113; score <= 122; score++) assert.equal(getAppearanceScore(score), 0);
  assert.equal(getAppearanceScore(123), 13);
  assert.equal(getAppearanceScore(132), 22);
  assert.equal(getAppearanceScore(133), 23);
  assert.equal(getAppearanceScore(213), 103);
  assert.equal(getAppearanceScore(222), 112);
});

test('later cycles repeat at the same ten-point interval', () => {
  for (const start of [113, 223, 333, 443, 553]) {
    assert.equal(getAppearanceScore(start), 0);
    assert.equal(getAppearanceScore(start + 9), 0);
    for (let form = 0; form < 10; form++) {
      assert.equal(getAppearanceScore(start + 10 + form * 10), 13 + form * 10);
    }
  }
});
