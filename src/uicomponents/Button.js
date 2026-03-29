/**
 * 按钮组件
 */

const UIComponent = require('./UIComponent');
const { darkenColor } = require('../utils/colorUtils');

/**
 * 绘制圆角矩形
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {number} x - 左上角 X 坐标
 * @param {number} y - 左上角 Y 坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} radius - 圆角半径
 */
function roundRect(ctx, x, y, width, height, radius) {
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

class Button extends UIComponent {
  /**
   * 构造函数
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {string} text - 按钮文本
   * @param {number} x - 左上角 X 坐标
   * @param {number} y - 左上角 Y 坐标
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {Object} options - 选项
   */
  constructor(ctx, text, x, y, width, height, options = {}) {
    super(ctx);
    this.text = text;
    this.setPosition(x, y);
    this.setSize(width, height);
    this.bgColor = options.bgColor || '#3B82F6';
    this.textColor = options.textColor || '#FFFFFF';
    this.borderRadius = options.borderRadius || 25;
    this.fontSize = options.fontSize || 18;
    this.onTap = options.onTap || null;
    this.enabled = options.enabled !== false;
  }

  /**
   * 绘制按钮
   */
  draw() {
    if (!this.visible) return;

    const ctx = this.ctx;
    ctx.save();

    // 绘制按钮背景
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, this.enabled ? this.bgColor : '#E0E0E0');
    gradient.addColorStop(1, this.enabled ? darkenColor(this.bgColor, 0.1) : '#CCCCCC');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    roundRect(ctx, this.x, this.y, this.width, this.height, this.borderRadius);
    ctx.fill();

    // 添加阴影效果
    if (this.enabled) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
    }

    // 绘制按钮边框
    ctx.strokeStyle = this.enabled ? darkenColor(this.bgColor, 0.2) : '#CCCCCC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    roundRect(ctx, this.x, this.y, this.width, this.height, this.borderRadius);
    ctx.stroke();

    // 为红色按钮添加特殊效果
    if (this.bgColor === '#E11D48') {
      // 添加红色按钮的发光效果
      ctx.shadowColor = 'rgba(225, 29, 72, 0.5)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;
      
      // 绘制按钮边框
      ctx.strokeStyle = '#F87171';
      ctx.lineWidth = 3;
      ctx.beginPath();
      roundRect(ctx, this.x, this.y, this.width, this.height, this.borderRadius);
      ctx.stroke();
    }

    // 绘制按钮文字
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = this.textColor;
    ctx.font = `bold ${this.fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 支持多行文本
    const lines = this.text.split('\n');
    const lineHeight = this.fontSize * 1.2;
    const startY = this.y + this.height / 2 - (lines.length - 1) * lineHeight / 2;
    
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], this.x + this.width / 2, startY + i * lineHeight);
    }

    ctx.restore();
  }

  /**
   * 处理点击事件
   * @param {number} x - 点击的 X 坐标
   * @param {number} y - 点击的 Y 坐标
   * @returns {boolean} 是否处理了点击事件
   */
  handleTap(x, y) {
    if (!this.visible || !this.enabled) return false;
    if (this.contains(x, y)) {
      if (this.onTap) {
        this.onTap();
        return true;
      }
    }
    return false;
  }
}

module.exports = Button;
