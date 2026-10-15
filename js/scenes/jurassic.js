import { ctx, rounded, scenePolygon } from '../canvas.js';

function drawVolcano(t) {
  const sunset = ctx.createRadialGradient(133, 241, 12, 133, 241, 88);
  sunset.addColorStop(0, '#ffe4a688');
  sunset.addColorStop(1, '#ffe4a600');
  ctx.fillStyle = sunset;
  ctx.fillRect(45, 153, 176, 176);
  ctx.fillStyle = '#f9db9d';
  ctx.beginPath(); ctx.arc(133, 241, 39, 0, Math.PI * 2); ctx.fill();

  scenePolygon([[167, 418], [273, 260], [299, 264], [400, 420]], '#8b827e');
  scenePolygon([[285, 266], [299, 264], [400, 420], [315, 394]], '#777d78');
  scenePolygon([[264, 273], [273, 260], [299, 264], [308, 277], [289, 272]], '#bd947e');
  ctx.strokeStyle = '#dfad78'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(288, 272); ctx.lineTo(281, 301); ctx.lineTo(292, 327); ctx.stroke();

  for (let i = 0; i < 5; i++) {
    const rise = (t * 9 + i * 19) % 100;
    ctx.fillStyle = `rgba(160, 145, 143, ${0.32 * (1 - rise / 125)})`;
    ctx.beginPath();
    ctx.ellipse(285 + rise * 0.16 + Math.sin(rise / 28) * 4, 255 - rise,
      9 + rise * 0.19, 7 + rise * 0.13, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPterosaurs(t) {
  for (let i = 0; i < 3; i++) {
    const x = 69 + i * 116 + Math.sin(t * 0.25 + i * 1.7) * 24;
    const yy = 174 + i % 2 * 42 + Math.cos(t * 0.4 + i) * 8;
    const flap = Math.sin(t * 2.7 + i) * 5;
    ctx.save(); ctx.translate(x, yy); ctx.scale(i === 1 ? 0.75 : 1, 0.8);
    scenePolygon([[-2, 2], [-26, -12 - flap], [-15, -9], [-7, -1], [0, -3],
      [8, -13 - flap], [24, -18 - flap], [13, -2], [4, 3], [0, 8]], '#6c6a73');
    scenePolygon([[2, 0], [9, -5], [21, -3], [9, 0]], '#6c6a73');
    ctx.restore();
  }
}

function drawSauropod(t) {
  ctx.save(); ctx.translate(112, 426 + Math.sin(t * 0.8) * 1.5);
  ctx.strokeStyle = '#57766a'; ctx.lineCap = 'round'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(-26, -1);
  ctx.bezierCurveTo(-47, -1, -59, 16, -88, 10); ctx.stroke();
  for (const [x, lean] of [[-22, -3], [-7, 2], [16, -1], [30, 3]]) {
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(x, 8); ctx.lineTo(x + lean, 48); ctx.stroke();
  }
  ctx.fillStyle = '#57766a';
  ctx.beginPath(); ctx.ellipse(0, 0, 43, 23, -0.05, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 18;
  ctx.beginPath(); ctx.moveTo(27, -6);
  ctx.bezierCurveTo(51, -31, 28, -84, 53, -113);
  ctx.quadraticCurveTo(64, -129, 72, -127); ctx.stroke();
  ctx.fillStyle = '#57766a';
  ctx.beginPath(); ctx.ellipse(77, -128, 15, 8, -0.12, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8ca18a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(35, -14);
  ctx.bezierCurveTo(52, -40, 35, -86, 58, -113); ctx.stroke();
  ctx.fillStyle = '#d6d1a2';
  ctx.beginPath(); ctx.arc(81, -131, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawCycad(x, baseY, height) {
  rounded(x - 5, baseY - height, 10, height, 3, '#4a6856');
  ctx.strokeStyle = '#73906b'; ctx.lineWidth = 1;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath(); ctx.moveTo(x - 4, baseY - i * 12); ctx.lineTo(x + 4, baseY - i * 12 - 5); ctx.stroke();
  }
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI + i * Math.PI / 6;
    const tipX = x + Math.cos(a) * 57, tipY = baseY - height + Math.sin(a) * 36 + 13;
    ctx.fillStyle = i % 2 ? '#4d775e' : '#63876a';
    ctx.beginPath(); ctx.moveTo(x, baseY - height);
    ctx.quadraticCurveTo((x + tipX) / 2, baseY - height - 22, tipX, tipY);
    ctx.quadraticCurveTo((x + tipX) / 2, baseY - height - 3, x, baseY - height + 5);
    ctx.fill();
  }
}

function drawTyrannosaur(t) {
  ctx.save(); ctx.translate(264 + Math.sin(t * 0.25) * 27, 500);
  const stride = Math.sin(t * 2.3) * 5;
  ctx.strokeStyle = '#355a49'; ctx.lineCap = 'round'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(-13, -29);
  ctx.bezierCurveTo(-36, -30, -52, -10, -80, -18); ctx.stroke();
  for (const [x, swing] of [[-10, stride], [9, -stride]]) {
    ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(x, -22); ctx.lineTo(x - 5, -10);
    ctx.lineTo(x + swing, 1); ctx.lineTo(x + swing + 10, 1); ctx.stroke();
  }
  ctx.fillStyle = '#355a49';
  ctx.beginPath(); ctx.ellipse(0, -33, 24, 18, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#355a49'; ctx.lineWidth = 17;
  ctx.beginPath(); ctx.moveTo(10, -36); ctx.lineTo(19, -54); ctx.stroke();
  rounded(13, -70, 35, 23, 6, '#355a49');
  ctx.fillStyle = '#93a47a';
  ctx.beginPath(); ctx.arc(25, -64, 2.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#29483d';
  ctx.beginPath(); ctx.arc(26, -64, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#203f37'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(26, -54); ctx.lineTo(46, -54); ctx.stroke();
  for (let i = 0; i < 4; i++) {
    scenePolygon([[29 + i * 4, -54], [31 + i * 4, -50], [33 + i * 4, -54]], '#c9cda9');
  }
  ctx.strokeStyle = '#355a49'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(17, -37); ctx.lineTo(25, -30); ctx.lineTo(31, -34);
  ctx.moveTo(29, -33); ctx.lineTo(33, -32); ctx.stroke();
  ctx.restore();
}

function drawFern(x, baseY, size, t) {
  ctx.save(); ctx.translate(x, baseY); ctx.scale(size, size);
  ctx.rotate(Math.sin(t * 0.7 + x) * 0.025);
  for (let frond = 0; frond < 5; frond++) {
    const a = -Math.PI + 0.2 + frond * (Math.PI - 0.4) / 4;
    const tipX = Math.cos(a) * 44, tipY = Math.sin(a) * 47 - 4;
    ctx.strokeStyle = '#325c46'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(tipX * 0.25, tipY, tipX, tipY); ctx.stroke();
    for (let leaf = 1; leaf < 5; leaf++) {
      const u = leaf / 5, lx = tipX * u * u, ly = tipY * (2 * u - u * u);
      const width = (1 - u) * 12 + 2;
      for (const side of [-1, 1]) {
        scenePolygon([[lx, ly], [lx + side * width, ly - 7], [lx + side * width * 0.65, ly], [lx, ly + 3]],
          frond % 2 ? '#3c684c' : '#4c7753');
      }
    }
  }
  ctx.restore();
}

export function drawJurassic(t) {
  drawVolcano(t);
  drawPterosaurs(t);
  scenePolygon([[0, 434], [0, 395], [65, 364], [159, 400], [223, 380], [307, 404], [400, 368], [400, 530], [0, 530]], '#6e896e');
  drawSauropod(t);
  drawCycad(22, 498, 112);
  drawCycad(377, 501, 122);

  const haze = ctx.createLinearGradient(0, 431, 0, 492);
  haze.addColorStop(0, '#c6c6a400'); haze.addColorStop(0.5, '#c6c6a422'); haze.addColorStop(1, '#c6c6a400');
  ctx.fillStyle = haze; ctx.fillRect(0, 431, 400, 61);
  drawTyrannosaur(t);
  scenePolygon([[0, 518], [78, 503], [147, 519], [221, 510], [301, 518], [400, 497], [400, 530], [0, 530]], '#527650');
  for (const [x, size] of [[8, 1.1], [69, 0.7], [161, 0.65], [337, 0.75], [398, 1.2]]) {
    drawFern(x, 531, size, t);
  }
}
