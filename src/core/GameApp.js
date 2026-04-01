const Renderer = require('./Renderer');
const InputManager = require('./InputManager');
const AudioManager = require('../audio/AudioManager');
const MainScene = require('../scenes/MainScene');

class GameApp {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.renderer = null;
    this.inputManager = null;
    this.audioManager = null;
    this.scene = null;
    this.isRunning = false;
    this.isInitialized = false;
    this.lastTimestamp = 0;
    this.frameId = null;

    this.tick = this.tick.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  start() {
    if (!this.isInitialized) {
      this.init();
    }

    this.resume();
  }

  init() {
    if (typeof wx !== 'undefined' && typeof wx.setPreferredFramesPerSecond === 'function') {
      wx.setPreferredFramesPerSecond(60);
    }

    this.canvas = this.createCanvas();
    this.context = this.canvas.getContext('2d');

    const metrics = this.getViewportMetrics();
    this.renderer = new Renderer(this.canvas, this.context, metrics);
    this.inputManager = new InputManager();
    this.audioManager = new AudioManager();
    this.scene = new MainScene({
      metrics,
      inputManager: this.inputManager,
      audioManager: this.audioManager,
    });

    this.bindLifecycle();
    this.isInitialized = true;
  }

  bindLifecycle() {
    if (typeof wx === 'undefined') {
      return;
    }

    if (typeof wx.onShow === 'function') {
      wx.onShow(this.handleShow);
    }

    if (typeof wx.onHide === 'function') {
      wx.onHide(this.handleHide);
    }

    if (typeof wx.onWindowResize === 'function') {
      wx.onWindowResize(this.handleResize);
    }
  }

  handleShow() {
    this.resume();
  }

  handleHide() {
    if (this.scene) {
      this.scene.onPause();
    }

    this.pause();
  }

  handleResize() {
    if (!this.renderer || !this.scene) {
      return;
    }

    const metrics = this.getViewportMetrics();
    this.renderer.resize(metrics);
    this.scene.onResize(metrics);
  }

  resume() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastTimestamp = 0;
    this.scheduleNextFrame();
  }

  pause() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.lastTimestamp = 0;

    if (this.frameId !== null) {
      this.cancelFrame(this.frameId);
      this.frameId = null;
    }
  }

  tick(timestamp) {
    if (!this.isRunning || !this.renderer || !this.scene) {
      return;
    }

    const now = typeof timestamp === 'number' ? timestamp : Date.now();
    const deltaTime = this.lastTimestamp ? Math.min(32, now - this.lastTimestamp) : 16.67;
    this.lastTimestamp = now;

    this.scene.update(deltaTime);
    this.renderer.render((ctx) => {
      this.scene.render(ctx);
    });

    this.scheduleNextFrame();
  }

  scheduleNextFrame() {
    this.frameId = this.requestFrame(this.tick);
  }

  requestFrame(callback) {
    if (this.canvas && typeof this.canvas.requestAnimationFrame === 'function') {
      return this.canvas.requestAnimationFrame(callback);
    }

    if (typeof requestAnimationFrame === 'function') {
      return requestAnimationFrame(callback);
    }

    return setTimeout(() => callback(Date.now()), 16);
  }

  cancelFrame(frameId) {
    if (this.canvas && typeof this.canvas.cancelAnimationFrame === 'function') {
      this.canvas.cancelAnimationFrame(frameId);
      return;
    }

    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(frameId);
      return;
    }

    clearTimeout(frameId);
  }

  createCanvas() {
    if (typeof wx !== 'undefined' && typeof wx.createCanvas === 'function') {
      return wx.createCanvas();
    }

    if (typeof canvas !== 'undefined') {
      return canvas;
    }

    throw new Error('Canvas is not available in the current environment.');
  }

  getViewportMetrics() {
    const systemInfo = typeof wx !== 'undefined' && typeof wx.getWindowInfo === 'function'
      ? wx.getWindowInfo()
      : wx.getSystemInfoSync();
    const safeArea = systemInfo.safeArea || {
      left: 0,
      right: systemInfo.windowWidth || systemInfo.screenWidth,
      top: 0,
      bottom: systemInfo.windowHeight || systemInfo.screenHeight,
    };
    let menuButton = null;

    if (typeof wx !== 'undefined' && typeof wx.getMenuButtonBoundingClientRect === 'function') {
      try {
        menuButton = wx.getMenuButtonBoundingClientRect();
      } catch (error) {
        menuButton = null;
      }
    }

    return {
      width: systemInfo.windowWidth || systemInfo.screenWidth,
      height: systemInfo.windowHeight || systemInfo.screenHeight,
      dpr: systemInfo.pixelRatio || 1,
      safeArea,
      statusBarHeight: systemInfo.statusBarHeight || 0,
      menuButton,
    };
  }
}

module.exports = GameApp;
