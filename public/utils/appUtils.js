/* eslint-disable strict */
"use strict";

var path = require('path');
var homedir = require('os').homedir();
var fs = require('fs');
var appFolder = 'code-generator';

/**
 * 获取项目列表
 *
 * @returns {Array} 项目列表
 */
var getProjectList = function () {
  var rename = `/${appFolder}/project`;
  var source = path.join(homedir, rename);

  var lstatSync = fs.lstatSync,
    readdirSync = fs.readdirSync,
    join = path.join;

  var isDirectory = function isDirectory(source) {
    return lstatSync(source).isDirectory();
  };

  var dirs = readdirSync(source)
    .map(function (name) {
      return join(source, name);
    })
    .filter(isDirectory);
  var arr = [];

  for (var i = 0; i < dirs.length; i++) {
    var value = dirs[i];
    var folderName = value.substring(value.lastIndexOf('/') + 1, value.length);
    //不展示template项目文件,template为创建项目的模版目录
    if(folderName === 'template') continue;
    var infoPath = join(value, '/info.json');
    var jsonStr = fs.readFileSync(infoPath, 'utf8');
    var obj = {};
    obj.infoPath = infoPath;
    obj.folderPath = value;
    obj.folderName = folderName;
    obj.jsonRaw = jsonStr;
    obj.json = JSON.parse(jsonStr);
    arr.push(obj);
  }

  console.log('获取项目列表 getProjectList');
  console.log(arr);
  return arr;
};

/**
 * 添加项目
 * 
 * @param {object}
 */
var addProject = function(obj){
  console.log('addProject');
  console.log(obj);
}

/**
 * 获取用户资源路径
 *
 * @param {string} file 文件路径
 * @returns {string} 绝对路径
 */
var resourcesPath = function (file) {
  const resourcesPath = `/${appFolder}/${file}`;
  const allPath = path.join(homedir, resourcesPath);
  return allPath;
};

/**
 * 加载数据库插件
 *
 * @param {string} dbType 数据库类型('sqlite'|'mysql')
 * @returns {object} 据库插件
 */
var databaseAddon = function (dbType) {
  const dbPath = `/${appFolder}/database/${dbType}`;
  const _path = path.join(homedir, dbPath);
  return require(_path);
};

/**
 * 模版引擎
 *
 * @returns {object} artTemplate对象
 */
var artTemplate = function () {
  const art = require('art-template');
  const rename = `/${appFolder}/rename`;
  const renamePath = path.join(homedir, rename);
  const readDir = fs.readdirSync(renamePath);

  //装载外部自定义命名js
  readDir.forEach(function (value, key, arr) {
    var strRegex = '(.js|.JS)$'; //用于验证图片扩展名的正则表达式
    var re = new RegExp(strRegex);
    if (re.test(value)) {
      let fun = value.substring(0, value.indexOf('.'));
      art.defaults.imports[fun] = function (str) {
        const clazz = require(`${renamePath}/${fun}`);
        return clazz.exce(str);
      };
    }
  });
  return art;
};

module.exports = {
  getProjectList,
  addProject,
  resourcesPath,
  databaseAddon,
  artTemplate,
};