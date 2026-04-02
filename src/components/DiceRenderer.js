function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

class DiceRenderer {
  draw(ctx, die, options) {
    const alpha = options && typeof options.alpha === 'number' ? options.alpha : 1;
    const size = die.size;
    const half = size / 2;
    const accent = die.accent === 'black' ? '#4b5f86' : '#53bbff';
    const pipColor = die.value === 1 || die.value === 4
      ? '#ff557c'
      : '#1f2430';

    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(die.x, die.y);
    ctx.rotate(die.rotation || 0);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 8;

    const faceGradient = ctx.createLinearGradient(-half, -half, half, half);
    faceGradient.addColorStop(0, '#ffffff');
    faceGradient.addColorStop(0.62, '#eef4ff');
    faceGradient.addColorStop(1, '#d7e6ff');

    roundedRectPath(ctx, -half, -half, size, size, size * 0.18);
    ctx.fillStyle = faceGradient;
    ctx.fill();

    ctx.lineWidth = Math.max(2, size * 0.05);
    ctx.strokeStyle = accent;
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    roundedRectPath(ctx, -half + 4, -half + 4, size - 8, size - 8, size * 0.14);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-half * 0.52, -half * 0.34);
    ctx.quadraticCurveTo(0, -half * 0.56, half * 0.28, -half * 0.3);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = Math.max(2, size * 0.06);
    ctx.lineCap = 'round';
    ctx.stroke();

    this.drawPips(ctx, die.value, size, pipColor);

    ctx.restore();
  }

  drawPips(ctx, value, size, color) {
    const offset = size * 0.23;
    const positions = {
      topLeft: [-offset, -offset],
      top: [0, -offset],
      topRight: [offset, -offset],
      left: [-offset, 0],
      center: [0, 0],
      right: [offset, 0],
      bottomLeft: [-offset, offset],
      bottom: [0, offset],
      bottomRight: [offset, offset],
    };

    const patterns = {
      1: ['center'],
      2: ['topLeft', 'bottomRight'],
      3: ['topLeft', 'center', 'bottomRight'],
      4: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
      5: ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'],
      6: ['topLeft', 'left', 'bottomLeft', 'topRight', 'right', 'bottomRight'],
    };

    const radius = Math.max(3, size * 0.07);
    const keys = patterns[value] || patterns[1];

    keys.forEach((key) => {
      const point = positions[key];
      if (!point) {
        return;
      }

      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(point[0] - radius * 0.22, point[1] - radius * 0.22, radius * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.fill();
    });
  }
}

module.exports = DiceRenderer;
