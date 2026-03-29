const CONFIG = require('./config');

class Player {
  constructor(id, name, diceCount) {
    this.id = id;
    this.name = name;
    this.diceCount = diceCount;
    this.dices = [];
  }

  rollDices() {
    this.dices = [];
    for (let i = 0; i < this.diceCount; i++) {
      this.dices.push(
        Math.floor(Math.random() * CONFIG.DICE_MAX_VALUE) + CONFIG.DICE_MIN_VALUE
      );
    }
    return this.dices;
  }

  getDices() {
    return [...this.dices];
  }
}

class PlayerManager {
  constructor() {
    this.players = [];
    this.currentPlayerIndex = 0;
  }

  initPlayers(count, dicePerPlayer) {
    this.players = [];
    const names = ['玩家1', '玩家2', '玩家3', '玩家4', '玩家5', '玩家6', '玩家7', '玩家8'];
    for (let i = 0; i < count; i++) {
      this.players.push(new Player(i, names[i], dicePerPlayer));
    }
    this.currentPlayerIndex = Math.floor(Math.random() * count);
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getAllPlayers() {
    return [...this.players];
  }
}

module.exports = { Player, PlayerManager };
