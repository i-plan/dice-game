const CONFIG = require('./config');
const { PlayerManager } = require('./player');
const { Dice, DiceRenderer } = require('./dice');
const { UIManager, Button, TitleText, Cup } = require('./ui');
const { getAudioManager } = require('./audio');

class GameManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.playerManager = new PlayerManager();
    this.uiManager = new UIManager(ctx);
    this.audioManager = getAudioManager();

    this.playerCount = CONFIG.DEFAULT_PLAYER_COUNT;
    this.dicePerPlayer = CONFIG.DEFAULT_DICE_PER_PLAYER;

    this.screenWidth = canvas.width;
    this.screenHeight = canvas.height;

    //startGame
    this.playerManager.initPlayers(this.playerCount, this.dicePerPlayer);
    this.showShaking();
  }
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
    const shakeBtn = new Button(this.ctx, '摇', centerX - 100, this.screenHeight - 220, 200, 200, {
      bgColor: '#E11D48',
      fontSize: 40,
      textColor: '#FFFFFF',
      borderRadius: 50,
      onTap: () => {
        cup.setOpen(false);
        cup.setShaking(true);
        this.audioManager.playShake();
        this.performShakeAnimation(cupY + 100, () => {
          cup.setShaking(false);
          cup.setOpen(true);
        });
      }
    });
    this.uiManager.add(shakeBtn);
  }

  performShakeAnimation(diceY, callback) {
    const dices = [];
    const dicePerPlayer = this.playerManager.getCurrentPlayer().diceCount;

    for (let i = 0; i < dicePerPlayer; i++) {
      dices.push(new Dice());
    }

    const renderer = new DiceRenderer(this.ctx);
    const spacing = 15;
    const diceWidth = CONFIG.DICE.WIDTH;
    const totalWidth = dicePerPlayer * diceWidth + (dicePerPlayer - 1) * spacing;
    const startX = (this.screenWidth - totalWidth) / 2;

    let frame = 0;
    const totalFrames = 60;

    const animate = () => {
      this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
      this.drawBackground();
      this.uiManager.draw();

      frame++;

      for (let i = 0; i < dices.length; i++) {
        const x = startX + i * (diceWidth + spacing);
        const y = diceY + Math.sin(frame * 0.3 + i) * 15;
        const rotation = frame * 12 + i * 45;
        const diceScale = 1 + Math.sin(frame * 0.1 + i) * 0.1;

        if (frame < totalFrames) {
          dices[i].randomValue();
        }

        renderer.drawDice(x, y, dices[i].value, { rotation, scale: diceScale, width: diceWidth, height: diceWidth });
      }

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        const diceValues = dices.map(dice => dice.value);
        this.playerManager.getCurrentPlayer().rollDices();
        
        const cup = this.uiManager.components.find(comp => comp.constructor.name === 'Cup');
        if (cup) {
          cup.setDices(diceValues);
        }
        
        callback();
      }
    };

    animate();
  }

  drawBackground() {
    const ctx = this.ctx;

    ctx.fillStyle = '#0A1128';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    this.drawDecorations();
  }

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

  render() {
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.drawBackground();
    this.uiManager.draw();
  }

  handleTap(x, y) {
    return this.uiManager.handleTap(x, y);
  }
}

module.exports = { GameManager };
