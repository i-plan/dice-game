const { GameManager } = require('./js/gameManager');
const { getAudioManager } = require('./js/audio');

let gameManager = null;
let canvas = null;
let ctx = null;
let systemInfo = null;

function init() {
  canvas = wx.createCanvas();
  ctx = canvas.getContext('2d');

  systemInfo = wx.getSystemInfoSync();
  canvas.width = 750;
  canvas.height = systemInfo.screenHeight * (750 / systemInfo.screenWidth);

  gameManager = new GameManager(canvas, ctx);

  const audioManager = getAudioManager();
  audioManager.preload();

  requestAnimationFrame(gameLoop);
  wx.onTouchStart(handleTouch);

  console.log('Liar Dice Game Initialized');
}

function gameLoop() {
  if (gameManager) {
    gameManager.render();
  }
  requestAnimationFrame(gameLoop);
}

function handleTouch(e) {
  if (!gameManager || !e.touches || e.touches.length === 0) return;

  const touch = e.touches[0];
  const scale = 750 / systemInfo.screenWidth;
  const x = touch.clientX * scale;
  const y = touch.clientY * scale;
  gameManager.handleTap(x, y);
}

init();
