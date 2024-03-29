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


const fs = require('fs');
const { dialog } = require('electron').remote;

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
  rmdir: require('rmdir'),
  appUtils: require('./utils/appUtils'),
  dialog: dialog
};
