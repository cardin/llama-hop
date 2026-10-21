import { ctx, rounded, drawSparkle, scenePolygon } from './canvas.js';
import { drawJurassic } from './scenes/jurassic.js';

export function weatherScene(weather, time) {
  const t = time / 1000;
  const skyGradient = ctx.createLinearGradient(0, 0, 0, 490);
  skyGradient.addColorStop(0, weather.skyTop);
  skyGradient.addColorStop(0.55, weather.sky);
  skyGradient.addColorStop(1, weather.skyHorizon);
  ctx.fillStyle = skyGradient; ctx.fillRect(0, 0, 400, 560);
  if (weather.landmark === 'castle') {
    ctx.fillStyle = '#fff0d5aa';
    for (let i = 0; i < 15; i++) {
      const x = (i * 83 + 27) % 400, yy = 65 + (i * 47) % 145;
      ctx.beginPath(); ctx.arc(x, yy, i % 3 ? 1 : 1.6, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (weather.sun || weather.moon) {
    ctx.fillStyle = weather.sun || '#fff4cf';
    ctx.beginPath(); ctx.arc(310, weather.landmark === 'castle' ? 330 : 90, 28, 0, Math.PI * 2); ctx.fill();
    if (weather.moon) {
      ctx.fillStyle = skyGradient; ctx.beginPath(); ctx.arc(322, 81, 25, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff4cf';
      for (let i = 0; i < 24; i++) {
        const x = (i * 83 + 19) % 400, yy = (i * 47 + 35) % 360;
        ctx.beginPath(); ctx.arc(x, yy, 1 + (i % 2) * 0.5, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  ctx.fillStyle = weather.cloud;
  for (const [x, yy] of [[40, 105], [250, 65], [340, 190], [140, 155]]) {
    const drift = ((x + t * (weather.wind ? 65 : 5) + 60) % 520) - 60;
    ctx.beginPath(); ctx.ellipse(drift, yy, weather.rain ? 70 : 45, weather.rain ? 20 : 12, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (weather.rain) {
    ctx.strokeStyle = '#dbeef080'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 65; i++) {
      const yy = (i * 71 + t * 230 * weather.rain) % 550;
      const x = ((i * 97 - t * (weather.wind ? 190 : 35)) % 440 + 440) % 440 - 20;
      ctx.moveTo(x, yy); ctx.lineTo(x - (weather.wind ? 25 : 5), yy + 14);
    }
    ctx.stroke();
  }
  if (weather.thunder) {
    // A gently glowing background bolt, never a full-screen flash.
    const glow = Math.pow(Math.max(0, Math.sin(t * Math.PI / 3)), 8) * 0.7;
    ctx.strokeStyle = `rgba(255, 235, 171, ${glow})`; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(305, 135); ctx.lineTo(275, 195); ctx.lineTo(303, 190);
    ctx.lineTo(267, 259); ctx.stroke();
  }
  if (weather.wind) {
    ctx.strokeStyle = '#e3eef060'; ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const yy = 220 + i * 17, width = 75 - i * 5;
      const sway = Math.sin(t * 2 + i * 0.6) * 12;
      ctx.beginPath(); ctx.ellipse(300 + sway, yy, width, 9, -0.12, t * 2 + i, t * 2 + i + Math.PI * 1.5); ctx.stroke();
    }
  }
  if (weather.snow || weather.dust) {
    ctx.fillStyle = weather.snow ? '#ffffffcc' : '#f5ddb0aa';
    for (let i = 0; i < 55; i++) {
      const x = ((i * 97 + t * (weather.dust ? -100 : 12) + Math.sin(t + i) * 8) % 440 + 440) % 440 - 20;
      const yy = (i * 71 + t * (weather.dust ? 20 : 35)) % 530;
      ctx.beginPath(); ctx.ellipse(x, yy, weather.snow ? 2.5 : 7, 2, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (weather.aurora) {
    drawAuroraSky(t);
  }
  ctx.fillStyle = weather.hills; ctx.beginPath(); ctx.moveTo(0, 530); ctx.lineTo(0, 440);
  ctx.quadraticCurveTo(100, 380, 210, 475); ctx.quadraticCurveTo(300, 400, 400, 455); ctx.lineTo(400, 530); ctx.fill();
  if (weather.landmark) drawLandmark(weather.landmark, t);
  if (weather.fog) {
    ctx.fillStyle = '#eef4f055';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.ellipse(200 + Math.sin(t * 0.25 + i) * 60, 220 + i * 65, 280, 38, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
}
function drawAuroraSky(t) {
  for (let band = 0; band < 2; band++) {
    const glow = ctx.createLinearGradient(0, 65 + band * 42, 0, 260 + band * 35);
    glow.addColorStop(0, '#9cf8d600'); glow.addColorStop(0.35, band ? '#8cd9ed66' : '#76edb97a');
    glow.addColorStop(0.7, '#a18fe950'); glow.addColorStop(1, '#a18fe900');
    ctx.strokeStyle = glow; ctx.lineWidth = 7;
    for (let i = 0; i < 60; i++) {
      const x = i * 7 - 7, crest = 93 + band * 44 + Math.sin(x / 66 + t * 0.25 + band) * 25;
      const length = 55 + Math.sin(x / 38 + t * 0.3) * 20;
      ctx.beginPath(); ctx.moveTo(x, crest); ctx.quadraticCurveTo(x + 10, crest + length * 0.5, x + 4, crest + length); ctx.stroke();
    }
    ctx.strokeStyle = band ? '#a8d5f16b' : '#a4f4ca88'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -10; x <= 410; x += 7) {
      const yy = 93 + band * 44 + Math.sin(x / 66 + t * 0.25 + band) * 25;
      if (x === -10) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  const stars = [[230, 281], [252, 263], [278, 270], [306, 250], [327, 265], [316, 290], [342, 311]];
  ctx.strokeStyle = '#d4e6ef33'; ctx.lineWidth = 1; ctx.beginPath();
  stars.forEach(([x, yy], i) => i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy)); ctx.stroke();
  for (const [x, yy] of stars) drawSparkle(x, yy, 2.5, '#e1f4efb3');
  const phase = t % 14;
  if (phase > 1 && phase < 1.9) {
    const progress = (phase - 1) / 0.9, x = 90 + progress * 160, yy = 66 + progress * 65;
    const tail = ctx.createLinearGradient(x - 36, yy - 15, x, yy);
    tail.addColorStop(0, '#e9faff00'); tail.addColorStop(1, '#e9faffaa');
    ctx.strokeStyle = tail; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 36, yy - 15); ctx.lineTo(x, yy); ctx.stroke();
  }
}
function drawMarioGround() {
  ctx.fillStyle = '#b48059'; ctx.fillRect(0, 530, 400, 30);
  ctx.fillStyle = '#80b16d'; ctx.fillRect(0, 530, 400, 4);
  ctx.strokeStyle = '#8f6449'; ctx.lineWidth = 1;
  for (let row = 0; row < 2; row++) {
    const yy = 535 + row * 13;
    ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(400, yy); ctx.stroke();
    for (let x = row % 2 * 12; x < 400; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy + 13); ctx.stroke();
    }
  }
}
function drawMarioWorld(t) {
  for (const [x, yy, width, height, color] of [[70, 472, 78, 132, '#8bc493'], [179, 484, 63, 90, '#b0d798'], [363, 481, 71, 157, '#9bcca3']]) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, yy, width, height, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - width, yy, width * 2, 530 - yy);
    for (const dx of [-7, 7]) { rounded(x + dx - 2, yy - height + 38, 4, 10, 2, '#557e69'); }
  }
  // A cheerful turreted castle and a pennant above its central tower.
  rounded(251, 413, 94, 96, 2, '#e6cfbf'); rounded(277, 365, 41, 144, 2, '#efdaca');
  for (const [x, yy] of [[242, 404], [326, 404], [277, 365]]) {
    rounded(x, yy, 27, 87, 2, '#e4c2be');
    scenePolygon([[x - 5, yy], [x + 13, yy - 35], [x + 32, yy]], '#b95f68');
    rounded(x + 8, yy + 16, 10, 19, 5, '#809eae');
  }
  rounded(283, 474, 22, 35, 11, '#967a7b');
  ctx.strokeStyle = '#8a7a80'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(290, 330); ctx.lineTo(290, 304); ctx.stroke();
  scenePolygon([[291, 305], [311, 310 + Math.sin(t * 2) * 2], [291, 319]], '#d77981');
  // Floating brick and question blocks, with coins rising in an arc.
  for (let i = 0; i < 4; i++) {
    const x = 77 + i * 27, yy = 327;
    rounded(x, yy, 25, 25, 2, i === 1 ? '#e8b45e' : '#c89168');
    ctx.strokeStyle = '#a77953'; ctx.lineWidth = 1; ctx.strokeRect(x + 1, yy + 1, 23, 23);
    if (i === 1) {
      ctx.fillStyle = '#fff0c2'; ctx.textAlign = 'center'; ctx.font = 'bold 21px system-ui'; ctx.fillText('?', x + 12, yy + 21);
    } else {
      ctx.beginPath(); ctx.moveTo(x, yy + 12); ctx.lineTo(x + 25, yy + 12);
      ctx.moveTo(x + 12, yy); ctx.lineTo(x + 12, yy + 12); ctx.moveTo(x + 6, yy + 12); ctx.lineTo(x + 6, yy + 25); ctx.stroke();
    }
  }
  for (let i = 0; i < 5; i++) {
    const x = 93 + i * 23, yy = 286 - Math.sin(i / 4 * Math.PI) * 19;
    const width = 2 + Math.abs(Math.cos(t * 2 + i * 0.3)) * 3;
    ctx.fillStyle = '#f1cb70'; ctx.beginPath(); ctx.ellipse(x, yy, width, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff0b8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, yy - 4); ctx.lineTo(x, yy + 4); ctx.stroke();
  }
  for (const [x, yy, height] of [[28, 530, 72], [171, 530, 48]]) {
    rounded(x, yy - height, 37, height, 2, '#679966');
    rounded(x + 5, yy - height, 7, height, 1, '#a1c78a');
    rounded(x - 5, yy - height - 8, 47, 16, 2, '#78ac71');
    ctx.fillStyle = '#527d59'; ctx.fillRect(x - 2, yy - height - 5, 41, 3);
  }
  for (let i = 0; i < 3; i++) {
    const x = 107 + i * 105 + Math.sin(t * 0.65 + i) * 11, yy = 519;
    const step = Math.sin(t * 3 + i) * 2;
    rounded(x - 10, yy + step, 9, 5, 2, '#785b4d'); rounded(x + 2, yy - step, 9, 5, 2, '#785b4d');
    rounded(x - 5, yy - 8, 12, 12, 4, '#dac3a0');
    ctx.fillStyle = '#a87959'; ctx.beginPath(); ctx.moveTo(x - 12, yy - 5);
    ctx.quadraticCurveTo(x - 10, yy - 25, x, yy - 21); ctx.quadraticCurveTo(x + 12, yy - 23, x + 14, yy - 5); ctx.closePath(); ctx.fill();
    for (const dx of [-4, 5]) { rounded(x + dx, yy - 14, 3, 7, 1, '#fff2d8'); }
    ctx.fillStyle = '#514b46'; ctx.fillRect(x - 3, yy - 12, 1.5, 4); ctx.fillRect(x + 5, yy - 12, 1.5, 4);
    ctx.strokeStyle = '#665345'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x - 6, yy - 16); ctx.lineTo(x - 1, yy - 14); ctx.moveTo(x + 3, yy - 14); ctx.lineTo(x + 9, yy - 17); ctx.stroke();
  }
  drawMarioGround();
}
function drawSakuraTree(x, baseY, direction) {
  ctx.save(); ctx.translate(x, baseY); ctx.scale(direction, 1);
  ctx.fillStyle = '#765d66'; ctx.beginPath(); ctx.moveTo(-9, 0);
  ctx.bezierCurveTo(4, -68, -1, -109, 14, -160);
  ctx.lineTo(28, -166); ctx.bezierCurveTo(10, -100, 18, -55, 12, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#765d66'; ctx.lineCap = 'round';
  for (const [bx, by, tx, ty, width] of [[11, -122, -24, -200, 7], [18, -152, 62, -211, 6], [14, -152, 5, -230, 5],
    [3, -178, -48, -220, 4], [44, -190, 85, -204, 3], [5, -210, -18, -242, 3]]) {
    ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo((bx + tx) / 2, ty + 26, tx, ty); ctx.stroke();
  }
  const clusters = [[-40, -215, 27], [-13, -237, 28], [18, -225, 31], [46, -216, 32], [77, -205, 26], [0, -199, 31], [34, -188, 28]];
  for (const [cx, cy, radius] of clusters) {
    ctx.fillStyle = '#d992b1'; ctx.beginPath(); ctx.ellipse(cx, cy + 9, radius, radius * 0.65, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#efb0ca'; ctx.beginPath(); ctx.ellipse(cx - 3, cy, radius, radius * 0.72, -0.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f7cadd'; ctx.beginPath(); ctx.ellipse(cx - 7, cy - 8, radius * 0.72, radius * 0.45, -0.18, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < 35; i++) {
    const [clusterX, clusterY, radius] = clusters[i % clusters.length];
    const cx = clusterX + Math.sin(i * 2.4) * radius * 0.65, cy = clusterY + Math.cos(i * 1.7) * radius * 0.4;
    ctx.fillStyle = i % 3 ? '#ffe4ee' : '#e99abc';
    for (let petal = 0; petal < 5; petal++) {
      const a = petal * Math.PI * 2 / 5;
      ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * 2, cy + Math.sin(a) * 2, 2, 1.2, a, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.strokeStyle = '#b7939a'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(3, -15); ctx.quadraticCurveTo(9, -73, 9, -116); ctx.stroke();
  ctx.restore();
}
function drawTotoroScene(t) {
  // A quiet wooded roadside, with the bus-stop figures kept in the distance.
  for (const [x, yy, radius] of [[17, 346, 52], [88, 370, 40], [369, 350, 49], [317, 382, 35]]) {
    rounded(x - 5, yy, 10, 144, 2, '#647b77');
    ctx.fillStyle = '#5f7e78'; ctx.beginPath(); ctx.ellipse(x, yy, radius, radius * 1.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#739087'; ctx.beginPath(); ctx.ellipse(x - 10, yy - 16, radius * 0.7, radius, -0.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#718987'; ctx.fillRect(0, 495, 400, 35);
  for (const [x, yy, radius] of [[82, 514, 48], [207, 521, 37], [312, 512, 54]]) {
    ctx.fillStyle = '#9fbabe88'; ctx.beginPath(); ctx.ellipse(x, yy, radius, 5, 0, 0, Math.PI * 2); ctx.fill();
  }
  const umbrella = (x, yy, radius, color, length) => {
    ctx.strokeStyle = '#4d5c62'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, yy - radius * 0.6 - 4); ctx.lineTo(x, yy + length);
    ctx.quadraticCurveTo(x, yy + length + 6, x - 5, yy + length + 3); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x - radius, yy);
    ctx.bezierCurveTo(x - radius * 0.8, yy - radius * 0.72, x + radius * 0.8, yy - radius * 0.72, x + radius, yy);
    for (let i = 0; i < 4; i++) {
      const edge = x + radius - i * radius / 2;
      ctx.quadraticCurveTo(edge - radius / 4, yy - 6, edge - radius / 2, yy);
    }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c4d0cb44'; ctx.lineWidth = 1;
    for (const dx of [-0.5, 0.5]) {
      ctx.beginPath(); ctx.moveTo(x, yy - radius * 0.54); ctx.quadraticCurveTo(x + dx * radius * 0.9, yy - radius * 0.4, x + dx * radius, yy - 2); ctx.stroke();
    }
  };
  umbrella(288, 369, 60, '#4b5961', 77);
  umbrella(180, 429, 37, '#ad6b6b', 49);
  // Totoro's pointed ears, whiskers and cream chevron-patterned belly.
  scenePolygon([[237, 395], [238, 354], [249, 365], [252, 395]], '#78868a');
  scenePolygon([[264, 394], [274, 351], [282, 366], [279, 399]], '#78868a');
  ctx.fillStyle = '#7c898c'; ctx.beginPath(); ctx.ellipse(258, 449, 37, 55, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(258, 410, 29, 27, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e0dfc7'; ctx.beginPath(); ctx.ellipse(258, 454, 27, 38, 0, 0, Math.PI * 2); ctx.fill();
  for (const [x, yy] of [[247, 433], [263, 432], [241, 447], [257, 445], [273, 447]]) {
    ctx.strokeStyle = '#7b8988'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x - 4, yy + 3); ctx.lineTo(x, yy); ctx.lineTo(x + 4, yy + 3); ctx.stroke();
  }
  ctx.fillStyle = '#f5f2db';
  for (const x of [246, 270]) { ctx.beginPath(); ctx.arc(x, 405, 4, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#35444b';
  for (const x of [247, 269]) { ctx.beginPath(); ctx.arc(x, 405, 1.7, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(258, 413, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#45575b'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(254, 420); ctx.quadraticCurveTo(258, 422, 262, 420);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) { ctx.moveTo(258 + side * 24, 414 + i * 4); ctx.lineTo(258 + side * 42, 409 + i * 7); }
  }
  ctx.stroke();
  rounded(225, 433, 10, 37, 5, '#728185'); rounded(282, 429, 12, 27, 5, '#728185');
  rounded(236, 494, 17, 9, 4, '#728185'); rounded(266, 494, 17, 9, 4, '#728185');
  // Satsuki shelters sleepy Mei, carried on her back, under a second umbrella.
  rounded(162, 461, 12, 19, 4, '#b77e8b');
  ctx.fillStyle = '#edceb3'; ctx.beginPath(); ctx.arc(167, 455, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5b5050'; ctx.beginPath(); ctx.arc(167, 452, 6, Math.PI, Math.PI * 2); ctx.fill();
  rounded(176, 459, 16, 23, 4, '#dfca87');
  scenePolygon([[175, 478], [193, 478], [199, 493], [171, 493]], '#b97563');
  rounded(176, 491, 5, 14, 1, '#edceb3'); rounded(188, 491, 5, 14, 1, '#edceb3');
  rounded(174, 502, 8, 4, 1, '#525c60'); rounded(187, 502, 8, 4, 1, '#525c60');
  ctx.fillStyle = '#edceb3'; ctx.beginPath(); ctx.arc(184, 449, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#544d4f'; ctx.beginPath(); ctx.arc(183, 447, 9, Math.PI, Math.PI * 2); ctx.fill();
  rounded(174, 445, 4, 10, 2, '#544d4f');
  ctx.fillStyle = '#4d5052'; ctx.beginPath(); ctx.arc(188, 449, 1, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#edceb3'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(190, 464); ctx.lineTo(195, 472); ctx.lineTo(181, 474); ctx.stroke();
  // A round roadside bus-stop sign and posted timetable.
  rounded(348, 397, 4, 112, 1, '#66716f');
  ctx.fillStyle = '#b36f68'; ctx.beginPath(); ctx.arc(350, 385, 15, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e9dfc6'; ctx.beginPath(); ctx.arc(350, 385, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#646f70'; ctx.textAlign = 'center'; ctx.font = 'bold 8px system-ui'; ctx.fillText('BUS', 350, 388);
  rounded(343, 412, 16, 23, 1, '#dedfcd');
  ctx.fillStyle = '#899a95';
  for (let i = 0; i < 4; i++) ctx.fillRect(346, 417 + i * 4, 10, 1);
  // Raindrops and expanding puddle rings stay subtle in front of the figures.
  ctx.strokeStyle = '#d8e9e57a'; ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    const phase = (t * 0.6 + i * 0.19) % 1;
    ctx.save(); ctx.globalAlpha *= 1 - phase;
    ctx.beginPath(); ctx.ellipse(20 + i * 31, 510 + i % 3 * 6, 2 + phase * 8, 1 + phase * 2, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  for (let i = 0; i < 16; i++) {
    const x = (i * 67 + 25) % 400, yy = 320 + (i * 47 + t * 150) % 195;
    // Leave the umbrella-covered space dry.
    if ((x > 229 && x < 348 && yy > 340 && yy < 498) || (x > 143 && x < 217 && yy > 410 && yy < 503)) continue;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x - 2, yy + 8); ctx.stroke();
  }
}
function drawDuskDragon(t) {
  ctx.save(); ctx.translate(264 + Math.sin(t * 0.3) * 79, 237 + Math.cos(t * 0.3) * 18);
  ctx.scale(Math.cos(t * 0.3) >= 0 ? 0.8 : -0.8, 0.8);
  const flap = Math.sin(t * 3) * 10;
  ctx.strokeStyle = '#65506d'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-10, 3); ctx.bezierCurveTo(-23, 16, -29, -5, -39, 5); ctx.stroke();
  scenePolygon([[-10, 0], [-25, -26 - flap], [-3, -17], [10, -29 - flap], [16, -9], [6, 3]], '#8c6b86');
  scenePolygon([[-5, 0], [-7, -28 - flap], [12, -16], [22, -19 - flap], [16, -4], [5, 6]], '#755773');
  ctx.fillStyle = '#65506d'; ctx.beginPath(); ctx.ellipse(0, 4, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#65506d'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(10, 3); ctx.quadraticCurveTo(14, -12, 22, -9); ctx.stroke();
  rounded(17, -13, 15, 8, 3, '#65506d');
  scenePolygon([[18, -12], [17, -20], [23, -13]], '#65506d');
  ctx.fillStyle = '#f4d69a'; ctx.beginPath(); ctx.arc(25, -10, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#65506d'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-6, 8); ctx.lineTo(-2, 14); ctx.lineTo(3, 14);
  ctx.moveTo(7, 8); ctx.lineTo(11, 13); ctx.lineTo(16, 13); ctx.stroke();
  ctx.restore();
}
function drawSkyLanterns(t) {
  for (let i = 0; i < 7; i++) {
    const x = 45 + i * 48 + Math.sin(t * 0.35 + i) * 7;
    const yy = 375 - (i * 43 + t * 7) % 220;
    const size = 4 + i % 3;
    const glow = ctx.createRadialGradient(x, yy, 1, x, yy, size * 3);
    glow.addColorStop(0, '#ffce8466'); glow.addColorStop(1, '#ffce8400');
    ctx.fillStyle = glow; ctx.fillRect(x - size * 3, yy - size * 3, size * 6, size * 6);
    rounded(x - size, yy - size * 1.4, size * 2, size * 2.4, 2, '#eebc83');
    rounded(x - size + 1, yy - size, size * 2 - 2, size * 1.7, 1, '#ffe2a8');
    ctx.fillStyle = '#a76d72'; ctx.fillRect(x - size * 0.6, yy + size, size * 1.2, 2);
  }
}
function drawDuskArmy(t) {
  // Quiet ranks beneath rival heraldic standards, rather than combat effects.
  scenePolygon([[0, 466], [85, 457], [169, 475], [174, 530], [0, 530]], '#817a86');
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 10; col++) {
      const x = 15 + col * 14 + row * 3, yy = 476 + row * 17 + col * 0.25;
      ctx.strokeStyle = '#554d63'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + 5, yy + 3); ctx.lineTo(x + 5, yy - 20); ctx.stroke();
      scenePolygon([[x + 5, yy - 24], [x + 3, yy - 19], [x + 7, yy - 19]], '#bdafb2');
      rounded(x - 2, yy - 7, 5, 9, 1, '#4c4c60');
      ctx.fillStyle = '#b0a5ad'; ctx.beginPath(); ctx.arc(x, yy - 10, 2.7, Math.PI, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#565164'; ctx.fillRect(x - 2, yy - 10, 4, 3);
      ctx.fillStyle = row % 2 ? '#8e6975' : '#858b9a';
      ctx.beginPath(); ctx.ellipse(x - 3, yy - 3, 3, 4, -0.1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#c2b0a4'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(x - 3, yy - 6); ctx.lineTo(x - 3, yy); ctx.stroke();
    }
  }
  for (const [x, yy, color] of [[35, 410, '#4f4b60'], [119, 430, '#855361']]) {
    ctx.strokeStyle = '#665467'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, yy - 6); ctx.lineTo(x, yy + 72); ctx.stroke();
    const flutter = Math.sin(t * 2 + x) * 3;
    scenePolygon([[x + 1, yy], [x + 25, yy + 2 + flutter], [x + 25, yy + 34 + flutter],
      [x + 14, yy + 28], [x + 1, yy + 33]], color);
    if (x === 35) {
      scenePolygon([[x + 7, yy + 12], [x + 7, yy + 5], [x + 12, yy + 9], [x + 17, yy + 7],
        [x + 20, yy + 14], [x + 14, yy + 19], [x + 11, yy + 25], [x + 8, yy + 17]], '#c8c3bd');
    } else {
      scenePolygon([[x + 13, yy + 22], [x + 5, yy + 9], [x + 12, yy + 12], [x + 16, yy + 7],
        [x + 22, yy + 11], [x + 17, yy + 14], [x + 22, yy + 21], [x + 15, yy + 18]], '#d2aa7e');
    }
    ctx.fillStyle = '#ceb694'; ctx.beginPath(); ctx.arc(x, yy - 7, 2, 0, Math.PI * 2); ctx.fill();
  }
}
function drawHalloweenDetails(t) {
  // Crooked iron fence and softly lit pumpkins frame the graveyard.
  ctx.strokeStyle = '#343447'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(10, 507); ctx.lineTo(391, 501); ctx.moveTo(10, 516); ctx.lineTo(391, 510); ctx.stroke();
  for (let i = 0; i < 21; i++) {
    const x = 10 + i * 19, lean = i % 3 - 1;
    ctx.beginPath(); ctx.moveTo(x, 528); ctx.lineTo(x + lean * 3, 491); ctx.stroke();
    scenePolygon([[x + lean * 3, 486], [x + lean * 3 - 3, 493], [x + lean * 3 + 3, 493]], '#343447');
  }
  for (const [x, yy, size] of [[76, 505, 12], [142, 484, 10], [321, 488, 14], [370, 515, 10]]) {
    const glow = ctx.createRadialGradient(x, yy, 2, x, yy, size * 2.3);
    glow.addColorStop(0, '#edac5866'); glow.addColorStop(1, '#edac5800');
    ctx.fillStyle = glow; ctx.fillRect(x - size * 2.3, yy - size * 2.3, size * 4.6, size * 4.6);
    ctx.fillStyle = '#bc7954'; ctx.beginPath(); ctx.ellipse(x, yy, size, size * 0.8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#9d5a45'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(x, yy, size * 0.45, size * 0.78, 0, 0, Math.PI * 2); ctx.stroke();
    rounded(x - 2, yy - size, 4, size * 0.4, 1, '#6f7751');
    const light = 0.8 + Math.sin(t * 3 + x) * 0.1;
    const color = `rgba(255, 219, 130, ${light})`;
    for (const side of [-1, 1]) {
      scenePolygon([[x + side * size * 0.43, yy - size * 0.4], [x + side * size * 0.15, yy - size * 0.05], [x + side * size * 0.7, yy - size * 0.05]], color);
    }
    scenePolygon([[x - size * 0.6, yy + size * 0.2], [x - size * 0.25, yy + size * 0.27], [x, yy + size * 0.1],
      [x + size * 0.25, yy + size * 0.27], [x + size * 0.6, yy + size * 0.2], [x + size * 0.3, yy + size * 0.55], [x - size * 0.3, yy + size * 0.55]], color);
  }
  // A web hangs between the mansion's eaves and the bare tree.
  ctx.save(); ctx.translate(309, 348); ctx.strokeStyle = '#c7d1d055'; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const a = -0.8 + i * 0.3;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 40, Math.sin(a) * 40); ctx.stroke();
  }
  for (const radius of [12, 24, 36]) {
    ctx.beginPath(); ctx.arc(0, 0, radius, -0.8, 0.4); ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = '#acb7bd22';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.ellipse(95 + i * 110 + Math.sin(t * 0.3 + i) * 25, 490 + i * 10, 117, 13, 0, 0, Math.PI * 2); ctx.fill();
  }
}
function drawHurricaneBattle(t) {
  ctx.save();
  // A distant kaiju rises out of the storm surge to face the Jaeger.
  ctx.translate(241, 392 + Math.sin(t * 1.3) * 2);
  ctx.strokeStyle = '#394f60'; ctx.lineWidth = 17; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(17, 41); ctx.bezierCurveTo(89, 62, 80, 15, 111, 30); ctx.stroke();
  scenePolygon([[-26, 64], [-30, 7], [-17, -43], [7, -60], [29, -35], [37, 20], [28, 68]], '#364e5b');
  scenePolygon([[-19, -45], [-35, -57], [-47, -49], [-39, -72], [-9, -83], [12, -69], [16, -46]], '#3c5965');
  scenePolygon([[-35, -67], [-53, -87], [-25, -76]], '#446675');
  scenePolygon([[2, -73], [12, -98], [14, -66]], '#446675');
  for (let i = 0; i < 6; i++) {
    const yy = -43 + i * 17, x = 22 + i * 2;
    scenePolygon([[x, yy], [x + 20, yy - 14], [x + 8, yy + 13]], '#4b7e8d');
    ctx.strokeStyle = '#75c5cf99'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 4, yy + 3); ctx.lineTo(x + 16, yy - 10); ctx.stroke();
  }
  ctx.strokeStyle = '#3c5965'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(-16, -27); ctx.lineTo(-43, -34); ctx.lineTo(-64, -59);
  ctx.moveTo(20, -24); ctx.lineTo(42, -10); ctx.lineTo(18, 7); ctx.stroke();
  ctx.strokeStyle = '#92b8bd'; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(-64 + i * 4, -56); ctx.lineTo(-72 + i * 5, -67); ctx.stroke();
  }
  ctx.strokeStyle = '#69b9c9aa'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-10, -30); ctx.lineTo(-16, -3); ctx.lineTo(-7, 18); ctx.lineTo(-12, 41); ctx.stroke();
  ctx.fillStyle = '#94e3df'; ctx.beginPath(); ctx.ellipse(-28, -66, 4, 2, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8aa8ad'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-42, -52); ctx.lineTo(-26, -48); ctx.stroke();
  ctx.restore();

  // Gipsy Danger's blue armor, orange turbine reactor and raised chain sword.
  ctx.save(); ctx.translate(112, 389 + Math.sin(t * 1.1) * 1.5);
  for (const x of [-20, 12]) {
    rounded(x, 27, 18, 32, 4, '#4a667e');
    rounded(x - 2, 54, 22, 32, 4, '#56768d');
    rounded(x - 4, 80, 27, 9, 2, '#354d63');
    rounded(x + 3, 59, 5, 18, 1, '#83a2ae');
  }
  scenePolygon([[-27, -43], [28, -43], [32, -17], [19, 27], [-18, 27], [-32, -17]], '#506e87');
  scenePolygon([[-26, -39], [-4, -30], [-9, -9], [-29, -19]], '#7893a4');
  scenePolygon([[26, -39], [4, -30], [9, -9], [29, -19]], '#69889e');
  rounded(-15, 9, 31, 18, 3, '#364f68');
  ctx.strokeStyle = '#7897a7'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-11, 15); ctx.lineTo(11, 15); ctx.moveTo(-9, 21); ctx.lineTo(9, 21); ctx.stroke();
  rounded(-13, -64, 27, 24, 6, '#526d83');
  scenePolygon([[-15, -60], [-5, -69], [13, -63], [18, -50], [9, -42], [-8, -43]], '#648399');
  rounded(-5, -58, 20, 4, 1, '#efba78');
  rounded(-17, -81, 5, 23, 1, '#617b8d');
  rounded(-41, -44, 21, 26, 5, '#617f96'); rounded(22, -45, 23, 26, 5, '#617f96');
  ctx.strokeStyle = '#425e77'; ctx.lineWidth = 15;
  ctx.beginPath(); ctx.moveTo(-31, -22); ctx.lineTo(-40, 5); ctx.lineTo(-20, 22);
  ctx.moveTo(35, -23); ctx.lineTo(54, -39); ctx.lineTo(71, -52); ctx.stroke();
  rounded(-31, 14, 17, 16, 4, '#6b889b'); rounded(61, -64, 19, 17, 4, '#7591a2');
  scenePolygon([[74, -64], [131, -131], [122, -109], [81, -54]], '#c5d9dd');
  ctx.strokeStyle = '#f1f7eb'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(80, -64); ctx.lineTo(128, -126); ctx.stroke();
  const reactorPulse = (Math.sin(t * 2.4) + 1) / 2;
  const reactorSpin = t * 1.8;
  const reactorGlow = ctx.createRadialGradient(0, -17, 3, 0, -17, 22 + reactorPulse * 5);
  reactorGlow.addColorStop(0, `rgba(255, 195, 115, ${0.4 + reactorPulse * 0.2})`);
  reactorGlow.addColorStop(1, 'rgba(245, 183, 107, 0)');
  ctx.fillStyle = reactorGlow; ctx.fillRect(-28, -45, 56, 56);
  ctx.fillStyle = '#2f455c'; ctx.beginPath(); ctx.arc(0, -17, 14, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = `rgba(255, 184, 108, ${0.65 + reactorPulse * 0.3})`; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, -17, 10, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#ffd5a0'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 + reactorSpin;
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * 4, -17 + Math.sin(a) * 4);
    ctx.lineTo(Math.cos(a + 0.25) * 9, -17 + Math.sin(a + 0.25) * 9); ctx.stroke();
  }
  ctx.fillStyle = `rgba(255, 222, 164, ${0.65 + reactorPulse * 0.3})`;
  ctx.beginPath(); ctx.arc(0, -17, 2.5 + reactorPulse, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // Spray at their feet gives scale without flashing over the play area.
  ctx.strokeStyle = '#d9e9e799'; ctx.lineWidth = 2;
  for (let i = 0; i < 14; i++) {
    const x = 62 + i * 20, yy = 472 + Math.sin(t * 2 + i) * 4;
    ctx.beginPath(); ctx.moveTo(x - 8, yy + 9); ctx.quadraticCurveTo(x, yy - 10 - i % 3 * 4, x + 8, yy + 7); ctx.stroke();
  }
}
function drawSceneWindows(x, yy, columns, rows, color) {
  ctx.fillStyle = color;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) ctx.fillRect(x + col * 24, yy + row * 28, 9, 13);
  }
}

function drawNetherlands(t) {
  // Narrow stepped-gable canal houses beside the windmill and tulip fields.
  for (const [x, top, color] of [[29, 373, '#ad7362'], [78, 355, '#727e8b'], [127, 382, '#bd9773']]) {
    rounded(x, top, 39, 91, 1, color);
    scenePolygon([[x - 3, top], [x - 3, top - 8], [x + 5, top - 8], [x + 5, top - 17],
      [x + 12, top - 17], [x + 12, top - 26], [x + 26, top - 26], [x + 26, top - 17],
      [x + 34, top - 17], [x + 34, top - 8], [x + 42, top - 8], [x + 42, top]], color);
    ctx.strokeStyle = '#efe6d0'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 2, top + 5); ctx.lineTo(x + 37, top + 5); ctx.stroke();
    for (let row = 0; row < 3; row++) {
      for (const dx of [7, 24]) {
        rounded(x + dx, top + 15 + row * 22, 9, 13, 1, '#d7e7df');
        ctx.strokeStyle = '#f5e8d4'; ctx.lineWidth = 1; ctx.strokeRect(x + dx, top + 15 + row * 22, 9, 13);
      }
    }
  }
  scenePolygon([[239, 471], [250, 313], [282, 313], [298, 471]], '#e9dbbb');
  scenePolygon([[242, 315], [266, 280], [291, 315]], '#9b685b');
  rounded(260, 433, 16, 38, 5, '#806552');
  drawSceneWindows(261, 371, 1, 1, '#79999a');
  ctx.save(); ctx.translate(266, 331); ctx.rotate(t * 0.6 + 0.35);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2); ctx.fillStyle = '#876f5a'; ctx.fillRect(-2, -76, 4, 76);
    ctx.fillStyle = '#fff5da'; ctx.fillRect(2, -72, 13, 54);
    ctx.strokeStyle = '#c6b69b'; ctx.lineWidth = 1;
    for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.moveTo(2, -70 + j * 11); ctx.lineTo(15, -70 + j * 11); ctx.stroke(); }
  }
  ctx.fillStyle = '#876f5a'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#98b983'; ctx.fillRect(0, 474, 400, 31);
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 28; i++) {
      const baseX = 7 + i * 14, x = baseX + Math.sin(t * 1.3 + i * 0.4) * 0.9, yy = 477 + row * 14;
      ctx.strokeStyle = '#62845c'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(baseX, yy + 12); ctx.lineTo(x, yy); ctx.moveTo(x, yy + 8); ctx.lineTo(x + 4, yy + 5); ctx.stroke();
      ctx.fillStyle = ['#dd737e', '#efc96d', '#c58bac', '#e99466'][Math.floor(i / 7)];
      ctx.beginPath(); ctx.moveTo(x - 4, yy - 3); ctx.lineTo(x - 1, yy);
      ctx.lineTo(x, yy - 4); ctx.lineTo(x + 2, yy); ctx.lineTo(x + 4, yy - 3);
      ctx.quadraticCurveTo(x + 5, yy + 6, x, yy + 5); ctx.quadraticCurveTo(x - 5, yy + 6, x - 4, yy - 3); ctx.fill();
    }
  }
  ctx.fillStyle = '#85b5bd'; ctx.fillRect(0, 506, 400, 24);
  ctx.fillStyle = '#d8ceb3'; ctx.fillRect(0, 503, 400, 4);
  ctx.strokeStyle = '#d7ece399'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const x = (i * 57 + t * 5) % 420 - 20;
    ctx.beginPath(); ctx.moveTo(x, 514 + i % 2 * 9); ctx.lineTo(x + 21, 514 + i % 2 * 9); ctx.stroke();
  }
  const boatX = (t * 5 + 250) % 480 - 40;
  ctx.save(); ctx.translate(boatX, 518 + Math.sin(t * 1.1) * 0.8);
  rounded(-12, -13, 27, 12, 3, '#f0e7cf'); rounded(-9, -11, 21, 6, 1, '#7f9fa5');
  scenePolygon([[-27, -3], [28, -3], [20, 5], [-20, 5]], '#9e655d');
  ctx.strokeStyle = '#d8eee5aa'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-42, 7); ctx.lineTo(-24, 7); ctx.moveTo(-35, 10); ctx.lineTo(-18, 10); ctx.stroke();
  ctx.restore();
  for (const x of [63, 132]) {
    ctx.strokeStyle = '#5e716d'; ctx.lineWidth = 1.3;
    for (const dx of [-7, 8]) { ctx.beginPath(); ctx.arc(x + dx, 469, 5, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x - 7, 469); ctx.lineTo(x - 1, 460); ctx.lineTo(x + 3, 469);
    ctx.lineTo(x - 7, 469); ctx.moveTo(x - 1, 460); ctx.lineTo(x + 6, 460); ctx.lineTo(x + 8, 469);
    ctx.moveTo(x + 6, 460); ctx.lineTo(x + 6, 456); ctx.lineTo(x + 10, 456);
    ctx.moveTo(x - 4, 458); ctx.lineTo(x + 1, 458); ctx.stroke();
  }
}

function drawGotham(t) {
  // The Bat-Signal sits high above a layered, gothic city skyline.
  const signalX = 282 + Math.sin(t * 0.15) * 5, signalY = 167;
  scenePolygon([[347, 460], [signalX - 31, signalY + 14], [signalX + 32, signalY - 10]], '#e8e4bc0d');
  const glow = ctx.createRadialGradient(signalX, signalY, 18, signalX, signalY, 48);
  glow.addColorStop(0, '#e7e5ba44'); glow.addColorStop(1, '#e7e5ba00');
  ctx.fillStyle = glow; ctx.fillRect(signalX - 48, signalY - 48, 96, 96);
  ctx.fillStyle = '#dddcb899'; ctx.beginPath(); ctx.ellipse(signalX, signalY, 34, 27, -0.18, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.translate(signalX, signalY); ctx.rotate(-0.18);
  scenePolygon([[-25, -8], [-17, -5], [-11, -7], [-6, -2], [-3, -3], [-3, -10], [0, -7], [3, -10],
    [3, -3], [6, -2], [11, -7], [17, -5], [25, -8], [21, 6], [16, 3], [11, 8], [7, 5], [0, 14],
    [-7, 5], [-11, 8], [-16, 3], [-21, 6]], '#303b4c');
  ctx.restore();
  for (let i = 0; i < 12; i++) {
    const x = i * 36 - 10, top = 292 + (i * 47) % 99;
    rounded(x, top, 29, 530 - top, 1, '#3d5066');
    ctx.fillStyle = '#b4b99866';
    for (let row = 0; row < 6; row++) {
      if ((i + row) % 3) ctx.fillRect(x + 8, top + 12 + row * 22, 4, 7);
    }
  }
  for (const [x, top, width] of [[-8, 357, 49], [48, 324, 43], [106, 285, 51], [174, 371, 38], [228, 314, 55], [302, 348, 47], [366, 291, 46]]) {
    rounded(x, top, width, 530 - top, 1, '#26364c');
    rounded(x + 6, top - 13, width - 12, 15, 1, '#26364c');
    scenePolygon([[x + 12, top - 13], [x + width / 2, top - 51], [x + width - 12, top - 13]], '#26364c');
    ctx.strokeStyle = '#5f7485'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x + width / 2, top - 51); ctx.lineTo(x + width / 2, top - 65); ctx.stroke();
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 3; col++) {
        if ((row * 7 + col * 3 + x) % 5 === 0) continue;
        ctx.fillStyle = (row + col) % 3 ? '#d3c48b88' : '#668b9b66';
        ctx.fillRect(x + 9 + col * 12, top + 14 + row * 20, 4, 7);
      }
    }
  }
  ctx.fillStyle = '#192b3e'; ctx.fillRect(0, 514, 400, 16);
  rounded(338, 451, 20, 12, 3, '#82949b');
  ctx.strokeStyle = '#82949b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(348, 464); ctx.lineTo(348, 484); ctx.stroke();
}

function drawNordic(t) {
  // Steep snow-capped mountains frame a pale, frozen fjord.
  scenePolygon([[0, 410], [0, 306], [78, 210], [159, 365], [219, 285], [315, 416]], '#8ca7b8');
  scenePolygon([[78, 210], [46, 249], [71, 240], [87, 262], [99, 250]], '#edf6f6');
  scenePolygon([[196, 410], [306, 224], [357, 310], [400, 267], [400, 427]], '#708c9f');
  scenePolygon([[306, 224], [273, 280], [298, 266], [314, 283], [329, 263]], '#e7f1f3');
  scenePolygon([[0, 415], [149, 399], [251, 414], [400, 404], [400, 530], [0, 530]], '#b4d5df');
  ctx.strokeStyle = '#e5f3f6'; ctx.lineWidth = 2;
  for (const [x, yy, length] of [[102, 432, 91], [172, 455, 126], [72, 477, 104], [208, 502, 138]]) {
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + length, yy - 3); ctx.stroke();
  }
  ctx.strokeStyle = '#8fb6c9'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(152, 438); ctx.lineTo(182, 447); ctx.lineTo(169, 463);
  ctx.moveTo(182, 447); ctx.lineTo(209, 444); ctx.stroke();
  scenePolygon([[0, 417], [73, 405], [134, 430], [89, 455], [112, 488], [0, 508]], '#f0f7f5');
  scenePolygon([[400, 415], [316, 426], [261, 465], [300, 491], [251, 530], [400, 530]], '#edf5f3');
  // Shoreline evergreens, with snow resting on their branches.
  for (const [x, yy, scale] of [[17, 442, 1], [66, 414, 0.65], [359, 450, 0.85], [392, 421, 1.05]]) {
    ctx.save(); ctx.translate(x, yy); ctx.scale(scale, scale);
    rounded(-3, -14, 6, 23, 1, '#7d7770');
    for (let tier = 0; tier < 3; tier++) {
      const top = -78 + tier * 20, width = 14 + tier * 6;
      scenePolygon([[0, top], [-width, top + 34], [width, top + 34]], '#567d79');
      scenePolygon([[0, top], [-width * 0.6, top + 22], [2, top + 17], [width * 0.65, top + 23]], '#e6f3ef');
    }
    ctx.restore();
  }
  for (const [x, yy, scale] of [[36, 442, 0.7], [274, 467, 1], [339, 495, 0.65]]) {
    ctx.save(); ctx.translate(x, yy); ctx.scale(scale, scale);
    rounded(0, -44, 61, 49, 2, '#ae5555');
    rounded(43, -70, 8, 23, 1, '#867b79');
    scenePolygon([[-7, -43], [30, -88], [68, -43]], '#535e70');
    ctx.strokeStyle = '#f6faf3'; ctx.lineWidth = 6; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-7, -43); ctx.lineTo(30, -88); ctx.lineTo(68, -43); ctx.stroke();
    ctx.strokeStyle = '#8d4249'; ctx.lineWidth = 1;
    for (let col = 0; col < 7; col++) { ctx.beginPath(); ctx.moveTo(col * 9, -40); ctx.lineTo(col * 9, 4); ctx.stroke(); }
    drawSceneWindows(9, -31, 2, 1, '#ffdda0');
    ctx.strokeStyle = '#f0e7d9'; ctx.lineWidth = 2;
    for (const wx of [8, 32]) ctx.strokeRect(wx, -32, 11, 15);
    rounded(26, -14, 12, 19, 1, '#624d51');
    ctx.fillStyle = '#f7f5ee66';
    for (let i = 0; i < 3; i++) {
      const rise = (t * 10 + i * 17) % 51;
      ctx.beginPath(); ctx.ellipse(47 + Math.sin(rise / 15) * 6, -75 - rise, 4 + rise / 11, 4 + rise / 16, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  for (const [yy, radius] of [[508, 12], [492, 9], [480, 7]]) {
    ctx.fillStyle = '#fffdf4'; ctx.beginPath(); ctx.arc(245, yy, radius, 0, Math.PI * 2); ctx.fill();
  }
  rounded(236, 470, 18, 4, 1, '#455368'); rounded(240, 462, 10, 10, 1, '#455368');
  rounded(237, 486, 17, 4, 1, '#c75d65');
  scenePolygon([[249, 481], [258, 484], [249, 485]], '#dc9854');
  ctx.fillStyle = '#455368'; ctx.beginPath(); ctx.arc(248, 479, 1, 0, Math.PI * 2); ctx.fill();
}

function drawDragonfall(t) {
  scenePolygon([[133, 493], [216, 419], [326, 422], [400, 485]], '#927b90');
  drawSkyLanterns(t);
  drawDuskDragon(t);
  ctx.strokeStyle = '#b39a9e'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(273, 449); ctx.bezierCurveTo(269, 474, 218, 481, 180, 530); ctx.stroke();
  rounded(218, 342, 104, 107, 2, '#756b87');
  for (const [x, yy] of [[198, 322], [253, 281], [310, 322]]) {
    rounded(x, yy, 31, 124, 2, '#827590');
    scenePolygon([[x - 7, yy + 2], [x + 15, yy - 43], [x + 38, yy + 2]], '#62546f');
    ctx.strokeStyle = '#62546f'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 15, yy - 43); ctx.lineTo(x + 15, yy - 62); ctx.stroke();
    const flutter = Math.sin(t * 3 + x) * 4;
    scenePolygon([[x + 16, yy - 61], [x + 36, yy - 58 + flutter], [x + 29, yy - 51 + flutter], [x + 16, yy - 48]], '#e3b2ac');
    drawSceneWindows(x + 11, yy + 23, 1, 2, '#edc28e');
  }
  rounded(262, 413, 21, 36, 10, '#50475e');
  for (const [x, yy] of [[247, 461], [218, 486], [186, 513]]) {
    const glow = ctx.createRadialGradient(x, yy - 11, 1, x, yy - 11, 15);
    glow.addColorStop(0, '#ffdda970'); glow.addColorStop(1, '#ffdda900');
    ctx.fillStyle = glow; ctx.fillRect(x - 15, yy - 26, 30, 30);
    rounded(x - 1, yy - 12, 3, 18, 1, '#66516c');
    rounded(x - 4, yy - 17, 9, 11, 2, '#6a536b');
    rounded(x - 2, yy - 15, 5, 7, 1, '#ffdfa0');
  }
  drawDuskArmy(t);
  for (let i = 0; i < 16; i++) {
    const x = 35 + (i * 67) % 330 + Math.sin(t * 0.8 + i) * 7;
    const yy = 435 + (i * 23) % 82 + Math.cos(t * 0.6 + i) * 5;
    ctx.fillStyle = `rgba(255, 235, 167, ${0.35 + (Math.sin(t * 1.5 + i) + 1) * 0.2})`;
    ctx.beginPath(); ctx.arc(x, yy, 1.5, 0, Math.PI * 2); ctx.fill();
  }
}

function drawHallowstorm(t) {
  for (let i = 0; i < 5; i++) {
    ctx.save(); ctx.translate(57 + i * 69 + Math.sin(t * 0.45 + i) * 17, 211 + i % 3 * 31 + Math.cos(t * 0.8 + i) * 8);
    const flap = Math.sin(t * 4 + i) * 4;
    scenePolygon([[-13, -4 - flap], [-5, -2], [-2, -4], [0, -1], [2, -4], [5, -2], [13, -4 - flap],
      [9, 5], [5, 2], [0, 7], [-5, 2], [-9, 5]], '#343448');
    ctx.restore();
  }
  scenePolygon([[161, 476], [173, 374], [264, 359], [312, 474]], '#363442');
  scenePolygon([[159, 380], [206, 322], [269, 366]], '#282a38');
  scenePolygon([[265, 474], [263, 309], [292, 302], [310, 474]], '#454052');
  scenePolygon([[251, 314], [269, 249], [305, 306]], '#282a38');
  scenePolygon([[180, 375], [176, 300], [194, 294], [204, 356]], '#454052');
  scenePolygon([[165, 305], [179, 265], [205, 299]], '#282a38');
  drawSceneWindows(185, 394, 3, 2, '#d9bb78'); drawSceneWindows(275, 330, 1, 2, '#d9bb78');
  rounded(240, 438, 20, 36, 9, '#242733');
  ctx.save(); ctx.translate(343, 487); ctx.rotate(Math.sin(t * 1.7) * 0.025);
  ctx.strokeStyle = '#4c4b58'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-5, -106); ctx.lineTo(-23, -136);
  ctx.moveTo(-4, -78); ctx.lineTo(19, -110); ctx.lineTo(25, -143);
  ctx.moveTo(-8, -113); ctx.lineTo(-28, -119); ctx.moveTo(20, -117); ctx.lineTo(37, -122); ctx.stroke();
  ctx.restore();
  for (const [x, yy, tilt] of [[120, 494, -0.14], [157, 512, 0.12], [208, 497, -0.08], [300, 506, 0.17], [366, 516, -0.1]]) {
    ctx.save(); ctx.translate(x, yy); ctx.rotate(tilt);
    rounded(-8, -21, 16, 24, 6, '#66717b');
    ctx.strokeStyle = '#444a5b'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, -5); ctx.moveTo(-4, -12); ctx.lineTo(4, -12); ctx.stroke();
    ctx.restore();
  }
  for (let i = 0; i < 3; i++) {
    ctx.save(); ctx.translate(171 + i * 53 + Math.sin(t * 0.7 + i * 2) * 20, 369 + i % 2 * 43 + Math.sin(t * 1.2 + i) * 7);
    ctx.fillStyle = '#e0eeea99'; ctx.beginPath(); ctx.moveTo(-8, 9);
    ctx.lineTo(-8, -3); ctx.bezierCurveTo(-8, -15, 8, -15, 8, -3); ctx.lineTo(8, 9);
    ctx.lineTo(4, 5); ctx.lineTo(0, 10); ctx.lineTo(-4, 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#405265';
    for (const x of [-3, 3]) { ctx.beginPath(); ctx.ellipse(x, -3, 1.5, 2, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  drawHalloweenDetails(t);
}

function drawHurricane(t) {
  ctx.fillStyle = '#7099a6'; ctx.fillRect(0, 458, 400, 72);
  // Keep the lighthouse as a small coastal landmark beyond the battle.
  ctx.save(); ctx.translate(214, 243); ctx.scale(0.42, 0.42);
  scenePolygon([[211, 485], [248, 433], [310, 428], [357, 493]], '#626d78');
  scenePolygon([[254, 443], [265, 295], [286, 295], [301, 443]], '#f0e6d6');
  scenePolygon([[260, 365], [263, 335], [290, 335], [293, 365]], '#bc6865');
  rounded(259, 279, 34, 26, 2, '#f4d891');
  scenePolygon([[252, 279], [276, 259], [300, 279]], '#626071');
  const beam = 0.12 + (Math.sin(t * 0.8) + 1) * 0.06;
  scenePolygon([[260, 284], [25, 223], [25, 334], [260, 297]], `rgba(255, 235, 170, ${beam})`);
  ctx.strokeStyle = '#606779'; ctx.lineWidth = 3; ctx.strokeRect(257, 277, 38, 29);
  drawSceneWindows(272, 385, 1, 1, '#7a8e9d');
  ctx.restore();
  drawHurricaneBattle(t);
  ctx.strokeStyle = '#d1e2df99'; ctx.lineWidth = 3;
  for (let i = 0; i < 7; i++) {
    const x = (i * 69 - t * 23 + 440) % 440 - 20, yy = 468 + i % 3 * 20;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.quadraticCurveTo(x + 16, yy - 10, x + 33, yy); ctx.stroke();
  }
}

function drawHighlands(t) {
  // Heather-covered hills and a ruined keep above a misty Scottish loch.
  ctx.fillStyle = '#879e94'; ctx.beginPath(); ctx.moveTo(0, 431); ctx.lineTo(0, 329);
  ctx.bezierCurveTo(70, 240, 114, 256, 191, 349);
  ctx.bezierCurveTo(260, 264, 322, 280, 400, 337); ctx.lineTo(400, 455); ctx.fill();
  ctx.fillStyle = '#9babb0'; ctx.fillRect(0, 418, 400, 112);
  scenePolygon([[178, 419], [226, 371], [308, 359], [367, 417]], '#788d80');
  rounded(250, 321, 51, 57, 1, '#75817d');
  scenePolygon([[239, 374], [241, 302], [251, 302], [251, 313], [261, 309], [267, 317], [267, 374]], '#6b7876');
  scenePolygon([[295, 372], [295, 293], [303, 293], [303, 300], [312, 300], [312, 289], [321, 295], [321, 375]], '#687772');
  scenePolygon([[267, 328], [267, 311], [279, 314], [285, 326], [293, 319], [299, 327]], '#75817d');
  rounded(275, 349, 12, 27, 6, '#465e5d');
  drawSceneWindows(248, 326, 1, 1, '#455b59'); drawSceneWindows(303, 312, 1, 1, '#455b59');
  ctx.strokeStyle = '#93a09a'; ctx.lineWidth = 1;
  for (let row = 0; row < 4; row++) {
    ctx.beginPath(); ctx.moveTo(250, 333 + row * 10); ctx.lineTo(300, 333 + row * 10); ctx.stroke();
  }
  ctx.strokeStyle = '#657771'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(308, 300); ctx.lineTo(308, 257); ctx.stroke();
  const flagWave = Math.sin(t * 2) * 2;
  scenePolygon([[309, 259], [333, 261 + flagWave], [333, 278 + flagWave], [309, 276]], '#557e9b');
  ctx.strokeStyle = '#e0e9e2'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(310, 260); ctx.lineTo(332, 277 + flagWave);
  ctx.moveTo(310, 275); ctx.lineTo(332, 262 + flagWave); ctx.stroke();
  ctx.strokeStyle = '#d5e0dbaa'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const x = (i * 61 + t * 3) % 400;
    ctx.beginPath(); ctx.moveTo(x, 436 + i % 3 * 28); ctx.lineTo(x + 24, 435 + i % 3 * 28); ctx.stroke();
  }
  scenePolygon([[0, 439], [44, 442], [76, 478], [54, 530], [0, 530]], '#879987');
  scenePolygon([[400, 445], [355, 451], [324, 493], [350, 530], [400, 530]], '#879987');
  for (let i = 0; i < 32; i++) {
    const x = i % 2 ? 357 + (i * 17) % 42 : (i * 13) % 47;
    const yy = 463 + (i * 23) % 60;
    ctx.fillStyle = ['#a58ba3', '#b59aac', '#8e7995'][i % 3];
    ctx.beginPath(); ctx.ellipse(x, yy, 4, 2.5, -0.3, 0, Math.PI * 2); ctx.fill();
  }
  // Preserve the old stone bridge as the foreground landmark.
  ctx.strokeStyle = '#7f8f8d'; ctx.lineWidth = 18;
  ctx.beginPath(); ctx.moveTo(39, 466); ctx.quadraticCurveTo(199, 390, 361, 466); ctx.stroke();
  for (const x of [92, 187, 281]) {
    rounded(x, 446, 17, 59, 2, '#879693');
  }
  ctx.strokeStyle = '#a3afaa'; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(36, 448); ctx.quadraticCurveTo(199, 370, 365, 448); ctx.stroke();
  for (let i = 0; i < 13; i++) {
    const u = i / 12, x = 38 + 325 * u, yy = 448 - 150 * u * (1 - u);
    ctx.strokeStyle = '#9aa7a2'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy + 20); ctx.stroke();
  }
  // Nessie swims in front of the bridge, clear of every pier.
  ctx.save(); ctx.translate(240 + Math.sin(t * 0.18) * 7, 511);
  ctx.strokeStyle = '#e2ebe5bb'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(8, 3, 56, 6, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#3f665d'; ctx.beginPath(); ctx.ellipse(7, 0, 34, 18, 0, Math.PI, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(45, 0, 14, 9, 0, Math.PI, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#3f665d'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-22, -2); ctx.bezierCurveTo(-14, -17, -29, -36, -15, -43); ctx.stroke();
  ctx.fillStyle = '#3f665d'; ctx.beginPath(); ctx.ellipse(-9, -44, 12, 7, -0.08, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#7d9e87'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-20, -8); ctx.quadraticCurveTo(-15, -22, -20, -32); ctx.stroke();
  ctx.fillStyle = '#769681'; ctx.beginPath(); ctx.ellipse(6, -3, 13, 5, -0.3, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 3; i++) {
    scenePolygon([[i * 10 - 2, -17], [i * 10 + 1, -24 + i * 2], [i * 10 + 6, -17]], '#648776');
  }
  ctx.fillStyle = '#e4e8c9'; ctx.beginPath(); ctx.arc(-10, -46, 2.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2d4c46'; ctx.beginPath(); ctx.arc(-9, -46, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2e514a'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-9, -41); ctx.quadraticCurveTo(-3, -39, 1, -42); ctx.stroke();
  ctx.strokeStyle = '#cfdfd2aa'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-29, 1); ctx.quadraticCurveTo(8, 6, 39, 1); ctx.stroke();
  ctx.restore();
}

function drawAuroraVillage(t) {
  ctx.fillStyle = '#b7d5df'; ctx.beginPath(); ctx.ellipse(237, 514, 210, 45, 0, 0, Math.PI * 2); ctx.fill();
  for (const [x, yy, radius] of [[273, 463, 49], [152, 480, 33], [354, 487, 29]]) {
    ctx.fillStyle = '#d9e9ef'; ctx.beginPath(); ctx.arc(x, yy, radius, Math.PI, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x, yy, radius, Math.PI, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = '#9fbfce'; ctx.lineWidth = 1.5;
    for (let row = 1; row < 4; row++) {
      const lineY = yy - row * radius / 4;
      ctx.beginPath(); ctx.moveTo(x - radius, lineY); ctx.lineTo(x + radius, lineY); ctx.stroke();
      for (let col = -2; col <= 2; col++) {
        const lineX = x + col * radius / 2 + row % 2 * radius / 4;
        ctx.beginPath(); ctx.moveTo(lineX, lineY); ctx.lineTo(lineX, lineY + radius / 4); ctx.stroke();
      }
    }
    ctx.restore();
    rounded(x - 10, yy - 20, 24, 20, 10, '#8aaaba');
    rounded(x - 5, yy - 15, 14, 15, 7, '#354e64');
  }
  ctx.strokeStyle = '#846c5c'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(208, 510); ctx.lineTo(234, 500); ctx.moveTo(207, 500); ctx.lineTo(235, 510); ctx.stroke();
  const flicker = Math.sin(t * 7) * 3;
  scenePolygon([[211, 504], [213, 486], [220, 493], [225, 478 + flicker], [232, 503]], '#e8a465');
  scenePolygon([[216, 504], [223, 490], [228, 504]], '#ffe1a2');
}

function drawEgypt(t) {
  const desertSun = ctx.createRadialGradient(76, 198, 8, 76, 198, 58);
  desertSun.addColorStop(0, '#ffe2a266'); desertSun.addColorStop(1, '#ffe2a200');
  ctx.fillStyle = desertSun; ctx.fillRect(18, 140, 116, 116);
  ctx.fillStyle = '#f5d09a88'; ctx.beginPath(); ctx.arc(76, 198, 29, 0, Math.PI * 2); ctx.fill();
  scenePolygon([[37, 462], [152, 277], [267, 462]], '#cba877');
  scenePolygon([[152, 277], [179, 462], [267, 462]], '#af895f');
  scenePolygon([[210, 465], [290, 335], [371, 465]], '#d8b686');
  scenePolygon([[290, 335], [308, 465], [371, 465]], '#b7946b');
  ctx.save(); ctx.beginPath(); ctx.moveTo(37, 462); ctx.lineTo(152, 277); ctx.lineTo(179, 462); ctx.closePath(); ctx.clip();
  ctx.strokeStyle = '#ab875a55'; ctx.lineWidth = 1;
  for (let yy = 322; yy < 463; yy += 18) { ctx.beginPath(); ctx.moveTo(37, yy); ctx.lineTo(180, yy); ctx.stroke(); }
  ctx.restore();
  scenePolygon([[48, 484], [51, 360], [59, 336], [67, 360], [70, 484]], '#c39c6b');
  scenePolygon([[59, 336], [67, 360], [70, 484], [60, 484]], '#ab8256');
  rounded(42, 481, 35, 8, 1, '#b48b5e');
  ctx.strokeStyle = '#866947'; ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const yy = 371 + i * 16;
    ctx.beginPath();
    if (i % 2) {
      ctx.moveTo(53, yy); ctx.lineTo(57, yy + 3); ctx.lineTo(53, yy + 6); ctx.lineTo(57, yy + 9);
    } else {
      ctx.ellipse(55, yy, 2, 3, 0, 0, Math.PI * 2); ctx.moveTo(55, yy + 3); ctx.lineTo(55, yy + 10);
      ctx.moveTo(52, yy + 6); ctx.lineTo(58, yy + 6);
    }
    ctx.stroke();
  }
  rounded(247, 461, 105, 27, 12, '#c6a174');
  rounded(233, 444, 34, 39, 8, '#d4b283');
  scenePolygon([[230, 451], [235, 413], [257, 411], [271, 451]], '#c19a6d');
  rounded(238, 419, 20, 28, 5, '#dfbf90');
  ctx.strokeStyle = '#ad885f'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(243, 429); ctx.lineTo(247, 429); ctx.moveTo(252, 429); ctx.lineTo(256, 429);
  ctx.moveTo(247, 440); ctx.lineTo(254, 440); ctx.stroke();
  ctx.strokeStyle = '#8c998e'; ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(231 + i, 426 + i * 5); ctx.lineTo(237, 426 + i * 5);
    ctx.moveTo(259, 425 + i * 5); ctx.lineTo(265, 428 + i * 5); ctx.stroke();
  }
  rounded(236, 479, 91, 8, 3, '#dfbf90');
  ctx.fillStyle = '#d5b68b'; ctx.beginPath(); ctx.ellipse(300, 502, 140, 23, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 3; i++) {
    ctx.save(); ctx.translate(53 + i * 53 + Math.sin(t * 0.12) * 13, 516 - i * 2); ctx.scale(0.8, 0.8);
    const stride = Math.sin(t * 3 + i) * 3;
    ctx.strokeStyle = '#92744f'; ctx.lineWidth = 2;
    for (let leg = 0; leg < 4; leg++) {
      const x = leg < 2 ? -8 : 7, swing = stride * (leg % 2 ? -1 : 1);
      ctx.beginPath(); ctx.moveTo(x, -11); ctx.lineTo(x + swing, 0); ctx.stroke();
    }
    ctx.fillStyle = '#92744f'; ctx.beginPath(); ctx.ellipse(0, -14, 13, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-1, -18, 7, Math.PI, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#92744f'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(9, -14); ctx.lineTo(14, -31); ctx.lineTo(21, -30); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-12, -16); ctx.lineTo(-18, -13); ctx.stroke();
    rounded(-6, -22, 12, 6, 1, '#ac6f5d');
    rounded(-2, -31, 5, 9, 1, '#64594e');
    ctx.fillStyle = '#e0c39a'; ctx.beginPath(); ctx.arc(0, -34, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function drawSingaporeFlyer(t) {
  ctx.strokeStyle = '#9ba8b5'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(33, 420); ctx.lineTo(57, 324); ctx.lineTo(82, 420); ctx.stroke();
  ctx.strokeStyle = '#ccd1d0'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(57, 324, 43, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6 + t * 0.055, x = 57 + Math.cos(a) * 43, yy = 324 + Math.sin(a) * 43;
    ctx.strokeStyle = '#b2bac477'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(57, 324); ctx.lineTo(x, yy); ctx.stroke();
    rounded(x - 4, yy - 3, 8, 6, 2, '#b4c8cf');
  }
}
function drawSingaporeWaterfront(t) {
  for (const [x, yy, height] of [[358, 466, 93], [389, 475, 70]]) {
    ctx.strokeStyle = '#897588'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy - height + 9); ctx.stroke();
    ctx.fillStyle = '#8d9b89'; ctx.beginPath(); ctx.ellipse(x, yy - height, 23, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b39baf'; ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(x, yy - 23); ctx.lineTo(x + i * 9, yy - height); ctx.stroke();
    }
    ctx.strokeStyle = '#dac1b7'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, yy - height, 23, 9, 0, 0, Math.PI * 2); ctx.stroke();
  }
  // The Merlion's mane, fish tail and flowing water face the bay.
  rounded(27, 496, 38, 7, 2, '#b8c6c4');
  scenePolygon([[31, 495], [38, 482], [38, 462], [50, 459], [53, 476], [45, 487], [54, 495]], '#eee9d8');
  ctx.fillStyle = '#d5dcd2'; ctx.beginPath(); ctx.arc(43, 454, 11, 0, Math.PI * 2); ctx.fill();
  rounded(43, 446, 13, 15, 4, '#f1ecdc');
  scenePolygon([[34, 486], [25, 475], [29, 492], [38, 496]], '#e6e4d5');
  ctx.strokeStyle = '#b4c7c6'; ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.arc(44, 473 + i * 5, 4, 0, Math.PI); ctx.stroke();
  }
  ctx.fillStyle = '#6e858b'; ctx.beginPath(); ctx.arc(51, 451, 1.3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#dff3efcc'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(56, 456); ctx.quadraticCurveTo(95, 449, 112, 507); ctx.stroke();
  const drop = (t * 0.65) % 1;
  ctx.fillStyle = '#f0fffa'; ctx.beginPath(); ctx.arc(56 + 56 * drop, 456 - 14 * drop + 65 * drop * drop, 1.7, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#dff3ef88'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(112, 508, 9 + Math.sin(t) * 2, 3, 0, 0, Math.PI * 2); ctx.stroke();
}
function drawMordor(t) {
  ctx.fillStyle = '#29252e'; ctx.beginPath(); ctx.moveTo(165, 465); ctx.lineTo(295, 213);
  ctx.lineTo(328, 218); ctx.lineTo(400, 450); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#e98749'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(304, 222);
  ctx.lineTo(281, 284); ctx.lineTo(307, 325); ctx.lineTo(271, 407); ctx.stroke();
  ctx.fillStyle = '#201f29'; ctx.beginPath(); ctx.moveTo(65, 475); ctx.lineTo(84, 218);
  ctx.lineTo(77, 155); ctx.lineTo(96, 177); ctx.lineTo(104, 211); ctx.lineTo(115, 177);
  ctx.lineTo(130, 155); ctx.lineTo(123, 220); ctx.lineTo(148, 475); ctx.closePath(); ctx.fill();
  const glow = ctx.createRadialGradient(104, 173, 4, 104, 173, 68);
  glow.addColorStop(0, '#ffd26fbb'); glow.addColorStop(1, '#ef702900');
  ctx.fillStyle = glow; ctx.fillRect(36, 105, 136, 136);
  ctx.fillStyle = '#f48936'; ctx.beginPath(); ctx.moveTo(74, 174);
  ctx.quadraticCurveTo(104, 145, 135, 174); ctx.quadraticCurveTo(104, 198, 74, 174); ctx.fill();
  ctx.fillStyle = '#ffd66a'; ctx.beginPath(); ctx.ellipse(104, 173, 10, 19, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#29202a'; ctx.beginPath(); ctx.ellipse(104, 173, 3, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ee8245'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 507);
  ctx.bezierCurveTo(120, 470, 220, 541, 400, 483); ctx.stroke();
  ctx.fillStyle = '#e9a37388';
  for (let i = 0; i < 25; i++) ctx.fillRect((i * 97 + t * 13) % 400, 530 - (i * 43 + t * 22) % 400, 2, 3);
}

function drawJapan(t) {
  ctx.fillStyle = '#8b9fbf'; ctx.beginPath(); ctx.moveTo(95, 402); ctx.lineTo(256, 164);
  ctx.lineTo(400, 402); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff8f4'; ctx.beginPath(); ctx.moveTo(256, 164); ctx.lineTo(212, 229);
  ctx.lineTo(237, 218); ctx.lineTo(250, 238); ctx.lineTo(269, 218); ctx.lineTo(296, 230); ctx.closePath(); ctx.fill();
  for (const x of [57, 181]) rounded(x, 345, 12, 168, 2, '#be493e');
  rounded(37, 343, 177, 14, 3, '#cf5147'); rounded(48, 375, 154, 10, 2, '#be493e');
  ctx.strokeStyle = '#553e42'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(28, 330);
  ctx.quadraticCurveTo(120, 348, 223, 330); ctx.stroke();
  drawSakuraTree(15, 505, 1); drawSakuraTree(382, 511, -1);
  ctx.fillStyle = '#ffe1ec';
  for (let i = 0; i < 36; i++) {
    const x = (i * 83 + t * 18) % 400, yy = (i * 67 + t * 25) % 520;
    ctx.beginPath(); ctx.ellipse(x, yy, 4, 2, i + t, 0, Math.PI * 2); ctx.fill();
  }
}

function drawAntarctica(t) {
  ctx.fillStyle = '#91c4dc'; ctx.beginPath(); ctx.moveTo(0, 439); ctx.lineTo(43, 317);
  ctx.lineTo(91, 385); ctx.lineTo(148, 293); ctx.lineTo(226, 439); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f1fbff'; ctx.beginPath(); ctx.moveTo(103, 367); ctx.lineTo(148, 293);
  ctx.lineTo(188, 368); ctx.lineTo(147, 346); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#eaf7fc'; ctx.beginPath(); ctx.ellipse(220, 516, 240, 65, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 6; i++) {
    const x = ((i * 71 + t * (i % 2 ? -8 : 10)) % 440 + 440) % 440 - 20;
    const yy = 477 + (i % 3) * 17, waddle = Math.sin(t * 5 + i) * 2;
    ctx.save(); ctx.translate(x, yy); ctx.rotate(i === 4 ? -1.25 : waddle * 0.045);
    ctx.fillStyle = '#edaa55'; ctx.fillRect(-9, 10, 7, 3); ctx.fillRect(3, 10, 7, 3);
    ctx.fillStyle = '#344354'; ctx.beginPath(); ctx.ellipse(0, 0, 10, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.ellipse(1, 3, 6, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#edaa55'; ctx.beginPath(); ctx.moveTo(6, -9); ctx.lineTo(15, -6); ctx.lineTo(7, -3); ctx.fill();
    ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(5, -10, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}


function drawSingapore(t) {
  // Three hotel towers and the boat-shaped SkyPark above Marina Bay.
  ctx.fillStyle = '#7eaebc'; ctx.fillRect(0, 456, 400, 74);
  drawSingaporeFlyer(t);
  for (const [x, height] of [[131, 188], [207, 196], [283, 190]]) {
    rounded(x, 445 - height, 43, height, 5, '#cbd8dd');
    rounded(x + 8, 450 - height, 25, height - 5, 2, '#7998ae');
    for (let row = 0; row < 18; row++) {
      ctx.fillStyle = '#e3ded8'; ctx.fillRect(x + 6, 455 - height + row * 10, 31, 2);
    }
    ctx.fillStyle = '#ecded0'; ctx.fillRect(x + 20, 450 - height, 3, height - 5);
  }
  ctx.fillStyle = '#d8dcd4'; ctx.beginPath(); ctx.moveTo(107, 247);
  ctx.quadraticCurveTo(208, 229, 349, 243); ctx.quadraticCurveTo(331, 264, 297, 264);
  ctx.lineTo(139, 264); ctx.quadraticCurveTo(119, 260, 107, 247); ctx.fill();
  ctx.strokeStyle = '#7ba8ad'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(143, 246); ctx.lineTo(281, 246); ctx.stroke();
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = '#6e9882'; ctx.beginPath(); ctx.arc(154 + i * 16, 240, 4, 0, Math.PI * 2); ctx.fill();
  }
  // Low waterfront skyline and the ArtScience Museum's lotus silhouette.
  ctx.fillStyle = '#b0c1cf';
  for (let i = 0; i < 5; i++) ctx.fillRect(i * 22, 401 - (i % 3) * 17, 17, 55 + (i % 3) * 17);
  ctx.fillStyle = '#f0e7de';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath(); ctx.ellipse(81 + (i - 2) * 8, 436 - Math.abs(i - 2) * 3, 7, 19, (i - 2) * 0.35, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = '#e9ddd880'; ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    const x = (i * 53 + t * 6) % 420 - 20;
    ctx.beginPath(); ctx.moveTo(x, 467 + (i % 4) * 15); ctx.lineTo(x + 30, 467 + (i % 4) * 15); ctx.stroke();
  }
  drawSingaporeWaterfront(t);
}

export const sceneRenderers = Object.freeze({
  jurassic: drawJurassic,
  mario: drawMarioWorld,
  totoro: drawTotoroScene,
  windmill: drawNetherlands,
  gotham: drawGotham,
  nordic: drawNordic,
  castle: drawDragonfall,
  haunted: drawHallowstorm,
  lighthouse: drawHurricane,
  highlands: drawHighlands,
  igloos: drawAuroraVillage,
  pyramids: drawEgypt,
  mordor: drawMordor,
  japan: drawJapan,
  antarctica: drawAntarctica,
  mbs: drawSingapore,
});

function drawLandmark(landmark, time) {
  const draw = sceneRenderers[landmark];
  if (!draw) throw new Error(`Unknown scene renderer: ${landmark}`);
  ctx.save();
  try {
    draw(time);
  } finally {
    ctx.restore();
  }
}

const groundColors = {
  antarctica: '#dceff8', nordic: '#dceff8', igloos: '#dceff8',
  mordor: '#403038', gotham: '#253447', totoro: '#718987', jurassic: '#526d50'
};

export function drawGround(weather) {
  ctx.fillStyle = groundColors[weather.landmark] ?? '#e3cc99';
  ctx.fillRect(0, 530, 400, 30);
  if (weather.landmark === 'mario') drawMarioGround();
}
