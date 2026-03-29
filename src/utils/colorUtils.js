/**
 * 颜色工具函数
 */

/**
 * 使颜色变暗
 * @param {string} color - 十六进制颜色值
 * @param {number} amount - 变暗的程度，0-1之间
 * @returns {string} 变暗后的十六进制颜色值
 */
function darkenColor(color, amount) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * amount * 100);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

module.exports = {
  darkenColor
};
