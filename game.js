const GameApp = require('./src/core/GameApp');

const app = new GameApp();

if (typeof GameGlobal !== 'undefined') {
  GameGlobal.__diceGameApp = app;
}

app.start();
