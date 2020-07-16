/***
 * 第一字符转换大写
 */
exports.exce = function (name) {
  return name.replace(/^\S/, s => s.toUpperCase())
};
