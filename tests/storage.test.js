import test from 'node:test';
import assert from 'node:assert/strict';
import { memoryStorage } from './helpers.js';
import { weatherTypes, FINAL_TRANSFORMATION_SCORE, trailStyles } from '../js/config.js';
import { loadBestScore, saveBestScore, loadDiscoveredScenes, saveDiscoveredScenes, clearSavedProgress } from '../js/storage.js';

test('scene names are unique and trail thresholds include the final form', () => {
  const names = new Set(weatherTypes.map(scene => scene.name));
  assert.equal(names.size, weatherTypes.length);
  assert.ok(names.has('Jurassic'));
  assert.equal(trailStyles.at(-2).until, FINAL_TRANSFORMATION_SCORE);
  assert.equal(trailStyles.at(-1).until, Infinity);
});

test('only current scene names load, with duplicates and obsolete names ignored', () => {
  globalThis.localStorage = memoryStorage({
    'llama-scenes': JSON.stringify(['Night time', 'Gotham City', 'Gotham', 'Rainbow', 'Mario World', 'Dusk', 'Thunderstorm', 'Japan', 'Unknown'])
  });
  assert.deepEqual([...loadDiscoveredScenes()], ['Gotham', 'Japan']);
});

test('missing and malformed discovery data safely produce an empty collection', () => {
  for (const value of [null, '{broken', 'null', '123', '{}', '[null,{},42]']) {
    globalThis.localStorage = memoryStorage(value === null ? {} : { 'llama-scenes': value });
    assert.equal(loadDiscoveredScenes().size, 0);
  }
});

test('best scores round-trip, while invalid values fall back to zero', () => {
  globalThis.localStorage = memoryStorage();
  saveBestScore(103);
  assert.equal(loadBestScore(), 103);
  for (const value of ['invalid', 'NaN', 'Infinity', '-9']) {
    localStorage.setItem('llama-best', value);
    assert.equal(loadBestScore(), 0);
  }
});

test('reset removes only game progress', () => {
  globalThis.localStorage = memoryStorage({ 'llama-best': '103', unrelated: 'keep' });
  saveDiscoveredScenes(new Set(['Japan']));
  assert.equal(clearSavedProgress(), true);
  assert.equal(localStorage.getItem('llama-best'), null);
  assert.equal(localStorage.getItem('llama-scenes'), null);
  assert.equal(localStorage.getItem('unrelated'), 'keep');
});

test('discovering Jurassic preserves existing discoveries and the best score', () => {
  globalThis.localStorage = memoryStorage({ 'llama-best': '103', 'llama-scenes': '["Japan"]' });
  const discovered = loadDiscoveredScenes();
  discovered.add('Jurassic');
  saveDiscoveredScenes(discovered);
  assert.deepEqual([...loadDiscoveredScenes()], ['Japan', 'Jurassic']);
  assert.equal(loadBestScore(), 103);
});

test('blocked storage never prevents gameplay or discoveries in memory', () => {
  globalThis.localStorage = {
    getItem(key) {
      if (key === 'llama-scenes') return '["Nordic", "Highlands"]';
      throw new Error('Blocked');
    },
    setItem() { throw new Error('Blocked'); },
    removeItem() { throw new Error('Blocked'); }
  };
  assert.equal(loadBestScore(), 0);
  assert.deepEqual([...loadDiscoveredScenes()], ['Nordic', 'Highlands']);
  assert.doesNotThrow(() => saveBestScore(23));
  assert.equal(clearSavedProgress(), false);
});
