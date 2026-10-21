import { ctx, rounded, scenePolygon } from './canvas.js';
import { trailStyles, dogePhrases, FINAL_TRANSFORMATION_SCORE } from './config.js';

// Character animation state stays private to the renderer, not the game rules.
export function createLlamaRenderer() {
  let state = 'ready', y = 255, score = 0, invulnerable = 0, llamaTilt = 0;
  let sparkles = [], sparkleSpawn = 0;
  let trailParticles = [], trailSpawn = 0, lastTrailKind = null;
  let dogeWords = [], oraBursts = [];
  const appearanceScore = () => score;

  function drawLlamaEffects(time) {
    const score = appearanceScore();
    const t = time / 1000;
    if (score >= 73) return;
    if (score >= 63) {
      drawStrangeMagic(time, false);
      return;
    }
    if (score >= 53) {
      const glow = ctx.createRadialGradient(0, -12, 8, 0, -12, 64);
      glow.addColorStop(0, '#b9edff55'); glow.addColorStop(0.6, '#8dd9ff30');
      glow.addColorStop(1, '#8dd9ff00');
      ctx.fillStyle = glow; ctx.fillRect(-64, -76, 128, 128);
      drawAvatarElements(time, false);
      drawOrbitingStones(time, false);
      return;
    }
    if (score >= 43) {
      ctx.strokeStyle = '#e6f7ffb0'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const drift = (t * 45 + i * 13) % 32;
        const x = -31 - drift, yy = -33 + i * 13;
        ctx.beginPath(); ctx.moveTo(x - 23, yy + 3);
        ctx.quadraticCurveTo(x - 6, yy - 3, x + 7, yy); ctx.stroke();
      }
      return;
    }
    if (score >= 23 && score < 33) {
      drawSuperSaiyanAura(time);
    }
  }
  function drawStrangeMagic(time, front) {
    const t = time / 1000;
    ctx.save(); ctx.lineCap = 'round';
    for (let side = 0; side < 2; side++) {
      if ((side === 1) !== front) continue;
      ctx.save(); ctx.translate(side ? 32 : -31, side ? -6 : -18);
      ctx.rotate(t * (side ? 0.45 : -0.35));
      ctx.shadowColor = '#f39232'; ctx.shadowBlur = 5;
      ctx.strokeStyle = '#ed8628'; ctx.lineWidth = 2;
      for (const radius of [16, 22]) {
        ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.shadowBlur = 0; ctx.strokeStyle = '#ffcf72'; ctx.lineWidth = 1;
      for (let turn = 0; turn < 2; turn++) {
        ctx.save(); ctx.rotate(turn * Math.PI / 4);
        ctx.strokeRect(-11, -11, 22, 22); ctx.restore();
      }
      for (let i = 0; i < 12; i++) {
        ctx.save(); ctx.rotate(i * Math.PI / 6);
        ctx.beginPath(); ctx.moveTo(18, -1); ctx.lineTo(20, -1);
        ctx.lineTo(19, 2); ctx.lineTo(21, 2); ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  function drawStrangeCloak(time) {
    const flutter = Math.sin(time / 350) * 3;
    ctx.fillStyle = '#a82638'; ctx.strokeStyle = '#702535'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(12, -23); ctx.lineTo(-8, -20);
    ctx.quadraticCurveTo(-32, -10, -40, 29 + flutter);
    ctx.quadraticCurveTo(-14, 40, 13, 22); ctx.lineTo(12, -23);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#d65350'; ctx.beginPath(); ctx.moveTo(-8, -12);
    ctx.quadraticCurveTo(-16, 10, -29, 29 + flutter); ctx.stroke();
    // Raised collar frames the head without hiding the muzzle or ears.
    ctx.fillStyle = '#b93242'; ctx.beginPath(); ctx.moveTo(6, -17);
    ctx.lineTo(-3, -39); ctx.quadraticCurveTo(10, -39, 12, -23);
    ctx.lineTo(22, -35); ctx.lineTo(20, -14); ctx.closePath(); ctx.fill();
  }
  function drawSuperSaiyanAura(time) {
    const t = time / 1000;
    ctx.save();
    const glow = ctx.createRadialGradient(0, -15, 12, 0, -15, 73);
    glow.addColorStop(0, '#fff7bc30'); glow.addColorStop(0.55, '#ffdd5960');
    glow.addColorStop(1, '#ffcc3300');
    ctx.fillStyle = glow; ctx.fillRect(-74, -89, 148, 148);
    // A tall, tapered flame envelope, with a clear center around the character.
    for (let layer = 0; layer < 3; layer++) {
      ctx.save(); ctx.translate(0, 29); ctx.scale(1 - layer * 0.16, 1 - layer * 0.12);
      const sway = Math.sin(t * 3 + layer) * 3;
      ctx.fillStyle = ['#efb72a80', '#ffe449b0', '#fff6a0b0'][layer];
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-37, -4, -44, -50);
      ctx.lineTo(-32, -40); ctx.lineTo(-45 + sway, -86);
      ctx.lineTo(-28, -67); ctx.lineTo(-28 + sway, -111);
      ctx.lineTo(-15, -86); ctx.lineTo(-5 + sway, -126);
      ctx.lineTo(6, -103); ctx.lineTo(20 + sway, -121);
      ctx.lineTo(23, -82); ctx.lineTo(38, -99);
      ctx.lineTo(32, -57); ctx.lineTo(46 + sway, -71);
      ctx.quadraticCurveTo(40, -8, 0, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    // Thin streams rise along the sides instead of flashing the whole aura.
    ctx.lineCap = 'round'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 14; i++) {
      const travel = (t * 60 + i * 17) % 85;
      const x = (i % 2 ? -1 : 1) * (25 + (i % 4) * 4);
      const yy = 22 - travel;
      ctx.strokeStyle = i % 3 ? '#fffbc2a0' : '#ffc72b99';
      ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x * 0.9, yy - 10 - (i % 3) * 4); ctx.stroke();
    }
    // Soft blue-white electricity remains part of the 23-point form.
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const angle = i * Math.PI * 2 / 3 + t * 0.35;
        const energy = (1 + Math.sin(t * 2 + i * 1.7)) / 2;
        ctx.save(); ctx.translate(0, -10); ctx.rotate(angle);
        ctx.strokeStyle = `rgba(190, 238, 255, ${0.3 + energy * 0.3})`;
        ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(33, -4);
        ctx.lineTo(32, 3); ctx.lineTo(41 + energy * 8, -2); ctx.stroke(); ctx.restore();
      }
    ctx.restore();
  }
  function drawSuperSaiyanHair() {
    ctx.fillStyle = '#ffdb49'; ctx.strokeStyle = '#d49b29'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(5, -28); ctx.lineTo(-9, -43); ctx.lineTo(-2, -41);
    ctx.lineTo(-9, -57); ctx.lineTo(3, -49); ctx.lineTo(3, -66);
    ctx.lineTo(13, -53); ctx.lineTo(21, -64); ctx.lineTo(23, -49);
    ctx.lineTo(33, -53); ctx.lineTo(25, -34); ctx.lineTo(18, -36);
    ctx.lineTo(12, -30); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#fff3a1';
    for (const [x, yy] of [[-3, -50], [7, -57], [20, -55]]) {
      ctx.beginPath(); ctx.moveTo(12, -37); ctx.lineTo(x, yy); ctx.stroke();
    }
  }
  function ponytaFlame(x, yy, width, height, phase, time) {
    const t = time / 1000;
    const sway = Math.sin(t * 5 + phase) * 0.12;
    ctx.save(); ctx.translate(x, yy); ctx.scale(width, height);
    ctx.fillStyle = '#ec6236';
    ctx.beginPath(); ctx.moveTo(-0.35, 0);
    ctx.bezierCurveTo(-0.8, -0.22, -0.42, -0.55, -0.58, -0.68);
    ctx.quadraticCurveTo(-0.22, -0.6, -0.2, -0.38);
    ctx.bezierCurveTo(-0.18, -0.65, 0.45 + sway, -0.78, 0.25 + sway, -1);
    ctx.bezierCurveTo(0.95 + sway, -0.72, 0.24, -0.4, 0.5, -0.52);
    ctx.bezierCurveTo(0.72, -0.26, 0.42, 0.08, -0.35, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffb62f';
    ctx.beginPath(); ctx.moveTo(-0.28, -0.05);
    ctx.quadraticCurveTo(-0.52, -0.32, -0.27, -0.48);
    ctx.quadraticCurveTo(-0.18, -0.26, -0.06, -0.35);
    ctx.quadraticCurveTo(0.38 + sway, -0.57, 0.36 + sway, -0.8);
    ctx.bezierCurveTo(0.63, -0.45, 0.16, -0.22, 0.36, -0.25);
    ctx.quadraticCurveTo(0.4, 0.02, -0.28, -0.05); ctx.fill();
    ctx.fillStyle = '#ffe77b';
    ctx.beginPath(); ctx.moveTo(-0.15, -0.06);
    ctx.quadraticCurveTo(-0.2, -0.27, 0.15, -0.43);
    ctx.quadraticCurveTo(0.07, -0.22, 0.22, -0.14);
    ctx.quadraticCurveTo(0.19, 0, -0.15, -0.06); ctx.fill();
    ctx.restore();
  }
  function drawPonytaTail(time) {
    const t = time / 1000;
    const sway = Math.sin(t * 2.6) * 2.2;
    const layers = [
      { scale: 1, color: '#d94a25', shift: 0 },
      { scale: 0.80, color: '#ff8a2e', shift: 3 },
      { scale: 0.58, color: '#ffc247', shift: 6 },
      { scale: 0.36, color: '#fff0a0', shift: 9 }
    ];
    ctx.save();
    ctx.translate(-20, -10);
    ctx.rotate(-0.12 + Math.sin(t * 2.2) * 0.05);
    ctx.scale(0.75, 0.75);
    for (const { scale, color, shift } of layers) {
      ctx.save();
      ctx.translate(-14, 0); ctx.scale(scale, scale); ctx.translate(14 + shift, 0);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-2 + sway * 0.2, 3);
      ctx.bezierCurveTo(-12, 9, -24, 7, -28, 0);
      ctx.lineTo(-36 + sway * 0.4, 2);
      ctx.quadraticCurveTo(-34, -5, -30, -9);
      ctx.lineTo(-39 + sway * 0.8, -8);
      ctx.quadraticCurveTo(-37, -16, -33, -20);
      ctx.lineTo(-42 + sway, -22);
      ctx.quadraticCurveTo(-38, -31, -32, -34);
      ctx.lineTo(-36 + sway, -42);
      ctx.quadraticCurveTo(-27, -44, -21, -36);
      ctx.lineTo(-16 + sway * 0.6, -44);
      ctx.quadraticCurveTo(-10, -38, -12, -31);
      ctx.lineTo(-4, -33);
      ctx.quadraticCurveTo(2, -26, -3, -20);
      ctx.lineTo(4, -19);
      ctx.quadraticCurveTo(7, -10, 0, -6);
      ctx.lineTo(6, 0);
      ctx.quadraticCurveTo(2, 5, -2 + sway * 0.2, 3);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  function drawPonytaMane(time) {
    const t = time / 1000;
    const sway = Math.sin(t * 3.4) * 1.6;
    const layers = [
      { scale: 1, color: '#d94a25' },
      { scale: 0.76, color: '#ff8a2e' },
      { scale: 0.52, color: '#ffe066' }
    ];
    ctx.save();
    ctx.translate(-8, 4);
    ctx.scale(0.75, 0.75);
    for (const { scale, color } of layers) {
      ctx.save();
      ctx.translate(16, -22); ctx.scale(scale, scale); ctx.translate(-16, 22);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(37, -43);
      ctx.bezierCurveTo(36, -51, 30, -57, 22 - sway, -55);
      ctx.lineTo(24 - sway, -62);
      ctx.quadraticCurveTo(16, -58, 12, -50);
      ctx.lineTo(10 - sway, -58);
      ctx.quadraticCurveTo(4, -52, 4, -42);
      ctx.lineTo(0 - sway, -49);
      ctx.quadraticCurveTo(-4, -41, -1, -33);
      ctx.lineTo(-6, -38);
      ctx.quadraticCurveTo(-9, -29, -6 - sway, -21);
      ctx.quadraticCurveTo(-1, -23, 4, -26);
      ctx.quadraticCurveTo(10, -30, 14, -36);
      ctx.quadraticCurveTo(18, -42, 24, -45);
      ctx.quadraticCurveTo(31, -48, 37, -43);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  function drawPonytaFetlock(x, y, scale, time, phase) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.12);
    ponytaFlame(0, 0, 6 * scale, 11 * scale, phase, time);
    ctx.restore();
  }
  function drawPonytaLlama(time) {
    const coat = '#fff9ec';
    drawPonytaTail(time);

    // Shared llama body, neck and head proportions.
    rounded(-19, -9, 32, 24, 9, coat);
    rounded(4, -30, 13, 36, 6, coat);
    rounded(4, -35, 24, 15, 6, coat);
    // A short pony muzzle keeps the silhouette horse-like.
    rounded(24, -30, 10, 9, 4, coat);

    // Legs, fetlock flames and blue hooves.
    rounded(-14, 10, 6, 14, 2, coat); rounded(3, 10, 6, 14, 2, coat);
    drawPonytaFetlock(-12, 21, 0.85, time, 1);
    drawPonytaFetlock(5, 21, 0.85, time, 4);
    rounded(-14, 22, 6, 4, 1.5, '#4b5c82');
    rounded(3, 22, 6, 4, 1.5, '#4b5c82');
    ctx.fillStyle = '#8fa0c2';
    ctx.fillRect(-13, 23, 4, 1); ctx.fillRect(4, 23, 4, 1);

    // Flame mane over the neck and crown.
    drawPonytaMane(time);

    // Ears with warm inner fur.
    rounded(5, -48, 5, 17, 2, coat); rounded(14, -47, 5, 16, 2, coat);
    scenePolygon([[6.5, -45], [7, -37], [9.5, -39]], '#e8a58f');
    scenePolygon([[15.5, -44], [16, -36], [18.5, -38]], '#e8a58f');

    // Small pony eye, nostril and mouth.
    ctx.fillStyle = '#2c2a3a';
    ctx.beginPath(); ctx.arc(20, -30, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6c7fa8';
    ctx.beginPath(); ctx.arc(20, -29.3, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fffdf4';
    ctx.beginPath(); ctx.arc(20.7, -31, 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8c6a55';
    ctx.beginPath(); ctx.ellipse(31, -26, 0.9, 1.2, -0.25, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a67d62'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(29, -23.5); ctx.quadraticCurveTo(31, -23, 33, -24); ctx.stroke();
  }
  function drawAvatarElements(time, front) {
    const t = time / 1000;
    ctx.save(); ctx.lineCap = 'round';
    for (let element = 0; element < 3; element++) {
      const tilt = [0.08, -0.88, 0.65][element];
      const rx = [66, 70, 63][element], ry = [20, 19, 24][element];
      const point = angle => {
        const x = Math.cos(angle) * rx, yy = Math.sin(angle) * ry;
        return [x * Math.cos(tilt) - yy * Math.sin(tilt), -10 + x * Math.sin(tilt) + yy * Math.cos(tilt)];
      };
      for (let i = 0; i < 64; i++) {
        const angle = i * Math.PI * 2 / 64;
        if ((Math.sin(angle + Math.PI / 64) >= 0) !== front) continue;
        const [x, yy] = point(angle), [nx, ny] = point(angle + Math.PI * 2 / 64 + 0.015);
        const ripple = Math.sin(i * 1.8 - t * 7);
        ctx.strokeStyle = ['#ed7c24', '#529dbb', '#d8f3ff90'][element];
        ctx.lineWidth = [9 + ripple * 2, 7, 2][element];
        ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(nx, ny); ctx.stroke();
        if (element === 0) {
          // A yellow-hot ribbon with orange flame tips rather than a flat halo.
          ctx.fillStyle = '#ffb92e';
          const flame = 6 + (1 + Math.sin(i * 2.3 - t * 9)) * 4;
          ctx.beginPath(); ctx.moveTo(x - 3, yy);
          ctx.quadraticCurveTo(x + 3, yy - flame * 0.5, x - 1 + ripple * 3, yy - flame);
          ctx.quadraticCurveTo(nx + 2, ny - 3, nx + 3, ny + 2); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = '#fff17b'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x, yy + 1); ctx.lineTo(nx, ny + 1); ctx.stroke();
        } else if (element === 1) {
          ctx.strokeStyle = '#a4e8f3'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x - 1, yy - 1); ctx.lineTo(nx - 1, ny - 1); ctx.stroke();
          if (i % 7 === 0) {
            const [dx, dy] = point(angle + t * 0.5);
            ctx.fillStyle = '#ddfbff'; ctx.beginPath(); ctx.arc(dx + 4, dy - 4, 1.5, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
    }
    ctx.restore();
  }
  function drawOrbitingStones(time, front) {
    const t = time / 1000;
    ctx.save();
    for (let axis = 0; axis < 2; axis++) {
      const tilt = axis === 0 ? -0.65 : 0.95;
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3 + t * (axis === 0 ? 1.2 : -0.95) + axis * 0.4;
        const depth = Math.sin(angle);
        if ((depth >= 0) !== front) continue;
        const ox = Math.cos(angle) * 76, oy = depth * 23;
        const x = ox * Math.cos(tilt) - oy * Math.sin(tilt);
        const yy = -12 + ox * Math.sin(tilt) + oy * Math.cos(tilt);
        ctx.save(); ctx.translate(x, yy); ctx.rotate(angle + axis);
        const size = 3 + (i % 3) * 1.5 + (depth + 1) * 0.7;
        ctx.fillStyle = front ? '#99714e' : '#b49977';
        ctx.strokeStyle = front ? '#624c3b' : '#8d7965'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-size, -size * 0.4); ctx.lineTo(-size * 0.3, -size);
        ctx.lineTo(size * 0.8, -size * 0.6); ctx.lineTo(size, size * 0.4);
        ctx.lineTo(0, size * 0.8); ctx.lineTo(-size * 0.9, size * 0.5);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#dbe3dd'; ctx.beginPath(); ctx.moveTo(-size * 0.5, -size * 0.3);
        ctx.lineTo(0, -size * 0.6); ctx.lineTo(size * 0.5, -size * 0.3); ctx.stroke();
        ctx.fillStyle = '#b49977'; ctx.fillRect(-size - 4, 1, 2, 2); ctx.fillRect(size + 3, -3, 1.5, 1.5);
        ctx.restore();
      }
    }
    ctx.restore();
  }
  function drawElectricSpark(x, yy, size, color) {
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineJoin = 'miter';
    ctx.beginPath(); ctx.moveTo(x - size, yy + size);
    ctx.lineTo(x - size * 0.2, yy - size * 0.3); ctx.lineTo(x + size * 0.3, yy + size * 0.2);
    ctx.lineTo(x + size, yy - size); ctx.stroke();
  }
  function drawPokemonTrail(dt) {
    const score = appearanceScore();
    const pokemon = score >= 13 && score < 23;
    ctx.save();
    if (pokemon && state === 'playing') {
      sparkleSpawn -= dt;
      while (sparkleSpawn <= 0) {
        sparkles.push({ x: 76, y: y - 3 + (Math.random() - 0.5) * 22,
          vx: -1.4 - Math.random() * 1.2, vy: (Math.random() - 0.5) * 0.6,
          life: 36, size: 3 + Math.random() * 3, phase: Math.random() * Math.PI });
        sparkleSpawn += 3;
      }
    } else sparkleSpawn = 0;
    for (const p of sparkles) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      ctx.globalAlpha = Math.max(0, p.life / 36);
      const twinkle = 0.7 + Math.sin(p.phase + p.life * 0.3) * 0.3;
      drawElectricSpark(p.x, p.y, p.size * twinkle, p.size > 4.5 ? '#fff6b0' : '#f0bb32');
    }
    sparkles = sparkles.filter(p => p.life > 0);
    ctx.restore();
  }
  function drawTrailParticle(p) {
    ctx.save(); ctx.translate(p.x, p.y);
    ctx.globalAlpha = (p.kind === 'menacing' ? 0.58 : 0.6) * Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color; ctx.strokeStyle = p.color; ctx.lineWidth = 1.5;
    switch (p.kind) {
      case 'menacing':
        ctx.rotate(-0.16); ctx.font = '500 17px MenacingSfx, sans-serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#fff5e5'; ctx.lineWidth = 1.5; ctx.strokeText('ゴゴゴ', 0, 0);
        ctx.fillText('ゴゴゴ', 0, 0);
        break;
      case 'energy':
        drawElectricSpark(0, 0, p.size, p.color);
        break;
      case 'ember':
        scenePolygon([[-p.size, p.size], [0, -p.size * 1.5], [p.size, p.size * 0.5]], p.color);
        break;
      case 'speed':
      case 'sith':
        ctx.beginPath(); ctx.moveTo(-p.size * 3, 1); ctx.lineTo(p.size, -1); ctx.stroke();
        break;
      case 'magic':
        ctx.rotate(p.life * 0.03); ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeRect(-p.size * 0.6, -p.size * 0.6, p.size * 1.2, p.size * 1.2);
        break;
      case 'elements':
        ctx.beginPath(); ctx.arc(0, 0, p.size, 0.2, Math.PI * 1.7); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); ctx.fill();
        break;
      case 'paw':
        ctx.beginPath(); ctx.ellipse(0, 2, p.size * 0.7, p.size * 0.55, 0, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.arc((i - 1) * p.size * 0.65, -p.size * 0.6 - (i === 1 ? 1 : 0), p.size * 0.28, 0, Math.PI * 2); ctx.fill();
        }
        break;
      default:
        ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function drawLlamaTrail(dt) {
    drawPokemonTrail(dt);
    const style = trailStyles.find(style => appearanceScore() < style.until);
    if (style.kind !== lastTrailKind) {
      trailSpawn = 0; lastTrailKind = style.kind;
    }
    // Pikachu and Nyan Cat already have their own electric and rainbow trails.
    const hasOwnTrail = style.kind === 'electric' || style.kind === 'rainbow';
    if (state === 'playing' && !hasOwnTrail) {
      trailSpawn -= dt;
      if (trailSpawn <= 0) {
        const maxLife = style.kind === 'menacing' ? 85 : 45;
        trailParticles.push({ x: style.kind === 'menacing' ? 55 : 76, y: y - 6 + (Math.random() - 0.5) * 26,
          size: 3 + Math.random() * 2, kind: style.kind, color: style.colors[Math.floor(Math.random() * style.colors.length)],
          life: maxLife, maxLife, vx: style.kind === 'menacing' ? -0.7 : -1.2 - Math.random() * 0.8 });
        trailSpawn = style.kind === 'menacing' ? 19 : style.kind === 'paw' ? 10 : 5;
      }
    }
    for (const p of trailParticles) {
      p.x += p.vx * dt; p.y -= (p.kind === 'menacing' ? 0.12 : 0.25) * dt; p.life -= dt;
      drawTrailParticle(p);
    }
    trailParticles = trailParticles.filter(p => p.life > 0 && p.x > -65);
  }
  function drawPokemonLlama(time) {
    const t = time / 1000;
    ctx.save(); ctx.translate(-43, -20 + Math.sin(t * 2.5) * 3);
    const drawBalls = front => {
      for (let i = 0; i < 3; i++) {
        const angle = t * 1.8 + i * Math.PI * 2 / 3;
        if ((Math.sin(angle) >= 0) !== front) continue;
        ctx.save(); ctx.translate(Math.cos(angle) * 29, Math.sin(angle) * 12 - 7);
        ctx.rotate(t + i); ctx.lineWidth = 1;
        ctx.fillStyle = '#fffaf1'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e55b66'; ctx.beginPath(); ctx.arc(0, 0, 4, Math.PI, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#454353'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(4, 0); ctx.stroke();
        ctx.fillStyle = '#fffaf1'; ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    };
    drawBalls(false);
    // Pikachu: black-tipped ears, red cheeks and a lightning-bolt tail.
    scenePolygon([[-12, 9], [-25, 4], [-21, -6], [-32, -13], [-23, -23], [-15, -14], [-19, -8], [-10, -2]], '#f4cd45');
    rounded(-13, -9, 25, 29, 10, '#f4cd45');
    rounded(-12, 16, 10, 5, 2, '#e7b93a'); rounded(5, 16, 10, 5, 2, '#e7b93a');
    scenePolygon([[-10, -19], [-16, -43], [-9, -39], [-3, -20]], '#f4cd45');
    scenePolygon([[6, -20], [17, -42], [19, -33], [13, -15]], '#f4cd45');
    scenePolygon([[-16, -43], [-9, -39], [-7, -33], [-13, -33]], '#45404a');
    scenePolygon([[17, -42], [19, -33], [15, -27], [12, -31]], '#45404a');
    rounded(-15, -24, 31, 25, 10, '#f8d54c');
    ctx.fillStyle = '#423d46';
    for (const x of [-6, 8]) { ctx.beginPath(); ctx.ellipse(x, -15, 2.2, 3, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#fffaf1';
    for (const x of [-6, 8]) { ctx.beginPath(); ctx.arc(x + 0.5, -16, 0.8, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#df6061';
    for (const x of [-11, 12]) { ctx.beginPath(); ctx.arc(x, -7, 3, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = '#6a4b42'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(2, -9); ctx.moveTo(-2, -5);
    ctx.quadraticCurveTo(1, -2, 4, -5); ctx.stroke();
    rounded(-17, 0, 6, 12, 3, '#f8d54c'); rounded(11, -1, 6, 12, 3, '#f8d54c');
    drawBalls(true);
    ctx.restore();
    // Ash's cap, blue vest, white sleeves and green fingerless gloves.
    ctx.rotate(llamaTilt);
    const coat = '#fff9ec';
    rounded(-19, -9, 32, 24, 7, coat); rounded(4, -30, 13, 36, 5, coat);
    rounded(4, -35, 25, 15, 5, coat);
    rounded(5, -49, 5, 18, 2, coat); rounded(15, -48, 5, 17, 2, coat);
    rounded(-14, 10, 6, 14, 2, '#587aa3'); rounded(3, 10, 6, 14, 2, '#587aa3');
    rounded(-27, -12, 12, 6, 3, coat);
    rounded(-18, -9, 31, 22, 5, '#367bc2'); rounded(4, -19, 13, 23, 4, '#367bc2');
    rounded(-5, -9, 8, 21, 1, '#354c62'); rounded(-6, -9, 2, 21, 1, '#f5d36e');
    rounded(-17, -7, 8, 7, 2, '#fff9ec'); rounded(6, -16, 8, 7, 2, '#fff9ec');
    rounded(-16, -2, 7, 6, 2, '#69a46f'); rounded(7, -10, 7, 6, 2, '#69a46f');
    rounded(3, -41, 22, 12, 4, '#da4e55'); rounded(2, -33, 31, 5, 2, '#da4e55');
    rounded(13, -40, 11, 9, 2, '#fff9ec');
    ctx.strokeStyle = '#478c73'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(16, -33); ctx.lineTo(18, -37); ctx.lineTo(21, -36); ctx.stroke();
    ctx.fillStyle = '#344739'; ctx.beginPath(); ctx.arc(22, -26, 2, 0, Math.PI * 2); ctx.fill();
  }
  function drawJojoLlama(time) {
    const t = time / 1000;
    // Star Platinum floats upright behind Jotaro, independently of the hop tilt.
    ctx.save(); ctx.translate(-39, -23 + Math.sin(t * 2.5) * 4);
    const aura = ctx.createRadialGradient(0, -8, 5, 0, -8, 57);
    aura.addColorStop(0, '#bd91ef55'); aura.addColorStop(1, '#9b73df00');
    ctx.fillStyle = aura; ctx.fillRect(-57, -65, 114, 114);
    ctx.globalAlpha *= 0.85;
    // Muscular purple silhouette, raised fists, shoulder guards and bracers.
    rounded(-12, 12, 10, 24, 4, '#805bb2'); rounded(3, 12, 10, 24, 4, '#805bb2');
    rounded(-14, -25, 29, 41, 10, '#9974c9');
    rounded(-23, -24, 12, 24, 6, '#926cc2'); rounded(14, -24, 12, 24, 6, '#926cc2');
    rounded(-26, -13, 10, 18, 4, '#8259b0'); rounded(20, -18, 10, 18, 4, '#8259b0');
    rounded(-28, -22, 14, 13, 5, '#b493dc'); rounded(19, -28, 14, 13, 5, '#b493dc');
    rounded(-25, -8, 11, 5, 1, '#e2c16f'); rounded(20, -13, 11, 5, 1, '#e2c16f');
    for (const x of [-19, 19]) {
      ctx.fillStyle = '#e2c16f'; ctx.beginPath(); ctx.ellipse(x, -24, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#a382cf'; ctx.beginPath(); ctx.ellipse(x, -25, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#65448e'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, -19); ctx.lineTo(0, 4); ctx.moveTo(-9, -9); ctx.lineTo(10, -9);
    ctx.moveTo(-7, -1); ctx.lineTo(8, -1); ctx.stroke();
    scenePolygon([[-14, 10], [14, 10], [11, 23], [1, 18], [-9, 24]], '#e7e0d5');
    rounded(-15, 7, 30, 5, 1, '#d8b25f');
    // Wild dark hair, gold headband and stern eyes.
    scenePolygon([[-12, -33], [-18, -42], [-10, -41], [-15, -53], [-5, -48], [0, -59], [5, -49], [15, -54], [12, -43], [20, -44], [13, -30]], '#343d57');
    rounded(-9, -42, 20, 22, 6, '#b08bd8');
    rounded(-11, -41, 24, 5, 1, '#e2c16f');
    ctx.fillStyle = '#65aa9a'; ctx.beginPath(); ctx.arc(1, -39, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#44365f'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-6, -33); ctx.lineTo(-1, -32); ctx.moveTo(4, -32); ctx.lineTo(9, -34); ctx.stroke();
    ctx.strokeStyle = '#ecf7e8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-5, -31); ctx.lineTo(-1, -31); ctx.moveTo(5, -31); ctx.lineTo(8, -32); ctx.stroke();
    rounded(-10, -23, 24, 6, 2, '#b96677');
    scenePolygon([[-10, -21], [-26, -18], [-36, -25 + Math.sin(t * 3) * 3], [-30, -13], [-9, -16]], '#b96677');
    ctx.restore();
    // Jotaro's long open coat retains the llama's silhouette and ears.
    ctx.rotate(llamaTilt);
    scenePolygon([[9, -24], [-15, -15], [-30, 27], [-8, 19], [1, 26], [15, 13]], '#262b3b');
    rounded(-19, -9, 32, 24, 7, '#303548');
    rounded(-14, 10, 6, 14, 2, '#303548'); rounded(3, 10, 6, 14, 2, '#303548');
    rounded(4, -30, 13, 36, 5, '#f0d8b7'); rounded(4, -35, 25, 15, 5, '#f0d8b7');
    rounded(5, -49, 5, 18, 2, '#303548'); rounded(15, -48, 5, 17, 2, '#303548');
    rounded(-8, -8, 15, 20, 2, '#7ba297');
    scenePolygon([[-19, -11], [-3, -16], [-9, 5], [-18, 12]], '#262b3b');
    scenePolygon([[5, -16], [16, -21], [18, 9], [7, 4]], '#262b3b');
    rounded(-17, 10, 28, 4, 1, '#c3a05a');
    rounded(3, -41, 21, 12, 3, '#232938'); rounded(2, -33, 31, 5, 2, '#232938');
    rounded(5, -34, 19, 2, 1, '#d9b866'); rounded(15, -39, 5, 5, 1, '#d9b866');
    ctx.strokeStyle = '#d9b866'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(12, -20); ctx.lineTo(21, -16); ctx.lineTo(20, -7);
    ctx.quadraticCurveTo(12, -4, 10, -11); ctx.stroke();
    ctx.fillStyle = '#303044'; ctx.beginPath(); ctx.arc(22, -27, 2, 0, Math.PI * 2); ctx.fill();
  }
  function drawPopLlama(score, time) {
    const t = time / 1000;
    const doge = score >= 93, nyan = score >= 83 && !doge;
    if (nyan) {
      ['#ff647e', '#ffaf59', '#ffe66d', '#83df95', '#79c9fa', '#bb96ef'].forEach((color, i) => {
        ctx.fillStyle = color;
        for (let x = -105; x < -15; x += 8) {
          ctx.fillRect(x, -14 + i * 5 + Math.round(Math.sin(x / 18 + t * 8)) * 3, 8, 5);
        }
      });
    }
    ctx.rotate(llamaTilt);
    if (!doge && !nyan) {
      ctx.fillStyle = '#20212d'; ctx.beginPath(); ctx.moveTo(8, -25);
      ctx.lineTo(-23, -19); ctx.lineTo(-48, 25 + Math.sin(t * 5) * 4);
      ctx.lineTo(11, 19); ctx.closePath(); ctx.fill();
    }
    const coat = doge ? '#d8a454' : nyan ? '#9b9cae' : '#30323f';
    rounded(-19, -9, 32, 24, 7, coat);
    rounded(4, -30, 13, 36, 5, coat);
    rounded(4, -35, 26, 17, 6, coat);
    rounded(5, -48, 6, 17, 2, coat); rounded(16, -47, 6, 16, 2, coat);
    rounded(-14, 10, 6, 14, 2, coat); rounded(3, 10, 6, 14, 2, coat);
    if (nyan) {
      // Pixel pastry, pink frosting and sprinkles; retain the llama's tall neck.
      ctx.fillStyle = '#c58d61'; ctx.fillRect(-24, -13, 40, 31);
      ctx.fillStyle = '#f7c995'; ctx.fillRect(-21, -11, 34, 27);
      ctx.fillStyle = '#f19bc4'; ctx.fillRect(-18, -8, 28, 21);
      ctx.fillStyle = '#cd528f';
      for (const [x, yy] of [[-14, -4], [-5, 0], [4, -5], [-12, 7], [3, 9]]) ctx.fillRect(x, yy, 3, 3);
      ctx.fillStyle = '#eea5b6'; ctx.fillRect(6, -45, 3, 9); ctx.fillRect(17, -44, 3, 9);
      ctx.fillRect(24, -24, 4, 3);
      ctx.fillStyle = '#36354d'; ctx.fillRect(21, -30, 3, 3);
      ctx.fillRect(28, -27, 3, 2);
      ctx.fillStyle = '#9b9cae'; ctx.fillRect(-31, -3, 9, 6); ctx.fillRect(-35, -8, 5, 9);
    } else if (doge) {
      rounded(9, -27, 24, 12, 5, '#f8e6bb');
      ctx.fillStyle = '#f8e6bb'; ctx.beginPath(); ctx.ellipse(-2, 3, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#725237'; ctx.fillRect(7, -44, 2, 8); ctx.fillRect(18, -43, 2, 8);
      ctx.fillStyle = '#302c30'; ctx.beginPath(); ctx.arc(23, -30, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(31, -24, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#765135'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(18, -35); ctx.lineTo(24, -36); ctx.moveTo(22, -19); ctx.lineTo(28, -18); ctx.stroke();
      ctx.strokeStyle = '#d8a454'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(-23, -8, 7, 0, Math.PI * 1.7); ctx.stroke();
    } else {
      // Vader's flared helmet, triangular respirator and chest controls.
      rounded(1, -39, 30, 25, 10, '#171923');
      ctx.fillStyle = '#171923'; ctx.beginPath(); ctx.moveTo(5, -35); ctx.lineTo(-3, -15);
      ctx.lineTo(35, -15); ctx.lineTo(28, -35); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#697080'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(15, -37); ctx.lineTo(15, -27); ctx.lineTo(8, -18);
      ctx.lineTo(23, -18); ctx.lineTo(15, -27); ctx.stroke();
      ctx.fillStyle = '#7e8594'; ctx.fillRect(6, -30, 7, 3); ctx.fillRect(19, -30, 7, 3);
      rounded(-10, -6, 18, 14, 2, '#12141e');
      for (let i = 0; i < 3; i++) { ctx.fillStyle = ['#72bfc8', '#ed595f', '#e8e4d8'][i]; ctx.fillRect(-7 + i * 5, -2, 3, 5); }
      ctx.strokeStyle = '#858792'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(21, 8); ctx.lineTo(29, -1); ctx.stroke();
      ctx.shadowColor = '#ff354c'; ctx.shadowBlur = 10; ctx.strokeStyle = '#ff4054'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(29, -1); ctx.lineTo(48, -39); ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = '#fff0ed'; ctx.lineWidth = 2; ctx.stroke();
    }
  }
  function drawOraBursts(dt) {
    ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.font = '900 27px OraSfx, "Noto Sans CJK JP", "Yu Gothic", sans-serif';
    for (const burst of oraBursts) {
      burst.life -= dt;
      burst.y -= dt * 0.4;
      ctx.save(); ctx.translate(burst.x, burst.y); ctx.rotate(-0.18);
      ctx.globalAlpha = Math.max(0, Math.min(1, burst.life / 14));
      ctx.strokeStyle = '#fff5e5'; ctx.lineWidth = 7; ctx.strokeText('オラッ！', 0, 0);
      ctx.strokeStyle = '#30203e'; ctx.lineWidth = 3; ctx.strokeText('オラッ！', 0, 0);
      ctx.fillStyle = '#b982df'; ctx.fillText('オラッ！', 0, 0);
      ctx.strokeStyle = '#30203e'; ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(-7 - i * 5, -12 + i * 11); ctx.lineTo(-15 - i * 7, -18 + i * 14); ctx.stroke();
      }
      ctx.restore();
    }
    oraBursts = oraBursts.filter(burst => burst.life > 0);
    ctx.restore();
  }
  function drawDogeWords(dt) {
    if (appearanceScore() >= FINAL_TRANSFORMATION_SCORE) dogeWords = [];
    ctx.save(); ctx.textAlign = 'left'; ctx.font = 'bold 17px "Comic Sans MS", cursive';
    for (const word of dogeWords) {
      word.life -= dt;
      word.y -= 0.45 * dt;
      ctx.globalAlpha = Math.max(0, Math.min(1, word.life / 15));
      ctx.strokeStyle = '#fff9ec'; ctx.lineWidth = 4; ctx.strokeText(word.text, 132, word.y);
      ctx.fillStyle = ['#a53691', '#356bb5', '#8b5a16'][dogePhrases.indexOf(word.text)];
      ctx.fillText(word.text, 132, word.y);
    }
    dogeWords = dogeWords.filter(word => word.life > 0);
    ctx.restore();
  }
  function llama(time) {
    const score = appearanceScore();
    const ponyta = score >= 33 && score < 43;
    const coat = score >= 33 ? '#fff9ec' : score >= 23 ? '#db783e' : '#fff9ec';
    ctx.save(); ctx.translate(100, y);
    if (invulnerable > 0 && state === 'playing') {
      ctx.strokeStyle = '#ffffffcc'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, -10, 38, 53, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.65;
    }
    if (score >= 13 && score < 23) {
      drawPokemonLlama(time);
      ctx.restore();
      return;
    }
    if (score >= FINAL_TRANSFORMATION_SCORE) {
      drawJojoLlama(time);
      ctx.restore();
      return;
    }
    if (score >= 73) {
      drawPopLlama(score, time);
      ctx.restore();
      return;
    }
    // Effects use the continuous frame timestamp in an upright local space.
    // Hopping changes the body's tilt, not the aura or orbital animation phase.
    drawLlamaEffects(time);
    ctx.rotate(llamaTilt);
    if (ponyta) {
      drawPonytaLlama(time);
      ctx.restore();
      return;
    }
    if (score >= 63) drawStrangeCloak(time);
    if (score >= 43 && score < 53) {
      const flutter = Math.sin(time / 180) * 5;
      ctx.fillStyle = '#d92843';
      ctx.beginPath(); ctx.moveTo(8, -21); ctx.lineTo(-9, -15);
      ctx.bezierCurveTo(-30, -20, -43, -8 + flutter, -58, -15 + flutter);
      ctx.lineTo(-49, 15 + flutter);
      ctx.quadraticCurveTo(-19, 26, 8, -3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#a51e38'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(2, -15); ctx.quadraticCurveTo(-24, 4, -48, 3 + flutter); ctx.stroke();
    }
    rounded(-19, -9, 32, 24, 9, coat);
    rounded(4, -30, 13, 36, 6, coat);
    rounded(4, -35, 24, 15, 6, coat);
    rounded(5, -48, 5, 17, 2, coat); rounded(14, -47, 5, 16, 2, coat);
    rounded(-14, 10, 6, 14, 2, coat); rounded(3, 10, 6, 14, 2, coat);
    rounded(-27, -12, 12, 6, 3, coat);
    if (score >= 43 && score < 53) {
      rounded(-19, -9, 32, 24, 9, '#2275cf');
      rounded(4, -21, 13, 25, 5, '#2275cf');
      rounded(-14, 10, 6, 14, 2, '#d92843'); rounded(3, 10, 6, 14, 2, '#d92843');
      rounded(-17, 9, 27, 4, 1, '#f7cf46');
      ctx.fillStyle = '#f7cf46'; ctx.strokeStyle = '#d92843'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(4, -6); ctx.lineTo(7, -2);
      ctx.lineTo(-4, 9); ctx.lineTo(-15, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c51e39'; ctx.textAlign = 'center'; ctx.font = 'bold 12px system-ui';
      ctx.fillText('S', -4, 4);
    } else if (score >= 63) {
      rounded(-19, -9, 32, 24, 9, '#245577');
      rounded(4, -22, 13, 25, 5, '#245577');
      ctx.strokeStyle = '#417b96'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(5, -8); ctx.lineTo(-9, 9);
      ctx.moveTo(-12, -7); ctx.lineTo(4, 9); ctx.stroke();
      rounded(-17, 9, 27, 4, 1, '#74523c');
      rounded(-14, 17, 6, 7, 2, '#343b47'); rounded(3, 17, 6, 7, 2, '#343b47');
      ctx.strokeStyle = '#d7aa53'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(6, -16); ctx.lineTo(-3, -3); ctx.lineTo(-12, -9); ctx.stroke();
      ctx.fillStyle = '#dfb957'; ctx.beginPath(); ctx.ellipse(-3, -2, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6dc29c'; ctx.beginPath(); ctx.arc(-3, -2, 1.5, 0, Math.PI * 2); ctx.fill();
      // Dark swept hair, silver temple and a tiny pointed goatee.
      rounded(4, -36, 17, 5, 2, '#343b47');
      rounded(4, -34, 4, 11, 1, '#343b47'); rounded(4, -32, 2, 6, 1, '#b8c2c8');
      ctx.fillStyle = '#343b47'; ctx.beginPath(); ctx.moveTo(17, -21);
      ctx.lineTo(23, -21); ctx.lineTo(20, -16); ctx.closePath(); ctx.fill();
    } else if (score >= 23 && score < 33) {
      // Goku-inspired orange gi, blue sash and boots, and the 悟 insignia.
      rounded(-19, -9, 32, 24, 9, '#e85e21');
      rounded(5, -15, 11, 16, 3, '#254b8a');
      rounded(-17, 9, 27, 4, 1, '#254b8a');
      rounded(-14, 17, 6, 7, 2, '#254b8a'); rounded(3, 17, 6, 7, 2, '#254b8a');
      ctx.fillStyle = '#fffaf0'; ctx.strokeStyle = '#263b50'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(-4, 0, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#263b50'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold 12px GokuEmblem, "Noto Sans CJK SC", sans-serif';
      ctx.fillText('悟', -4, 0);
      ctx.textBaseline = 'alphabetic';
    } else rounded(-13, -8, 20, 12, 3, '#e79373');
    if (score >= 23 && score < 33) drawSuperSaiyanHair();
    ctx.fillStyle = score >= 23 && score < 33 ? '#278f86' : '#344739';
    ctx.beginPath(); ctx.arc(20, -29, 2, 0, Math.PI * 2); ctx.fill();
    if (score >= 53 && score < 63) {
      ctx.save();
      // A dark socket and saturated blue rim keep the glowing eye distinct on cream.
      ctx.fillStyle = '#173e67';
      ctx.beginPath(); ctx.ellipse(20, -29, 4, 3.5, -0.12, 0, Math.PI * 2); ctx.fill();
      ctx.shadowColor = '#259dff'; ctx.shadowBlur = 6;
      ctx.fillStyle = '#1686e8'; ctx.beginPath(); ctx.arc(20, -29, 2.8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f0fcff'; ctx.beginPath(); ctx.arc(20, -29, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.save(); ctx.rotate(-llamaTilt);
      drawAvatarElements(time, true);
      drawOrbitingStones(time, true);
      ctx.restore();
    }
    if (score >= 63) {
      ctx.save(); ctx.rotate(-llamaTilt);
      drawStrangeMagic(time, true);
      ctx.restore();
    }
    ctx.restore();
  }

  function reset() {
    sparkles = []; sparkleSpawn = 0;
    trailParticles = []; trailSpawn = 0; lastTrailKind = null;
    dogeWords = []; oraBursts = [];
  }

  function syncAppearance(nextScore) {
    // Returning to the basic llama must not retain Jotaro's text or trail.
    if (nextScore < score) reset();
    score = nextScore;
  }

  function onHop(score, y) {
    syncAppearance(score);
    if (score >= 93 && score < FINAL_TRANSFORMATION_SCORE) {
      dogeWords.push({ text: dogePhrases[Math.floor(Math.random() * dogePhrases.length)], y: Math.max(82, y - 58), life: 48 });
      dogeWords = dogeWords.slice(-4);
    }
    if (score >= FINAL_TRANSFORMATION_SCORE) {
      oraBursts.push({ x: 143 + (oraBursts.length % 2) * 18, y: Math.max(90, Math.min(480, y - 25)), life: 40 });
      oraBursts = oraBursts.slice(-4);
    }
  }

  function draw(time, dt, appearance) {
    syncAppearance(appearance.score);
    ({ state, y, score, invulnerable, llamaTilt } = appearance);
    drawLlamaTrail(dt);
    llama(time);
    drawDogeWords(dt);
    drawOraBursts(dt);
  }

  return { draw, onHop, reset };
}
