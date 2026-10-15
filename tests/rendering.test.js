import test from 'node:test';
import assert from 'node:assert/strict';
import { browserEnvironment, drawingContext } from './helpers.js';
import { weatherTypes } from '../js/config.js';

Object.assign(globalThis, browserEnvironment());
const drawing = await import('../js/canvas.js');
const { weatherScene, sceneRenderers } = await import('../js/scenes.js');
const { createLlamaRenderer } = await import('../js/llama.js');
const { createGallery } = await import('../js/gallery.js');

test('every world has a renderer and balances its canvas state', () => {
  assert.equal(Object.keys(sceneRenderers).length, weatherTypes.length);
  for (const scene of weatherTypes) {
    assert.equal(typeof sceneRenderers[scene.landmark], 'function', scene.name);
    const context = drawingContext();
    drawing.withDrawingContext(context, () => weatherScene(scene, 5000));
    assert.equal(context.stack.length, 0, scene.name);
    assert.ok(context.calls.length > 0, scene.name);
  }
});

test('preview drawing always restores the main canvas, even after an exception', () => {
  const main = drawing.ctx;
  const preview = drawingContext();
  assert.throws(() => drawing.withDrawingContext(preview, () => {
    assert.equal(drawing.ctx, preview);
    throw new Error('Painter failed');
  }), /Painter failed/);
  assert.equal(drawing.ctx, main);
});

test('Jurassic has time-driven dinosaur, flight, smoke, and foliage animation', () => {
  const scene = weatherTypes.find(world => world.name === 'Jurassic');
  const snapshot = time => {
    const context = drawingContext();
    drawing.withDrawingContext(context, () => weatherScene(scene, time));
    return JSON.stringify(context.calls);
  };
  assert.equal(snapshot(5000), snapshot(5000));
  assert.notEqual(snapshot(0), snapshot(5000));
});

test('all transformation forms and their trails can render without preference checks', () => {
  const renderer = createLlamaRenderer();
  for (const score of [0, 13, 23, 33, 43, 53, 63, 73, 83, 93, 103]) {
    const context = drawingContext();
    renderer.reset();
    drawing.withDrawingContext(context, () => {
      for (let frame = 0; frame < 10; frame++) {
        renderer.draw(1000 + frame * 17, 1, { state: 'playing', y: 255, score, invulnerable: 0, llamaTilt: 0 });
      }
    });
    assert.equal(context.stack.length, 0, `score ${score}`);
  }
});

test('Doge and Jotaro have exclusive hop text, and reset clears transient effects', () => {
  const renderer = createLlamaRenderer();
  const context = drawingContext();
  const draw = score => drawing.withDrawingContext(context, () => renderer.draw(1000, 0, {
    state: 'ready', y: 255, score, invulnerable: 0, llamaTilt: 0
  }));
  renderer.onHop(93, 255);
  draw(93);
  assert.ok(context.calls.some(([method, text]) => method === 'fillText' && ['much hop', 'very llama', 'wow'].includes(text)));
  renderer.reset();
  context.calls.length = 0;
  for (let i = 0; i < 10; i++) renderer.onHop(103, 255);
  draw(103);
  assert.equal(context.calls.filter(([method, text]) => method === 'fillText' && text === 'オラッ！').length, 4);
  assert.ok(!context.calls.some(([method, text]) => method === 'fillText' && ['much hop', 'very llama', 'wow'].includes(text)));
  renderer.reset();
  context.calls.length = 0;
  draw(103);
  assert.ok(!context.calls.some(([method, text]) => method === 'fillText' && text === 'オラッ！'));
});

test('gallery discovery is idempotent and reset hides every scene again', () => {
  globalThis.localStorage = { setItem() {} };
  const discovered = new Set();
  const gallery = createGallery(discovered);
  gallery.init();
  gallery.discover(weatherTypes[0]);
  gallery.discover(weatherTypes[0]);
  assert.equal(discovered.size, 1);
  gallery.clear();
  assert.equal(discovered.size, 0);
  assert.equal(document.getElementById('discovery-count').textContent, `0 / ${weatherTypes.length} worlds discovered`);
});

test('cycling back to the basic llama clears Jotaro hop text and menacing trails', () => {
  const renderer = createLlamaRenderer();
  const context = drawingContext();
  const draw = score => drawing.withDrawingContext(context, () => renderer.draw(1000, 1, {
    state: 'playing', y: 255, score, invulnerable: 0, llamaTilt: 0
  }));
  renderer.onHop(103, 255);
  draw(103);
  assert.ok(context.calls.some(([method, text]) => method === 'fillText' && text === 'オラッ！'));
  context.calls.length = 0;
  renderer.onHop(0, 255);
  draw(0);
  assert.ok(!context.calls.some(([method, text]) => method === 'fillText' && ['オラッ！', 'ゴゴゴ'].includes(text)));
});
