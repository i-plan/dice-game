const CONFIG = {
  DEFAULT_PLAYER_COUNT: 1,
  DEFAULT_DICE_PER_PLAYER: 5,
  DICE_MIN_VALUE: 1,
  DICE_MAX_VALUE: 6,
  STATE: {
    SHAKING: 'shaking'
  },
  DICE: {
    WIDTH: 80,
    HEIGHT: 80,
    CORNER_RADIUS: 15,
    DOT_RADIUS: 8,
    FACE_COLOR: '#FFF8E7',
    DOT_COLOR: '#2D2D2D',
    SHADOW_COLOR: '#00000033',
    BORDER_COLOR: '#333333'
  },
  AUDIO: {
    SHAKE: 'assets/audio/shake.mp3',
    OPEN: 'assets/audio/open.mp3',
    CLICK: 'assets/audio/click.mp3'
  }
};

module.exports = CONFIG;
