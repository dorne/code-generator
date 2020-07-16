/***
 * 下划线转驼峰
 */
exports.exce = function(name){
    return name.replace(/_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}