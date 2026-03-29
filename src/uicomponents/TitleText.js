/**
 * 标题文本组件
 */

const UIComponent = require('./UIComponent');

class TitleText extends UIComponent {
  /**
   * 构造函数
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {string} text - 文本内容
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   * @param {Object} options - 选项
   */
  constructor(ctx, text, x, y, options = {}) {
    super(ctx);
    this.text = text;
    this.setPosition(x, y);
    this.fontSize = options.fontSize || 24;
    this.color = options.color || '#333333';
    this.align = options.align || 'center';
  }

  /**
   * 绘制文本
   */
  draw() {
    if (!this.visible) return;

    const ctx = this.ctx;
    ctx.save();

    ctx.fillStyle = this.color;
    ctx.font = `bold ${this.fontSize}px sans-serif`;
    ctx.textAlign = this.align;
    ctx.textBaseline = 'top';

    const textX = this.align === 'center' ? this.x : (this.align === 'right' ? this.x + this.width : this.x);
    ctx.fillText(this.text, textX, this.y);

    ctx.restore();
  }
}

module.exports = TitleText;
