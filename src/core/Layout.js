const { clamp } = require('../utils/easing');

const SHORTCUT_ITEMS = [
  // { id: 'shortcut-more', label: '更多玩法', icon: 'spark' },
  // { id: 'shortcut-skin', label: '选择皮肤', icon: 'palette' },
  // { id: 'shortcut-bonus', label: '每日福利', icon: 'gift' },
  // { id: 'shortcut-invite', label: '邀请好友', icon: 'user' },
];

class Layout {
  constructor(metrics) {
    this.metrics = metrics;
    this.layout = this.createLayout(metrics);
  }

  update(metrics) {
    this.metrics = metrics;
    this.layout = this.createLayout(metrics);
    return this.layout;
  }

  createLayout(metrics) {
    const width = metrics.width;
    const height = metrics.height;
    const safeArea = metrics.safeArea || {
      left: 0,
      right: width,
      top: 0,
      bottom: height,
    };
    const menuButton = metrics.menuButton;
    const statusBarHeight = metrics.statusBarHeight || safeArea.top || 0;
    const horizontalPadding = Math.max(18, Math.round(width * 0.05));
    const centerX = width / 2;
    const safeTop = menuButton && menuButton.bottom
      ? Math.ceil(menuButton.bottom + 14)
      : Math.ceil(statusBarHeight + 24);
    const bottomInset = Math.max(0, height - (safeArea.bottom || height));

    const titleFontSize = Math.round(clamp(width * 0.086, 28, 34));
    const titleY = Math.round(safeTop + titleFontSize * 0.72);

    const shortcutGap = Math.max(8, Math.round(width * 0.025));
    const shortcutWidth = width - horizontalPadding * 2;
    const shortcutItemWidth = Math.floor((shortcutWidth - shortcutGap * 3) / 4);
    const shortcutIconSize = Math.round(clamp(width * 0.102, 34, 42));
    const shortcutItemHeight = shortcutIconSize + 34;
    const shortcutY = Math.round(titleY + titleFontSize * 0.62 + 14);

    const shortcuts = SHORTCUT_ITEMS.map((item, index) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      x: Math.round(horizontalPadding + index * (shortcutItemWidth + shortcutGap)),
      y: shortcutY,
      width: shortcutItemWidth,
      height: shortcutItemHeight,
      iconSize: shortcutIconSize,
    }));

    const shakeRadius = Math.round(clamp(width * 0.155, 56, 70));
    const sideRadius = Math.round(shakeRadius * 0.58);
    const bottomMargin = Math.round(clamp(height * 0.026, 18, 28)) + bottomInset;
    const controlCenterY = Math.round(height - bottomMargin - shakeRadius);

    const trayWidth = Math.round(Math.min(width - horizontalPadding * 2, 360));
    const trayHeight = Math.round(clamp(trayWidth * 0.46, 132, 168));
    const trayY = Math.round(controlCenterY - shakeRadius - trayHeight * 0.48 - 28);

    const cupTop = Math.round(shortcutY + shortcutItemHeight + clamp(height * 0.035, 20, 28));
    const cupBottom = Math.round(trayY - trayHeight * 0.56 - clamp(height * 0.04, 22, 32));
    const cupHeight = Math.round(clamp(cupBottom - cupTop, 128, 220));
    const cupWidth = Math.round(cupHeight * 0.92);
    const cupY = Math.round(cupTop + cupHeight * 0.52);

    const bottomControls = {
      centerButton: {
        id: 'action-shake',
        x: centerX,
        y: controlCenterY,
        radius: shakeRadius,
      },
      leftButton: {
        id: 'action-help',
        x: horizontalPadding + sideRadius + 8,
        y: controlCenterY + 6,
        radius: sideRadius,
      },
      rightButton: {
        id: 'action-settings',
        x: width - horizontalPadding - sideRadius - 8,
        y: controlCenterY + 6,
        radius: sideRadius,
      },
    };

    const tray = {
      x: centerX,
      y: trayY,
      width: trayWidth,
      height: trayHeight,
      innerWidth: trayWidth * 0.82,
      innerHeight: trayHeight * 0.62,
      diceSize: clamp(trayHeight * 0.36, 46, 58),
    };

    const cup = {
      x: centerX,
      y: cupY,
      width: cupWidth,
      height: cupHeight,
      liftDistance: Math.round(cupHeight * 0.7),
    };

    const hitRegions = [
      ...shortcuts.map((item) => ({
        id: item.id,
        type: 'rect',
        x: item.x - 4,
        y: item.y - 4,
        width: item.width + 8,
        height: item.height + 8,
      })),
      {
        id: bottomControls.leftButton.id,
        type: 'circle',
        x: bottomControls.leftButton.x,
        y: bottomControls.leftButton.y,
        radius: bottomControls.leftButton.radius,
        hitSlop: 8,
      },
      {
        id: bottomControls.centerButton.id,
        type: 'circle',
        x: bottomControls.centerButton.x,
        y: bottomControls.centerButton.y,
        radius: bottomControls.centerButton.radius,
        hitSlop: 8,
      },
      {
        id: bottomControls.rightButton.id,
        type: 'circle',
        x: bottomControls.rightButton.x,
        y: bottomControls.rightButton.y,
        radius: bottomControls.rightButton.radius,
        hitSlop: 8,
      },
    ];

    return {
      width,
      height,
      centerX,
      horizontalPadding,
      safeTop,
      bottomInset,
      title: {
        text: '开心大话骰',
        x: centerX,
        y: titleY,
        fontSize: titleFontSize,
      },
      shortcuts,
      cup,
      tray,
      bottomControls,
      hitRegions,
    };
  }
}

module.exports = Layout;
