/**
 * 骰盅组件
 */

const UIComponent = require('./UIComponent');
const { DiceRenderer, Dice } = require('../core/dice');
const CONFIG = require('../config');

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

class Cup extends UIComponent {
  /**
   * 构造函数
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} x - 左上角 X 坐标
   * @param {number} y - 左上角 Y 坐标
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {Object} options - 选项
   */
  constructor(ctx, x, y, width, height, options = {}) {
    super(ctx);
    this.setPosition(x, y);
    this.setSize(width, height);
    this.isOpen = options.isOpen || false;
    this.isShaking = false;
    this.shakeProgress = 0;
    this.onShake = options.onShake || null;
    this.dices = [];
    this.diceRenderer = new DiceRenderer(ctx);
    
    // 摇动动画相关
    this.isAnimating = false;
    this.animationFrame = 0;
    this.animationDices = [];
    this.onAnimationComplete = null;
  }

  /**
   * 设置骰子
   * @param {Array} dices - 骰子值数组
   */
  setDices(dices) {
    this.dices = dices;
  }

  /**
   * 执行摇一摇动效
   * @param {number} diceCount - 骰子数量
   * @param {function} onComplete - 动画完成回调
   * @param {Object} audioManager - 音频管理器（可选）
   */
  shake(diceCount, onComplete, audioManager) {
    // 关闭骰盅
    this.setOpen(false);
    // 开始摇动动画
    this.setShaking(true);
    
    // 播放音效
    if (audioManager) {
      audioManager.playShake();
    }
    
    // 初始化动画骰子
    this.animationDices = [];
    for (let i = 0; i < diceCount; i++) {
      this.animationDices.push(new Dice());
    }
    
    this.isAnimating = true;
    this.animationFrame = 0;
    this.onAnimationComplete = onComplete;
  }

  /**
   * 更新摇动动画
   * @returns {boolean} 动画是否结束
   */
  updateShakeAnimation() {
    if (!this.isAnimating) return true;
    
    this.animationFrame++;
    const totalFrames = 60;
    
    // 随机骰子值
    if (this.animationFrame < totalFrames) {
      for (let dice of this.animationDices) {
        dice.randomValue();
      }
    }
    
    // 动画结束
    if (this.animationFrame >= totalFrames) {
      this.isAnimating = false;
      this.setShaking(false);
      this.setOpen(true);
      
      // 设置最终骰子值
      const diceValues = this.animationDices.map(dice => dice.value);
      this.setDices(diceValues);
      
      // 调用完成回调
      if (this.onAnimationComplete) {
        this.onAnimationComplete(diceValues);
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * 绘制摇动动画中的骰子
   * @param {number} diceY - 骰子的 Y 坐标
   */
  drawShakeAnimation(diceY) {
    if (!this.isAnimating || this.animationDices.length === 0) return;
    
    const spacing = 15;
    const diceWidth = 50;
    const totalWidth = this.animationDices.length * diceWidth + (this.animationDices.length - 1) * spacing;
    const startX = this.x + (this.width - totalWidth) / 2;
    
    for (let i = 0; i < this.animationDices.length; i++) {
      const x = startX + i * (diceWidth + spacing);
      const y = diceY + Math.sin(this.animationFrame * 0.3 + i) * 15;
      const rotation = this.animationFrame * 12 + i * 45;
      const diceScale = 1 + Math.sin(this.animationFrame * 0.1 + i) * 0.1;
      
      this.diceRenderer.drawDice(x, y, this.animationDices[i].value, { 
        rotation, 
        scale: diceScale, 
        width: diceWidth, 
        height: diceWidth 
      });
    }
  }

  /**
   * 绘制骰盅
   */
  draw() {
    if (!this.visible) return;

    const ctx = this.ctx;
    const { x, y, width, height } = this;

    ctx.save();

    // 绘制底部蓝色圆形底座
    const baseRadius = width * 0.6;
    const baseY = y + height - 10;
    
    // 绘制底座阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(x + width / 2, baseY + 5, baseRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制底座渐变
    const baseGradient = ctx.createLinearGradient(x, baseY, x, baseY + 20);
    baseGradient.addColorStop(0, '#3B82F6');
    baseGradient.addColorStop(1, '#1E3A8A');
    ctx.fillStyle = baseGradient;
    ctx.beginPath();
    ctx.arc(x + width / 2, baseY, baseRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制底座边缘
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + width / 2, baseY, baseRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 绘制骰盅主体
    if (!this.isOpen) {
      // 关闭状态
      // 绘制主体渐变
      const gradient = ctx.createLinearGradient(x, y, x, y + height - 20);
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(1, '#1E3A8A');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      roundRect(ctx, x, y, width, height - 20, 15);
      ctx.fill();

      // 绘制中间的椭圆窗口
      ctx.fillStyle = '#0A1128';
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height * 0.5, width * 0.4, height * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // 绘制骰盅顶部装饰
      ctx.fillStyle = '#60A5FA';
      ctx.beginPath();
      roundRect(ctx, x - 5, y - 10, width + 10, 15, 5);
      ctx.fill();

      // 绘制骰盅顶部边缘
      ctx.strokeStyle = '#93C5FD';
      ctx.lineWidth = 2;
      ctx.beginPath();
      roundRect(ctx, x, y, width, height - 20, 15);
      ctx.stroke();

      // 如果正在摇动，添加摇动效果
      if (this.isShaking) {
        const shakeOffset = Math.sin(this.shakeProgress * 10) * 5;
        ctx.translate(shakeOffset, 0);

        // 绘制摇动时的模糊效果
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.beginPath();
        roundRect(ctx, x, y, width, height - 20, 15);
        ctx.fill();
        ctx.globalAlpha = 1;

        this.shakeProgress += 0.1;
        if (this.shakeProgress > Math.PI * 2) {
          this.shakeProgress = 0;
        }
      }
    } else {
      // 打开状态 - 绘制打开的骰盅
      ctx.fillStyle = '#1E3A8A';
      ctx.beginPath();
      roundRect(ctx, x, y + height * 0.3, width, height * 0.4, 15);
      ctx.fill();

      // 绘制打开的盖子
      ctx.save();
      ctx.translate(x + width / 2, y + height * 0.3);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#60A5FA';
      ctx.beginPath();
      roundRect(ctx, -width / 2, -height * 0.2, width, height * 0.2, 5);
      ctx.fill();
      ctx.restore();

      // 绘制骰子
      if (this.dices.length > 0) {
        const diceWidth = 50;
        const spacing = 10;
        const totalWidth = this.dices.length * diceWidth + (this.dices.length - 1) * spacing;
        const startX = x + (width - totalWidth) / 2;
        const startY = y + height * 0.45;

        for (let i = 0; i < this.dices.length; i++) {
          const diceX = startX + i * (diceWidth + spacing);
          const diceY = startY;
          const value = this.dices[i];
          // 根据骰子索引设置不同的点数颜色
          let dotColor;
          if (i === 0 || i === 1 || i === 3) {
            dotColor = '#3B82F6'; // 蓝色
          } else if (i === 2 || i === 4) {
            dotColor = '#EF4444'; // 红色
          } else {
            dotColor = '#3B82F6'; // 默认蓝色
          }
          this.drawDice(ctx, diceX, diceY, diceWidth, value, dotColor);
        }
      }
    }

    ctx.restore();
  }

  /**
   * 绘制骰子
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} x - 左上角 X 坐标
   * @param {number} y - 左上角 Y 坐标
   * @param {number} size - 大小
   * @param {number} value - 骰子值
   * @param {string} dotColor - 点数颜色
   */
  drawDice(ctx, x, y, size, value, dotColor) {
    // 使用 DiceRenderer 绘制骰子
    this.diceRenderer.drawDice(x, y, value, { 
      width: size, 
      height: size, 
      shadow: true 
    });
  }

  /**
   * 处理点击事件
   * @param {number} x - 点击的 X 坐标
   * @param {number} y - 点击的 Y 坐标
   * @returns {boolean} 是否处理了点击事件
   */
  handleTap(x, y) {
    if (!this.visible) return false;
    if (this.contains(x, y)) {
      if (!this.isOpen && this.onShake) {
        this.isShaking = true;
        this.onShake();
        return true;
      }
    }
    return false;
  }

  /**
   * 设置摇动状态
   * @param {boolean} shaking - 是否摇动
   */
  setShaking(shaking) {
    this.isShaking = shaking;
    if (!shaking) {
      this.shakeProgress = 0;
    }
  }

  /**
   * 设置打开状态
   * @param {boolean} open - 是否打开
   */
  setOpen(open) {
    this.isOpen = open;
  }
}

module.exports = Cup;
