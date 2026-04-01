const Layout = require('../core/Layout');
const GameState = require('../state/GameState');
const TopShortcutBar = require('../components/TopShortcutBar');
const CupView = require('../components/CupView');
const TrayView = require('../components/TrayView');
const DiceRenderer = require('../components/DiceRenderer');
const BottomControls = require('../components/BottomControls');
const CupAnimator = require('../animation/CupAnimator');
const DiceSet = require('../models/DiceSet');

class MainScene {
  constructor(options) {
    this.inputManager = options.inputManager;
    this.audioManager = options.audioManager;
    this.layoutEngine = new Layout(options.metrics);
    this.layout = this.layoutEngine.layout;
    this.diceRenderer = new DiceRenderer();
    this.topShortcutBar = new TopShortcutBar();
    this.cupView = new CupView();
    this.trayView = new TrayView(this.diceRenderer);
    this.bottomControls = new BottomControls();
    this.cupAnimator = new CupAnimator();
    this.animationState = this.cupAnimator.getState();
    this.ambientTime = 0;
    this.stars = this.createStars(this.layout.width, this.layout.height);

    this.state = new GameState(DiceSet.create(this.layout.tray));

    this.inputManager.setCallbacks({
      onPressChange: (id) => {
        if (!this.state.inputLocked) {
          this.state.setPressed(id);
        }
      },
      onTap: (id) => {
        this.handleTap(id);
      },
    });

    this.syncInteractiveRegions();
  }

  onResize(metrics) {
    this.layout = this.layoutEngine.update(metrics);
    this.stars = this.createStars(this.layout.width, this.layout.height);
    this.state.dice = this.remapDice(this.state.dice);

    if (this.state.pendingDice) {
      this.state.pendingDice = this.remapDice(this.state.pendingDice);
    }

    this.syncInteractiveRegions();
  }

  onPause() {
    this.state.clearPressed();

    if (this.inputManager && typeof this.inputManager.resetActive === 'function') {
      this.inputManager.resetActive();
    }
  }

  update(deltaTime) {
    this.ambientTime += deltaTime * 0.001;

    if (this.state.phase === 'shaking') {
      this.animationState = this.cupAnimator.update(deltaTime);

      if (!this.cupAnimator.isRunning()) {
        this.state.finishReveal();
        this.inputManager.setLocked(false);
        this.animationState = this.cupAnimator.getRevealPose();
      }

      return;
    }

    this.animationState = this.state.phase === 'revealed'
      ? this.cupAnimator.getRevealPose()
      : this.cupAnimator.getState();
  }

  render(ctx) {
    this.drawBackground(ctx);
    this.drawTitle(ctx);
    this.topShortcutBar.draw(ctx, this.layout.shortcuts, {
      pressedId: this.state.pressedId,
    });

    this.trayView.draw(ctx, this.layout.tray, {
      dice: this.getVisibleDice(),
      diceAlpha: this.getDiceAlpha(),
      dim: this.state.phase === 'shaking' ? 1 - this.animationState.revealProgress : 0,
    });

    this.cupView.draw(ctx, this.layout.cup, this.animationState);

    this.bottomControls.draw(ctx, this.layout.bottomControls, {
      pressedId: this.state.pressedId,
      disabled: this.state.phase === 'shaking',
    });
  }

  handleTap(id) {
    if (id === 'action-shake') {
      if (!this.state.canShake()) {
        return;
      }

      const nextDice = DiceSet.create(this.layout.tray);
      const started = this.state.startShake(nextDice);
      if (!started) {
        return;
      }

      this.audioManager.playTap();
      this.audioManager.playShake();
      this.cupAnimator.start();
      this.animationState = this.cupAnimator.getState();
      this.inputManager.setLocked(true);
      return;
    }

    this.audioManager.playTap();
    this.showPlaceholderToast();
  }

  getVisibleDice() {
    if (this.state.phase === 'shaking') {
      return this.animationState.revealProgress > 0 ? this.state.pendingDice || [] : [];
    }

    return this.state.dice;
  }

  getDiceAlpha() {
    if (this.state.phase === 'shaking') {
      return this.animationState.revealProgress;
    }

    return 1;
  }

  syncInteractiveRegions() {
    this.inputManager.setRegions(this.layout.hitRegions);
    this.inputManager.setLocked(this.state.inputLocked);
  }

  remapDice(sourceDice) {
    if (!sourceDice || !sourceDice.length) {
      return [];
    }

    const nextLayout = DiceSet.create(this.layout.tray);

    return nextLayout.map((die, index) => ({
      ...die,
      value: sourceDice[index] ? sourceDice[index].value : die.value,
      accent: sourceDice[index] ? sourceDice[index].accent : die.accent,
    }));
  }

  showPlaceholderToast() {
    if (typeof wx !== 'undefined' && typeof wx.showToast === 'function') {
      wx.showToast({
        title: '开发中',
        icon: 'none',
      });
    }
  }

  drawBackground(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.layout.height);
    gradient.addColorStop(0, '#031024');
    gradient.addColorStop(0.45, '#081a3b');
    gradient.addColorStop(1, '#030913');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.layout.width, this.layout.height);

    this.drawGlow(ctx, this.layout.width * 0.5, this.layout.height * 0.22, this.layout.width * 0.52, 'rgba(65, 120, 255, 0.18)');
    this.drawGlow(ctx, this.layout.width * 0.5, this.layout.height * 0.56, this.layout.width * 0.44, 'rgba(47, 214, 255, 0.12)');
    this.drawGlow(ctx, this.layout.width * 0.25, this.layout.height * 0.72, this.layout.width * 0.24, 'rgba(255, 91, 129, 0.08)');

    ctx.save();
    this.stars.forEach((star) => {
      const twinkle = 0.65 + 0.35 * Math.sin(this.ambientTime * 1.6 + star.phase);
      ctx.globalAlpha = star.alpha * twinkle;
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawGlow(ctx, x, y, radius, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawTitle(ctx) {
    const title = this.layout.title;
    const gradient = ctx.createLinearGradient(title.x, title.y - title.fontSize, title.x, title.y + title.fontSize);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#d6e6ff');

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(114, 212, 255, 0.32)';
    ctx.shadowBlur = 18;
    ctx.font = `700 ${title.fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title.text, title.x, title.y);
    ctx.restore();
  }

  createStars(width, height) {
    const stars = [];

    for (let index = 0; index < 18; index += 1) {
      const x = width * (0.08 + ((index * 37) % 100) / 100 * 0.84);
      const y = height * (0.05 + ((index * 19) % 100) / 100 * 0.58);

      stars.push({
        x,
        y,
        size: 0.9 + (index % 4) * 0.45,
        alpha: 0.2 + (index % 5) * 0.06,
        phase: index * 0.65,
        color: index % 3 === 0 ? '#ffffff' : '#9adfff',
      });
    }

    return stars;
  }
}

module.exports = MainScene;
