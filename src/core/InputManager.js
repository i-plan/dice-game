class InputManager {
  constructor() {
    this.regions = [];
    this.locked = false;
    this.activeTouchId = null;
    this.initialTargetId = null;
    this.activeTargetId = null;
    this.activeDragRegion = null;
    this.activeDragStartPoint = null;
    this.activeDragLastPoint = null;
    this.onPressChange = null;
    this.onTap = null;
    this.onCupDragStart = null;
    this.onCupDragMove = null;
    this.onCupDragEnd = null;
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
    this.onCupDragStart = callbacks && callbacks.onCupDragStart ? callbacks.onCupDragStart : null;
    this.onCupDragMove = callbacks && callbacks.onCupDragMove ? callbacks.onCupDragMove : null;
    this.onCupDragEnd = callbacks && callbacks.onCupDragEnd ? callbacks.onCupDragEnd : null;
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

    const point = this.getPoint(touch);
    const hit = this.hitTest(point);

    if (this.isDragRegion(hit)) {
      this.initialTargetId = hit.id;
      this.activeDragRegion = hit;
      this.activeDragStartPoint = point;
      this.activeDragLastPoint = point;
      this.setActiveTarget(null);

      if (this.onCupDragStart) {
        this.onCupDragStart({
          point,
          region: hit,
        });
      }
      return;
    }

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

    const point = this.getPoint(touch);

    if (this.activeDragRegion) {
      this.activeDragLastPoint = point;

      if (this.onCupDragMove) {
        this.onCupDragMove({
          point,
          region: this.activeDragRegion,
          deltaX: point.x - this.activeDragStartPoint.x,
          deltaY: point.y - this.activeDragStartPoint.y,
        });
      }
      return;
    }

    if (!this.initialTargetId) {
      this.setActiveTarget(null);
      return;
    }

    const hit = this.hitTest(point);
    this.setActiveTarget(hit && hit.id === this.initialTargetId ? this.initialTargetId : null);
  }

  handleEnd(event) {
    if (this.activeTouchId === null) {
      return;
    }

    const touch = this.getTrackedTouch(event, 'changedTouches') || this.getTrackedTouch(event, 'touches');
    if (!touch) {
      this.completeDrag(this.activeDragLastPoint, false);
      this.resetActive();
      return;
    }

    const point = this.getPoint(touch);

    if (this.activeDragRegion) {
      this.completeDrag(point, false);
      this.resetActive();
      return;
    }

    const hit = this.hitTest(point);
    const tapId = !this.locked && this.initialTargetId && hit && hit.id === this.initialTargetId
      ? this.initialTargetId
      : null;

    this.resetActive();

    if (tapId && this.onTap) {
      this.onTap(tapId);
    }
  }

  handleCancel() {
    this.completeDrag(this.activeDragLastPoint, true);
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
    this.activeDragRegion = null;
    this.activeDragStartPoint = null;
    this.activeDragLastPoint = null;
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

  isDragRegion(region) {
    return !!(region && region.interaction === 'drag');
  }

  completeDrag(point, cancelled) {
    if (!this.activeDragRegion || !this.onCupDragEnd) {
      return;
    }

    const finalPoint = point || this.activeDragLastPoint || this.activeDragStartPoint;
    this.onCupDragEnd({
      point: finalPoint,
      region: this.activeDragRegion,
      deltaX: finalPoint ? finalPoint.x - this.activeDragStartPoint.x : 0,
      deltaY: finalPoint ? finalPoint.y - this.activeDragStartPoint.y : 0,
      cancelled: !!cancelled,
    });
  }
}

module.exports = InputManager;
