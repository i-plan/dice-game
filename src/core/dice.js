/**
 * 骰子相关类
 * 包括 Dice 和 DiceRenderer 类
 */

const CONFIG = require('../config');

class Dice {
  /**
   * 构造函数
   * @param {number} value - 骰子值，默认为 1
   */
  constructor(value = 1) {
    this.value = value; // 骰子值
  }

  /**
   * 设置骰子值
   * @param {number} value - 骰子值
   */
  setValue(value) {
    // 确保骰子值在有效范围内
    this.value = Math.max(CONFIG.DICE_MIN_VALUE, Math.min(CONFIG.DICE_MAX_VALUE, value));
  }

  /**
   * 随机生成骰子值
   * @returns {number} 随机生成的骰子值
   */
  randomValue() {
    this.value = Math.floor(Math.random() * CONFIG.DICE_MAX_VALUE) + CONFIG.DICE_MIN_VALUE;
    return this.value;
  }
}

class DiceRenderer {
  /**
   * 构造函数
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  constructor(ctx) {
    this.ctx = ctx; // 画布上下文
    this.cfg = CONFIG.DICE; // 骰子配置
  }

  /**
   * 绘制骰子
   * @param {number} x - 左上角 X 坐标
   * @param {number} y - 左上角 Y 坐标
   * @param {number} value - 骰子值
   * @param {Object} options - 选项
   */
  drawDice(x, y, value, options = {}) {
    const ctx = this.ctx;
    const {
      width = this.cfg.WIDTH,
      height = this.cfg.HEIGHT,
      rotation = 0,
      scale = 1,
      shadow = true
    } = options;

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.scale(scale, scale);

    if (shadow) {
      ctx.shadowColor = this.cfg.SHADOW_COLOR;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 8;
    }

    // 绘制骰子主体
    ctx.fillStyle = this.cfg.FACE_COLOR;
    this.roundRect(-width / 2, -height / 2, width, height, this.cfg.CORNER_RADIUS);
    ctx.fill();

    // 添加高光效果
    const gradient = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    this.roundRect(-width / 2, -height / 2, width, height, this.cfg.CORNER_RADIUS);
    ctx.fill();

    // 绘制边框
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = this.cfg.BORDER_COLOR;
    ctx.lineWidth = 3;
    this.roundRect(-width / 2, -height / 2, width, height, this.cfg.CORNER_RADIUS);
    ctx.stroke();

    // 绘制骰子点数
    ctx.fillStyle = this.cfg.DOT_COLOR;
    this.drawDots(value, width, height);

    ctx.restore();
  }

  /**
   * 绘制骰子点数
   * @param {number} value - 骰子值
   * @param {number} width - 骰子宽度
   * @param {number} height - 骰子高度
   */
  drawDots(value, width, height) {
    const dotRadius = this.cfg.DOT_RADIUS;
    const positions = this.getDotPositions(value, width, height);
    for (const pos of positions) {
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, dotRadius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * 获取骰子点数的位置
   * @param {number} value - 骰子值
   * @param {number} width - 骰子宽度
   * @param {number} height - 骰子高度
   * @returns {Array} 点数位置数组
   */
  getDotPositions(value, width, height) {
    const margin = width * 0.2;
    const centerX = 0;
    const centerY = 0;

    const layouts = {
      1: [[centerX, centerY]],
      2: [[-margin, -margin], [margin, margin]],
      3: [[-margin, -margin], [centerX, centerY], [margin, margin]],
      4: [[-margin, -margin], [margin, -margin], [-margin, margin], [margin, margin]],
      5: [[-margin, -margin], [margin, -margin], [centerX, centerY], [-margin, margin], [margin, margin]],
      6: [[-margin, -margin], [margin, -margin], [-margin, centerY], [margin, centerY], [-margin, margin], [margin, margin]]
    };

    return layouts[value] || [];
  }

  /**
   * 绘制圆角矩形
   * @param {number} x - 左上角 X 坐标
   * @param {number} y - 左上角 Y 坐标
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {number} radius - 圆角半径
   */
  roundRect(x, y, width, height, radius) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

module.exports = { Dice, DiceRenderer };
