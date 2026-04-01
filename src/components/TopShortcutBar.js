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

class TopShortcutBar {
  draw(ctx, items, options) {
    const pressedId = options && options.pressedId ? options.pressedId : null;

    items.forEach((item) => {
      this.drawItem(ctx, item, pressedId === item.id);
    });
  }

  drawItem(ctx, item, pressed) {
    const centerX = item.x + item.width / 2;
    const iconCenterY = item.y + item.iconSize / 2 + 4;
    const scale = pressed ? 0.95 : 1;
    const cardAlpha = pressed ? 0.22 : 0.12;

    ctx.save();
    ctx.translate(centerX, iconCenterY);
    ctx.scale(scale, scale);

    roundedRectPath(ctx, -item.width * 0.42, -item.height * 0.34, item.width * 0.84, item.height * 0.92, 16);
    ctx.fillStyle = `rgba(22, 48, 93, ${cardAlpha})`;
    ctx.fill();

    const iconGradient = ctx.createLinearGradient(0, -item.iconSize / 2, 0, item.iconSize / 2);
    iconGradient.addColorStop(0, '#6ce1ff');
    iconGradient.addColorStop(1, '#1f8ff6');

    ctx.shadowColor = pressed ? 'rgba(108, 225, 255, 0.45)' : 'rgba(108, 225, 255, 0.28)';
    ctx.shadowBlur = pressed ? 22 : 16;
    ctx.beginPath();
    ctx.arc(0, 0, item.iconSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = iconGradient;
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.stroke();

    this.drawIcon(ctx, item.icon, item.iconSize * 0.56);

    ctx.fillStyle = '#edf5ff';
    ctx.font = '500 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(item.label, 0, item.iconSize / 2 + 12);

    ctx.restore();
  }

  drawIcon(ctx, type, size) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, size * 0.08);

    if (type === 'spark') {
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.42);
      ctx.lineTo(0, size * 0.42);
      ctx.moveTo(-size * 0.42, 0);
      ctx.lineTo(size * 0.42, 0);
      ctx.moveTo(-size * 0.25, -size * 0.25);
      ctx.lineTo(size * 0.25, size * 0.25);
      ctx.moveTo(size * 0.25, -size * 0.25);
      ctx.lineTo(-size * 0.25, size * 0.25);
      ctx.stroke();
    } else if (type === 'palette') {
      ctx.beginPath();
      ctx.arc(-size * 0.05, 0, size * 0.38, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size * 0.18, size * 0.14, size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-size * 0.18, -size * 0.08, size * 0.06, 0, Math.PI * 2);
      ctx.arc(0, -size * 0.2, size * 0.06, 0, Math.PI * 2);
      ctx.arc(size * 0.08, 0, size * 0.06, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'gift') {
      ctx.strokeRect(-size * 0.34, -size * 0.04, size * 0.68, size * 0.38);
      ctx.strokeRect(-size * 0.28, -size * 0.28, size * 0.56, size * 0.24);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.28);
      ctx.lineTo(0, size * 0.34);
      ctx.moveTo(-size * 0.34, size * 0.12);
      ctx.lineTo(size * 0.34, size * 0.12);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-size * 0.1, -size * 0.3, size * 0.08, Math.PI * 0.1, Math.PI * 1.25);
      ctx.arc(size * 0.1, -size * 0.3, size * 0.08, Math.PI * 1.75, Math.PI * 0.9, true);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, -size * 0.16, size * 0.16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, size * 0.18, size * 0.24, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size * 0.22, -size * 0.02);
      ctx.lineTo(size * 0.42, -size * 0.02);
      ctx.moveTo(size * 0.32, -size * 0.12);
      ctx.lineTo(size * 0.32, size * 0.08);
      ctx.stroke();
    }

    ctx.restore();
  }
}

module.exports = TopShortcutBar;
