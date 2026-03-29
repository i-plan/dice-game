/**
 * UI 管理器
 * 负责管理所有 UI 组件
 */

class UIManager {
  /**
   * 构造函数
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.components = [];
  }

  /**
   * 添加组件
   * @param {UIComponent} component - UI 组件
   */
  add(component) {
    this.components.push(component);
  }

  /**
   * 移除组件
   * @param {UIComponent} component - UI 组件
   */
  remove(component) {
    const index = this.components.indexOf(component);
    if (index > -1) {
      this.components.splice(index, 1);
    }
  }

  /**
   * 清空所有组件
   */
  clear() {
    this.components = [];
  }

  /**
   * 绘制所有组件
   */
  draw() {
    for (const comp of this.components) {
      comp.draw();
    }
  }

  /**
   * 处理点击事件
   * @param {number} x - 点击的 X 坐标
   * @param {number} y - 点击的 Y 坐标
   * @returns {boolean} 是否处理了点击事件
   */
  handleTap(x, y) {
    for (const comp of this.components) {
      if (comp.handleTap && comp.handleTap(x, y)) {
        return true;
      }
    }
    return false;
  }
}

module.exports = UIManager;
