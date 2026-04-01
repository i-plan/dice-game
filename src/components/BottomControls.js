class BottomControls {
  draw(ctx, controls, options) {
    const pressedId = options && options.pressedId ? options.pressedId : null;
    const disabled = options && options.disabled;

    this.drawSideButton(ctx, controls.leftButton, {
      pressed: pressedId === controls.leftButton.id,
      icon: 'dots',
      disabled: false,
    });

    this.drawMainButton(ctx, controls.centerButton, {
      pressed: pressedId === controls.centerButton.id,
      disabled,
    });

    this.drawSideButton(ctx, controls.rightButton, {
      pressed: pressedId === controls.rightButton.id,
      icon: 'gear',
      disabled: false,
    });
  }

  drawMainButton(ctx, button, state) {
    const radius = button.radius;
    const scale = state.pressed ? 0.95 : 1;
    const alpha = state.disabled ? 0.78 : 1;

    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(button.x, button.y);
    ctx.scale(scale, scale);

    ctx.shadowColor = 'rgba(255, 92, 76, 0.44)';
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#d83b24';
    ctx.fill();

    ctx.shadowColor = 'transparent';

    const gradient = ctx.createLinearGradient(0, -radius, 0, radius);
    gradient.addColorStop(0, '#ff9355');
    gradient.addColorStop(0.6, '#f74e36');
    gradient.addColorStop(1, '#c92a1d');
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.94, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -radius * 0.16, radius * 0.64, Math.PI, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.94, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 244, 227, 0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fff8f1';
    ctx.font = `700 ${Math.round(radius * 0.82)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('摇', 0, radius * 0.06);

    ctx.restore();
  }

  drawSideButton(ctx, button, state) {
    const radius = button.radius;
    const scale = state.pressed ? 0.94 : 1;

    ctx.save();
    ctx.translate(button.x, button.y);
    ctx.scale(scale, scale);

    ctx.shadowColor = 'rgba(78, 168, 255, 0.26)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0c2a56';
    ctx.fill();

    ctx.shadowColor = 'transparent';

    const gradient = ctx.createLinearGradient(0, -radius, 0, radius);
    gradient.addColorStop(0, '#245a9b');
    gradient.addColorStop(1, '#081a34');
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(129, 220, 255, 0.58)';
    ctx.lineWidth = 2;
    ctx.stroke();

    this.drawSideIcon(ctx, state.icon, radius * 0.82);

    ctx.restore();
  }

  drawSideIcon(ctx, icon, size) {
    ctx.save();
    ctx.strokeStyle = '#f1f8ff';
    ctx.fillStyle = '#f1f8ff';
    ctx.lineWidth = Math.max(2, size * 0.08);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (icon === 'gear') {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.14, 0, Math.PI * 2);
      ctx.stroke();

      for (let index = 0; index < 8; index += 1) {
        const angle = (Math.PI / 4) * index;
        const inner = size * 0.2;
        const outer = size * 0.34;

        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
        ctx.stroke();
      }
    } else {
      [-size * 0.2, 0, size * 0.2].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, 0, size * 0.07, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }
}

module.exports = BottomControls;
