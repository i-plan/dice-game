const SOUND_SOURCES = {
  // tap: 'assets/audio/click.mp3',
  shake: 'assets/audio/shake.mp3',
};

class AudioManager {
  constructor() {
    this.enabled = typeof wx !== 'undefined' && typeof wx.createInnerAudioContext === 'function';
    this.volume = 0.5;
    this.activeContexts = [];
  }

  playTap() {
    this.play('tap');
  }

  playShake() {
    this.play('shake');
  }

  play(name) {
    if (!this.enabled) {
      return;
    }

    const src = SOUND_SOURCES[name];
    if (!src) {
      return;
    }

    let audio = null;

    try {
      audio = wx.createInnerAudioContext();
      audio.src = src;
      audio.volume = this.volume;
      this.activeContexts.push(audio);

      const cleanup = () => {
        this.activeContexts = this.activeContexts.filter((context) => context !== audio);

        if (!audio) {
          return;
        }

        try {
          audio.destroy();
        } catch (error) {
        }

        audio = null;
      };

      audio.onEnded(cleanup);
      audio.onError(cleanup);
      audio.play();
    } catch (error) {
      if (audio) {
        try {
          audio.destroy();
        } catch (destroyError) {
        }
      }
    }
  }

  destroy() {
    this.activeContexts.forEach((audio) => {
      try {
        audio.stop();
        audio.destroy();
      } catch (error) {
      }
    });

    this.activeContexts = [];
  }
}

module.exports = AudioManager;
