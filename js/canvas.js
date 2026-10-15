export const canvas = document.getElementById('game');
export let ctx = canvas.getContext('2d');
// Keep game coordinates at 400×560, but render sharply on high-density screens.
const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
canvas.width = 400 * pixelRatio; canvas.height = 560 * pixelRatio;
ctx.scale(pixelRatio, pixelRatio);

export function rounded(x, y, w, h, radius, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill();
}

export function drawSparkle(x, yy, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(x, yy - size); ctx.lineTo(x + size * 0.3, yy - size * 0.3);
  ctx.lineTo(x + size, yy); ctx.lineTo(x + size * 0.3, yy + size * 0.3);
  ctx.lineTo(x, yy + size); ctx.lineTo(x - size * 0.3, yy + size * 0.3);
  ctx.lineTo(x - size, yy); ctx.lineTo(x - size * 0.3, yy - size * 0.3);
  ctx.closePath(); ctx.fill();
}

export function scenePolygon(points, color) {
  ctx.fillStyle = color; ctx.beginPath();
  points.forEach(([x, yy], i) => i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy));
  ctx.closePath(); ctx.fill();
}

// Gallery previews share the same painters, but never retain the game context.
export function withDrawingContext(context, draw) {
  const previousContext = ctx;
  try {
    ctx = context;
    return draw();
  } finally {
    ctx = previousContext;
  }
}
