const { clamp } = require('../utils/easing');

const SLOT_LAYOUT = [
  { x: -1.18, y: -0.56, rotation: -0.12 },
  { x: 0, y: -0.62, rotation: 0.04 },
  { x: 1.18, y: -0.56, rotation: 0.14 },
  { x: -0.62, y: 0.56, rotation: -0.08 },
  { x: 0.62, y: 0.56, rotation: 0.1 },
];

class DiceSet {
  static create(tray) {
    const baseSize = tray.diceSize || tray.height * 0.36;
    const maxSizeByWidth = tray.innerWidth / 6.1;
    const maxSizeByHeight = tray.innerHeight / 2.25;
    const size = clamp(Math.min(baseSize, maxSizeByWidth, maxSizeByHeight), 40, 54);

    return SLOT_LAYOUT.map((slot, index) => ({
      id: `die-${index}`,
      value: 1 + Math.floor(Math.random() * 6),
      accent: Math.random() > 0.5 ? 'blue' : 'red',
      x: tray.x + slot.x * size,
      y: tray.y + slot.y * size,
      size,
      rotation: slot.rotation + (Math.random() - 0.5) * 0.06,
    }));
  }
}

module.exports = DiceSet;
