/***
 * 驼峰转下划线
 */
exports.exce = function(name){
    return name.replace(/\B([A-Z])/g, '_$1').toLowerCase();
}