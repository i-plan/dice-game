const CONFIG = require('./config');

class AudioManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.loaded = false;
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

  play(name) {
    if (!this.enabled) return;
    if (!this.sounds[name]) return;

    try {
      const audio = wx.createInnerAudioContext();
      audio.src = this.sounds[name].src;
      audio.volume = 0.5;
      audio.play();
      audio.onEnded(() => {
        audio.destroy();
      });
      audio.onError(() => {
        audio.destroy();
      });
    } catch (e) {
      // Silent fail for audio
    }
  }

  playShake() {
    this.play('SHAKE');
  }

  playOpen() {
    this.play('OPEN');
  }

  playClick() {
    this.play('CLICK');
  }
}

let instance = null;

function getAudioManager() {
  if (!instance) {
    instance = new AudioManager();
  }
  return instance;
}

module.exports = { getAudioManager };
