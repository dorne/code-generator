// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

const path = require('path');
const homedir = require('os').homedir();
const fs = require('fs');

// 暴露electron
global.dorne_code_gen = {
  process_versions: process.versions,
  electron: require('electron'),
  template: require('art-template'),
  fs: fs,
  path: require('path'),
  os: require('os'),
  vm: require('vm'),
  http: require('http'),
  Sequelize: require('sequelize'),
  artTemplate: function () {
    const art = require('art-template');
    const rename = `/code-generator/rename`;
    const renamePath = path.join(homedir, rename);
    const readDir = fs.readdirSync(renamePath);

    //装载外部自定义命名js
    readDir.forEach(function (value, key, arr) {
      var strRegex = '(.js|.JS)$'; //用于验证图片扩展名的正则表达式
      var re = new RegExp(strRegex);
      if (re.test(value)) {
        let fun = value.substring(0,value.indexOf('.'));
        art.defaults.imports[fun] = function (str) {
          const clazz = require(`${renamePath}/${fun}`);
          return clazz.exce(str);
        };
      }
    });
    return art;
  },
  db: function (db) {
    const dbPath = `/code-generator/database/${db}`;
    const alibPath = path.join(homedir, dbPath);
    return require(alibPath);
  },
  templatePath: function (file) {
    const dbPath = `/code-generator/${file}`;
    const alibPath = path.join(homedir, dbPath);
    return alibPath;
  },
};
