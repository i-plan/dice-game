/**
 * 玩家相关类
 * 包括 Player类
 */

const CONFIG = require('../config');

class Player {
  /**
   * 构造函数
   * @param {string} name - 玩家名称
   * @param {number} diceCount - 骰子数量
   */
  constructor(name, diceCount) {
    this.name = name; // 玩家名称
    this.diceCount = diceCount; // 骰子数量
    this.dices = []; // 骰子值数组
  }

  /**
   * 摇骰子
   * @returns {Array} 骰子值数组
   */
  rollDices() {
    this.dices = [];
    for (let i = 0; i < this.diceCount; i++) {
      this.dices.push(
        Math.floor(Math.random() * CONFIG.DICE_MAX_VALUE) + CONFIG.DICE_MIN_VALUE
      );
    }
    return this.dices;
  }

  /**
   * 获取骰子
   * @returns {Array} 骰子值数组的副本
   */
  getDices() {
    return [...this.dices];
  }
}
module.exports = { Player };
