import { canvas, ctx, rounded } from './canvas.js';
import { weatherTypes, FINAL_TRANSFORMATION_SCORE, TRANSFORMATION_INTERVAL, TRANSFORMATION_RESTART_SCORE } from './config.js';
import { getAppearanceScore } from './transformations.js';
import { weatherScene, drawGround } from './scenes.js';
import { createGallery } from './gallery.js';
import { createLlamaRenderer } from './llama.js';
import { loadBestScore, loadDiscoveredScenes, saveBestScore, clearSavedProgress } from './storage.js';

const restart = document.getElementById('restart');
document.fonts.load('700 12px GokuEmblem', '悟').catch(() => {});
document.fonts.load('900 27px OraSfx', 'オラッ！').catch(() => {});
document.fonts.load('500 15px MenacingSfx', 'ゴゴゴ').catch(() => {});
const llamaRenderer = createLlamaRenderer();
let state = 'ready', y = 255, velocity = 0, pipes = [], score = 0, best = 0, spawn = 0, last = 0;
let confetti = [], celebration = 0, milestone = 0;
let lives = 3, invulnerable = 0, shake = 0, impact = 0, impactY = 255, hitParticles = [];
let lifeBonus = 0;
let llamaTilt = 0;
// Set a score to preview a transformation; null uses normal score progression.
const previewAppearanceScore = null;
function appearanceScore() { return previewAppearanceScore ?? getAppearanceScore(score); }
let weatherElapsed = 0, weatherLast = null;
let currentWeather = 0, previousWeather = 0, weatherChangedAt = 0, nextWeatherChange = 8000;
best = loadBestScore();
const gallery = createGallery(loadDiscoveredScenes());

// Restarting a run preserves the best score, discoveries and current world.
function resetRun() {
  state = 'ready'; y = 255; velocity = 0; pipes = []; score = 0; spawn = 0;
  confetti = []; celebration = 0; milestone = 0;
  lives = 3; invulnerable = 0; shake = 0; impact = 0; impactY = 255; hitParticles = [];
  lifeBonus = 0; llamaTilt = 0; weatherLast = null;
  llamaRenderer.reset();
  restart.hidden = true;
}

function hop() {
  if (state === 'over') return;
  if (state !== 'playing') {
    resetRun();
    state = 'playing';
  }
  velocity = -6.2;
  llamaRenderer.onHop(appearanceScore(), y);
}
function playAgain() {
  state = 'ready'; restart.hidden = true; canvas.focus(); hop();
}
function clearGameState() {
  if (!window.confirm('Reset your best score, all discovered worlds, and the current game? This cannot be undone.')) return;
  const savedProgressCleared = clearSavedProgress();
  resetRun();
  best = 0; last = 0;
  weatherElapsed = 0; weatherLast = null;
  currentWeather = 0; previousWeather = 0; weatherChangedAt = 0; nextWeatherChange = 8000;
  gallery.clear();
  document.getElementById('reset-status').textContent = savedProgressCleared
    ? 'Progress cleared. A fresh adventure awaits!'
    : 'Game reset, but saved progress could not be cleared from browser storage.';
}

restart.addEventListener('click', playAgain);
document.getElementById('clear-state').addEventListener('click', clearGameState);
canvas.addEventListener('pointerdown', e => { e.preventDefault(); hop(); });
window.addEventListener('keydown', e => {
  if (e.target.closest('button')) return;
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault(); if (!e.repeat) hop();
  }
  if (e.code === 'Enter' && state === 'over') {
    e.preventDefault(); if (!e.repeat) playAgain();
  }
});
function end() {
  state = 'over'; best = Math.max(best, score);
  restart.hidden = false;
  saveBestScore(best);
}
function loseLife(cactusHit = null) {
  if (state !== 'playing' || invulnerable > 0) return;
  lives--; invulnerable = 90; shake = 25; impact = 45;
  impactY = Math.max(50, Math.min(490, y));
  hitParticles = Array.from({ length: 22 }, (_, i) => {
    const angle = i * Math.PI * 2 / 22, speed = 2 + (i % 4);
    return { x: 100, y: impactY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 40 };
  });
  if (cactusHit) cactusHit.passed = true; // No points for a cactus we hit.
  if (lives === 0) { end(); return; }
  // Recover inside the gap, or away from the sky/ground, without resetting progress.
  y = cactusHit ? cactusHit.top + 85 : Math.max(90, Math.min(450, y));
  velocity = cactusHit ? -2 : y <= 90 ? 2 : -3;
}
function drawImpact(dt) {
  ctx.save();
  for (const p of hitParticles) {
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.08 * dt; p.life -= dt;
    ctx.globalAlpha = Math.max(0, p.life / 40); ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
  }
  hitParticles = hitParticles.filter(p => p.life > 0);
  if (impact > 0) {
    ctx.globalAlpha = Math.min(1, impact / 15);
    ctx.strokeStyle = '#f28f87'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(100, impactY, 12 + (45 - impact) * 1.3, 0, Math.PI * 2); ctx.stroke();
    const labelY = Math.max(65, impactY - 65);
    rounded(52, labelY - 23, 96, 30, 10, '#fff9ec');
    ctx.fillStyle = '#b64f56'; ctx.textAlign = 'center'; ctx.font = 'bold 16px system-ui';
    ctx.fillText('-1 life', 100, labelY - 3);
    impact = Math.max(0, impact - dt);
  }
  ctx.restore();
}
function drawLastLifeWarning(time) {
  if (state !== 'playing' || lives !== 1) return;
  ctx.save();
  const pulse = 0.65 + Math.sin(time / 450) * 0.2;
  const glow = ctx.createRadialGradient(200, 280, 140, 200, 280, 340);
  glow.addColorStop(0, 'rgba(215, 55, 75, 0)');
  glow.addColorStop(1, 'rgba(215, 55, 75, 0.5)');
  ctx.globalAlpha = pulse; ctx.fillStyle = glow; ctx.fillRect(0, 0, 400, 560);
  ctx.strokeStyle = '#dc5366'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.roundRect(3, 3, 394, 554, 20); ctx.stroke();
  ctx.restore();
}
function awardPoints(points) {
  const previousScore = score;
  score += points;
  const extraLives = Math.floor(score / 9) - Math.floor(previousScore / 9);
  if (extraLives > 0) { lives += extraLives; lifeBonus = 100; }
  if (Math.floor(score / 5) > Math.floor(previousScore / 5)) {
    celebrate(Math.floor(score / 5) * 5);
  }
}
function celebrate(milestoneScore) {
  milestone = milestoneScore; celebration = 100;
  const colors = ['#e79373', '#ffd166', '#558c61', '#ffffff', '#a78bfa'];
  confetti = Array.from({ length: 45 }, () => ({
    x: 100, y, vx: (Math.random() - 0.35) * 8, vy: -2 - Math.random() * 6,
    angle: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.2,
    life: 85, color: colors[Math.floor(Math.random() * colors.length)]
  }));
}
function drawCelebration(dt) {
  ctx.save();
  for (const p of confetti) {
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.12 * dt;
    p.angle += p.spin * dt; p.life -= dt;
    ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 25));
    ctx.translate(p.x, p.y); ctx.rotate(p.angle);
    ctx.fillStyle = p.color; ctx.fillRect(-3, -2, 6, 4); ctx.restore();
  }
  confetti = confetti.filter(p => p.life > 0);
  if (celebration > 0) {
    celebration = Math.max(0, celebration - dt);
    ctx.globalAlpha = Math.min(1, celebration / 20);
    rounded(75, 70, 250, 42, 14, '#fff9ec');
    ctx.fillStyle = '#344739'; ctx.textAlign = 'center'; ctx.font = 'bold 19px system-ui';
    ctx.fillText(`★ ${milestone} points! Llama-zing! ★`, 200, 98);
  }
  ctx.restore();
}
function cactus(x, top, bottom, pink) {
  const color = pink ? '#df79a5' : '#558c61';
  rounded(x, -18, 54, top + 18, 12, color);
  rounded(x, bottom, 54, 530 - bottom, 12, color);
  ctx.strokeStyle = pink ? '#f5b2d0' : '#76a97b'; ctx.lineWidth = 3;
  for (const offset of [16, 36]) {
    ctx.beginPath(); ctx.moveTo(x + offset, 0); ctx.lineTo(x + offset, top - 10);
    ctx.moveTo(x + offset, bottom + 10); ctx.lineTo(x + offset, 530); ctx.stroke();
  }
  if (pink) {
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.font = 'bold 18px system-ui';
    ctx.fillText('+3', x + 27, top - 18);
  }
}
function advanceWeather(time) {
  if (state === 'playing' && weatherLast !== null) {
    weatherElapsed += Math.max(0, time - weatherLast);
  }
  weatherLast = state === 'playing' ? time : null;
}
function weatherAt(elapsed) {
  if (elapsed >= nextWeatherChange) {
    previousWeather = currentWeather;
    currentWeather = (currentWeather + 1 + Math.floor(Math.random() * (weatherTypes.length - 1))) % weatherTypes.length;
    weatherChangedAt = Math.floor(elapsed / 8000) * 8000;
    nextWeatherChange = weatherChangedAt + 8000;
  }
  const progress = Math.min(1, Math.max(0, (elapsed - weatherChangedAt) / 3000));
  return {
    current: weatherTypes[currentWeather],
    previous: weatherTypes[previousWeather],
    blend: progress * progress * (3 - 2 * progress)
  };
}
function drawWeather(time) {
  const weather = weatherAt(time);
  ctx.save();
  weatherScene(weather.previous, time);
  ctx.globalAlpha = weather.blend;
  weatherScene(weather.current, time);
  ctx.restore();
  if (state === 'playing') {
    gallery.discover(weather.previous);
    if (weather.blend === 1) gallery.discover(weather.current);
  }
}
function updateRun(dt) {
  if (state !== 'playing') return;
  invulnerable = Math.max(0, invulnerable - dt);
  velocity += 0.32 * dt; y += velocity * dt; spawn -= dt;
  if (spawn <= 0) {
    const top = 90 + Math.random() * 220;
    pipes.push({ x: 410, top, passed: false, pink: Math.random() < 0.15 }); spawn = 105;
  }
  for (const p of pipes) {
    p.x -= 2.5 * dt;
    if (!p.passed && p.x + 54 < 80) {
      p.passed = true; awardPoints(p.pink ? 3 : 1);
    }
    if (p.x < 124 && p.x + 54 > 82 && (y - 34 < p.top || y + 20 > p.top + 170)) loseLife(p);
    if (state === 'over') break;
  }
  pipes = pipes.filter(p => p.x > -60);
  if (y < 38 || y > 508) loseLife();
  if (state === 'playing') y = Math.max(38, Math.min(508, y));
}

function frame(time) {
  const dt = last ? Math.min((time - last) / 16.667, 2) : 1; last = time;
  advanceWeather(time);
  updateRun(dt);
  const targetTilt = Math.max(-0.3, Math.min(0.5, velocity * 0.055));
  llamaTilt += (targetTilt - llamaTilt) * (1 - Math.exp(-0.14 * dt));
  ctx.fillStyle = '#c9e9e5'; ctx.fillRect(0, 0, 400, 560);
  ctx.save();
  if (shake > 0) {
    const strength = 7 * shake / 25;
    ctx.translate(Math.sin(shake * 2.3) * strength, Math.cos(shake * 3.1) * strength);
    shake = Math.max(0, shake - dt);
  }
  drawWeather(weatherElapsed);
  for (const p of pipes) cactus(p.x, p.top, p.top + 170, p.pink);
  drawGround(weatherTypes[currentWeather]);
  llamaRenderer.draw(time, dt, { state, y, score: appearanceScore(), invulnerable, llamaTilt });
  rounded(168, 12, 64, 48, 14, '#fff9ecdd');
  ctx.fillStyle = '#344739'; ctx.textAlign = 'center'; ctx.font = 'bold 36px system-ui'; ctx.fillText(score, 200, 52);
  drawCelebration(dt);
  drawImpact(dt);
  ctx.restore();
  rounded(12, 14, 112, 34, 12, '#fff9ecdd');
  ctx.fillStyle = '#d96b7a'; ctx.textAlign = 'center'; ctx.font = '23px system-ui';
  ctx.fillText(lives > 3 ? `♥ × ${lives}` : '♥'.repeat(lives) + '♡'.repeat(3 - lives), 68, 39);
  if (lifeBonus > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, lifeBonus / 20);
    rounded(250, 12, 138, 48, 14, '#fff9ec');
    ctx.fillStyle = '#558c61'; ctx.font = 'bold 18px system-ui'; ctx.fillText('+1 life!', 319, 42);
    ctx.restore(); lifeBonus = Math.max(0, lifeBonus - dt);
  }
  if (state !== 'playing') {
    rounded(35, 310, 330, 135, 18, '#fff9ecf2');
    ctx.font = 'bold 25px system-ui'; ctx.fillStyle = '#344739';
    ctx.fillText(state === 'ready' ? 'Ready to hop?' : 'One more hop?', 200, 347);
    ctx.font = '16px system-ui';
    ctx.fillText(state === 'ready' ? 'Tap or press Space to start' : `Score: ${score}  ·  Best: ${best}`, 200, 380);
    ctx.font = '14px system-ui';
    ctx.fillText(state === 'ready' ? 'Fly through the cactus gaps' : 'Press Enter or click Play again below', 200, 413);
  }
  drawLastLifeWarning(time);
  requestAnimationFrame(frame);
}
document.getElementById('final-score').textContent = FINAL_TRANSFORMATION_SCORE;
document.getElementById('cycle-start').textContent = TRANSFORMATION_RESTART_SCORE;
document.getElementById('form-interval').textContent = TRANSFORMATION_INTERVAL;
gallery.init();
requestAnimationFrame(frame);
