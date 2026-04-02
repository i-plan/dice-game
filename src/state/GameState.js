const { clamp } = require('../utils/easing');

class GameState {
  constructor(initialDice) {
    this.phase = 'idle';
    this.pressedId = null;
    this.dice = initialDice || [];
    this.pendingDice = null;
    this.cupLift = 0;
    this.inputLocked = false;
  }

  setPressed(id) {
    this.pressedId = id;
  }

  clearPressed() {
    this.pressedId = null;
  }

  setCupLift(lift) {
    this.cupLift = clamp(lift, 0, 1);
  }

  canShake() {
    return !this.inputLocked && this.phase !== 'shaking';
  }

  startShake(nextDice) {
    if (!this.canShake()) {
      return false;
    }

    this.phase = 'shaking';
    this.inputLocked = true;
    this.pendingDice = nextDice;
    this.cupLift = 0;
    this.pressedId = null;

    return true;
  }

  finishShake() {
    if (this.pendingDice) {
      this.dice = this.pendingDice;
      this.pendingDice = null;
    }

    this.phase = 'idle';
    this.inputLocked = false;
  }
}

module.exports = GameState;
