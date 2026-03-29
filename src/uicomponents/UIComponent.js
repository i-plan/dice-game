/**
 * 基础 UI 组件类
 * 所有 UI 组件的基类
 */

class UIComponent {
  /**
   * 构造函数
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.visible = true;
  }

  /**
   * 检查点是否在组件内
   * @param {number} x - 点的 X 坐标
   * @param {number} y - 点的 Y 坐标
   * @returns {boolean} 是否在组件内
   */
  contains(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
  }

  /**
   * 设置组件位置
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 设置组件大小
   * @param {number} width - 宽度
   * @param {number} height - 高度
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * 绘制组件
   * 子类需要重写此方法
   */
  draw() {
    // 子类实现
  }

  /**
   * 处理点击事件
   * 子类可以重写此方法
   * @param {number} x - 点击的 X 坐标
   * @param {number} y - 点击的 Y 坐标
   * @returns {boolean} 是否处理了点击事件
   */
  handleTap(x, y) {
    return false;
  }
}

module.exports = UIComponent;
