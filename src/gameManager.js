/**
 * 游戏管理器
 * 负责游戏的主要逻辑和状态管理
 */

const CONFIG = require('./config');
const { Player } = require('./core/player');
const { UIManager, Button, TitleText, Cup } = require('./uicomponents/index.js');
const { getAudioManager } = require('./core/audio');

class GameManager {
  /**
   * 构造函数
   * @param {Canvas} canvas - 游戏画布
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.uiManager = new UIManager(ctx);
    this.audioManager = getAudioManager();

    this.dicePerPlayer = CONFIG.DEFAULT_DICE_PER_PLAYER;

    this.screenWidth = canvas.width;
    this.screenHeight = canvas.height;
    this.player = new Player("玩家", this.dicePerPlayer);
    
    // 显示摇骰子界面
    this.showShaking();
  }

  /**
   * 显示摇骰子界面
   */
  showShaking() {
    this.state = CONFIG.STATE.SHAKING;
    this.uiManager.clear();

    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight / 2;
    
    // 绘制顶部标题
    const title = new TitleText(
      this.ctx,
      '喝酒摇骰子',
      centerX, 200,
      { fontSize: 50, color: '#FFFFFF', align: 'center' }
    );
    this.uiManager.add(title);

    // 绘制邀请好友按钮
    const inviteBtn = new Button(this.ctx, '🔄邀请好友', centerX - 45, 300, 90, 40, {
      bgColor: 'rgba(59, 130, 246, 0.3)',
      fontSize: 30,
      textColor: '#FFFFFF',
      borderRadius: 15
    });
    this.uiManager.add(inviteBtn);

    // 绘制骰盅
    const cupWidth = 280;
    const cupHeight = 300;
    const cupX = centerX - cupWidth / 2;
    const cupY = centerY - cupHeight / 2 + 20;

    this.cup = new Cup(this.ctx, cupX, cupY, cupWidth, cupHeight);
    this.uiManager.add(this.cup);

    // 绘制红色圆形摇按钮
    const shakeBtnSize = 200;
    const shakeBtn = new Button(this.ctx, '摇', centerX - shakeBtnSize / 2, this.screenHeight - shakeBtnSize - 20, shakeBtnSize, shakeBtnSize, {
      bgColor: '#E11D48',
      fontSize: 40,
      textColor: '#FFFFFF',
      borderRadius: shakeBtnSize / 2,
      onTap: () => {
        this.handleShakeButtonTap();
      }
    });
    this.uiManager.add(shakeBtn);
  }

  /**
   * 处理摇按钮点击
   */
  handleShakeButtonTap() {
    // 使用 Cup 组件的 shake 方法执行摇一摇动效
    this.cup.shake(
      this.player.diceCount,
      (diceValues) => {
        // 动画完成回调：更新玩家骰子
        this.player.dices = [...diceValues];
      },
      this.audioManager
    );
  }

  /**
   * 绘制背景
   */
  drawBackground() {
    const ctx = this.ctx;

    // 绘制深色背景
    ctx.fillStyle = '#0A1128';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // 绘制装饰
    this.drawDecorations();
  }

  /**
   * 绘制装饰
   */
  drawDecorations() {
    const ctx = this.ctx;
    const screenWidth = this.screenWidth;
    const screenHeight = this.screenHeight;

    // 绘制星星装饰
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * screenWidth;
      const y = Math.random() * screenHeight;
      const size = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制顶部装饰
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    ctx.arc(screenWidth * 0.2, 100, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(147, 197, 253, 0.08)';
    ctx.beginPath();
    ctx.arc(screenWidth * 0.8, 120, 30, 0, Math.PI * 2);
    ctx.fill();

    // 绘制底部装饰
    ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.beginPath();
    ctx.arc(screenWidth * 0.3, screenHeight - 100, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(147, 197, 253, 0.06)';
    ctx.beginPath();
    ctx.arc(screenWidth * 0.7, screenHeight - 120, 25, 0, Math.PI * 2);
    ctx.fill();

    // 绘制渐变光效
    const gradient = ctx.createLinearGradient(0, 0, screenWidth, 0);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.05)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, screenWidth, 50);

    const bottomGradient = ctx.createLinearGradient(0, screenHeight - 50, screenWidth, screenHeight - 50);
    bottomGradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    bottomGradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.05)');
    bottomGradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, screenHeight - 50, screenWidth, 50);
  }

  /**
   * 渲染游戏界面
   */
  render() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    // 绘制背景
    this.drawBackground();
    
    // 更新 Cup 的摇动动画
    if (this.cup && this.cup.isAnimating) {
      this.cup.updateShakeAnimation();
    }
    
    // 绘制 UI 组件
    this.uiManager.draw();
    
    // 绘制摇动动画中的骰子（在骰盅上方）
    if (this.cup && this.cup.isAnimating) {
      const diceY = this.cup.y + this.cup.height * 0.45;
      this.cup.drawShakeAnimation(diceY);
    }
  }

  /**
   * 处理点击事件
   * @param {number} x - 点击的 X 坐标
   * @param {number} y - 点击的 Y 坐标
   * @returns {boolean} 是否处理了点击事件
   */
  handleTap(x, y) {
    return this.uiManager.handleTap(x, y);
  }
}

module.exports = { GameManager };
