const CONFIG = require('./config');

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

class UIComponent {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.visible = true;
  }

  contains(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }
}

class Button extends UIComponent {
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

  draw() {
    if (!this.visible) return;

    const ctx = this.ctx;
    ctx.save();

    // 绘制按钮背景
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, this.enabled ? this.bgColor : '#E0E0E0');
    gradient.addColorStop(1, this.enabled ? this.darkenColor(this.bgColor, 0.1) : '#CCCCCC');
    
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
    ctx.strokeStyle = this.enabled ? this.darkenColor(this.bgColor, 0.2) : '#CCCCCC';
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

  darkenColor(color, amount) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
  }

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

class TitleText extends UIComponent {
  constructor(ctx, text, x, y, options = {}) {
    super(ctx);
    this.text = text;
    this.setPosition(x, y);
    this.fontSize = options.fontSize || 24;
    this.color = options.color || '#333333';
    this.align = options.align || 'center';
  }

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

class Cup extends UIComponent {
  constructor(ctx, x, y, width, height, options = {}) {
    super(ctx);
    this.setPosition(x, y);
    this.setSize(width, height);
    this.isOpen = options.isOpen || false;
    this.isShaking = false;
    this.shakeProgress = 0;
    this.onShake = options.onShake || null;
    this.dices = [];
  }

  setDices(dices) {
    this.dices = dices;
  }

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

          // 绘制骰子
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          roundRect(ctx, diceX, diceY, diceWidth, diceWidth, 5);
          ctx.fill();

          // 绘制骰子边框
          ctx.strokeStyle = '#E5E7EB';
          ctx.lineWidth = 2;
          ctx.beginPath();
          roundRect(ctx, diceX, diceY, diceWidth, diceWidth, 5);
          ctx.stroke();

          // 绘制骰子点数
          const dotRadius = 5;
          // 根据骰子索引设置不同的点数颜色
          let dotColor;
          if (i === 0 || i === 1 || i === 3) {
            dotColor = '#3B82F6'; // 蓝色
          } else if (i === 2 || i === 4) {
            dotColor = '#EF4444'; // 红色
          } else {
            dotColor = '#3B82F6'; // 默认蓝色
          }

          ctx.fillStyle = dotColor;
          const value = this.dices[i];

          if (value === 1) {
            // 1点
            ctx.beginPath();
            ctx.arc(diceX + diceWidth / 2, diceY + diceWidth / 2, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else if (value === 2) {
            // 2点
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.3, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.7, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else if (value === 3) {
            // 3点
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.3, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth / 2, diceY + diceWidth / 2, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.7, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else if (value === 4) {
            // 4点
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.3, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.3, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.7, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.7, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else if (value === 5) {
            // 5点
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.3, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.3, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth / 2, diceY + diceWidth / 2, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.7, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.7, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          } else if (value === 6) {
            // 6点
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.25, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.25, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.5, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.5, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.3, diceY + diceWidth * 0.75, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(diceX + diceWidth * 0.7, diceY + diceWidth * 0.75, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    ctx.restore();
  }

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

  setShaking(shaking) {
    this.isShaking = shaking;
    if (!shaking) {
      this.shakeProgress = 0;
    }
  }

  setOpen(open) {
    this.isOpen = open;
  }
}

class UIManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.components = [];
  }

  add(component) {
    this.components.push(component);
  }

  remove(component) {
    const index = this.components.indexOf(component);
    if (index > -1) {
      this.components.splice(index, 1);
    }
  }

  clear() {
    this.components = [];
  }

  draw() {
    for (const comp of this.components) {
      comp.draw();
    }
  }

  handleTap(x, y) {
    for (const comp of this.components) {
      if (comp.handleTap && comp.handleTap(x, y)) {
        return true;
      }
    }
    return false;
  }
}

module.exports = {
  UIComponent,
  Button,
  TitleText,
  Cup,
  UIManager
};
