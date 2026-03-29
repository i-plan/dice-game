/**
 * 游戏管理器
 * 负责游戏的主要逻辑和状态管理
 */

const CONFIG = require('./config');
const { Player } = require('./core/player');
const { Dice, DiceRenderer } = require('./core/dice');
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
    this.player = new Player("玩家",this.dicePerPlayer);
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
    const inviteBtn = new Button(this.ctx, '🔄邀请好友', centerX-45, 300, 90, 40, {
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

    const cup = new Cup(this.ctx, cupX, cupY, cupWidth, cupHeight);
    this.uiManager.add(cup);

    // 绘制红色圆形摇按钮
    const shakeBtnSize = 200;
    const shakeBtn = new Button(this.ctx, '摇', centerX - shakeBtnSize / 2, this.screenHeight - shakeBtnSize - 20, shakeBtnSize, shakeBtnSize, {
      bgColor: '#E11D48',
      fontSize: 40,
      textColor: '#FFFFFF',
      borderRadius: shakeBtnSize / 2,
      onTap: () => {
        this.handleShakeButtonTap(cup, cupY);
      }
    });
    this.uiManager.add(shakeBtn);
  }

  /**
   * 处理摇按钮点击
   * @param {Cup} cup - 骰盅对象
   * @param {number} cupY - 骰盅的 Y 坐标
   */
  handleShakeButtonTap(cup, cupY) {
    // 关闭骰盅
    cup.setOpen(false);
    // 开始摇动动画
    cup.setShaking(true);
    // 播放摇骰子音效
    this.audioManager.playShake();
    // 执行摇骰子动画
    this.performShakeAnimation(cupY + 100, () => {
      // 停止摇动动画
      cup.setShaking(false);
      // 打开骰盅
      cup.setOpen(true);
    });
  }

  /**
   * 执行摇骰子动画
   * @param {number} diceY - 骰子的 Y 坐标
   * @param {function} callback - 动画结束后的回调函数
   */
  performShakeAnimation(diceY, callback) {
    const dices = [];
    const diceCount = this.player.diceCount;

    // 创建骰子对象
    for (let i = 0; i < diceCount; i++) {
      dices.push(new Dice());
    }

    const renderer = new DiceRenderer(this.ctx);
    const spacing = 15;
    const diceWidth = CONFIG.DICE.WIDTH;
    const totalWidth = diceCount * diceWidth + (diceCount - 1) * spacing;
    const startX = (this.screenWidth - totalWidth) / 2;

    let frame = 0;
    const totalFrames = 60;

    // 动画函数
    const animate = () => {
      // 清空画布
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
      // 绘制背景
      this.drawBackground();
      // 绘制 UI 组件
      this.uiManager.draw();

      frame++;

      // 绘制骰子动画
      for (let i = 0; i < dices.length; i++) {
        const x = startX + i * (diceWidth + spacing);
        const y = diceY + Math.sin(frame * 0.3 + i) * 15;
        const rotation = frame * 12 + i * 45;
        const diceScale = 1 + Math.sin(frame * 0.1 + i) * 0.1;

        // 随机骰子值
        if (frame < totalFrames) {
          dices[i].randomValue();
        }

        // 绘制骰子
        renderer.drawDice(x, y, dices[i].value, { rotation, scale: diceScale, width: diceWidth, height: diceWidth });
      }

      // 继续动画或结束
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        // 获取骰子值
        const diceValues = dices.map(dice => dice.value);
        // 玩家摇骰子
        this.player.rollDices();
        
        // 更新骰盅中的骰子
        const cup = this.uiManager.components.find(comp => comp.constructor.name === 'Cup');
        if (cup) {
          cup.setDices(diceValues);
        }
        
        // 调用回调函数
        callback();
      }
    };

    // 开始动画
    animate();
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
    // 绘制 UI 组件
    this.uiManager.draw();
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
