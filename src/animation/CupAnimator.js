const {
  clamp,
  easeOutCubic,
  easeOutSine,
} = require('../utils/easing');

class CupAnimator {
  constructor() {
    this.duration = 1320;
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
      this.elapsed = 0;
    }

    return this.getState();
  }

  isRunning() {
    return this.running;
  }

  getState() {
    if (!this.running) {
      return {
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        shadowOpacity: 0.62,
        glowBoost: 0,
      };
    }

    const progress = clamp(this.elapsed / this.duration, 0, 1);
    const settle = 1 - easeOutCubic(progress);
    const swayDecay = 0.18 + (1 - easeOutSine(progress)) * 0.82;
    const primaryWave = Math.sin(progress * Math.PI * 8.2);
    const secondaryWave = Math.sin(progress * Math.PI * 16.4 + Math.PI / 5);
    const sway = (primaryWave * 0.82 + secondaryWave * 0.18) * swayDecay;
    const lean = easeOutSine(clamp(Math.abs(sway) * 1.08, 0, 1));
    const squash = lean * (0.72 + settle * 0.44);

    return {
      offsetX: sway * 0.068,
      offsetY: -lean * 0.024,
      rotation: sway * 0.24,
      scaleX: 1 + squash * 0.028,
      scaleY: 1 - squash * 0.042,
      shadowOpacity: 0.56 + lean * 0.12,
      glowBoost: 0.1 + lean * 0.28,
    };
  }
}

module.exports = CupAnimator;
