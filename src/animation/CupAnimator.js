const {
  clamp,
  easeOutBack,
  easeOutCubic,
  easeOutSine,
} = require('../utils/easing');

class CupAnimator {
  constructor() {
    this.duration = 1460;
    this.elapsed = 0;
    this.running = false;
  }

  start() {
    this.elapsed = 0;
    this.running = true;
  }

  update(deltaTime) {
    if (!this.running) {
      return this.getState();
    }

    this.elapsed = Math.min(this.elapsed + deltaTime, this.duration);

    if (this.elapsed >= this.duration) {
      this.running = false;
    }

    return this.getState();
  }

  isRunning() {
    return this.running;
  }

  getRevealPose() {
    return {
      offsetX: 0,
      offsetY: -0.03,
      rotation: 0.02,
      scaleX: 0.98,
      scaleY: 1.02,
      lift: 1,
      revealProgress: 1,
      shadowOpacity: 0.24,
      glowBoost: 0.42,
    };
  }

  getState() {
    const progress = clamp(this.duration ? this.elapsed / this.duration : 0, 0, 1);

    if (!this.running && this.elapsed === 0) {
      return {
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        lift: 0,
        revealProgress: 0,
        shadowOpacity: 0.62,
        glowBoost: 0,
      };
    }

    if (progress < 0.62) {
      const local = progress / 0.62;
      const wave = Math.sin(local * Math.PI * 8.5);
      const bounce = Math.abs(Math.sin(local * Math.PI * 4.1));
      const decay = 1 - local * 0.35;
      const pulse = Math.sin(local * Math.PI * 8.5 + Math.PI / 2);

      return {
        offsetX: wave * 0.075 * decay,
        offsetY: bounce * 0.055 - 0.028,
        rotation: wave * 0.17 * decay,
        scaleX: 1 + pulse * 0.028,
        scaleY: 1 - pulse * 0.034,
        lift: 0,
        revealProgress: 0,
        shadowOpacity: 0.72,
        glowBoost: 0.08 + bounce * 0.12,
      };
    }

    if (progress < 0.78) {
      const local = (progress - 0.62) / 0.16;
      const settle = 1 - easeOutCubic(local);

      return {
        offsetX: 0.012 * settle,
        offsetY: -0.01 * easeOutSine(local),
        rotation: 0.025 * settle,
        scaleX: 1 - 0.012 * local,
        scaleY: 1 + 0.012 * local,
        lift: 0,
        revealProgress: 0,
        shadowOpacity: 0.62,
        glowBoost: 0.1,
      };
    }

    const local = (progress - 0.78) / 0.22;
    const lift = easeOutBack(local);

    return {
      offsetX: 0,
      offsetY: -0.03 * easeOutSine(local),
      rotation: 0.02 * local,
      scaleX: 1 - 0.02 * local,
      scaleY: 1 + 0.02 * local,
      lift,
      revealProgress: easeOutCubic(clamp((local - 0.1) / 0.9, 0, 1)),
      shadowOpacity: 0.62 - local * 0.38,
      glowBoost: 0.12 + local * 0.3,
    };
  }
}

module.exports = CupAnimator;
