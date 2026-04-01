class GameState {
  constructor(initialDice) {
    this.phase = 'idle';
    this.pressedId = null;
    this.dice = initialDice || [];
    this.pendingDice = null;
    this.inputLocked = false;
  }

  setPressed(id) {
    this.pressedId = id;
  }

  clearPressed() {
    this.pressedId = null;
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
    this.pressedId = null;

    return true;
  }

  finishReveal() {
    if (this.pendingDice) {
      this.dice = this.pendingDice;
      this.pendingDice = null;
    }

    this.phase = 'revealed';
    this.inputLocked = false;
  }
}

module.exports = GameState;
