class CupView {
  draw(ctx, cup, pose) {
    const offsetX = (pose.offsetX || 0) * cup.width;
    const offsetY = (pose.offsetY || 0) * cup.height;
    const liftRatio = typeof pose.lift === 'number'
      ? Math.max(0, Math.min(pose.lift, 1))
      : 0;
    const lift = liftRatio * cup.liftDistance;
    const x = cup.x + offsetX;
    const y = cup.y + offsetY - lift;
    const width = cup.width;
    const height = cup.height;
    const glowBoost = pose.glowBoost || 0;
    const shadowOpacity = typeof pose.shadowOpacity === 'number' ? pose.shadowOpacity : 0.55;
    const pivotY = height * 0.34;

    ctx.save();

    ctx.globalAlpha = shadowOpacity * (1 - liftRatio * 0.48);
    ctx.shadowColor = `rgba(86, 198, 255, ${0.22 + glowBoost * 0.18})`;
    ctx.shadowBlur = 18 + glowBoost * 22 + liftRatio * 8;
    ctx.fillStyle = 'rgba(3, 6, 18, 0.52)';
    ctx.beginPath();
    ctx.ellipse(
      cup.x + offsetX * 0.22,
      cup.y + height * 0.39 - lift * 0.18,
      width * (0.31 - liftRatio * 0.06),
      height * (0.11 - liftRatio * 0.028),
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
    ctx.save();
    ctx.translate(x, y + pivotY);
    ctx.rotate(pose.rotation || 0);
    ctx.scale(pose.scaleX || 1, pose.scaleY || 1);
    ctx.translate(0, -pivotY);

    ctx.globalAlpha = (0.12 + glowBoost * 0.13) * (1 - liftRatio * 0.08);
    ctx.shadowColor = '#2f8fd0';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#1f5f96';
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.28, height * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    const bodyGradient = ctx.createLinearGradient(0, -height * 0.48, 0, height * 0.48);
    bodyGradient.addColorStop(0, '#15365f');
    bodyGradient.addColorStop(0.45, '#081f3e');
    bodyGradient.addColorStop(1, '#020c19');

    this.bodyPath(ctx, width, height);
    ctx.fillStyle = bodyGradient;
    ctx.fill();

    ctx.lineWidth = Math.max(3, width * 0.025);
    ctx.strokeStyle = 'rgba(91, 182, 235, 0.62)';
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, -height * 0.37, width * 0.28, height * 0.08, 0, 0, Math.PI * 2);
    const rimGradient = ctx.createLinearGradient(0, -height * 0.44, 0, -height * 0.28);
    rimGradient.addColorStop(0, '#3f9dd6');
    rimGradient.addColorStop(1, '#124f87');
    ctx.fillStyle = rimGradient;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, height * 0.38, width * 0.21, height * 0.07, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#050e1f';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-width * 0.18, -height * 0.3);
    ctx.quadraticCurveTo(-width * 0.05, -height * 0.46, width * 0.08, -height * 0.28);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.lineWidth = Math.max(5, width * 0.05);
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width * 0.18, -height * 0.1);
    ctx.quadraticCurveTo(width * 0.26, height * 0.06, width * 0.1, height * 0.24);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = Math.max(4, width * 0.035);
    ctx.stroke();

    ctx.restore();
  }

  bodyPath(ctx, width, height) {
    ctx.beginPath();
    ctx.moveTo(-width * 0.34, -height * 0.37);
    ctx.quadraticCurveTo(-width * 0.51, -height * 0.1, -width * 0.23, height * 0.4);
    ctx.lineTo(width * 0.23, height * 0.4);
    ctx.quadraticCurveTo(width * 0.51, -height * 0.1, width * 0.34, -height * 0.37);
    ctx.quadraticCurveTo(0, -height * 0.52, -width * 0.34, -height * 0.37);
    ctx.closePath();
  }
}

module.exports = CupView;
