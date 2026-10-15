import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { browserEnvironment, memoryStorage } from './helpers.js';
import { weatherTypes, FINAL_TRANSFORMATION_SCORE, TRANSFORMATION_INTERVAL, TRANSFORMATION_RESTART_SCORE } from '../js/config.js';
import { getAppearanceScore } from '../js/transformations.js';

// Exercise private game rules with small adapters, without exposing a debug API
// in the production page or installing a browser test framework.
const source = readFileSync(new URL('../js/game.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '');

function game() {
  const environment = browserEnvironment();
  const storage = memoryStorage({ unrelated: 'keep' });
  const renderer = { resets: 0, hops: [], draw() {}, reset() { this.resets++; }, onHop(...args) { this.hops.push(args); } };
  const context = vm.createContext({
    ...environment,
    canvas: environment.document.getElementById('game'),
    ctx: environment.document.getElementById('game').getContext('2d'),
    weatherTypes, FINAL_TRANSFORMATION_SCORE, TRANSFORMATION_INTERVAL, TRANSFORMATION_RESTART_SCORE, getAppearanceScore,
    requestAnimationFrame() {},
    rounded() {}, weatherScene() {}, drawGround() {},
    createLlamaRenderer: () => renderer,
    createGallery: () => ({ init() {}, discover() {}, clear() {} }),
    loadBestScore: () => Number(storage.getItem('llama-best')) || 0,
    loadDiscoveredScenes: () => new Set(),
    saveBestScore: best => storage.setItem('llama-best', best),
    clearSavedProgress() {
      storage.removeItem('llama-best');
      storage.removeItem('llama-scenes');
      return true;
    }
  });
  vm.runInContext(source, context, { filename: 'game.js' });
  return { run: code => vm.runInContext(code, context), environment, storage, renderer };
}

test('a new run starts at zero, with three lives and the original appearance', () => {
  const app = game();
  app.run('hop()');
  assert.equal(app.run('state'), 'playing');
  assert.equal(app.run('score'), 0);
  assert.equal(app.run('appearanceScore()'), 0);
  assert.equal(app.run('lives'), 3);
  assert.equal(app.run('velocity'), -6.2);
});

test('pink-cactus bonuses crossing thresholds earn lives and celebrations', () => {
  const app = game();
  app.run('hop(); awardPoints(8); awardPoints(3)');
  assert.equal(app.run('score'), 11);
  assert.equal(app.run('lives'), 4);
  assert.equal(app.run('milestone'), 10);
  assert.equal(app.run('confetti.length'), 45);
});

test('appearance cycles never reset the score, life bonuses or saved best', () => {
  const app = game();
  app.run('hop(); awardPoints(113)');
  assert.equal(app.run('score'), 113);
  assert.equal(app.run('appearanceScore()'), 0);
  assert.equal(app.run('lives'), 15);
  app.run('awardPoints(10)');
  assert.equal(app.run('score'), 123);
  assert.equal(app.run('appearanceScore()'), 13);
  app.run('end()');
  assert.equal(app.storage.getItem('llama-best'), '123');
});

test('collisions cost one life and invulnerability prevents repeated damage', () => {
  const app = game();
  app.run('hop(); loseLife(); loseLife()');
  assert.equal(app.run('lives'), 2);
  assert.equal(app.run('invulnerable'), 90);
  assert.equal(app.run('shake'), 25);
  assert.equal(app.run('hitParticles.length'), 22);
});

test('hitting a cactus marks it passed without awarding points', () => {
  const app = game();
  app.run('hop(); pipes = [{ x: 100, top: 100, passed: false }]; loseLife(pipes[0])');
  assert.equal(app.run('pipes[0].passed'), true);
  assert.equal(app.run('score'), 0);
  assert.equal(app.run('y'), 185);
});

test('replaying preserves the best score and weather clock while clearing effects', () => {
  const app = game();
  app.run('hop(); awardPoints(103); weatherElapsed = 12000; currentWeather = 3; end(); playAgain()');
  assert.equal(app.run('best'), 103);
  assert.equal(app.storage.getItem('llama-best'), '103');
  assert.equal(app.run('score'), 0);
  assert.equal(app.run('weatherElapsed'), 12000);
  assert.equal(app.run('currentWeather'), 3);
  assert.equal(app.run('confetti.length'), 0);
  assert.ok(app.renderer.resets >= 2);
});

test('clear progress supports cancellation and resets the game after confirmation', () => {
  const app = game();
  app.run('hop(); awardPoints(103); end()');
  app.environment.window.confirm = () => false;
  app.run('clearGameState()');
  assert.equal(app.run('best'), 103);
  app.environment.window.confirm = () => true;
  app.run('clearGameState()');
  assert.equal(app.run('state'), 'ready');
  assert.equal(app.run('score'), 0);
  assert.equal(app.run('best'), 0);
  assert.equal(app.run('lives'), 3);
  assert.equal(app.run('weatherElapsed'), 0);
  assert.equal(app.run('currentWeather'), 0);
  assert.equal(app.storage.getItem('llama-best'), null);
  assert.equal(app.storage.getItem('unrelated'), 'keep');
});

test('worlds change every eight seconds and finish blending after three seconds', () => {
  const app = game();
  assert.equal(app.run('weatherAt(7999).current.name'), 'Netherlands');
  app.run('weatherAt(8000)');
  assert.notEqual(app.run('currentWeather'), 0);
  assert.equal(app.run('weatherAt(8000).blend'), 0);
  assert.equal(app.run('weatherAt(11000).blend'), 1);
});

test('the weather clock advances only while playing', () => {
  const app = game();
  app.run('advanceWeather(1000); advanceWeather(2000)');
  assert.equal(app.run('weatherElapsed'), 0);
  app.run('hop(); advanceWeather(3000); advanceWeather(4000)');
  assert.equal(app.run('weatherElapsed'), 1000);
  app.run('end(); advanceWeather(5000); advanceWeather(6000)');
  assert.equal(app.run('weatherElapsed'), 1000);
});

test('button keyboard activation does not also hop the llama', () => {
  const app = game();
  app.environment.window.listeners.keydown({ target: { closest: () => ({}) }, code: 'Space' });
  assert.equal(app.run('state'), 'ready');
});
