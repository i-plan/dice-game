const { GameManager } = require('./src/gameManager');
const { getAudioManager } = require('./src/uicomponents/Cup/audio');
function init() {
  const systemInfo = wx.getSystemInfoSync();
  const canvas = wx.createCanvas();
  canvas.width = 750;
  canvas.height = systemInfo.screenHeight * (750 / systemInfo.screenWidth);
  const ctx = canvas.getContext('2d');
  const gameManager = new GameManager(canvas, ctx);
  const audioManager = getAudioManager();
  audioManager.preload();
  const gameLoop = () => {
    if (gameManager) {
      gameManager.render();
    }
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
  wx.onTouchStart((e) => {
    if (!gameManager || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const scale = 750 / systemInfo.screenWidth;
    const x = touch.clientX * scale;
    const y = touch.clientY * scale;
    gameManager.handleTap(x, y);
  });
}
init();
