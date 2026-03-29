const CONFIG = require('../config');
/**
 * 音频管理器
 * 负责音频的预加载和播放
 */

class AudioManager {
  /**
   * 构造函数
   */
  constructor() {
    this.sounds = {}; // 存储音频对象
    this.enabled = true; // 是否启用音频
    this.loaded = false; // 是否加载完成
  }

 preload() {
    return new Promise((resolve) => {
      try {
        for (const [key, path] of Object.entries(CONFIG.AUDIO)) {
          try {
            const audio = wx.createInnerAudioContext();
            audio.src = path;
            audio.volume = 0.5;
            this.sounds[key] = audio;
          } catch (e) {
            console.warn(`Failed to create audio for ${key}:`, e);
          }
        }
        this.loaded = true;
        resolve();
      } catch (e) {
        console.warn('Audio preload failed:', e);
        resolve();
      }
    });
  }

  /**
   * 播放音频
   * @param {string} name - 音频名称
   */
  play(name) {
    if (!this.enabled) return;
    // 模拟音频播放
  }

  /**
   * 播放摇骰子音效
   */
  playShake() {
    this.play('SHAKE');
  }

  /**
   * 播放打开骰盅音效
   */
  playOpen() {
    this.play('OPEN');
  }

  /**
   * 播放点击音效
   */
  playClick() {
    this.play('CLICK');
  }
}

let instance = null;

/**
 * 获取音频管理器实例
 * @returns {AudioManager} 音频管理器实例
 */
function getAudioManager() {
  if (!instance) {
    instance = new AudioManager();
  }
  return instance;
}

module.exports = { getAudioManager };
