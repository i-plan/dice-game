class TrayView {
  constructor(diceRenderer) {
    this.diceRenderer = diceRenderer;
  }

  draw(ctx, tray, options) {
    const dice = options && options.dice ? options.dice : [];
    const diceAlpha = options && typeof options.diceAlpha === 'number' ? options.diceAlpha : 1;
    const dim = options && typeof options.dim === 'number' ? options.dim : 0;
    const width = tray.width;
    const height = tray.height;

    ctx.save();

    ctx.shadowColor = 'rgba(59, 175, 255, 0.35)';
    ctx.shadowBlur = 36;
    ctx.fillStyle = 'rgba(8, 24, 50, 0.92)';
    this.fillEllipse(ctx, tray.x, tray.y, width / 2, height / 2);

    const outerGradient = ctx.createLinearGradient(tray.x, tray.y - height / 2, tray.x, tray.y + height / 2);
    outerGradient.addColorStop(0, '#1a477f');
    outerGradient.addColorStop(0.55, '#10315f');
    outerGradient.addColorStop(1, '#08172f');
    ctx.fillStyle = outerGradient;
    this.fillEllipse(ctx, tray.x, tray.y, width / 2, height / 2);

    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(122, 220, 255, 0.6)';
    this.strokeEllipse(ctx, tray.x, tray.y, width / 2 - 2, height / 2 - 2);

    const innerGradient = ctx.createLinearGradient(tray.x, tray.y - height * 0.3, tray.x, tray.y + height * 0.3);
    innerGradient.addColorStop(0, 'rgba(23, 72, 128, 0.9)');
    innerGradient.addColorStop(1, 'rgba(9, 24, 54, 0.94)');
    ctx.fillStyle = innerGradient;
    this.fillEllipse(ctx, tray.x, tray.y + 2, tray.innerWidth / 2, tray.innerHeight / 2);

    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    this.strokeEllipse(ctx, tray.x, tray.y - 1, tray.innerWidth / 2 - 2, tray.innerHeight / 2 - 2);

    if (dim > 0) {
      ctx.fillStyle = `rgba(6, 12, 30, ${Math.min(0.45, dim * 0.45)})`;
      this.fillEllipse(ctx, tray.x, tray.y, tray.innerWidth / 2, tray.innerHeight / 2);
    }

    if (dice.length) {
      ctx.save();
      ctx.globalAlpha *= diceAlpha;
      dice.forEach((die) => {
        this.diceRenderer.draw(ctx, die, { alpha: 1 });
      });
      ctx.restore();
    }

    ctx.restore();
  }

  fillEllipse(ctx, x, y, radiusX, radiusY) {
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  strokeEllipse(ctx, x, y, radiusX, radiusY) {
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

module.exports = TrayView;
