/* eslint-disable strict */
'use strict';

var { remote } = require('electron');
var path = require('path');
var copydir = require('copy-dir');
var homedir = require('os').homedir();
var fs = require('fs');
var fse = require('fs-extra');
var sd = require('silly-datetime');
var appFolder = 'code-generator';
var appUserPath = path.join(homedir, '/code-generator');

/**
 * 获取项目列表
 *
 * @returns {Array} 项目列表
 */
var getProjectList = function () {
  var project = `/${appFolder}/project`;
  var source = path.join(homedir, project);

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
    var folderName = value.substring(value.lastIndexOf(path.sep) + 1, value.length);
    console.log('目录', folderName);
    //不展示template项目文件,template为创建项目的模版目录
    if (folderName === 'template') continue;
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

var getProject = function (folderName) {
  try {
    var infoPath = path.join(appUserPath, `/project/${folderName}/info.json`);
    var jsonStr = fs.readFileSync(infoPath, 'utf8');
    var jsonObj = JSON.parse(jsonStr);
    if (jsonObj.filterData === undefined) {
      jsonObj.filterData = [];
    }
    if (jsonObj.collapseKeys === undefined) {
      jsonObj.collapseKeys = [];
    }
    if (jsonObj.taskData === undefined) {
      jsonObj.taskData = [];
    }
    return jsonObj;
  } catch (e) {
    return null;
  }
};

var saveProject = function (folderName, obj) {
  var infoPath = path.join(appUserPath, `/project/${folderName}/info.json`);
  try {
    fs.writeFileSync(infoPath, JSON.stringify(obj, undefined, 4), 'utf-8');
    return { code: 1, msg: '保存成功' };
  } catch (err) {
    return { code: 0, msg: err.msg };
  }
};

var initResources = function () {
  const isDev = require('electron-is-dev');

  if (!isDev) {
    var exePath = path.dirname(remote.app.getPath('exe'));
    console.log(exePath);
    console.log(appUserPath);
    if (process.platform === 'darwin') {
      if (!fs.existsSync(appUserPath)) {
        fs.mkdirSync(appUserPath);
        const _res = path.join(exePath, '/../Resources/app.asar/build/resources');
        // debugger 时的目录结构
        // const _res = path.join(exePath, '/../Resources/default_app.asar/octicon');
        copydir.sync(_res, appUserPath);
      }
    } else if (process.platform === 'win32') {
      if (!fs.existsSync(appUserPath)) {
        fs.mkdirSync(appUserPath);
        const _res = path.join(exePath, '/resources/app.asar/build/resources');
        copydir.sync(_res, appUserPath);
      }
    }
  }
};

/**
 * 添加项目
 *
 * @param {object}
 */
var addProject = function (obj) {
  console.log('addProject');
  console.log(obj);
  var projectPath = path.join(appUserPath, `/project/${obj.folderName}`);

  if (fs.existsSync(projectPath)) {
    return { code: 0, msg: '文件名被占用,请更换文件名' };
  }

  var infoPath = path.join(projectPath, `/info.json`);
  var timeStr = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  try {
    fse.copySync(path.join(appUserPath, '/project/template'), projectPath);
    console.log('addProject copy success!', projectPath);
    var jsonStr = fs.readFileSync(infoPath, 'utf8');
    var json = JSON.parse(jsonStr);
    json.name = obj.name;
    json.sortCode = obj.sortCode;
    json.createTime = timeStr;
    json.updateTime = timeStr;
    jsonStr = JSON.stringify(json);
    fs.writeFileSync(infoPath, jsonStr, 'utf-8');
    return { code: 1, msg: '添加成功' };
  } catch (err) {
    console.error(err);
    return { code: 0, msg: err };
  }
};

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

var databaseList = function () {
  let arrFiles = [];
  fs.readdirSync(`${appUserPath}/database`)
    .filter(function (f) {
      return f.endsWith('.js');
    })
    .forEach(function (f) {
      arrFiles.push(f.substring(0, f.indexOf('.')));
    });

  console.log(arrFiles);
  return arrFiles;
};

/**
 * 模版引擎
 *
 * @returns {object} artTemplate对象
 */
var artTemplate = function () {
  const art = require('art-template');
  const addon = `/${appFolder}/addon`;
  const addonPath = path.join(homedir, addon);
  const readDir = fs.readdirSync(addonPath);

  //装载外部自定义命名js
  readDir.forEach(function (value, key, arr) {
    var strRegex = '(.js|.JS)$'; //用于验证图片扩展名的正则表达式
    var re = new RegExp(strRegex);
    if (re.test(value)) {
      let fun = value.substring(0, value.indexOf('.'));
      art.defaults.imports[fun] = function (str) {
        const clazz = require(`${addonPath}/${fun}`);
        return clazz.exce(str);
      };
    }
  });
  return art;
};

module.exports = {
  getProjectList,
  getProject,
  addProject,
  saveProject,
  resourcesPath,
  databaseAddon,
  databaseList,
  artTemplate,
  initResources,
};
