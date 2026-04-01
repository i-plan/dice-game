class InputManager {
  constructor() {
    this.regions = [];
    this.locked = false;
    this.activeTouchId = null;
    this.initialTargetId = null;
    this.activeTargetId = null;
    this.onPressChange = null;
    this.onTap = null;
    this.bound = false;

    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.bind();
  }

  bind() {
    if (this.bound || typeof wx === 'undefined') {
      return;
    }

    if (typeof wx.onTouchStart === 'function') {
      wx.onTouchStart(this.handleStart);
    }
    if (typeof wx.onTouchMove === 'function') {
      wx.onTouchMove(this.handleMove);
    }
    if (typeof wx.onTouchEnd === 'function') {
      wx.onTouchEnd(this.handleEnd);
    }
    if (typeof wx.onTouchCancel === 'function') {
      wx.onTouchCancel(this.handleCancel);
    }

    this.bound = true;
  }

  setCallbacks(callbacks) {
    this.onPressChange = callbacks && callbacks.onPressChange ? callbacks.onPressChange : null;
    this.onTap = callbacks && callbacks.onTap ? callbacks.onTap : null;
  }

  setRegions(regions) {
    this.regions = Array.isArray(regions) ? regions : [];
  }

  setLocked(locked) {
    this.locked = locked;

    if (locked) {
      this.resetActive();
    }
  }

  handleStart(event) {
    if (this.locked) {
      return;
    }

    const touch = this.getTrackedTouch(event, 'touches') || this.getTrackedTouch(event, 'changedTouches');
    if (!touch) {
      return;
    }

    this.activeTouchId = typeof touch.identifier === 'number' ? touch.identifier : 0;

    const hit = this.hitTest(this.getPoint(touch));
    this.initialTargetId = hit ? hit.id : null;
    this.setActiveTarget(this.initialTargetId);
  }

  handleMove(event) {
    if (this.activeTouchId === null) {
      return;
    }

    const touch = this.getTrackedTouch(event, 'touches') || this.getTrackedTouch(event, 'changedTouches');
    if (!touch) {
      return;
    }

    if (!this.initialTargetId) {
      this.setActiveTarget(null);
      return;
    }

    const hit = this.hitTest(this.getPoint(touch));
    this.setActiveTarget(hit && hit.id === this.initialTargetId ? this.initialTargetId : null);
  }

  handleEnd(event) {
    if (this.activeTouchId === null) {
      return;
    }

    const touch = this.getTrackedTouch(event, 'changedTouches') || this.getTrackedTouch(event, 'touches');
    if (!touch) {
      this.resetActive();
      return;
    }

    const hit = this.hitTest(this.getPoint(touch));
    const tapId = !this.locked && this.initialTargetId && hit && hit.id === this.initialTargetId
      ? this.initialTargetId
      : null;

    this.resetActive();

    if (tapId && this.onTap) {
      this.onTap(tapId);
    }
  }

  handleCancel() {
    this.resetActive();
  }

  getTrackedTouch(event, key) {
    const touches = event && event[key];
    if (!touches || !touches.length) {
      return null;
    }

    if (this.activeTouchId === null) {
      return touches[0];
    }

    for (let index = 0; index < touches.length; index += 1) {
      const touch = touches[index];
      const identifier = typeof touch.identifier === 'number' ? touch.identifier : 0;

      if (identifier === this.activeTouchId) {
        return touch;
      }
    }

    return null;
  }

  getPoint(touch) {
    return {
      x: typeof touch.clientX === 'number' ? touch.clientX : touch.x,
      y: typeof touch.clientY === 'number' ? touch.clientY : touch.y,
    };
  }

  resetActive() {
    this.activeTouchId = null;
    this.initialTargetId = null;
    this.setActiveTarget(null);
  }

  setActiveTarget(id) {
    if (this.activeTargetId === id) {
      return;
    }

    this.activeTargetId = id;

    if (this.onPressChange) {
      this.onPressChange(id);
    }
  }

  hitTest(point) {
    for (let index = this.regions.length - 1; index >= 0; index -= 1) {
      const region = this.regions[index];

      if (this.containsPoint(region, point)) {
        return region;
      }
    }

    return null;
  }

  containsPoint(region, point) {
    const hitSlop = region.hitSlop || 0;

    if (region.type === 'circle') {
      const radius = region.radius + hitSlop;
      const dx = point.x - region.x;
      const dy = point.y - region.y;

      return dx * dx + dy * dy <= radius * radius;
    }

    const x = region.x - hitSlop;
    const y = region.y - hitSlop;
    const width = region.width + hitSlop * 2;
    const height = region.height + hitSlop * 2;

    return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
  }
}

module.exports = InputManager;
